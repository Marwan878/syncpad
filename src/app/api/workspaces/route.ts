import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { WorkspaceService } from "@/lib/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Get workspaces
    const workspaceService = WorkspaceService.getInstance();
    const workspaces = await workspaceService.getWorkspacesByUserId(userId);

    return NextResponse.json(workspaces);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Data validation
    const { name, description } = await request.json();

    if (!name) {
      throw new ValidationError("Name is required");
    }

    if (name.length > 100) {
      throw new ValidationError(
        "Name must be less than or equal to 100 characters"
      );
    }

    if (description && description.length > 500) {
      throw new ValidationError(
        "Description must be less than or equal to 500 characters"
      );
    }

    // Create workspace
    const workspaceService = WorkspaceService.getInstance();
    await workspaceService.createWorkspace(userId, name, description);

    return NextResponse.json({ message: "Workspace created successfully" });
  } catch (error) {
    return handleError(error);
  }
}
