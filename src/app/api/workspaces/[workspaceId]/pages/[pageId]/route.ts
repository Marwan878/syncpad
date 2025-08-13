import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { PageService } from "@/lib/page-service";
import { WorkspaceService } from "@/lib/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

    // Authentication and authorization
    const clerkClient = ClerkClient.getInstance();
    await clerkClient.authenticateRequest(request);

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

    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

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

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    if (!pageId) {
      throw new ValidationError("Page ID is required");
    }

    // Authentication and authorization
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Check if user can delete page
    const pageService = PageService.getInstance();
    await pageService.checkUserCanDeletePage(workspaceId, userId);

    // Delete the page
    // Transaction: Delete page + decrement pages count for the workspace + reorder pages
    const deletedPage =
      await pageService.deletePageAndDecrementPagesCountAndReorder(pageId);

    return NextResponse.json(deletedPage);
  } catch (error) {
    return handleError(error);
  }
}
