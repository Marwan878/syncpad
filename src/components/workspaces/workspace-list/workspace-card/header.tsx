"use client";

import { Button } from "@/components/ui";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import OptionsMenu from "./options-menu";
import { Workspace } from "@/types/workspace";
import DeleteWorkspaceModal from "./delete-workspace-modal";
import ManageAccessModal from "./manage-access-modal/manage-access-modal";

type HeaderProps = {
  workspace: Workspace;
};

export default function Header({ workspace }: Readonly<HeaderProps>) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isManageAccessModalOpen, setIsManageAccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="flex items-start justify-between mb-4 relative">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text-primary truncate">
          {workspace.name}
        </h3>
        {workspace.description && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {workspace.description}
          </p>
        )}
      </div>

      <Button
        variant="icon"
        onClick={() =>
          setIsOptionsMenuOpen((isOptionsMenuOpen) => !isOptionsMenuOpen)
        }
        aria-label="Open options menu"
      >
        <EllipsisVertical className="w-5 h-5" aria-hidden="true" />
      </Button>

      {isOptionsMenuOpen && (
        <OptionsMenu
          onManageAccessButtonClick={() => setIsManageAccessModalOpen(true)}
          onClose={() => setIsOptionsMenuOpen(false)}
          onDeleteButtonClick={() => setIsDeleteModalOpen(true)}
        />
      )}

      {isManageAccessModalOpen && (
        <ManageAccessModal
          onClose={() => setIsManageAccessModalOpen(false)}
          workspace={workspace}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteWorkspaceModal
          onClose={() => setIsDeleteModalOpen(false)}
          workspace={workspace}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
    </div>
  );
}
