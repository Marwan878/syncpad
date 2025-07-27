"use client";

import { useState } from "react";
import { Trash2, Users, FileText, Calendar } from "lucide-react";
import { Workspace } from "@/types/workspace";

type WorkspaceCardProps = {
  workspace: Workspace;
  onDelete: (workspaceId: string) => void;
  onNavigate: (workspaceId: string) => void;
};

export default function WorkspaceCard({
  workspace,
  onDelete,
  onNavigate,
}: Readonly<WorkspaceCardProps>) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete(workspace.id);
  };

  const handleClick = () => {
    onNavigate(workspace.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-lg border border-gray-200 p-6 hover:border-brand hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary truncate group-hover:text-brand transition-colors">
            {workspace.name}
          </h3>
          {workspace.description && (
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {workspace.description}
            </p>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
          aria-label="Delete workspace"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-text-secondary">
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>{workspace.pages_count} pages</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Updated {formatDate(workspace.updated_at)}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-brand ring-opacity-0 group-hover:ring-opacity-20 transition-all duration-200 pointer-events-none" />
    </div>
  );
}
