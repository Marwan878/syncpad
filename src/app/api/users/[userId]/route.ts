import { ClerkClient } from "@/lib/clerk-client";
import { handleError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { UserService } from "@/lib/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Authentication
    const clerkClient = ClerkClient.getInstance();
    await clerkClient.authenticateRequest(request);

    // Return cached user if it exists
    const cachedUser = await redis.get(`user:${userId}`);

    if (cachedUser) {
      return NextResponse.json(JSON.parse(cachedUser));
    }

    // Get user
    const userService = UserService.getInstance();
    const user = await userService.getUser(userId);

    // Cache user for 24 hours
    await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 60 * 60 * 24);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
