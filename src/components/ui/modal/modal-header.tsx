import { X } from "lucide-react";

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ModalHeader({
  title,
  onClose,
}: Readonly<ModalHeaderProps>) {
  return (
    <div
      className="flex items-center justify-between py-4 px-6 border-b"
      style={{ borderColor: "var(--color-background-muted)" }}
    >
      <h2
        id="modal-title"
        className="text-xl font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </h2>
      <button
        onClick={onClose}
        className="p-2 rounded-lg transition-colors hover:bg-background-muted text-text-secondary"
        aria-label="Close modal"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
