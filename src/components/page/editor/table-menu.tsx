import { Editor } from "@tiptap/react";
import {
  BetweenHorizonalStart,
  BetweenVerticalStart,
  PanelBottomOpen,
  PanelRightOpen,
  Trash2,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const menuItems = [
  {
    children: (
      <>
        <BetweenHorizonalStart aria-hidden="true" /> Add Row
      </>
    ),
    onClick: (editor: Editor) => editor.chain().focus().addRowAfter().run(),
  },
  {
    children: (
      <>
        <PanelBottomOpen aria-hidden="true" /> Delete Row
      </>
    ),
    onClick: (editor: Editor) => editor.chain().focus().deleteRow().run(),
  },
  {
    children: (
      <>
        <BetweenVerticalStart aria-hidden="true" /> Add Column
      </>
    ),
    onClick: (editor: Editor) => editor.chain().focus().addColumnAfter().run(),
  },
  {
    children: (
      <>
        <PanelRightOpen aria-hidden="true" /> Delete Column
      </>
    ),
    onClick: (editor: Editor) => editor.chain().focus().deleteColumn().run(),
  },
  {
    children: (
      <>
        <Trash2 aria-hidden="true" className="text-state-error" /> Delete Table
      </>
    ),
    onClick: (
      editor: Editor,
      setConfirmDeleteTableOpen: Dispatch<SetStateAction<boolean>>
    ) => {
      setConfirmDeleteTableOpen(true);
    },
    className: "text-state-error hover:bg-state-error/10",
  },
];

type TableMenuProps = {
  editor: Editor;
  setConfirmDeleteTableOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TableMenu({
  editor,
  setConfirmDeleteTableOpen,
}: Readonly<TableMenuProps>) {
  const [tableActive, setTableActive] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateMenuPosition = () => {
      const tableActive = editor.isActive("table");
      setTableActive(tableActive);

      if (tableActive) {
        const table = (
          editor.view.domAtPos(editor.state.selection.from).node as HTMLElement
        ).closest("table");

        if (table) {
          const tableRect = table.getBoundingClientRect();

          const menuMarginLeft = 8;

          setMenuPosition({
            top: tableRect.top + window.scrollY,
            left: tableRect.right + window.scrollX + menuMarginLeft,
          });
        }
      }
    };

    editor.on("selectionUpdate", updateMenuPosition);
    editor.on("transaction", updateMenuPosition);

    return () => {
      editor.off("selectionUpdate", updateMenuPosition);
      editor.off("transaction", updateMenuPosition);
    };
  }, [editor]);

  if (!tableActive) return null;

  return (
    <ul
      className="flex flex-col space-y-1 p-4 bg-white shadow-md rounded-md absolute z-10"
      style={menuPosition}
    >
      {menuItems.map((item, i) => (
        <li key={i * i}>
          <button
            className={`flex items-center gap-2 w-full py-2 px-2 rounded-sm hover:bg-background-muted ${
              item.className ?? ""
            }`}
            onClick={() => item.onClick(editor, setConfirmDeleteTableOpen)}
            style={{ "--cursor": "default" } as React.CSSProperties}
          >
            {item.children}
          </button>
        </li>
      ))}
    </ul>
  );
}
