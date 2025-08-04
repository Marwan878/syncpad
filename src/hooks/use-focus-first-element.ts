import { RefObject, useEffect } from "react";

export default function useFocusFirstElement(
  firstFocusableElementRef: RefObject<HTMLElement | null> | undefined
) {
  useEffect(() => {
    if (!firstFocusableElementRef) return;

    firstFocusableElementRef.current?.focus();
  }, [firstFocusableElementRef]);
}
