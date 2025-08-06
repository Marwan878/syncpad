import { ClerkClient } from "@/lib/clerk-client";
import { handleError } from "@/lib/error";
import { UserService } from "@/lib/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    // Authentication
    const clerkClient = ClerkClient.getInstance();
    await clerkClient.authenticateRequest(request);

    // Search users
    const userService = UserService.getInstance();
    const users = await userService.searchUsers(query);

    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}
