import { AuthService } from "@/lib/services/auth-service";
import { handleError, ValidationError } from "@/lib/error";
import { PageService } from "@/lib/services/page-service";
import { redis } from "@/lib/redis";
import { WorkspaceService } from "@/lib/services/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string; pageId?: string }> }
) {
  try {
    const { pageId } = await params;

    if (!pageId) {
      throw new ValidationError("Page ID is required");
    }

    // Authentication and authorization
    const clerkClient = AuthService.getInstance();
    await clerkClient.checkSignedIn(request);

    // Patch the page
    const updates = await request.json();

    const pageService = PageService.getInstance();
    const page = await pageService.updatePage(pageId, updates);

    // return NextResponse.json(page);
    return NextResponse.json({ message: "Page updated" });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string; pageId?: string }> }
) {
  try {
    const { workspaceId, pageId } = await params;

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    if (!pageId) {
      throw new ValidationError("Page ID is required");
    }

    const clerkClient = AuthService.getInstance();
    const userId = await clerkClient.checkSignedIn(request);

    // Check if user can view workspace
    const workspaceService = WorkspaceService.getInstance();
    workspaceService.checkUserCanView(workspaceId, userId);

    // Get the page
    const pageService = PageService.getInstance();
    const page = await pageService.getPageById(pageId);

    return NextResponse.json(page);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string; pageId?: string }> }
) {
  try {
    const { workspaceId, pageId } = await params;

    // Authentication and authorization
    const clerkClient = AuthService.getInstance();
    const userId = await clerkClient.checkSignedIn(request);

    // Check if user can delete page
    const pageService = PageService.getInstance();
    await pageService.checkUserCanDeletePage(workspaceId, userId);

    // Delete the page
    // Transaction: Delete page + decrement pages count for the workspace + reorder pages
    const deletedPage =
      await pageService.deletePageAndDecrementPagesCountAndReorder(pageId);

    // Invalidate cache
    await redis.del(`pages:${workspaceId}`);
    await redis.del(`workspace:${workspaceId}`);

    // Invalidate workspace cache
    const workspaceService = WorkspaceService.getInstance();
    const workspace = await workspaceService.getWorkspaceById(workspaceId);
    await redis.del(`workspaces:${workspace.owner_id}`);

    return NextResponse.json(deletedPage);
  } catch (error) {
    return handleError(error);
  }
}
