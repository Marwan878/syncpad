import { User } from "@/types/user";
import { ValidationError } from "./error";
import { HasuraClient } from "./hasura-client";

const USER_QUERY = `
    query GetUser($userId: String!) {
        users_by_pk(id: $userId) {
            id
            name
            email
            avatar_url
            created_at
        }
    }
`;

const USER_SEARCH_QUERY = `
  query GetUsers($query: String!) {
    users(where: {
      _or: [
        { name: { _ilike: $query } },
        { email: { _ilike: $query } }
      ]
    }) {
      id
      name
      email
      avatar_url
      created_at
    }
  }
`;

export class UserService {
  private static instance: UserService;
  private readonly hasura = HasuraClient.getInstance();

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUser(userId: string): Promise<User> {
    const data = await this.hasura.query<{
      users_by_pk: User;
    }>(USER_QUERY, { userId });

    return data.users_by_pk;
  }

  async searchUsers(query: string | null): Promise<User[]> {
    if (!query) {
      throw new ValidationError("Query is required");
    }

    const data = await this.hasura.query<{
      users: User[];
    }>(USER_SEARCH_QUERY, { query: `%${query}%` });

    return data.users;
  }
}
