import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { WorkspaceService } from "@/lib/workspace-service";
import { Permission } from "@/types/workspace";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    const { workspaceId } = await params;

    // TODO: Delegate this validation to other functions
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    const permissions: Set<Permission> = new Set();

    // Get workspace
    const workspaceService = WorkspaceService.getInstance();
    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    // Assign permissions

    if (workspace.any_user_can_view) {
      permissions.add("view");
    }

    const clerkClient = ClerkClient.getInstance();
    const isSignedIn = await clerkClient.isSignedIn(request);

    if (isSignedIn) {
      const userId = await clerkClient.authenticateRequest(request);
      if (workspace.allowed_viewers_ids.includes(userId)) {
        permissions.add("view");
      }

      if (
        workspace.allowed_editors_ids.includes(userId) ||
        workspace.owner_id === userId ||
        workspace.any_user_can_edit
      ) {
        permissions.add("edit");
        permissions.add("delete");
        permissions.add("view");
      }
    }

    return NextResponse.json(Array.from(permissions));
  } catch (error) {
    return handleError(error);
  }
}
