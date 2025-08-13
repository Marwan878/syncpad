"use client";

// UI
import PageListSkeleton from "@/skeletons/workspace/page-list";
import AddPageModal from "./add-page-modal";
import CreatePageButton from "./create-page-button";
import DeletePageModal from "./delete-page-modal";
import EmptyMessage from "./empty-message/empty-message";
import PageGrid from "./page-grid";
import PageItem from "./page-item/page-item";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Types
import { Page } from "@/types/page";
import { Workspace } from "@/types/workspace";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type PageListProps = {
  workspaceId: string;
};

export default function PageList({ workspaceId }: Readonly<PageListProps>) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pageToBeDeleted, setPageToBeDeleted] = useState<Page | null>(null);
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { data: pages, isLoading: isLoadingPages } = useQuery({
    queryKey: ["pages", workspaceId],
    queryFn: async () => {
      const token = await getToken();
      const pages = await fetchWithAuth<Page[]>({
        token,
        userId,
        relativeUrl: `/workspaces/${workspaceId}/pages`,
      });

      return pages;
    },

    enabled: isAuthLoaded,
  });

  const {
    data: { canView, canEdit },
    isLoading: isLoadingCredentials,
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const token = await getToken();
      const workspace = await fetchWithAuth<Workspace>({
        token,
        userId,
        relativeUrl: `/workspaces/${workspaceId}`,
      });

      return {
        canView: workspace?.any_user_can_view || workspace?.owner_id === userId,
        canEdit: workspace?.any_user_can_edit || workspace?.owner_id === userId,
      };
    },
    initialData: { canView: false, canEdit: false },
    enabled: isAuthLoaded,
  });

  const isLoading = isLoadingPages || isLoadingCredentials || !isAuthLoaded;

  if (isLoading) {
    return <PageListSkeleton />;
  }

  if (!pages) {
    return null;
  }

  return (
    <div className="space-y-6">
      {pages.length === 0 && (
        <EmptyMessage
          setIsAddModalOpen={setIsAddModalOpen}
          canView={canView}
          canEdit={canEdit}
        />
      )}
      {pages.length > 0 && (
        <PageGrid>
          {pages.map((page, index) => (
            <PageItem
              key={page.id}
              page={page}
              index={index}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setPageToBeDeleted={setPageToBeDeleted}
            />
          ))}
          {canEdit && (
            <CreatePageButton setIsAddModalOpen={setIsAddModalOpen} />
          )}
        </PageGrid>
      )}

      {isAddModalOpen && (
        <AddPageModal
          onClose={() => setIsAddModalOpen(false)}
          workspaceId={workspaceId}
        />
      )}

      {isDeleteModalOpen && (
        <DeletePageModal
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPageToBeDeleted(null);
          }}
          workspaceId={workspaceId}
          page={pageToBeDeleted}
        />
      )}
    </div>
  );
}
