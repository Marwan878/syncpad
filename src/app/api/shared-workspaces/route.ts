import { ClerkClient } from "@/lib/clerk-client";
import { handleError } from "@/lib/error";
import { WorkspaceService } from "@/lib/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Get shared workspaces
    const workspaceService = WorkspaceService.getInstance();
    const sharedWorkspaces = await workspaceService.getSharedWorkspacesByUserId(
      userId
    );

    return NextResponse.json(sharedWorkspaces);
  } catch (error) {
    return handleError(error);
  }
}
