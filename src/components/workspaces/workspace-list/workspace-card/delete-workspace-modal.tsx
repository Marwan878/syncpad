"use client";

// UI
import { Button, Modal, ModalBody, ModalFooter } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import Warnings from "./warnings";

// Types
import { Workspace } from "@/types/workspace";

// React
import { Dispatch, SetStateAction } from "react";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteWorkspaceModalProps = {
  onClose: () => void;
  workspace: Workspace;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteWorkspaceModal({
  onClose,
  workspace,
  setIsDeleteModalOpen,
}: Readonly<DeleteWorkspaceModalProps>) {
  const queryClient = useQueryClient();
  const { getToken, userId, isLoaded } = useAuth();

  const {
    mutate: deleteWorkspace,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetchWithAuth(
        {
          token: token ?? "",
          userId: userId ?? "",
          relativeUrl: `/workspaces/${workspace.id}`,
        },
        {
          method: "DELETE",
        }
      );

      return response;
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Modal
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <AlertTriangle
            className="w-6 h-6 text-red-500 flex-shrink-0"
            aria-hidden
          />
          <span className="text-lg font-semibold">Delete Workspace</span>
        </div>
      }
    >
      <ModalBody className="w-full">
        <Warnings pagesCount={workspace.pages_count} name={workspace.name} />
        {deleteError && (
          <p className="text-sm text-red-600 mt-3">
            <span className="font-medium">Error: </span>
            {deleteError.message}
          </p>
        )}
      </ModalBody>

      <ModalFooter className="w-full">
        <Button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          variant="ghost"
        >
          Cancel
        </Button>

        <Button
          onClick={deleteWorkspace}
          disabled={isDeleting || !isLoaded}
          variant="error"
        >
          {isDeleting ? "Deleting..." : "Delete Workspace"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
