import { config } from "@/config/private-config";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { UnauthorizedError, ValidationError } from "../error";

export class AuthService {
  private static instance: AuthService;
  private readonly clerkClient = createClerkClient({
    secretKey: config.clerk.secretKey,
    publishableKey: config.clerk.publishableKey,
  });

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async isSignedIn(request: NextRequest): Promise<boolean> {
    const { isSignedIn } = await this.clerkClient.authenticateRequest(request, {
      jwtKey: config.clerk.jwtKey,
      authorizedParties: [config.app.url],
    });

    return isSignedIn;
  }

  async checkSignedIn(request: NextRequest): Promise<string> {
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
}
