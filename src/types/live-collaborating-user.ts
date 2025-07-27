export type LiveCollaboratingUserStatus = "editing" | "viewing" | "idle";

export type LiveCollaboratingUser = {
  id: string;
  user_id: string;
  page_id: string;
  updated_at: string;
  status: LiveCollaboratingUserStatus;
  cursor_x: number;
  cursor_y: number;
};
