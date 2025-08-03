import { config } from "@/config/private-config";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export class ClerkClient {
  private static instance: ClerkClient;
  private readonly clerkClient = createClerkClient({
    secretKey: config.clerk.secretKey,
    publishableKey: config.clerk.publishableKey,
  });

  private constructor() {}

  static getInstance(): ClerkClient {
    if (!ClerkClient.instance) {
      ClerkClient.instance = new ClerkClient();
    }
    return ClerkClient.instance;
  }

  async authenticateRequest(request: NextRequest): Promise<string> {
    const { isSignedIn } = await this.clerkClient.authenticateRequest(request, {
      jwtKey: config.clerk.jwtKey,
      authorizedParties: [config.app.url],
    });

    if (!isSignedIn) {
      throw new Error("Authentication required");
    }

    const userId = request.headers.get("userId");

    if (!userId) {
      throw new Error("User ID is required");
    }

    return userId;
  }
}
