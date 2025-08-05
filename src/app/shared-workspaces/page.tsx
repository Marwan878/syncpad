// UI
import { Header, SharedWorkspaceList } from "@/components/shared-workspaces";
import { Container } from "@/components/ui";
import SharedWorkspacesListSkeleton from "@/skeletons/shared-workspaces/shared-workspaces-list";

import { Suspense } from "react";

export default function SharedWorkspacesPage() {
  return (
    <Container className="min-h-screen bg-background-light mt-5">
      <Header />
      <Suspense fallback={<SharedWorkspacesListSkeleton />}>
        <SharedWorkspaceList />
      </Suspense>
    </Container>
  );
}
