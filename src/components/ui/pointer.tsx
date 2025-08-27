import { cn } from "@/lib/utils/cn";
import { MousePointer2 } from "lucide-react";
import { CSSProperties, RefObject } from "react";

type PointerProps = {
  wrapperClassName?: string;
  pointerClassName?: string;
  username?: string;
  inverted?: boolean;
  style?: CSSProperties;
  ref?: RefObject<HTMLDivElement | null>;
};

export default function Pointer({
  wrapperClassName,
  pointerClassName,
  username,
  inverted,
  style,
  ref,
}: Readonly<PointerProps>) {
  return (
    <div
      className={cn("absolute flex flex-col z-100", wrapperClassName)}
      style={style}
      ref={ref}
    >
      <MousePointer2
        className={cn(
          "size-7 -mb-2",
          inverted && "rotate-y-180 self-end",
          pointerClassName
        )}
        fill="currentColor"
        fillOpacity={0.5}
        aria-hidden
      />
      {username && (
        <span
          className={cn(
            "text-sm rounded-full max-w-24 py-1 px-2 self-end border truncate select-none",
            {
              "ms-5": !inverted,
              "me-5": inverted,
            }
          )}
        >
          {username.split(" ")[0]}
        </span>
      )}
    </div>
  );
}
