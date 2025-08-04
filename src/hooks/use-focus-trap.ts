import { RefObject, useEffect } from "react";

export default function useFocusTrap(
  mainElementRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea",
      'input[type="text"]',
      "select",
      '[tabindex]:not([tabindex="-1"])',
    ];

    const sidebar = mainElementRef.current;
    const focusableElements = sidebar?.querySelectorAll<HTMLElement>(
      focusableSelectors.join(",")
    );

    const firstEl = focusableElements?.[0];
    const lastEl = focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (!firstEl || !lastEl) return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Initial focus
    firstEl?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mainElementRef]);
}
