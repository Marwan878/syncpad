"use client";

import * as React from "react";
import { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { TableIcon } from "@/components/tiptap-icons/table-icon";

export const TABLE_SHORTCUT_KEY = "Mod-Alt-t";

export interface UseTableConfig {
  /**
   * The editor instance to use. If not provided, the editor will be retrieved from the nearest EditorProvider.
   */
  editor?: Editor | null;
  /**
   * Whether to hide the button when the table functionality is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean;
  /**
   * Callback function to execute when a table is inserted.
   */
  onInserted?: () => void;
}

export function canInsertTable(editor: Editor | null): boolean {
  if (!editor) return false;
  return editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true });
}

export function insertTable(editor: Editor): boolean {
  if (!editor) return false;

  return editor
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
}

export function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;

  if (hideWhenUnavailable) {
    return canInsertTable(editor);
  }

  return true;
}

/**
 * Custom hook that provides table insertion functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage
 * function MySimpleTableButton() {
 *   const { isVisible, handleInsert } = useTable()
 *
 *   if (!isVisible) return null
 *
 *   return <button onClick={handleInsert}>Insert Table</button>
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedTableButton() {
 *   const { isVisible, handleInsert, label } = useTable({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onInserted: () => console.log('Table inserted!')
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleInsert}
 *       aria-label={label}
 *     >
 *       Insert Table
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useTable(config: UseTableConfig = {}) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config;

  const { editor } = useTiptapEditor(providedEditor);
  const [isVisible, setIsVisible] = React.useState<boolean>(true);
  const canInsert = canInsertTable(editor);

  React.useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };

    handleUpdate();

    editor.on("transaction", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
    };
  }, [editor, hideWhenUnavailable]);

  const handleInsert = React.useCallback(() => {
    if (!editor) return false;

    const success = insertTable(editor);
    if (success) {
      onInserted?.();
    }
    return success;
  }, [editor, onInserted]);

  return {
    isVisible,
    handleInsert,
    canInsert,
    label: "Insert Table",
    shortcutKeys: TABLE_SHORTCUT_KEY,
    Icon: TableIcon,
  };
}
