"use client";

// UI
import { Button } from "@/components/ui";
import { X } from "lucide-react";
import OverlayingElement from "../ui/overlaying-element";
import BurgerMenuButton from "./burger-menu-button";
import LinksList from "./links-list";

// Hooks
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useBelowBreakpoint from "@/hooks/use-below-breakpoint";

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isRelativelySmallScreen = useBelowBreakpoint("md");

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <BurgerMenuButton onClick={() => setIsOpen(true)} />
      {isRelativelySmallScreen && isOpen && (
        <OverlayingElement
          onClose={() => setIsOpen(false)}
          className="bg-white h-screen w-[80vw] max-w-sm fixed top-0 right-0 z-50 flex flex-col items-start animate-slide-in"
          firstFocusableElementRef={firstFocusableElementRef}
        >
          <Button
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            variant="ghost"
            className="self-end mt-4 mr-4"
            ref={firstFocusableElementRef}
          >
            <X className="h-6 w-6" aria-hidden />
          </Button>
          <LinksList className="flex flex-col items-start space-x-4 flex-grow ps-2 py-3" />
        </OverlayingElement>
      )}

      {!isRelativelySmallScreen && (
        <LinksList className="flex items-center gap-x-3" />
      )}
    </>
  );
}
