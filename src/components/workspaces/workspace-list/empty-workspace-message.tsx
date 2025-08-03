import { FolderOpen } from "lucide-react";
import AddWorkspaceButton from "../add-workspace-button";

type EmptyWorkspaceMessageProps = {
  onAddWorkspace: () => void;
};

export default function EmptyWorkspaceMessage({
  onAddWorkspace,
}: Readonly<EmptyWorkspaceMessageProps>) {
  return (
    <div className="text-center flex flex-col items-center py-12">
      <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-text-primary mb-2">
        No workspaces yet
      </h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Create your first workspace to start organizing your collaborative
        documents and projects.
      </p>
      <AddWorkspaceButton onAddWorkspace={onAddWorkspace} />
    </div>
  );
}
