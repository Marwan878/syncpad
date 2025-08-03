"use client";

import { MouseEvent, ReactNode, useEffect, useRef } from "react";
import ModalHeader from "./modal-header";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Modal({
  onClose,
  title,
  children,
  className,
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

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
        className={cn(
          "rounded-lg shadow-xl text-text-primary bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block w-[90%] max-w-[28rem]",
          className
        )}
        aria-labelledby={"modal-title"}
      >
        <ModalHeader title={title} onClose={onClose} />

        {children}
      </dialog>
    </div>
  );
}
