"use client";

import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import SubmitAndCancelButtons from "./submit-and-cancel-buttons";
import Label from "@/components/ui/form/label";
import ErrorMessage from "@/components/ui/form/error";

type AddWorkspaceModalProps = {
  onClose: () => void;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddWorkspaceModal({
  onClose,
  setIsAddModalOpen,
}: Readonly<AddWorkspaceModalProps>) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { getToken, userId } = useAuth();

  const queryClient = useQueryClient();

  const {
    mutate: createWorkspace,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetchWithAuth(
        {
          token: token ?? "",
          userId: userId ?? "",
          relativeUrl: "/workspaces",
        },
        {
          method: "POST",
          body: JSON.stringify({ name, description }),
        }
      );

      return response;
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Modal onClose={onClose} title="Create New Workspace">
      <ModalBody>
        <div className="space-y-4">
          {/* Workspace Name */}
          <div>
            <Label htmlFor="workspace-name">Workspace Name *</Label>
            <input
              type="text"
              id="workspace-name"
              placeholder="Enter workspace name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors border-gray-300`}
              autoFocus
              maxLength={100}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Workspace Description */}
          <div>
            <Label htmlFor="workspace-description">
              Description (optional)
            </Label>
            <textarea
              id="workspace-description"
              placeholder="Optional description for your workspace"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors resize-none"
              maxLength={500}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {createError && <ErrorMessage>{createError.message}</ErrorMessage>}
        </div>
      </ModalBody>

      <ModalFooter>
        <SubmitAndCancelButtons
          onClose={onClose}
          isPending={isCreating}
          onClick={createWorkspace}
        />
      </ModalFooter>
    </Modal>
  );
}
