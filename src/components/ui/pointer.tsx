import { cn } from "@/lib/utils/cn";
import { MousePointer2 } from "lucide-react";

type PointerProps = {
  className?: string;
  username?: string;
  inverted?: boolean;
};

export default function Pointer({
  className,
  username,
  inverted,
}: Readonly<PointerProps>) {
  return (
    <div className={cn("absolute flex flex-col z-100", className)}>
      <MousePointer2
        className={cn("size-7 -mb-2", inverted && "rotate-y-180 self-end")}
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
