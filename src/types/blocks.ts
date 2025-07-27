import { JSONContent } from "@tiptap/react";

export type Block = {
  id: string;
  type: string;
  order: number;
  created_at: string;
  updated_at?: string;
  page_id: string;
  content: JSONContent;
};
