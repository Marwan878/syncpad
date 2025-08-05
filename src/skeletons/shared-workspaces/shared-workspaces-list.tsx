import SharedWorkspaceCardSkeleton from "./shared-workspace-card";

export default function SharedWorkspacesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map(() => (
        <SharedWorkspaceCardSkeleton key={crypto.randomUUID()} />
      ))}
    </div>
  );
}
