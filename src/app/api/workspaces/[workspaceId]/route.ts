import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { WorkspaceService } from "@/lib/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    // Data validation
    const { workspaceId } = await params;

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    // Get workspace
    const workspaceService = WorkspaceService.getInstance();
    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    if (!workspace.any_user_can_view) {
      // Authentication
      const clerkClient = ClerkClient.getInstance();
      const userId = await clerkClient.authenticateRequest(request);

      // Authorization
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
    await workspaceService.deleteWorkspaceAndPagesById(workspaceId);

    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}
