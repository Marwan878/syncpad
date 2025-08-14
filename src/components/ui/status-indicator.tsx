import { Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ConnectionStatus } from "@/types/page";

type StatusIndicatorProps = {
  status: ConnectionStatus;
  className?: string;
};

const statusToClassName: Record<ConnectionStatus, string> = {
  connected: "text-accent",
  disconnected: "text-background-muted",
  connecting: "text-state-warning",
};

export default function StatusIndicator({
  status,
  className,
}: Readonly<StatusIndicatorProps>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/90 backdrop-blur-sm px-3 py-2 shadow-lg ring-1 ring-background-muted/10 flex items-center space-x-2",
        statusToClassName[status],
        className
      )}
    >
      <Circle
        fill="currentColor"
        className="text-inherit animate-pulse size-2"
        aria-hidden="true"
      />
      <span className="text-xs font-medium text-text-primary select-none">
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {status === "connected" && " (Live)"}
        {status === "connecting" && "..."}
      </span>
    </div>
  );
}
