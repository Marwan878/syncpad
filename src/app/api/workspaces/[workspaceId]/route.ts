import { AuthService } from "@/lib/services/auth-service";
import { handleError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { WorkspaceService } from "@/lib/services/workspace-service";
import { Workspace } from "@/types/workspace";
import { NextRequest, NextResponse } from "next/server";
import { KeyService } from "@/lib/services/key-service";
import {
  importPublicKeyJwk,
  rsaEncrypt,
  exportAesRaw,
  generateWorkspaceKey,
} from "@/lib/crypto";
import { UserService } from "@/lib/services/user-service";
import { EncryptionKey } from "@/types/encryption-key";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    // Data validation
    const { workspaceId } = await params;

    // Get cached workspace if it exists
    const cacheKey = `workspace:${workspaceId}`;
    const stringifiedWorkspace = await redis.get(cacheKey);

    // Prepare the workspace
    let workspace: Workspace;

    if (stringifiedWorkspace) {
      workspace = JSON.parse(stringifiedWorkspace);
    } else {
      // Get workspace
      const workspaceService = WorkspaceService.getInstance();
      workspace = await workspaceService.getWorkspaceById(workspaceId);

      // Cache workspace for 24 hours
      await redis.set(cacheKey, JSON.stringify(workspace), "EX", 60 * 60 * 24);
    }

    if (!workspace.any_user_can_view) {
      // Authentication
      const authService = AuthService.getInstance();
      const userId = await authService.checkSignedIn(request);

      // Authorization
      const workspaceService = WorkspaceService.getInstance();
      workspaceService.checkUserCanView(workspaceId, userId);
    }

    return NextResponse.json(workspace);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    // Data validation
    const { workspaceId } = await params;

    // Authentication
    const authService = AuthService.getInstance();
    const userId = await authService.checkSignedIn(request);

    // Authorization
    const workspaceService = WorkspaceService.getInstance();
    await workspaceService.checkUserCanDelete(workspaceId, userId);

    // Delete workspace
    const deletedWorkspace = await workspaceService.deleteWorkspaceAndPagesById(
      workspaceId
    );

    // Invalidate workspace cache
    await redis.del(`workspace:${workspaceId}`);

    // Invalidate workspaces cache
    await redis.del(`workspaces:${deletedWorkspace.owner_id}`);

    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    const { workspaceId } = await params;

    // Authentication
    const authService = AuthService.getInstance();
    const userId = await authService.checkSignedIn(request);

    // Authorization
    const workspaceService = WorkspaceService.getInstance();
    await workspaceService.checkUserCanModifyWorkspace(userId, workspaceId);

    const unpatchedWorkspace = await workspaceService.getWorkspaceById(
      workspaceId
    );

    // Patch workspace
    const updatedWorkspace = await request.json();
    const patchedWorkspace = await workspaceService.updateWorkspace({
      workspaceId,
      updates: updatedWorkspace,
    });

    // Give access to added collaborators and remove access from removed collaborators
    const oldCollaboratorsIds = new Set(
      unpatchedWorkspace.allowed_editors_ids.concat(
        unpatchedWorkspace.allowed_viewers_ids
      )
    );

    const currentCollaboratorsIds = new Set(
      patchedWorkspace.allowed_editors_ids.concat(
        patchedWorkspace.allowed_viewers_ids
      )
    );

    const addedCollaboratorsIds = [];

    for (const collaboratorId of currentCollaboratorsIds) {
      if (!oldCollaboratorsIds.has(collaboratorId)) {
        addedCollaboratorsIds.push(collaboratorId);
      }
    }

    const removedCollaboratorsIds = [];

    for (const collaboratorId of oldCollaboratorsIds) {
      if (!currentCollaboratorsIds.has(collaboratorId)) {
        removedCollaboratorsIds.push(collaboratorId);
      }
    }

    // Generate or retrieve workspace AES key
    const keyService = KeyService.getInstance();
    let workspaceAesKey: CryptoKey;

    // Try to get existing workspace key from the owner
    const existingKeys = await keyService.getKeyByUserIdAndWorkspaceId(
      patchedWorkspace.owner_id,
      workspaceId
    );

    if (existingKeys) {
      // Decrypt existing workspace key using owner's private key (this would need to be done client-side)
      // For now, we'll generate a new key for each new collaborator
      workspaceAesKey = await generateWorkspaceKey();
    } else {
      // Generate new workspace key
      workspaceAesKey = await generateWorkspaceKey();

      // Store encrypted workspace key for owner
      const userService = UserService.getInstance();
      const owner = await userService.getUser(patchedWorkspace.owner_id);

      if (owner.public_key_jwk) {
        const ownerPubKey = await importPublicKeyJwk(owner.public_key_jwk);
        const workspaceKeyRaw = await exportAesRaw(workspaceAesKey);
        const encryptedWorkspaceKey = await rsaEncrypt(
          ownerPubKey,
          workspaceKeyRaw
        );

        const ownerKey: EncryptionKey = {
          id: crypto.randomUUID(),
          user_id: patchedWorkspace.owner_id,
          workspace_id: workspaceId!,
          key: Array.from(encryptedWorkspaceKey).join(","), // Store as comma-separated string
        };
        await keyService.createKey(ownerKey);
      }
    }

    // Give access to added collaborators
    for (const collaboratorId of addedCollaboratorsIds) {
      const userService = UserService.getInstance();
      const user = await userService.getUser(collaboratorId);

      // Only process users who have a public key
      if (user.public_key_jwk) {
        const pub = await importPublicKeyJwk(user.public_key_jwk);
        const raw = await exportAesRaw(workspaceAesKey);
        const encryptedKey = await rsaEncrypt(pub, raw);

        const newKey: EncryptionKey = {
          id: crypto.randomUUID(),
          user_id: collaboratorId,
          workspace_id: workspaceId!,
          key: Array.from(encryptedKey).join(","), // Store as comma-separated string
        };
        await keyService.createKey(newKey);
      }
    }

    // Remove access from removed collaborators
    for (const collaboratorId of removedCollaboratorsIds) {
      await keyService.deleteKeyByUserIdAndWorkspaceId(
        collaboratorId,
        workspaceId
      );
    }

    // Revalidate workspace cache
    await redis.del(`workspace:${workspaceId}`);

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    return handleError(error);
  }
}
