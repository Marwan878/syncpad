import { Breakpoint } from "@/types";
import { useEffect, useState } from "react";

export default function useBelowBreakpoint(breakpoint: Breakpoint) {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const breakpointValue = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--breakpoint-" + breakpoint
        )
      );

      setIsBelowBreakpoint(window.innerWidth < breakpointValue);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isBelowBreakpoint;
}
