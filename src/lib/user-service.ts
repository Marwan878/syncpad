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

const CREATE_USER = `
  mutation CreateUser($id: String!, $name: String!, $email: String, $avatar_url: String!, $created_at: timestamptz!) {
    insert_users_one(object: {
      id: $id,
      name: $name,
      email: $email,
      avatar_url: $avatar_url,
      created_at: $created_at
    }) {
      id
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

  async createUser(user: User): Promise<User> {
    const data = await this.hasura.query<{
      insert_users_one: User;
    }>(CREATE_USER, { user });

    return data.insert_users_one;
  }
}
