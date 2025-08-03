export type Workspace = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  owner_id: string;
  pages_count: number;
  allowed_viewers_ids: string[];
  allowed_editors_ids: string[];
  any_user_can_edit: boolean;
  any_user_can_view: boolean;
};
