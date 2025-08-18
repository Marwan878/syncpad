import { Pencil } from "lucide-react";
import { ElementType } from "react";
import {
  baseStyles,
  buttonSizes,
  buttonVariants,
  disabledStyles,
  loadingStyles,
} from "./button-variants";
import { ButtonProps } from "./types";
import { cn } from "@/lib/utils/cn";

const Button = <T extends ElementType = "button">({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  as,
  ...props
}: ButtonProps<T>) => {
  const Component = as ?? "button";

  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];

  const combinedClassName = [
    baseStyles,
    sizeClasses,
    variantClasses,
    isLoading ? loadingStyles : "",
    props.disabled || isLoading ? disabledStyles : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      disabled={props.disabled || isLoading}
      {...props}
      className={cn(combinedClassName, props.className)}
    >
      {isLoading && (
        <Pencil
          size={16}
          className="animate-spin"
          style={{
            animationDuration: "0.5s",
          }}
          aria-label="Loading"
        />
      )}
      {isLoading && loadingText && <span className="ms-2">{loadingText}</span>}

      {!isLoading && props.children}
    </Component>
  );
};

export default Button;
