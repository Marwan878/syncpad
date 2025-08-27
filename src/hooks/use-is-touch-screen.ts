import { useEffect, useState } from "react";

export default function useIsTouchScreen() {
  const [isTouchScreen, setIsTouchScreen] = useState<boolean | null>(null);

  useEffect(() => {
    function handlePointerDownOrPointerMove(e: PointerEvent) {
      // Return it's already been determined
      if (isTouchScreen !== null) return;

      if (e.pointerType === "mouse") {
        setIsTouchScreen(false);
      } else {
        setIsTouchScreen(true);
      }
    }

    window.addEventListener("pointerdown", handlePointerDownOrPointerMove);
    window.addEventListener("pointermove", handlePointerDownOrPointerMove);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDownOrPointerMove);
      window.removeEventListener("pointermove", handlePointerDownOrPointerMove);
    };
  }, [isTouchScreen]);

  return { isTouchScreen };
}
