import { Editor as EditorType } from "@tiptap/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
} from "lucide-react";

type TextOptionsBarProps = {
  editor: EditorType;
};

type TextOption = {
  label: string;
  icon: React.ElementType;
  onClick: (editor: EditorType) => void;
};

const textOptions: TextOption[] = [
  {
    label: "Bold",
    icon: Bold,
    onClick: (editor) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  {
    label: "Italic",
    icon: Italic,
    onClick: (editor) => {
      editor.chain().focus().toggleItalic().run();
    },
  },
  {
    label: "Underline",
    icon: Underline,
    onClick: (editor) => {
      editor.chain().focus().toggleUnderline().run();
    },
  },
  {
    label: "Strikethrough",
    icon: Strikethrough,
    onClick: (editor) => {
      editor.chain().focus().toggleStrike().run();
    },
  },
  {
    label: "Code",
    icon: Code,
    onClick: (editor) => {
      editor.chain().focus().toggleCode().run();
    },
  },
  {
    label: "Link",
    icon: Link,
    onClick: (editor) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to).trim();

      if (!selectedText) return;

      // Apply the link using the selected text as the URL
      editor.chain().focus().setLink({ href: selectedText }).run();
    },
  },
] as const;
// TODO: Fix weird positioning
export default function TextOptionsBar({
  editor,
}: Readonly<TextOptionsBarProps>) {
  const [barPosition, setBarPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updateBarPosition = () => {
      console.log("Updating bar position");
      const { from, to } = editor.state.selection;

      console.log(from, to);

      if (from === to) {
        return;
      }

      const selectedElement = editor.view.domAtPos(from).node;

      let textParentRect: DOMRect;

      // The user selected the whole text (including the tag)
      if (selectedElement instanceof HTMLElement) {
        textParentRect = selectedElement.getBoundingClientRect();
      }
      // The user selected only a part of the text (not including the tag)
      else {
        const textParent = selectedElement.parentElement;

        if (!textParent) {
          console.error("No parent element found for selected text");
          return;
        }

        textParentRect = textParent.getBoundingClientRect();
      }

      const barTopMargin = 8;

      const top =
        textParentRect.top +
        textParentRect.height +
        window.scrollY +
        barTopMargin;

      const left = editor.state.selection.from;

      setBarPosition({
        top,
        left,
      });
    };

    editor.on("selectionUpdate", updateBarPosition);
    editor.on("transaction", updateBarPosition);

    return () => {
      editor.off("selectionUpdate", updateBarPosition);
      editor.off("transaction", updateBarPosition);
    };
  }, [editor]);

  return createPortal(
    <ul
      className="absolute bg-white p-2 rounded-md border-gray-200 flex gap-3 shadow-md"
      style={{
        top: barPosition.top,
        left: barPosition.left,
      }}
    >
      {textOptions.map((option) => (
        <li
          key={option.label}
          className="hover:bg-background-muted flex items-center justify-center rounded-sm transition-colors"
        >
          <button
            onClick={() => option.onClick(editor)}
            aria-label={option.label}
            title={option.label}
            className="w-full h-full p-2"
          >
            <option.icon className="w-6 h-6" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>,
    document.body
  );
}
