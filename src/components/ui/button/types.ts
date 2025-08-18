import { ComponentPropsWithRef, ElementType } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "error"
  | "warning"
  | "icon";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
} & Omit<
  ComponentPropsWithRef<T>,
  "as" | "variant" | "isLoading" | "loadingText" | "size"
>;
