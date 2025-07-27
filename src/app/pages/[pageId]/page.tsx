"use client";

// TipTap
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// React
import { useState } from "react";

// Components
import Editor from "@/components/page/editor/editor";
import { SkeletonNode } from "@/components/page/editor/nodes/skeleton-node";
import PageImageWithNodeView from "@/components/page/editor/page-image";
import TableMenu from "@/components/page/editor/table-menu";
import Toolbar from "@/components/page/toolbar/toolbar";

const BackspaceExtension = Extension.create({
  name: "backspaceHandler",

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection, doc } = editor.state;

        const $from = doc.resolve(selection.from);

        if (
          $from.node(-1).type.name === "tableCell" ||
          $from.node(-1).type.name === "tableRow"
        ) {
          return false;
        }

        const node = $from.parent;

        // Delete the current empty block
        if (node.textContent === "" && node.type.name !== "table") {
          const nodeStart = $from.start();
          const nodeEnd = $from.end();

          editor.commands.deleteRange({ from: nodeStart - 1, to: nodeEnd });

          // Tells TipTap: I've handled this event
          return true;
        }

        // Default behavior for other cases
        return false;
      },
    };
  },
});

export default function Page() {
  const [confirmDeleteTableOpen, setConfirmDeleteTableOpen] = useState(false);
  const [textOptionsBarVisible, setTextOptionsBarVisible] = useState(false);

  const editor = useEditor({
    extensions: [
      BackspaceExtension,
      SkeletonNode,
      StarterKit,
      Image.extend({
        addAttributes() {
          return this.parent?.();
        },
        addNodeView() {
          return ReactNodeViewRenderer(PageImageWithNodeView);
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            if (node.attrs.level === 1) {
              return "Heading 1...";
            }
            if (node.attrs.level === 2) {
              return "Heading 2...";
            }
            if (node.attrs.level === 3) {
              return "Heading 3...";
            }
          }

          return "";
        },
        showOnlyCurrent: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    immediatelyRender: false,
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state;

      setTextOptionsBarVisible(!selection.empty);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded p-4 space-y-2 container mx-auto px-36">
      <Toolbar editor={editor} />
      <TableMenu
        editor={editor}
        setConfirmDeleteTableOpen={setConfirmDeleteTableOpen}
      />
      <Editor
        editor={editor}
        confirmDeleteTableOpen={confirmDeleteTableOpen}
        setConfirmDeleteTableOpen={setConfirmDeleteTableOpen}
        textOptionsBarVisible={textOptionsBarVisible}
      />
    </div>
  );
}
