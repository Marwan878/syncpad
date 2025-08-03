"use client";

import { Workspace } from "@/types/workspace";
import Link from "next/link";
import { useState } from "react";
import Header from "./header";
import Stats from "./stats";
import DeleteWorkspaceModal from "./delete-workspace-modal";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";

type WorkspaceCardProps = {
  workspace: Workspace;
};

export default function WorkspaceCard({
  workspace,
}: Readonly<WorkspaceCardProps>) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <Header
        name={workspace.name}
        description={workspace.description}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />

      <div className="flex flex-col items-start space-y-4 justify-between">
        <Stats
          pagesCount={workspace.pages_count}
          updatedAt={workspace.updated_at}
        />

        <Button
          as={Link}
          href={`/workspaces/${workspace.id}`}
          className="flex items-center space-x-2"
        >
          <span>View Workspace</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>

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
