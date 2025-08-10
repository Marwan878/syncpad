import { Page } from "@/types/page";
import { HasuraClient } from "./hasura-client";

const PAGES_QUERY = `
    query Pages($workspaceId: uuid!) {
        pages(where: { workspace_id: { _eq: $workspaceId } }, order_by: { order: asc }) {
            id
            title
            order
            updated_at
            workspace_id
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

  async getPagesByWorkspaceId(workspaceId: string): Promise<Page[]> {
    const data = await this.hasura.query<{
      pages: Page[];
    }>(PAGES_QUERY, { workspaceId });

    return data.pages;
  }
}
