export type Workspace = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  owner_id: string;
  pages_count: number;
};
