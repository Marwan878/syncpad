"use client";

// TODO: Comprehensive testing
// TODO: Ensure proper connection status indication
// TODO: Fix issue where cursor disappears when hovering an uploading image

// --- Hooks ---
import useConfiguredEditor from "@/hooks/use-configured-editor";
import useCustomCursor from "@/hooks/use-custom-cursor";
import useIsTouchScreen from "@/hooks/use-is-touch-screen";
import useLiveCollaboration from "@/hooks/use-live-collaboration";
import useMobileView from "@/hooks/use-mobile-view";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";
import "@/styles/_keyframe-animations.scss";
import "@/styles/_variables.scss";

// --- Components ---
import CollaborationIndicators from "@/components/collaboration/collaboration-indicators";
import ConfirmDeleteTableModal from "@/components/page/editor/confirm-delete-table-modal";
import Cursor from "@/components/page/editor/cursor";
import TableMenu from "@/components/page/editor/table-menu";
import ForbiddenMessage from "@/components/workspace/forbidden-message";
import Toolbar from "@/components/page/toolbar/toolbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Container,
} from "@/components/ui";
import StatusIndicator from "@/components/ui/status-indicator";
import { EditorContent, EditorContext } from "@tiptap/react";

// --- Utils ---
import { fetchWithAuth } from "@/lib/fetch-with-auth";

// --- Types ---
import { Page as PageType } from "@/types/page";
import { Workspace } from "@/types/workspace";
import { CSSProperties } from "react";

export default function Page() {
  const { isMobile, mobileView, setMobileView } = useMobileView();

  const topElementRef = useRef<HTMLDivElement>(null);

  const toolbarRef = useRef<HTMLDivElement>(null);

  const [confirmDeleteTableOpen, setConfirmDeleteTableOpen] = useState(false);

  const { isTouchScreen } = useIsTouchScreen();

  const { workspaceId, pageId } = useParams() as {
    workspaceId: string;
    pageId: string;
  };

  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { data: workspaceData, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const token = await getToken();
      const workspace = await fetchWithAuth<Workspace>({
        relativeUrl: `/workspaces/${workspaceId}`,
        token,
        userId,
      });

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

      return { accessData: { canEdit, canView }, workspace };
    },
    enabled: isAuthLoaded,
  });

  const { data: page, isLoading: isPageLoading } = useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => {
      const token = await getToken();
      const page = await fetchWithAuth<PageType>({
        relativeUrl: `/workspaces/${workspaceId}/pages/${pageId}`,
        token,
        userId,
      });

      return page;
    },
    enabled: isAuthLoaded,
  });

  const { ydoc, provider, status } = useLiveCollaboration(workspaceId, pageId);

  const editor = useConfiguredEditor(
    ydoc,
    workspaceData?.accessData?.canEdit ?? false
  );

  const { cursorRef, isCursorVisible, cursorType } = useCustomCursor(
    editor,
    topElementRef,
    toolbarRef
  );

  if (
    !editor ||
    isPermissionsLoading ||
    !isAuthLoaded ||
    isPageLoading ||
    !workspaceData ||
    !page
  )
    return null;

  if (!workspaceData.accessData?.canView && !workspaceData.accessData?.canEdit)
    return <ForbiddenMessage />;

  return (
    <EditorContext.Provider value={{ editor }}>
      <Container
        className="py-6"
        ref={topElementRef}
        style={{ "--cursor": "default" } as CSSProperties}
      >
        <Breadcrumb>
          <BreadcrumbItem
            href={`/workspaces/${workspaceId}`}
            title={`Return to ${workspaceData.workspace.name}`}
          >
            {workspaceData.workspace.name}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem isLast title="Current page name">
            {page.title}
          </BreadcrumbItem>
        </Breadcrumb>
      </Container>
      {workspaceData.accessData?.canEdit && (
        <Toolbar
          editor={editor}
          isMobile={isMobile}
          mobileView={mobileView}
          setMobileView={setMobileView}
          toolbarRef={toolbarRef}
          pageTitle={page.title}
        />
      )}
      <div
        className="relative"
        style={{ "--cursor": "ibeam" } as CSSProperties}
      >
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
        {editor && workspaceData.accessData?.canEdit && (
          <CollaborationIndicators
            editor={editor}
            provider={workspaceData.accessData?.canEdit ? provider : null}
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
      {isCursorVisible && isTouchScreen !== null && !isTouchScreen && (
        <Cursor cursorRef={cursorRef} cursorType={cursorType} />
      )}
    </EditorContext.Provider>
  );
}
