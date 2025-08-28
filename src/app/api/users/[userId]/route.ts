import { AuthService } from "@/lib/services/auth-service";
import { ForbiddenError, handleError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { UserService } from "@/lib/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Authentication
    const clerkClient = AuthService.getInstance();
    await clerkClient.checkSignedIn(request);

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const updatedUser = await request.json();

    // Authorization
    const authService = AuthService.getInstance();
    const signedInUserId = await authService.checkSignedIn(request);

    if (signedInUserId !== userId) {
      throw new ForbiddenError("You are not authorized to update this user");
    }

    const userService = UserService.getInstance();
    const user = await userService.updateUser(userId, updatedUser);

    // Cache user for 24 hours
    await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 60 * 60 * 24);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
