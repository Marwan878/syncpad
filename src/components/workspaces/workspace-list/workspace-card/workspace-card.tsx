import { Button } from "@/components/ui";
import { Workspace } from "@/types/workspace";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "./header";
import Stats from "./stats";

type WorkspaceCardProps = {
  workspace: Workspace;
};

export default function WorkspaceCard({
  workspace,
}: Readonly<WorkspaceCardProps>) {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <Header workspace={workspace} />

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
    </div>
  );
}
