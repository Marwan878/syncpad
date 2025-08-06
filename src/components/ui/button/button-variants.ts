import { ButtonSize, ButtonVariant } from "./types";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-text-inverted hover:bg-brand-dark active:bg-brand-dark focus:ring-brand shadow-sm",
  secondary:
    "bg-background-muted text-text-primary hover:bg-background-dark-muted hover:text-text-inverted active:bg-background-dark-muted active:text-text-inverted focus:ring-background-dark border border-background-muted",
  accent:
    "bg-accent text-text-inverted hover:bg-accent-dark active:bg-accent-dark focus:ring-accent shadow-sm",
  outline:
    "border border-brand text-brand hover:bg-brand hover:text-text-inverted active:bg-brand active:text-text-inverted focus:ring-brand",
  ghost:
    "text-text-secondary hover:bg-background-muted hover:text-text-primary active:bg-background-muted active:text-text-primary focus:ring-background-muted",
  error:
    "bg-state-error text-text-inverted hover:bg-red-700 active:bg-red-700 focus:ring-state-error shadow-sm",
  warning:
    "bg-state-warning text-text-primary hover:bg-yellow-500 active:bg-yellow-500 focus:ring-state-warning shadow-sm",
  icon: "px-1 py-1 md:px-2 md:py-2 rounded-md text-text-secondary hover:bg-background-muted hover:text-text-primary active:bg-background-muted active:text-text-primary focus:ring-background-muted",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium",
  md: "px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold",
  lg: "px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold",
};

export const disabledStyles =
  "opacity-50 cursor-not-allowed hover:bg-current focus:ring-0";

export const loadingStyles = "";

export const baseStyles =
  "inline-flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light disabled:pointer-events-none";
