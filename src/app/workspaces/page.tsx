"use client";

// Components
import { Container } from "@/components/ui";
import AddWorkspaceModal from "@/components/workspaces/add-workspace-modal/add-workspace-modal";
import Header from "@/components/workspaces/header";
import WorkspaceList from "@/components/workspaces/workspace-list/workspace-list";

// Lib
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// Types
import { Workspace } from "@/types/workspace";

// Hooks
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function WorkspacesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { getToken, userId, isLoaded } = useAuth();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const token = await getToken();
      const workspaces = await fetchWithAuth<Workspace[]>(
        {
          token: token ?? "",
          userId: userId ?? "",
          relativeUrl: "/workspaces",
        },
        {
          method: "GET",
        }
      );
      return workspaces;
    },
    enabled: isLoaded,
  });

  return (
    <Container className="min-h-screen bg-background-light mt-5">
      <Header
        isLoading={isLoading || !isLoaded}
        setIsAddModalOpen={setIsAddModalOpen}
        workspacesCount={workspaces?.length ?? 0}
      />

      <WorkspaceList
        workspaces={workspaces ?? []}
        onAddWorkspace={() => setIsAddModalOpen(true)}
        isLoading={isLoading || !isLoaded}
      />

      {isAddModalOpen && (
        <AddWorkspaceModal
          onClose={() => setIsAddModalOpen(false)}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}
    </Container>
  );
}
