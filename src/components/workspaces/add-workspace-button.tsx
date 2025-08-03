import { Plus } from "lucide-react";
import { Button } from "../ui";

type AddWorkspaceButtonProps = {
  onAddWorkspace: () => void;
};

export default function AddWorkspaceButton({
  onAddWorkspace,
}: Readonly<AddWorkspaceButtonProps>) {
  return (
    <Button
      onClick={onAddWorkspace}
      className="flex items-center space-x-2"
      variant="primary"
      size="md"
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      <span>Create Workspace</span>
    </Button>
  );
}
