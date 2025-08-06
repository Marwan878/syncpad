import { cn } from "@/lib/utils/cn";
import { ComponentProps } from "react";

type LabelProps = ComponentProps<"label">;

export default function Label({ children, ...props }: Readonly<LabelProps>) {
  return (
    <label
      {...props}
      className={cn(
        "block text-sm font-medium text-text-primary",
        props.className
      )}
    >
      {children}
    </label>
  );
}
