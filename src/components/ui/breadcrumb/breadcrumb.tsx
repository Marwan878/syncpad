import { cn } from "@/lib/utils/cn";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type BreadcrumbProps = {
  className?: string;
  children: ReactNode;
};

type BreadcrumbItemProps = {
  href?: string;
  className?: string;
  children: ReactNode;
  isLast?: boolean;
  title?: string;
};

type BreadcrumbSeparatorProps = {
  className?: string;
};

function Breadcrumb({ className, children }: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-md text-text-secondary",
        className
      )}
      aria-label="Breadcrumb"
    >
      {children}
    </nav>
  );
}

function BreadcrumbItem({
  href,
  className,
  children,
  isLast = false,
  title,
}: BreadcrumbItemProps) {
  const baseClasses = cn(
    "hover:text-text-primary transition-colors duration-200",
    isLast && "text-text-primary font-medium",
    className
  );

  if (href && !isLast) {
    return (
      <Link href={href} className={baseClasses} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <span
      className={baseClasses}
      aria-current={isLast ? "page" : undefined}
      title={title}
    >
      {children}
    </span>
  );
}

function BreadcrumbSeparator({ className }: BreadcrumbSeparatorProps) {
  return (
    <ChevronRight
      className={cn("h-4 w-4 text-text-secondary", className)}
      aria-hidden="true"
    />
  );
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator };
