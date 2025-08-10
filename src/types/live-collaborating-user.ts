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

export type CollaborationUser = {
  name: string;
  color: string;
  cursor?: {
    anchor: number;
    head: number;
    position: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  };
};
