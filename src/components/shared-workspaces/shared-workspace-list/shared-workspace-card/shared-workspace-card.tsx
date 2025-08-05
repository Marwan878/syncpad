// Next
import Link from "next/link";

// Types
import { Workspace } from "@/types/workspace";

// Clerk
import { auth } from "@clerk/nextjs/server";

// UI
import formatDateString from "@/lib/utils/formatDateString";
import handlePlural from "@/lib/utils/handlePlural";
import { Calendar, Edit, Eye, FileText, Users } from "lucide-react";

type SharedWorkspaceCardProps = {
  workspace: Workspace;
};

export default async function SharedWorkspaceCard({
  workspace,
}: Readonly<SharedWorkspaceCardProps>) {
  const { userId } = await auth();

  // User will have editor access if they're (authenticated) and either:
  // 1. They're an allowed editor
  // 2. The workspace is set to allow any user to edit
  const hasEditorAccess =
    userId &&
    (workspace.allowed_editors_ids.includes(userId) ||
      workspace.any_user_can_edit);

  // User will have viewer access if either:
  // 1. They're authenticated and they're an allowed viewer
  // 2. The workspace is set to allow any user to view
  const hasViewerAccess =
    (userId && workspace.allowed_viewers_ids.includes(userId)) ||
    workspace.any_user_can_view;

  let accessLevel = "Limited";
  let AccessIcon = Users;

  if (hasEditorAccess) {
    accessLevel = "Editor";
    AccessIcon = Edit;
  } else if (hasViewerAccess) {
    accessLevel = "Viewer";
    AccessIcon = Eye;
  }

  return (
    <Link
      href={`/workspaces/${workspace.id}`}
      className="block bg-white rounded-lg border border-background-muted hover:border-brand hover:shadow-md transition-all duration-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
            {workspace.name}
          </h3>
          {workspace.description && (
            <p className="text-text-secondary text-sm line-clamp-2">
              {workspace.description}
            </p>
          )}
        </div>

        <div className="ml-4 flex items-center space-x-2 bg-background-light px-2 py-1 rounded-md border border-background-muted">
          <AccessIcon
            className="w-3 h-3 text-text-secondary"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-text-secondary">
            {accessLevel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>
              {workspace.pages_count}{" "}
              {handlePlural(workspace.pages_count, "page", "pages")}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Shared</span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>
            {formatDateString(workspace.updated_at || workspace.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
