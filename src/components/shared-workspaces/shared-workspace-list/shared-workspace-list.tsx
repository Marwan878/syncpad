// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Types
import { Workspace } from "@/types/workspace";

// Clerk
import { auth } from "@clerk/nextjs/server";

// UI
import EmptySharedWorkspaceMessage from "./empty-shared-workspace-message";
import SharedWorkspaceCard from "./shared-workspace-card/shared-workspace-card";

export default async function SharedWorkspaceList() {
  const { userId, getToken } = await auth();
  const token = await getToken();

  const workspaces = await fetchWithAuth<Workspace[]>({
    relativeUrl: "/shared-workspaces",
    token: token ?? "",
    userId: userId ?? "",
  });

  if (workspaces.length === 0) {
    return <EmptySharedWorkspaceMessage />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <SharedWorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
