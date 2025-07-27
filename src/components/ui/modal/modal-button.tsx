import { CSSProperties, ReactNode } from "react";

type ModalButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
};

export default function ModalButton({
  children,
  onClick,
  variant = "secondary",
  className = "",
  disabled = false,
}: Readonly<ModalButtonProps>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={getVariantStyles(variant)}
    >
      {children}
    </button>
  );
}

const getVariantStyles = (
  variant: ModalButtonProps["variant"]
): CSSProperties => {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--color-brand)",
        color: "var(--color-text-inverted)",
        borderColor: "var(--color-brand)",
      };
    case "danger":
      return {
        backgroundColor: "var(--color-state-error)",
        color: "var(--color-text-inverted)",
        borderColor: "var(--color-state-error)",
      };
    default:
      return {
        backgroundColor: "var(--color-background-muted)",
        color: "var(--color-text-primary)",
        borderColor: "var(--color-background-muted)",
      };
  }
};
