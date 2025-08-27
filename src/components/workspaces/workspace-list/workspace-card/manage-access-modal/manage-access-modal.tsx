import { Button, Modal, ModalBody, ModalFooter } from "@/components/ui";
import { Workspace } from "@/types/workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import GlobalAccessFields from "./global-access-fields";
import UserSpecificAccessFields from "./user-specific-access-fields";
import { AccessManagedUser } from "@/types/user";
import AddUsersField from "./add-user-field";
import { useAuth } from "@clerk/nextjs";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { toast } from "react-hot-toast";

type ManageAccessModalProps = {
  onClose: () => void;
  workspace: Workspace;
};

export default function ManageAccessModal({
  onClose,
  workspace,
}: Readonly<ManageAccessModalProps>) {
  const [allowedUsers, setAllowedUsers] = useState<AccessManagedUser[]>(() =>
    [
      ...new Set([
        ...workspace.allowed_viewers_ids,
        ...workspace.allowed_editors_ids,
      ]),
    ].map((id) => ({
      id,
      isViewer: workspace.allowed_viewers_ids.includes(id),
      isEditor: workspace.allowed_editors_ids.includes(id),
    }))
  );

  const [anyUserCanView, setAnyUserCanView] = useState(
    workspace.any_user_can_view
  );
  const [anyUserCanEdit, setAnyUserCanEdit] = useState(
    workspace.any_user_can_edit
  );

  const { getToken, userId } = useAuth();

  const queryClient = useQueryClient();

  const { mutate: updateWorkspaceAccess } = useMutation({
    mutationFn: async () => {
      // Create the updated workspace
      const updates: Partial<Workspace> = {
        any_user_can_view: anyUserCanView,
        any_user_can_edit: anyUserCanEdit,
        allowed_viewers_ids: allowedUsers
          .filter((user) => user.isViewer)
          .map((user) => user.id),
        allowed_editors_ids: allowedUsers
          .filter((user) => user.isEditor)
          .map((user) => user.id),
      };

      // Update the workspace
      const token = await getToken();
      await fetchWithAuth(
        {
          relativeUrl: `/workspaces/${workspace.id}`,
          token,
          userId,
        },
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        }
      );
    },
    onSuccess: () => {
      onClose();
      toast.success("Workspace access has been updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });

  return (
    <Modal onClose={onClose} title={"Manage Access"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateWorkspaceAccess();
        }}
      >
        <ModalBody className="flex flex-col gap-4 overflow-y-auto max-h-[25rem]">
          <AddUsersField
            allowedUsers={allowedUsers}
            setAllowedUsers={setAllowedUsers}
          />
          <UserSpecificAccessFields
            allowedUsers={allowedUsers}
            setAllowedUsers={setAllowedUsers}
          />
          <GlobalAccessFields
            anyUserCanView={anyUserCanView}
            anyUserCanEdit={anyUserCanEdit}
            setAnyUserCanView={setAnyUserCanView}
            setAnyUserCanEdit={setAnyUserCanEdit}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" type="submit">
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
