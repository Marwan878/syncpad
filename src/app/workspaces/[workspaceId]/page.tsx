import PageList from "@/components/workspace/page-list/page-list";
import Header from "@/components/workspace/header";

import WorkspaceHeaderSkeleton from "@/skeletons/workspace/header";
import PageListSkeleton from "@/skeletons/workspace/page-list";

import { Suspense } from "react";

export default async function WorkspacePage({
  params,
}: Readonly<{
  params: Promise<{ workspaceId: string }>;
}>) {
  const { workspaceId } = await params;

  return (
    <div className="min-h-screen bg-background-light mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<WorkspaceHeaderSkeleton />}>
        <Header workspaceId={workspaceId} />
      </Suspense>

      <Suspense fallback={<PageListSkeleton />}>
        <PageList workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
