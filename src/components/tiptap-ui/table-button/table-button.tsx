"use client";

import * as React from "react";

// --- Tiptap UI ---
import type { UseTableConfig } from "@/components/tiptap-ui/table-button/use-table";
import {
  TABLE_SHORTCUT_KEY,
  useTable,
} from "@/components/tiptap-ui/table-button/use-table";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Lib ---
import { parseShortcutKeys } from "@/lib/tiptap-utils";

// --- UI Primitives ---
import { Badge } from "@/components/tiptap-ui-primitive/badge";
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";

export interface TableButtonProps
  extends Omit<ButtonProps, "type">,
    UseTableConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * Optional show shortcut keys in the button.
   * @default false
   */
  showShortcut?: boolean;
}

export function TableShortcutBadge({
  shortcutKeys = TABLE_SHORTCUT_KEY,
}: Readonly<{
  shortcutKeys?: string;
}>) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for inserting tables in a Tiptap editor.
 *
 * For custom button implementations, use the `useTable` hook instead.
 */
export const TableButton = React.forwardRef<
  HTMLButtonElement,
  TableButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onInserted,
      showShortcut = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const { isVisible, handleInsert, label, canInsert, Icon, shortcutKeys } =
      useTable({
        editor,
        hideWhenUnavailable,
        onInserted,
      });

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleInsert();
      },
      [handleInsert, onClick]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Button
        type="button"
        disabled={!canInsert}
        data-style="ghost"
        data-disabled={!canInsert}
        tabIndex={-1}
        aria-label={label}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && <TableShortcutBadge shortcutKeys={shortcutKeys} />}
          </>
        )}
      </Button>
    );
  }
);

TableButton.displayName = "TableButton";
