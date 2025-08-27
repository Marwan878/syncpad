import { Editor } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";

const AVAILABLE_CURSORS = ["ibeam", "default"] as const;

export default function useCustomCursor(
  editor: Editor | null,
  topElementRef: React.RefObject<HTMLDivElement | null>,
  toolbarRef: React.RefObject<HTMLDivElement | null>
) {
  const cursorRef = useRef<HTMLImageElement | null>(null);

  const [cursorType, setCursorType] =
    useState<(typeof AVAILABLE_CURSORS)[number]>("default");
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  // Handles clicking animation
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;

    const handleMouseClick = () => {
      if (timeout || !isCursorVisible) return;

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
  }, [isCursorVisible]);

  // Handles moving the cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const topElementRect = topElementRef.current?.getBoundingClientRect();
      if (!topElementRect) return;

      // Hide custom cursor if it's above the top element (in the header)
      setIsCursorVisible(e.clientY >= topElementRect.top);

      const cursor = cursorRef.current;
      if (!cursor) return;

      const cursorHotspotMargin = cursorType === "ibeam" ? 16 : 0;

      cursor.style.left = e.clientX - cursorHotspotMargin + "px";
      cursor.style.top = e.clientY - cursorHotspotMargin + "px";
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorType, topElementRef]);

  // Handles showing cursor type default / I-beam
  useEffect(() => {
    function handleMouseOver(e: MouseEvent) {
      if (!isCursorVisible || !toolbarRef.current) return;

      const target = e.target;

      if (!(target instanceof HTMLElement)) return;
      const toolbar = toolbarRef.current;
      const toolbarRect = toolbar.getBoundingClientRect();

      // If we're inside the toolbar or a popover or an image uploader or an image the cursor type is infered from the --cursor CSS variable
      if (
        toolbarRef.current.contains(target) ||
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest(".node-imageUpload") ||
        target.tagName === "IMG" ||
        target.tagName === "BUTTON" ||
        e.clientY < toolbarRect.top
      ) {
        const targetStyle = getComputedStyle(target);
        const targetAssignedCursor = targetStyle.getPropertyValue("--cursor");

        if (isDefinedCursorType(targetAssignedCursor)) {
          setCursorType(targetAssignedCursor);
        } else {
          setCursorType("default");
          console.debug(target, "cursor property value not set");
        }
        // Other than that we're in the editor, so we show an I-Beam by default
      } else {
        setCursorType("ibeam");
      }
    }

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [topElementRef, isCursorVisible, toolbarRef]);

  return { cursorRef, isCursorVisible, cursorType };
}

function isDefinedCursorType(
  cursorType: string
): cursorType is (typeof AVAILABLE_CURSORS)[number] {
  return AVAILABLE_CURSORS.includes(
    cursorType as (typeof AVAILABLE_CURSORS)[number]
  );
}
