import PageList from "@/components/workspace/page-list/page-list";
import Header from "@/components/workspace/header";
import WorkspaceHeaderSkeleton from "@/skeletons/workspace/header";
import PageListSkeleton from "@/skeletons/workspace/page-list";
import ForbiddenMessage from "@/components/workspace/forbidden-message";

import { Suspense } from "react";
import { Container } from "@/components/ui";

import { auth } from "@clerk/nextjs/server";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { Workspace } from "@/types/workspace";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  const { userId, getToken } = await auth();

  const token = await getToken();

  const workspace = await fetchWithAuth<Workspace>({
    relativeUrl: `/workspaces/${workspaceId}`,
    token,
    userId,
  });

  const canEdit =
    userId &&
    (workspace.owner_id === userId ||
      workspace.any_user_can_edit ||
      workspace.allowed_editors_ids.includes(userId));

  const canView =
    canEdit ||
    workspace.any_user_can_view ||
    (userId && workspace.allowed_viewers_ids.includes(userId));

  if (!canView && !canEdit) {
    return <ForbiddenMessage />;
  }

  return (
    <div className="bg-background-light min-h-screen">
      <Container className="py-8">
        <Suspense fallback={<WorkspaceHeaderSkeleton />}>
          <Header workspaceId={workspaceId} />
        </Suspense>

        <Suspense fallback={<PageListSkeleton />}>
          <PageList workspaceId={workspaceId} />
        </Suspense>
      </Container>
    </div>
  );
}
