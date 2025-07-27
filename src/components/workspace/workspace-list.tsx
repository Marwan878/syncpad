"use client";

import { Workspace } from "@/types/workspace";
import WorkspaceCard from "./workspace-card";
import { Plus, FolderOpen } from "lucide-react";

type WorkspaceListProps = {
  workspaces: Workspace[];
  onDeleteWorkspace: (workspaceId: string) => void;
  onNavigateToWorkspace: (workspaceId: string) => void;
  onAddWorkspace: () => void;
  isLoading?: boolean;
};

export default function WorkspaceList({
  workspaces,
  onDeleteWorkspace,
  onNavigateToWorkspace,
  onAddWorkspace,
  isLoading = false,
}: Readonly<WorkspaceListProps>) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No workspaces yet
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Create your first workspace to start organizing your collaborative
          documents and projects.
        </p>
        <button
          onClick={onAddWorkspace}
          className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workspace</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onDelete={onDeleteWorkspace}
          onNavigate={onNavigateToWorkspace}
        />
      ))}
    </div>
  );
}
