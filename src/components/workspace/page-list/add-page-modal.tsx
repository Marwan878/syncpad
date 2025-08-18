"use client";

// UI
import { Button } from "@/components/ui";
import Label from "@/components/ui/form/label";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { toast } from "react-hot-toast";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddPageModalProps = {
  onClose: () => void;
  workspaceId: string;
};

export default function AddPageModal({
  onClose,
  workspaceId,
}: Readonly<AddPageModalProps>) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutate: createPage,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetchWithAuth(
        {
          token,
          userId,
          relativeUrl: `/workspaces/${workspaceId}/pages`,
        },
        {
          method: "POST",
          body: JSON.stringify({ title }),
        }
      );

      return response;
    },
    onSuccess: () => {
      toast.success("Page created successfully");
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] });
      router.refresh();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Modal onClose={onClose} title="Create New Page">
      <ModalBody>
        <Label htmlFor="page-title" className="mb-2">
          Page Title *
        </Label>
        <input
          type="text"
          id="page-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          disabled={isLoading}
          autoFocus
          maxLength={100}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
        <p className="text-xs text-text-secondary mt-1">
          You can edit the content after creating the page
        </p>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!title.trim()}
          isLoading={isLoading}
          loadingText="Creating..."
          onClick={() => createPage()}
        >
          Create Page
        </Button>
      </ModalFooter>
    </Modal>
  );
}
