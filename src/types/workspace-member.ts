type Role = "admin" | "editor" | "viewer";

export type WorkspaceMember = {
  id: string;
  user_id: string;
  workspace_id: string;
  role: Role;
  joined_at: string;
};
