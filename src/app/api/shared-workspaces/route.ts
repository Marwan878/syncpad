import { AuthService } from "@/lib/services/auth-service";
import { handleError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { WorkspaceService } from "@/lib/services/workspace-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const clerkClient = AuthService.getInstance();
    const userId = await clerkClient.checkSignedIn(request);

    // Return cached shared workspaces if they exist
    const cacheKey = `shared-workspaces:${userId}`;
    const cachedSharedWorkspaces = await redis.get(cacheKey);

    if (cachedSharedWorkspaces) {
      return NextResponse.json(JSON.parse(cachedSharedWorkspaces));
    }

    // Get shared workspaces
    const workspaceService = WorkspaceService.getInstance();
    const sharedWorkspaces = await workspaceService.getSharedWorkspacesByUserId(
      userId
    );

    // Cache shared workspaces for 5 minutes
    await redis.set(cacheKey, JSON.stringify(sharedWorkspaces), "EX", 60 * 5);

    return NextResponse.json(sharedWorkspaces);
  } catch (error) {
    return handleError(error);
  }
}
