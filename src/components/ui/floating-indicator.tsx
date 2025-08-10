import { Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type FloatingIndicatorProps = {
  text: string;
  className?: string;
};

export default function FloatingIndicator({
  text,
  className,
}: Readonly<FloatingIndicatorProps>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg ring-1 ring-background-muted/10 flex items-center space-x-2",
        className
      )}
    >
      <Circle
        fill="currentColor"
        className="text-inherit animate-pulse size-2"
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-text-primary select-none">
        {text}
      </span>
    </div>
  );
}
