import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { WorkspaceService } from "@/lib/workspace-service";
import { Workspace } from "@/types/workspace";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    // Data validation
    const { workspaceId } = await params;

    // TODO: Delegate this check to other functions
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

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
      const clerkClient = ClerkClient.getInstance();
      const userId = await clerkClient.authenticateRequest(request);

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

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    // Authentication
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

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
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Authorization
    const workspaceService = WorkspaceService.getInstance();
    await workspaceService.checkUserCanModifyWorkspace(userId, workspaceId);

    // Patch workspace
    const updatedWorkspace = await request.json();
    await workspaceService.updateWorkspace({
      workspaceId,
      updates: updatedWorkspace,
    });

    // Revalidate workspace cache
    await redis.del(`workspace:${workspaceId}`);

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    return handleError(error);
  }
}
