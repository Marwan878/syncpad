import { MouseEvent, ReactNode, useEffect, useRef } from "react";
import ModalHeader from "./modal-header";

type ModalProps = {
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({
  onClose,
  title,
  children,
}: Readonly<ModalProps>) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    modalRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleOverlayClick = (event: MouseEvent) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 p-4 w-screen h-screen bg-black/50"
      onClick={handleOverlayClick}
      tabIndex={-1}
    >
      <dialog
        ref={modalRef}
        className={`rounded-lg shadow-xl text-text-primary bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        aria-labelledby={"modal-title"}
      >
        <ModalHeader title={title} onClose={onClose} />

        {children}
      </dialog>
    </div>
  );
}
