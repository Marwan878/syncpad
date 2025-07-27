import { Editor } from "@tiptap/react";
import {
  Heading,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  TableIcon,
} from "lucide-react";
import StyleButton from "./style-button";

export default function Toolbar({ editor }: Readonly<{ editor: Editor }>) {
  return (
    <div className="space-x-2 sticky top-6 rounded-md bg-background-light border-b border-background-muted p-4 z-20 shadow-sm">
      <StyleButton
        label="Heading 1"
        onClick={() => {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "heading",
              attrs: { level: 1 },
              content: [],
            })
            .run();
        }}
      >
        <Heading aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Heading 2"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "heading",
              attrs: { level: 2 },
              content: [],
            })
            .run()
        }
      >
        <Heading2 aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Heading 3"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "heading",
              attrs: { level: 3 },
              content: [],
            })
            .run()
        }
      >
        <Heading3 aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Task List"
        onClick={() =>
          editor.commands.insertContent([
            {
              type: "taskList",
              attrs: {},
              content: [
                {
                  type: "taskItem",
                  attrs: { checked: false },
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "First Task" }],
                    },
                  ],
                },
                {
                  type: "taskItem",
                  attrs: { checked: true },
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Done Task" }],
                    },
                  ],
                },
              ],
            },
          ])
        }
      >
        <ListTodo aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Bullet List"
        onClick={() =>
          editor.commands.insertContent([
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Some item" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Another item" }],
                    },
                  ],
                },
              ],
            },
          ])
        }
      >
        <List aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Ordered List"
        onClick={() =>
          editor.commands.insertContent([
            {
              type: "orderedList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Item 1" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Item 2" }],
                    },
                  ],
                },
              ],
            },
          ])
        }
      >
        <ListOrdered aria-hidden="true" />
      </StyleButton>

      <StyleButton
        label="Table"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        <TableIcon aria-hidden="true" />
      </StyleButton>
    </div>
  );
}
