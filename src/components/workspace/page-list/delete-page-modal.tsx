"use client";

// UI
import { Button } from "@/components/ui";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { toast } from "react-hot-toast";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Types
import { Page } from "@/types/page";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type DeletePageModalProps = {
  onClose: () => void;
  workspaceId: string;
  page: Page | null;
};

export default function DeletePageModal({
  onClose,
  workspaceId,
  page,
}: Readonly<DeletePageModalProps>) {
  const router = useRouter();
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deletePage, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!page || !isAuthLoaded) return;

      const token = await getToken();
      const response = await fetchWithAuth(
        {
          token,
          userId,
          relativeUrl: `/workspaces/${workspaceId}/pages/${page.id}`,
        },
        {
          method: "DELETE",
        }
      );

      return response;
    },
    onSuccess: () => {
      toast.success("Page deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
      router.refresh();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!isAuthLoaded) return null;

  return (
    <Modal onClose={onClose} title="Delete Page">
      <ModalBody>
        <p>
          Are you sure you want to delete this page? This action is
          irreversible.
        </p>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="error"
          disabled={isDeleting}
          isLoading={isDeleting}
          loadingText="Deleting..."
          onClick={() => deletePage()}
        >
          Delete Page
        </Button>
      </ModalFooter>
    </Modal>
  );
}
