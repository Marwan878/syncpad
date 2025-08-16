import { ClerkClient } from "@/lib/clerk-client";
import { handleError, ValidationError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { WorkspaceService } from "@/lib/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const clerkClient = ClerkClient.getInstance();
    const userId = await clerkClient.authenticateRequest(request);

    // Return cached workspaces if they exist
    const cacheKey = `workspaces:${userId}`;
    const cachedWorkspaces = await redis.get(cacheKey);

    if (cachedWorkspaces) {
      return NextResponse.json(JSON.parse(cachedWorkspaces));
    }

    // Get workspaces
    const workspaceService = WorkspaceService.getInstance();
    const workspaces = await workspaceService.getWorkspacesByUserId(userId);

    // Cache workspaces for 24 hours
    await redis.set(cacheKey, JSON.stringify(workspaces), "EX", 60 * 60 * 24);

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

    // Revalidate workspaces cache
    await redis.del(`workspaces:${userId}`);

    return NextResponse.json({ message: "Workspace created successfully" });
  } catch (error) {
    return handleError(error);
  }
}
