"use client";

// TODO: End-to-End Encryption (optional advanced)
// TODO: Encrypt content client-side for privacy.
// TODO: Decrypt only on the client, backend stores encrypted blobs.
// TODO: Scalable architecture for multiple users
// TODO: Use GraphQL for frontend
// TODO: Comprehensive testing

import "@/styles/_keyframe-animations.scss";
import "@/styles/_variables.scss";

import { EditorContent, EditorContext } from "@tiptap/react";

// --- Hooks ---
import useConfiguredEditor from "@/hooks/use-configured-editor";
import useCustomCursor from "@/hooks/use-custom-cursor";
import useLiveCollaboration from "@/hooks/use-live-collaboration";
import useMobileView from "@/hooks/use-mobile-view";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// --- Components ---
import CollaborationIndicators from "@/components/collaboration/collaboration-indicators";
import ConfirmDeleteTableModal from "@/components/page/editor/confirm-delete-table-modal";
import TableMenu from "@/components/page/editor/table-menu";
import ForbiddenMessage from "@/components/page/forbidden-message";
import Toolbar from "@/components/page/toolbar/toolbar";
import Pointer from "@/components/ui/pointer";
import StatusIndicator from "@/components/ui/status-indicator";

// --- Utils ---
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// --- Types ---
import { Workspace } from "@/types/workspace";

// --- React ---
import { createPortal } from "react-dom";

export default function Page() {
  const { isMobile, mobileView, setMobileView } = useMobileView();

  const [confirmDeleteTableOpen, setConfirmDeleteTableOpen] = useState(false);

  const { workspaceId, pageId } = useParams() as {
    workspaceId: string;
    pageId: string;
  };

  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { cursorRef, toolbarRef, isCursorVisible } = useCustomCursor();
  const { ydoc, provider, status } = useLiveCollaboration(workspaceId, pageId);

  const { data: accessData, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const token = await getToken();
      const workspace = await fetchWithAuth<Workspace>({
        relativeUrl: `/workspaces/${workspaceId}`,
        token,
        userId,
      });

      // TODO: Change this (Make the backend decide the permissions not the frontend)
      const canEdit = !!(
        userId &&
        (workspace.owner_id === userId ||
          workspace.any_user_can_edit ||
          workspace.allowed_editors_ids.includes(userId))
      );

      const canView = !!(
        canEdit ||
        workspace.any_user_can_view ||
        (userId && workspace.allowed_viewers_ids.includes(userId))
      );

      return { canEdit, canView };
    },
    enabled: isAuthLoaded,
  });

  const editor = useConfiguredEditor(ydoc, accessData?.canEdit ?? false);

  if (!editor || isPermissionsLoading || !isAuthLoaded) return null;

  if (!accessData?.canView && !accessData?.canEdit) return <ForbiddenMessage />;

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        editor={editor}
        isMobile={isMobile}
        mobileView={mobileView}
        setMobileView={setMobileView}
        ref={toolbarRef}
      />
      <div className="relative">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        {editor && accessData?.canEdit && (
          <CollaborationIndicators
            editor={editor}
            provider={accessData?.canEdit ? provider : null}
          />
        )}
      </div>

      {editor && (
        <>
          <TableMenu
            editor={editor}
            setConfirmDeleteTableOpen={setConfirmDeleteTableOpen}
          />
          {confirmDeleteTableOpen && (
            <ConfirmDeleteTableModal
              editor={editor}
              setConfirmDeleteTableOpen={setConfirmDeleteTableOpen}
            />
          )}
        </>
      )}

      <StatusIndicator status={status} className="fixed bottom-3 right-3" />
      {isCursorVisible &&
        createPortal(
          <Pointer
            wrapperClassName="pointer-events-none text-brand fixed"
            ref={cursorRef}
          />,
          document.body
        )}
    </EditorContext.Provider>
  );
}
