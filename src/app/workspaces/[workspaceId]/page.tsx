"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import { Workspace, Page } from "@/types/workspace";
import {
  PageList,
  AddPageModal,
  DeletePageModal,
} from "@/components/workspace";

// Mock data - replace with real API calls
const mockWorkspace: Workspace = {
  id: "1",
  name: "Product Design",
  description: "All design-related documents and wireframes for our products",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T14:30:00Z",
  owner_id: "user_1",
  pages_count: 12,
};

const mockPages: Page[] = [
  {
    id: "1",
    title: "User Interface Specifications",
    content:
      "<p>This document outlines the UI specifications for our new product dashboard...</p>",
    workspace_id: "1",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    order: 1,
    is_favorite: true,
  },
  {
    id: "2",
    title: "Wireframes - Mobile App",
    content: "<p>Mobile app wireframes and user flow diagrams...</p>",
    workspace_id: "1",
    created_at: "2024-01-16T11:30:00Z",
    updated_at: "2024-01-19T16:20:00Z",
    order: 2,
    is_favorite: false,
  },
  {
    id: "3",
    title: "Design System Components",
    content: "<p>Component library documentation and usage guidelines...</p>",
    workspace_id: "1",
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-18T13:45:00Z",
    order: 3,
    is_favorite: true,
  },
  {
    id: "4",
    title: "User Research Findings",
    content:
      "<p>Summary of user interviews and usability testing results...</p>",
    workspace_id: "1",
    created_at: "2024-01-18T14:20:00Z",
    updated_at: "2024-01-19T10:10:00Z",
    order: 4,
    is_favorite: false,
  },
  {
    id: "5",
    title: "Meeting Notes - Design Review",
    content: "",
    workspace_id: "1",
    created_at: "2024-01-19T15:00:00Z",
    updated_at: "2024-01-19T15:00:00Z",
    order: 5,
    is_favorite: false,
  },
];

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load workspace and pages on mount
  useEffect(() => {
    const loadWorkspaceData = async () => {
      setIsLoading(true);

      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real app, you'd fetch based on workspaceId
        setWorkspace(mockWorkspace);
        setPages(mockPages);
      } catch (error) {
        console.error("Failed to load workspace data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaceData();
  }, [workspaceId]);

  const handleCreatePage = async (data: { title: string }) => {
    setIsCreating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPage: Page = {
        id: Date.now().toString(),
        title: data.title,
        content: "",
        workspace_id: workspaceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order: pages.length + 1,
        is_favorite: false,
      };

      setPages((prev) => [...prev, newPage]);
      setIsAddModalOpen(false);

      // Update workspace pages count
      if (workspace) {
        setWorkspace((prev) =>
          prev ? { ...prev, pages_count: prev.pages_count + 1 } : null
        );
      }
    } catch (error) {
      console.error("Failed to create page:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePage = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setSelectedPage(page);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPage) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPages((prev) => prev.filter((p) => p.id !== selectedPage.id));
      setIsDeleteModalOpen(false);
      setSelectedPage(null);

      // Update workspace pages count
      if (workspace) {
        setWorkspace((prev) =>
          prev ? { ...prev, pages_count: prev.pages_count - 1 } : null
        );
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNavigateToPage = (pageId: string) => {
    router.push(`/pages/${pageId}`);
  };

  const handleReorderPages = async (pageIds: string[]) => {
    try {
      // Update local state immediately for better UX
      const reorderedPages = pageIds
        .map((id, index) => {
          const page = pages.find((p) => p.id === id);
          return page ? { ...page, order: index + 1 } : null;
        })
        .filter(Boolean) as Page[];

      setPages(reorderedPages);

      // Simulate API call to save new order
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to reorder pages:", error);
      // Revert to original order on error
      // In a real app, you'd reload the pages or show an error message
    }
  };

  const handleToggleFavorite = async (pageId: string) => {
    try {
      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId
            ? { ...page, is_favorite: !page.is_favorite }
            : page
        )
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert on error
      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId
            ? { ...page, is_favorite: !page.is_favorite }
            : page
        )
      );
    }
  };

  const handleBackToWorkspaces = () => {
    router.push("/workspaces");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>

            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Workspace not found
          </h2>
          <p className="text-text-secondary mb-4">
            The workspace you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={handleBackToWorkspaces}
            className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspaces</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToWorkspaces}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white transition-colors"
                aria-label="Back to workspaces"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {workspace.name}
                </h1>
                {workspace.description && (
                  <p className="text-text-secondary mt-2">
                    {workspace.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                  <span>{pages.length} pages</span>
                  <span>•</span>
                  <span>
                    Last updated{" "}
                    {new Date(workspace.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Page</span>
              </button>

              <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pages List */}
        <PageList
          pages={pages}
          onDeletePage={handleDeletePage}
          onNavigateToPage={handleNavigateToPage}
          onAddPage={() => setIsAddModalOpen(true)}
          onReorderPages={handleReorderPages}
          onToggleFavorite={handleToggleFavorite}
          isLoading={false}
        />

        {/* Add Page Modal */}
        <AddPageModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreatePage}
          isLoading={isCreating}
        />

        {/* Delete Page Modal */}
        <DeletePageModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          page={selectedPage}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
