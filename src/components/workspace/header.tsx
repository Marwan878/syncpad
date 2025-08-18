// Types
import { Workspace } from "@/types/workspace";

// Utils
import handlePlural from "@/lib/utils/handlePlural";

// UI
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";

// Navigation and auth
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { auth } from "@clerk/nextjs/server";

type WorkspaceHeaderProps = {
  workspaceId: string;
};

export default async function WorkspaceHeader({
  workspaceId,
}: Readonly<WorkspaceHeaderProps>) {
  const { getToken, userId } = await auth();
  const token = await getToken();

  const workspace = await fetchWithAuth<Workspace>(
    {
      token,
      userId,
      relativeUrl: `/workspaces/${workspaceId}`,
    },
    {
      method: "GET",
    }
  );

  const { name, description, pages_count, updated_at } = workspace;

  return (
    <div className="mb-8 flex items-start space-x-2">
      <Button
        as={Link}
        href="/workspaces"
        variant="icon"
        aria-label="Back to workspaces"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-text-primary">{name}</h1>
        {description && (
          <p className="text-text-secondary mt-2">{description}</p>
        )}
        <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
          {pages_count > 0 && (
            <span>{`${pages_count} ${handlePlural(
              pages_count,
              "page",
              "pages"
            )}`}</span>
          )}
          {pages_count > 0 && updated_at && <span>•</span>}
          {updated_at && (
            <span>
              Last updated {new Date(updated_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
