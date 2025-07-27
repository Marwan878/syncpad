"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Workspace } from "@/types/workspace";
import {
  WorkspaceList,
  AddWorkspaceModal,
  DeleteWorkspaceModal,
} from "@/components/workspace";

// Mock data - replace with real API calls
const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Product Design",
    description: "All design-related documents and wireframes for our products",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    owner_id: "user_1",
    pages_count: 12,
  },
  {
    id: "2",
    name: "Team Meeting Notes",
    description: "Weekly standup notes and action items",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-19T16:45:00Z",
    owner_id: "user_1",
    pages_count: 8,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign planning and execution",
    created_at: "2024-01-05T11:00:00Z",
    updated_at: "2024-01-18T13:20:00Z",
    owner_id: "user_1",
    pages_count: 15,
  },
];

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load workspaces on mount
  useEffect(() => {
    const loadWorkspaces = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWorkspaces(mockWorkspaces);
      setIsLoading(false);
    };

    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async (data: {
    name: string;
    description?: string;
  }) => {
    setIsCreating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newWorkspace: Workspace = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_id: "user_1",
        pages_count: 0,
      };

      setWorkspaces((prev) => [newWorkspace, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setSelectedWorkspace(workspace);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedWorkspace) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setWorkspaces((prev) =>
        prev.filter((w) => w.id !== selectedWorkspace.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedWorkspace(null);
    } catch (error) {
      console.error("Failed to delete workspace:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNavigateToWorkspace = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Workspaces
              </h1>
              <p className="text-text-secondary mt-2">
                Organize your collaborative documents and projects
              </p>
            </div>

            {!isLoading && workspaces.length > 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Workspace</span>
              </button>
            )}
          </div>
        </div>

        {/* Workspaces List */}
        <WorkspaceList
          workspaces={workspaces}
          onDeleteWorkspace={handleDeleteWorkspace}
          onNavigateToWorkspace={handleNavigateToWorkspace}
          onAddWorkspace={() => setIsAddModalOpen(true)}
          isLoading={isLoading}
        />

        {/* Add Workspace Modal */}
        <AddWorkspaceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateWorkspace}
          isLoading={isCreating}
        />

        {/* Delete Workspace Modal */}
        <DeleteWorkspaceModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          workspace={selectedWorkspace}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
