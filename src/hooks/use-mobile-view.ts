import { useEffect, useState } from "react";
import { useIsMobile } from "./use-mobile";

export default function useMobileView() {
  const isMobile = useIsMobile();

  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return { isMobile, mobileView, setMobileView };
}
