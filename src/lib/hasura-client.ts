import { config } from "@/config/private-config";

export class HasuraClient {
  // Singleton pattern
  private static instance: HasuraClient;
  private readonly baseUrl: string;
  private readonly adminSecret: string;

  private constructor() {
    this.baseUrl = config.hasura.url;
    this.adminSecret = config.hasura.adminSecret;
  }

  static getInstance(): HasuraClient {
    if (!HasuraClient.instance) {
      HasuraClient.instance = new HasuraClient();
    }
    return HasuraClient.instance;
  }

  async query<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": this.adminSecret,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      throw new Error(
        `GraphQL error: ${data.errors[0]?.message || "Unknown error"}`
      );
    }

    return data.data;
  }
}
