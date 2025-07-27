import { ReactNode } from "react";

type StyleButtonProps = {
  onClick: () => void;
  label: string;
  children: ReactNode;
};

export default function StyleButton({
  children,
  onClick,
  label,
}: Readonly<StyleButtonProps>) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-2 text-text-secondary hover:bg-background-muted hover:text-text-primary transition-colors"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
