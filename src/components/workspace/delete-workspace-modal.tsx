"use client";

import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Workspace } from "@/types/workspace";
import { AlertTriangle } from "lucide-react";

type DeleteWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workspace: Workspace | null;
  isLoading?: boolean;
};

export default function DeleteWorkspaceModal({
  isOpen,
  onClose,
  onConfirm,
  workspace,
  isLoading = false,
}: Readonly<DeleteWorkspaceModalProps>) {
  if (!workspace) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Workspace">
      <ModalBody>
        <div className="w-96">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary mb-3">
                Are you sure you want to delete the workspace{" "}
                <span className="font-semibold">"{workspace.name}"</span>?
              </p>

              <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">
                    This action cannot be undone:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-red-600">
                    <li>All pages in this workspace will be deleted</li>
                    <li>All collaborative content will be lost</li>
                    <li>
                      This workspace will be removed from all collaborators
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-text-secondary">
                {workspace.pages_count === 0
                  ? "This workspace has no pages."
                  : `This workspace contains ${workspace.pages_count} page${
                      workspace.pages_count === 1 ? "" : "s"
                    }.`}
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
          {isLoading ? "Deleting..." : "Delete Workspace"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
