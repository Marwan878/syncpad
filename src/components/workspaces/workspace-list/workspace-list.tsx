import WorkspaceCardSkeleton from "@/skeletons/workspaces/workspace-card";
import { Workspace } from "@/types/workspace";
import EmptyWorkspaceMessage from "./empty-workspace-message";
import WorkspaceCard from "./workspace-card/workspace-card";

type WorkspaceListProps = {
  workspaces: Workspace[];
  onAddWorkspace: () => void;
  isLoading?: boolean;
};

export default function WorkspaceList({
  workspaces,
  onAddWorkspace,
  isLoading = false,
}: Readonly<WorkspaceListProps>) {
  if (!isLoading && workspaces.length === 0) {
    return <EmptyWorkspaceMessage onAddWorkspace={onAddWorkspace} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading &&
        Array.from({ length: 6 }).map(() => (
          <WorkspaceCardSkeleton key={crypto.randomUUID()} />
        ))}
      {!isLoading &&
        workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
    </div>
  );
}
