"use client";

import { useState } from "react";
import { Page } from "@/types/workspace";
import { FileText, Trash2, GripVertical, Star, Calendar } from "lucide-react";

type PageItemProps = {
  page: Page;
  onDelete: (pageId: string) => void;
  onNavigate: (pageId: string) => void;
  onToggleFavorite?: (pageId: string) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
};

export default function PageItem({
  page,
  onDelete,
  onNavigate,
  onToggleFavorite,
  isDragging = false,
  dragHandleProps,
}: Readonly<PageItemProps>) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete(page.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(page.id);
    }
  };

  const handleClick = () => {
    onNavigate(page.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-200 p-4 hover:border-brand hover:shadow-sm transition-all duration-200 cursor-pointer ${
        isDragging ? "shadow-lg rotate-2 scale-105" : ""
      }`}
      onClick={handleClick}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Content */}
      <div className="ml-6 pr-20">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand flex-shrink-0" />
              <h3 className="text-sm font-medium text-text-primary truncate group-hover:text-brand transition-colors">
                {page.title || "Untitled Page"}
              </h3>
              {page.is_favorite && (
                <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
              )}
            </div>

            {/* Content preview */}
            {page.content && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                {page.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
              </p>
            )}
          </div>
        </div>

        {/* Meta information */}
        <div className="flex items-center space-x-3 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(page.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className="p-1 rounded text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-all duration-200"
            aria-label={
              page.is_favorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star
              className={`w-4 h-4 ${
                page.is_favorite ? "fill-current text-yellow-500" : ""
              }`}
            />
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
          aria-label="Delete page"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-brand ring-opacity-0 group-hover:ring-opacity-20 transition-all duration-200 pointer-events-none" />
    </div>
  );
}
