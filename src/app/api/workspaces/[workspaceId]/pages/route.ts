import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { PageService } from "@/lib/page-service";
import { WorkspaceService } from "@/lib/workspace-service";
import { Page } from "@/types/page";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    const { workspaceId } = await params;

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    // Authentication and authorization
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    const workspaceService = WorkspaceService.getInstance();
    workspaceService.checkUserCanView(workspaceId, userId);

    // Get pages
    const pageService = PageService.getInstance();
    const pages = await pageService.getPagesByWorkspaceId(workspaceId);

    return NextResponse.json(pages);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId?: string }> }
) {
  try {
    const { workspaceId } = await params;

    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    // Authentication and authorization
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    const workspaceService = WorkspaceService.getInstance();
    workspaceService.checkUserCanEdit(workspaceId, userId);

    // Validate input
    const { title } = await request.json();

    if (title.trim().length > 100 || title.trim().length === 0) {
      throw new ValidationError(
        "Title must be less than or equal to 100 characters and not empty"
      );
    }

    // Get workspace for calculating order of the new page
    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    // Create page
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: title.trim(),
      created_at: new Date().toISOString(),
      workspace_id: workspace.id,
      order: workspace.pages_count + 1,
      content: new Uint8Array(),
    };

    const pageService = PageService.getInstance();
    const page = await pageService.createPageAndIncrementWorkspacePagesCount(
      newPage
    );

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
