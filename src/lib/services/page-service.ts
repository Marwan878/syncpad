import { Page, PageWithByte64Content } from "@/types/page";
import { HasuraClient } from "../hasura-client";
import { WorkspaceService } from "./workspace-service";
import { ForbiddenError, ValidationError } from "../error";

const PAGES_QUERY = `
    query Pages($workspaceId: uuid!) {
        pages(where: { workspace_id: { _eq: $workspaceId } }, order_by: { order: asc }) {
            id
            title
            order
            updated_at
            workspace_id
            content
        }
    }
`;

const PAGES_MUTATION = `
  mutation CreatePage($newPage: jsonb!) {
    create_page_and_increment_count(args: { _new_page: $newPage }) {
      id,
      title,
      order,
      created_at,
      workspace_id,
      updated_at
      content
    }
  }
`;

const PAGES_UPDATE_MUTATION = `
  mutation UpdatePage($updates: pages_set_input!, $pageId: uuid!) {
    update_pages_by_pk(pk_columns: { id: $pageId }, _set: $updates) {
      id
      title
      order
      updated_at
      workspace_id
      content
    }
  }
`;

const PAGES_GET_BY_ID_QUERY = `
  query Page($pageId: uuid!) {
    pages_by_pk(id: $pageId) {
      id
      title
      order
      updated_at
      workspace_id
      content
    }
  }
`;

const DELETE_PAGE_AND_DECREMENT_PAGES_COUNT_AND_REORDER_MUTATION = `
  mutation DeletePageAndDecrementPagesCount($pageId: uuid!) {
    delete_page_and_decrement_pages_count_and_reorder(args: { _page_id: $pageId }) {
      id
      title
      workspace_id
      created_at
      updated_at
      order
      content
    }
  }
`;

export class PageService {
  private static instance: PageService;
  private readonly hasura = HasuraClient.getInstance();

  private constructor() {}

  static getInstance(): PageService {
    if (!PageService.instance) {
      PageService.instance = new PageService();
    }
    return PageService.instance;
  }

  async createPageAndIncrementWorkspacePagesCount(
    newPage: Page
  ): Promise<Page> {
    const data = await this.hasura.query<{
      create_page_and_increment_count: Page;
    }>(PAGES_MUTATION, { newPage });

    return data.create_page_and_increment_count;
  }

  async getPagesByWorkspaceId(
    workspaceId: string | undefined
  ): Promise<PageWithByte64Content[]> {
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    const data = await this.hasura.query<{
      pages: PageWithByte64Content[];
    }>(PAGES_QUERY, { workspaceId });

    return data.pages;
  }

  async updatePage(pageId: string, updates: Partial<Page>) {
    await this.hasura.query<{
      update_page_by_pk: Page;
    }>(PAGES_UPDATE_MUTATION, {
      updates: { ...updates, updated_at: new Date().toISOString() },
      pageId,
    });
  }

  async getPageById(pageId: string) {
    const data = await this.hasura.query<{
      pages_by_pk: Page;
    }>(PAGES_GET_BY_ID_QUERY, { pageId });

    return data.pages_by_pk;
  }

  async checkUserCanDeletePage(
    workspaceId: string | undefined,
    userId: string
  ) {
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required");
    }

    const workspaceService = WorkspaceService.getInstance();
    const workspace = await workspaceService.getWorkspaceById(workspaceId);

    const canDelete =
      workspace.owner_id === userId ||
      workspace.allowed_editors_ids.includes(userId);

    if (!canDelete) {
      throw new ForbiddenError("You can't delete this page");
    }
  }

  async deletePageAndDecrementPagesCountAndReorder(pageId: string | undefined) {
    if (!pageId) {
      throw new ValidationError("Page ID is required");
    }

    const data = await this.hasura.query<{
      delete_page_and_decrement_pages_count_and_reorder: Page;
    }>(DELETE_PAGE_AND_DECREMENT_PAGES_COUNT_AND_REORDER_MUTATION, { pageId });

    return data.delete_page_and_decrement_pages_count_and_reorder;
  }
}
