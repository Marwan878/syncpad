import { useEffect, useRef, useState } from "react";

export default function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<{
    getRect: () => DOMRect;
  }>({
    getRect: () => new DOMRect(),
  });

  const [isCursorVisible, setIsCursorVisible] = useState(false);

  // Handles clicking animation
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    const handleMouseClick = () => {
      if (timeout) return;

      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.classList.add("animate-squeeze");

      timeout = setTimeout(() => {
        cursor.classList.remove("animate-squeeze");
        timeout = undefined;
      }, 200);
    };

    document.addEventListener("click", handleMouseClick);

    return () => {
      document.removeEventListener("click", handleMouseClick);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Handles moving the cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const toolbarRect = toolbarRef.current?.getRect();
      if (!toolbarRect) return;

      const cursor = cursorRef.current;
      if (!cursor) return;

      // Ignore moving the cursor if it's above the toolbar
      // We just want to show the custom cursor in the editor
      if (e.clientY - 10 < toolbarRect.top) return;

      cursor.style.left = e.clientX - 10 + "px";
      cursor.style.top = e.clientY - 10 + "px";
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Handles showing the cursor
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const toolbarRect = toolbarRef.current?.getRect();
      if (!toolbarRect) return;

      if (e.target instanceof HTMLElement)
        setIsCursorVisible(
          e.clientY - 10 <= toolbarRect.top ||
            ((e.target.nodeName === "DIV" ||
              e.target.nodeName === "MAIN" ||
              e.target.nodeName === "BUTTON" ||
              e.target.nodeName === "SPAN" ||
              e.target.nodeName === "PATH" ||
              e.target.nodeName === "HTML" ||
              e.target.nodeName === "A" ||
              e.target.nodeName === "SVG") &&
              !e.target.closest(".node-imageUpload"))
        );
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return { cursorRef, toolbarRef, isCursorVisible };
}
