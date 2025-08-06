import { cn } from "@/lib/utils/cn";

export default function ModalBody({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={cn("p-3 md:p-6", className)}>{children}</div>;
}
