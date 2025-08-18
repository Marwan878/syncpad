"use client";

// --- UI Primitives ---
import { Toolbar as ToolbarPrimitive } from "@/components/tiptap-ui-primitive/toolbar";

// --- Hooks ---
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useWindowSize } from "@/hooks/use-window-size";
import { useImperativeHandle, useRef } from "react";

// --- Types ---
import { Editor } from "@tiptap/react";

// --- Components ---
import MainToolbarContent from "./main-toolbar-content";
import MobileToolbarContent from "./mobile-toolbar-content";

type ToolbarProps = {
  editor: Editor;
  isMobile: boolean;
  mobileView: "main" | "highlighter" | "link";
  setMobileView: (view: "main" | "highlighter" | "link") => void;
  ref?: React.RefObject<{
    getRect: () => DOMRect;
  }>;
};

export default function Toolbar({
  editor,
  isMobile,
  mobileView,
  setMobileView,
  ref,
}: Readonly<ToolbarProps>) {
  const { height } = useWindowSize();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useImperativeHandle(ref, () => ({
    getRect: () => toolbarRef.current?.getBoundingClientRect() ?? new DOMRect(),
  }));

  return (
    <ToolbarPrimitive
      ref={toolbarRef}
      style={{
        ...(isMobile
          ? {
              bottom: `calc(100% - ${height - rect.y}px)`,
            }
          : {}),
      }}
    >
      {mobileView === "main" ? (
        <MainToolbarContent
          editor={editor}
          onHighlighterClick={() => setMobileView("highlighter")}
          onLinkClick={() => setMobileView("link")}
          isMobile={isMobile}
        />
      ) : (
        <MobileToolbarContent
          type={mobileView === "highlighter" ? "highlighter" : "link"}
          onBack={() => setMobileView("main")}
        />
      )}
    </ToolbarPrimitive>
  );
}
