import Pointer from "@/components/ui/pointer";
import { RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type CursorProps = {
  cursorRef: RefObject<HTMLImageElement | null>;
  cursorType: "ibeam" | "default";
};

export default function Cursor({ cursorRef, cursorType }: CursorProps) {
  if (cursorType === "ibeam")
    return createPortal(
      <Image
        ref={cursorRef}
        src={"/textcursor.png"}
        alt={"cursor"}
        height={32}
        width={32}
        className="pointer-events-none fixed z-[1000]"
      />,
      document.body
    );

  return createPortal(
    <Pointer
      wrapperClassName="pointer-events-none text-brand fixed z-[1000]"
      ref={cursorRef}
    />,
    document.body
  );
}
