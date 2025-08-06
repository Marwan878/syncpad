import { ClerkClient } from "@/lib/clerk-client";
import { handleError } from "@/lib/error";
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

    // Get user
    const userService = UserService.getInstance();

    const user = await userService.getUser(userId);

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}
