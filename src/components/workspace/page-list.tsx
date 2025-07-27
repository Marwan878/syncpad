"use client";

import { useState } from "react";
import { Page } from "@/types/workspace";
import PageItem from "./page-item";
import { Plus, FileText, Search } from "lucide-react";

type PageListProps = {
  pages: Page[];
  onDeletePage: (pageId: string) => void;
  onNavigateToPage: (pageId: string) => void;
  onAddPage: () => void;
  onReorderPages?: (pageIds: string[]) => void;
  onToggleFavorite?: (pageId: string) => void;
  isLoading?: boolean;
};

export default function PageList({
  pages,
  onDeletePage,
  onNavigateToPage,
  onAddPage,
  onReorderPages,
  onToggleFavorite,
  isLoading = false,
}: Readonly<PageListProps>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">(
    "updated"
  );
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);

  // Filter and sort pages
  const filteredPages = pages
    .filter(
      (page) =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.content &&
          page.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      // Favorites always come first
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;

      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "updated":
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

  const handleDragStart = (pageId: string) => {
    setDraggedPageId(pageId);
  };

  const handleDragEnd = () => {
    setDraggedPageId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();

    if (!draggedPageId || !onReorderPages || draggedPageId === targetPageId) {
      return;
    }

    // Simple reordering logic
    const newOrder = [...pages];
    const draggedIndex = newOrder.findIndex((p) => p.id === draggedPageId);
    const targetIndex = newOrder.findIndex((p) => p.id === targetPageId);

    const [draggedPage] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedPage);

    onReorderPages(newOrder.map((p) => p.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No pages yet
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Create your first page to start collaborating and organizing your
          content.
        </p>
        <button
          onClick={onAddPage}
          className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Page</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="title">Alphabetical</option>
          </select>

          <button
            onClick={onAddPage}
            className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-dark text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Page</span>
          </button>
        </div>
      </div>

      {/* Pages count */}
      <div className="text-sm text-text-secondary">
        {filteredPages.length === pages.length
          ? `${pages.length} page${pages.length === 1 ? "" : "s"}`
          : `${filteredPages.length} of ${pages.length} pages`}
      </div>

      {/* Page list */}
      <div className="space-y-3">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            draggable={onReorderPages ? true : false}
            onDragStart={() => handleDragStart(page.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, page.id)}
          >
            <PageItem
              page={page}
              onDelete={onDeletePage}
              onNavigate={onNavigateToPage}
              onToggleFavorite={onToggleFavorite}
              isDragging={draggedPageId === page.id}
              dragHandleProps={onReorderPages ? {} : undefined}
            />
          </div>
        ))}
      </div>

      {filteredPages.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary">
            No pages found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
