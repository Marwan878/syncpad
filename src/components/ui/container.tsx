import { cn } from "@/lib/utils/cn";
import { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export default function Container({
  children,
  className,
  as: Component = "div",
}: Readonly<ContainerProps>) {
  return (
    <Component
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Component>
  );
}
