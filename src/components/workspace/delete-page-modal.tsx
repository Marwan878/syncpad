"use client";

import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Page } from "@/types/page";
import { AlertTriangle } from "lucide-react";

type DeletePageModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  page: Page | null;
  isLoading?: boolean;
};

export default function DeletePageModal({
  onClose,
  onConfirm,
  page,
  isLoading = false,
}: Readonly<DeletePageModalProps>) {
  if (!page) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const hasContent = page.content && page.content.trim().length > 0;

  return (
    <Modal onClose={handleClose} title="Delete Page">
      <ModalBody>
        <div className="w-96">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary mb-3">
                Are you sure you want to delete the page{" "}
                <span className="font-semibold">
                  &quot;{page.title || "Untitled Page"}&quot;
                </span>
                ?
              </p>

              <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">
                    This action cannot be undone:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-red-600">
                    <li>
                      All content in this page will be permanently deleted
                    </li>
                    <li>Any collaborative changes will be lost</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-text-secondary">
                {hasContent
                  ? "This page contains content that will be lost."
                  : "This page has no content."}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Deleting..." : "Delete Page"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
