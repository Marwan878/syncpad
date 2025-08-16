import { config } from "@/config/private-config";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { UnauthorizedError, ValidationError } from "./error";

// TODO: Change the name to be more generic, we may change the library in the future
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

  // TODO: Change name to checkSignedIn
  async authenticateRequest(request: NextRequest): Promise<string> {
    const isSignedIn = await this.isSignedIn(request);

    if (!isSignedIn) {
      throw new UnauthorizedError("Authentication required");
    }

    const userId = request.headers.get("userId");

    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    return userId;
  }

  async isSignedIn(request: NextRequest): Promise<boolean> {
    const { isSignedIn } = await this.clerkClient.authenticateRequest(request, {
      jwtKey: config.clerk.jwtKey,
      authorizedParties: [config.app.url],
    });

    return isSignedIn;
  }
}
