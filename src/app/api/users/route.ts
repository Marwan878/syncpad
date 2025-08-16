import { ClerkClient } from "@/lib/clerk-client";
import { handleError } from "@/lib/error";
import { redis } from "@/lib/redis";
import { UserService } from "@/lib/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    // Authentication
    const clerkClient = ClerkClient.getInstance();
    await clerkClient.authenticateRequest(request);

    // Return cached users if they exist
    const cacheKey = `users:${query}`;
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      return NextResponse.json(JSON.parse(cachedUsers));
    }

    // Search users
    const userService = UserService.getInstance();
    const users = await userService.searchUsers(query);

    // Cache users for 5 minutes
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60 * 5);

    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}
