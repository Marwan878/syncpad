import PageList from "@/components/workspace/page-list/page-list";
import Header from "@/components/workspace/header";

import WorkspaceHeaderSkeleton from "@/skeletons/workspace/header";
import PageListSkeleton from "@/skeletons/workspace/page-list";

import { Suspense } from "react";
import { Container } from "@/components/ui";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  // TODO: Make this route protected

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
