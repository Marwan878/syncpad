"use client";

// TODO: Add status: syncing/offline/synced
// TODO: Handle offline state
// TODO: Add live cursors
// TODO: End-to-End Encryption (optional advanced)
// TODO: Encrypt content client-side for privacy.
// TODO: Decrypt only on the client, backend stores encrypted blobs.
// TODO: Scalable architecture for multiple users
// TODO: Caching using Redis
// TODO: Use GraphQL for frontend

import { EditorContent, EditorContext } from "@tiptap/react";

// --- Hooks ---
import useConfiguredEditor from "@/hooks/use-configured-editor";
import useLiveCollaboration from "@/hooks/use-live-collaboration";
import useMobileView from "@/hooks/use-mobile-view";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// --- Components ---
import { CollaborationCarets } from "@/components/collaboration/collaboration-carets";
import ConfirmDeleteTableModal from "@/components/page/editor/confirm-delete-table-modal";
import TableMenu from "@/components/page/editor/table-menu";
import ForbiddenMessage from "@/components/page/forbidden-message";
import Toolbar from "@/components/page/toolbar/toolbar";

// --- Utils ---
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// --- Types ---
import { Page as PageType } from "@/types/page";
import { Workspace } from "@/types/workspace";

// --- Yjs ---
import * as Y from "yjs";

export default function Page() {
  const { isMobile, mobileView, setMobileView } = useMobileView();

  const [confirmDeleteTableOpen, setConfirmDeleteTableOpen] = useState(false);

  const { workspaceId, pageId } = useParams() as {
    workspaceId: string;
    pageId: string;
  };

  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { ydoc, provider } = useLiveCollaboration(workspaceId, pageId);

  const editor = useConfiguredEditor(ydoc);

  const {
    data: { canEdit, canView },
    isLoading: isPermissionsLoading,
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const token = await getToken();
      const workspace = await fetchWithAuth<Workspace>({
        relativeUrl: `/workspaces/${workspaceId}`,
        token,
        userId,
      });

      // TODO: Change this (Make the backend decide the permissions not the front end)
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
    initialData: { canEdit: false, canView: false },
  });

  useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => {
      const token = await getToken();
      const page = await fetchWithAuth<PageType>({
        relativeUrl: `/workspaces/${workspaceId}/pages/${pageId}`,
        token,
        userId,
      });

      const binary = new Uint8Array(page.content);
      Y.applyUpdate(ydoc, binary);

      return page;
    },
    enabled: isAuthLoaded && (canEdit || canView),
  });

  if (!editor || isPermissionsLoading || !isAuthLoaded) return null;

  if (!canView && !canEdit) return <ForbiddenMessage />;

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        editor={editor}
        isMobile={isMobile}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />
      <div className="relative">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
          contentEditable={canEdit}
        />
        {editor && (
          <CollaborationCarets
            editor={editor}
            provider={canEdit ? provider : null}
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
    </EditorContext.Provider>
  );
}
