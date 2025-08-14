export type Page = {
  id: string;
  title: string;
  workspace_id: string;
  created_at: string;
  updated_at?: string;
  order: number;
  content: Uint8Array<ArrayBufferLike>;
};

export type PageWithByte64Content = Omit<Page, "content"> & {
  content?: string;
};

export type ConnectionStatus = "connected" | "disconnected" | "connecting";
