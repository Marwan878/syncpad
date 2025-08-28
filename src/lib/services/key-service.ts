import { EncryptionKey } from "@/types/encryption-key";
import { HasuraClient } from "../hasura-client";
import { ValidationError } from "../error";

const UPDATE_KEY = `
  mutation UpdateKeyByWorkspace($userId: String!, $workspaceId: String!, $key: encryption_keys_set_input!) {
    update_encryption_keys(where: {_and: {workspace_id: {_eq: $workspaceId}, user_id: {_eq: $userId}}}, _set: $key) {
      id
      user_id
      page_id
      workspace_id
      key
    }
  }
`;

const CREATE_KEY = `
  mutation CreateKey($key: encryption_keys_insert_input!) {
      insert_encryption_keys_one(object: $key) {
          id
          user_id
          page_id
          workspace_id
          key
      }
    }
  }
`;

const GET_KEY = `
  query GetKeyByWorkspace($userId: String!, $workspaceId: String!) {
      encryption_keys(where: {_and: {user_id: {_eq: $userId}, workspace_id: {_eq: $workspaceId}}}) {
        id
        user_id
        page_id
        workspace_id
        key
      }
  }
`;

const DELETE_KEY = `
  mutation DeleteKeyByWorkspace($userId: String!, $workspaceId: String!) {
    delete_encryption_keys(where: {_and: {user_id: {_eq: $userId}, workspace_id: {_eq: $workspaceId}}}) {
        id
        user_id
        page_id
        workspace_id
        key
    }
  }
`;

export class KeyService {
  private static instance: KeyService;
  private readonly hasura = HasuraClient.getInstance();

  private constructor() {}

  static getInstance(): KeyService {
    if (!KeyService.instance) {
      KeyService.instance = new KeyService();
    }
    return KeyService.instance;
  }

  async updateKeyByUserIdAndPageId(
    userId: string | undefined,
    pageId: string | undefined,
    key: Partial<EncryptionKey>
  ) {
    if (!userId || !pageId) {
      throw new ValidationError("User ID and page ID are required");
    }

    const data = await this.hasura.query<{
      update_encryption_keys: EncryptionKey;
    }>(UPDATE_KEY, { userId, pageId, key });

    return data.update_encryption_keys;
  }

  async updateKeyByUserIdAndWorkspaceId(
    userId: string | undefined,
    workspaceId: string | undefined,
    key: Partial<EncryptionKey>
  ) {
    if (!userId || !workspaceId) {
      throw new ValidationError("User ID and workspace ID are required");
    }

    const data = await this.hasura.query<{
      update_encryption_keys: EncryptionKey;
    }>(UPDATE_KEY, { userId, workspaceId, key });

    return data.update_encryption_keys;
  }

  async getKeyByUserIdAndPageId(
    userId: string | undefined,
    pageId: string | undefined
  ) {
    if (!userId || !pageId) {
      throw new ValidationError("User ID and page ID are required");
    }

    const data = await this.hasura.query<{
      encryption_keys: EncryptionKey[];
    }>(GET_KEY, { userId, pageId });

    return data.encryption_keys;
  }

  async getKeyByUserIdAndWorkspaceId(
    userId: string | undefined,
    workspaceId: string | undefined
  ) {
    if (!userId || !workspaceId) {
      throw new ValidationError("User ID and workspace ID are required");
    }

    const data = await this.hasura.query<{
      encryption_keys: EncryptionKey;
    }>(GET_KEY, { userId, workspaceId });

    return data.encryption_keys;
  }

  async createKey(key: EncryptionKey) {
    const data = await this.hasura.query<{
      insert_encryption_keys_one: EncryptionKey;
    }>(CREATE_KEY, { key });

    return data.insert_encryption_keys_one;
  }

  async deleteKeyByUserIdAndPageId(
    userId: string | undefined,
    pageId: string | undefined
  ) {
    if (!userId || !pageId) {
      throw new ValidationError("User ID and page ID are required");
    }

    const data = await this.hasura.query<{
      delete_encryption_keys: EncryptionKey;
    }>(DELETE_KEY, { userId, pageId });

    return data.delete_encryption_keys;
  }

  async deleteKeyByUserIdAndWorkspaceId(
    userId: string | undefined,
    workspaceId: string | undefined
  ) {
    if (!userId || !workspaceId) {
      throw new ValidationError("User ID and workspace ID are required");
    }

    const data = await this.hasura.query<{
      delete_encryption_keys: EncryptionKey;
    }>(DELETE_KEY, { userId, workspaceId });

    return data.delete_encryption_keys;
  }
}
