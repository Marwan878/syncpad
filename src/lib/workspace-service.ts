import { Workspace } from "@/types/workspace";
import { ValidationError, ForbiddenError } from "./error";
import { HasuraClient } from "./hasura-client";

const WORKSPACE_QUERY = `
    query Workspace($id: uuid!) {
        workspaces_by_pk(id: $id) {
            id
            name
            description
            pages_count
            updated_at
            owner_id
            allowed_viewers_ids
            allowed_editors_ids
            any_user_can_edit
            any_user_can_view
        }
    } 
`;

const WORKSPACES_QUERY = `
    query WorkspacesQuery($userId: String!) {
      workspaces(where: { owner_id: { _eq: $userId } }) {
            id
            name
            description
            pages_count
            created_at
            updated_at
            owner_id
            allowed_viewers_ids
            allowed_editors_ids
            any_user_can_edit
            any_user_can_view
      }
    }
`;

const SHARED_WORKSPACES_QUERY = `
    query SharedWorkspacesQuery($userId: String!) {
      workspaces(where: { 
        _and: [
          { owner_id: { _neq: $userId } },
          { _or: [
            { allowed_viewers_ids: { _contains: [$userId] } },
            { allowed_editors_ids: { _contains: [$userId] } },
            { any_user_can_view: { _eq: true } },
            { any_user_can_edit: { _eq: true } }
          ]}
        ]
      }) {
            id
            name
            description
            pages_count
            created_at
            updated_at
            owner_id
            allowed_viewers_ids
            allowed_editors_ids
            any_user_can_edit
            any_user_can_view
      }
    }
`;

const DELETE_WORKSPACE_AND_PAGES_MUTATION = `
  mutation DeleteWorkspaceAndPages($id: uuid!) {
    delete_workspace_and_pages(args: { _workspace_id: $id }) {
          id
          name
          description
          pages_count
          created_at
          updated_at
          owner_id
          allowed_viewers_ids
          allowed_editors_ids
          any_user_can_edit
          any_user_can_view
    }
  }
`;

const WORKSPACE_ID_AND_OWNER_ID_QUERY = `
    query WorkspaceIdAndOwnerIdQuery($id: uuid!) {
      workspaces_by_pk(id: $id) {
        id
        owner_id
      }
    }
`;

const CREATE_WORKSPACE_MUTATION = `
  mutation CreateWorkspace($newWorkspace: workspaces_insert_input!) {
    insert_workspaces_one(object: $newWorkspace) {
      id
    }
  }
`;

const UPDATE_WORKSPACE_MUTATION = `
  mutation UpdateWorkspace($id: uuid!, $updates: workspaces_set_input!) {
    update_workspaces_by_pk(pk_columns: { id: $id }, _set: $updates) {
      id
    }
  }
`;

export class WorkspaceService {
  private static instance: WorkspaceService;
  private readonly hasura = HasuraClient.getInstance();

  private constructor() {}

  static getInstance(): WorkspaceService {
    if (!WorkspaceService.instance) {
      WorkspaceService.instance = new WorkspaceService();
    }
    return WorkspaceService.instance;
  }

  async getWorkspaceById(workspaceId: string | undefined): Promise<Workspace> {
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    const data = await this.hasura.query<{
      workspaces_by_pk: Workspace;
    }>(WORKSPACE_QUERY, { id: workspaceId });

    return data.workspaces_by_pk;
  }

  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    const data = await this.hasura.query<{
      workspaces: Workspace[];
    }>(WORKSPACES_QUERY, { userId });

    return data.workspaces;
  }

  async getSharedWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    const data = await this.hasura.query<{
      workspaces: Workspace[];
    }>(SHARED_WORKSPACES_QUERY, { userId });

    return data.workspaces;
  }

  async createWorkspace(
    userId: string,
    name: string,
    description?: string
  ): Promise<void> {
    const newWorkspace: Workspace = {
      name,
      description: description ?? "",
      id: crypto.randomUUID(),
      owner_id: userId,
      pages_count: 0,
      created_at: new Date().toISOString(),
      allowed_viewers_ids: [],
      allowed_editors_ids: [],
      any_user_can_edit: false,
      any_user_can_view: false,
    };

    await this.hasura.query<{
      insert_workspaces_one: Workspace;
    }>(CREATE_WORKSPACE_MUTATION, { newWorkspace });
  }

  async deleteWorkspaceAndPagesById(workspaceId: string): Promise<Workspace> {
    const data = await this.hasura.query<{
      delete_workspace_and_pages: Workspace;
    }>(DELETE_WORKSPACE_AND_PAGES_MUTATION, {
      id: workspaceId,
    });

    return data.delete_workspace_and_pages;
  }

  async checkUserCanDelete(workspaceId: string, userId: string): Promise<void> {
    const data = await this.hasura.query<{
      workspaces_by_pk: {
        id: string;
        owner_id: string;
      };
    }>(WORKSPACE_ID_AND_OWNER_ID_QUERY, { id: workspaceId });

    if (data.workspaces_by_pk.owner_id !== userId) {
      throw new ForbiddenError("You are not the owner of this workspace");
    }
  }

  async checkUserCanView(workspaceId: string, userId: string): Promise<void> {
    const workspace = await this.getWorkspaceById(workspaceId);
    // If workspace allows public access, no need to check further
    if (workspace.any_user_can_view || workspace.any_user_can_edit) {
      return;
    }

    // Check if user has any form of access
    const hasAccess =
      workspace.owner_id === userId ||
      workspace.allowed_viewers_ids.includes(userId) ||
      workspace.allowed_editors_ids.includes(userId);

    if (!hasAccess) {
      throw new ForbiddenError("You do not have access to this workspace");
    }
  }

  async checkUserCanEdit(workspaceId: string, userId: string): Promise<void> {
    const workspace = await this.getWorkspaceById(workspaceId);
    if (workspace.any_user_can_edit) {
      return;
    }

    const canEdit =
      workspace.owner_id === userId ||
      workspace.allowed_editors_ids.includes(userId);

    if (!canEdit) {
      throw new ForbiddenError(
        "You do not have edit permissions for this workspace"
      );
    }
  }

  async updateWorkspace({
    workspaceId,
    updates,
  }: {
    workspaceId?: string;
    updates: Partial<Omit<Workspace, "id" | "created_at" | "updated_at">>;
  }): Promise<void> {
    await this.hasura.query<void>(UPDATE_WORKSPACE_MUTATION, {
      id: workspaceId,
      updates: {
        ...updates,
        updated_at: new Date().toISOString(),
      },
    });
  }

  async checkUserCanModifyWorkspace(
    userId: string,
    workspaceId?: string
  ): Promise<void> {
    const workspace = await this.getWorkspaceById(workspaceId);
    if (workspace.owner_id !== userId) {
      throw new ForbiddenError("You are not the owner of this workspace");
    }
  }
}
