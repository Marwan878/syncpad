import { Users } from "lucide-react";

export default function EmptySharedWorkspaceMessage() {
  return (
    <div className="text-center mt-24">
      <Users
        className="w-12 h-12 text-text-secondary mx-auto mb-6"
        aria-hidden="true"
      />

      <h3 className="text-lg font-semibold text-text-primary mb-2">
        No shared workspaces
      </h3>

      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        You don&apos;t have access to any shared workspaces yet. When someone
        shares a workspace with you, it will appear here.
      </p>

      <div className="bg-background-light rounded-lg p-4 max-w-md mx-auto border border-background-muted">
        <p className="text-sm text-text-secondary">
          <strong className="text-text-primary">Tip:</strong> Ask workspace
          owners to add you as a viewer or editor to access their collaborative
          documents.
        </p>
      </div>
    </div>
  );
}
