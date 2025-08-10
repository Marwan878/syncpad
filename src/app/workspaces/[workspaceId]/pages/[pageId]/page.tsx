"use client";

// TODO: Add status: syncing/offline/synced
// TODO: Handle offline state
// TODO: Add live cursors
// TODO: Add pages data to DB
// TODO: Allow deleting pages
// TODO: Support for view only
// TODO: Markdown Support & Export
// TODO: Allow users to write in or convert blocks to Markdown syntax.
// TODO: Export pages as PDF, Markdown, or HTML.
// TODO: Optimistic UI Updates
// TODO: Show changes immediately before server confirmation for smooth UX.
// TODO: End-to-End Encryption (optional advanced)
// TODO: Encrypt content client-side for privacy.
// TODO: Decrypt only on the client, backend stores encrypted blobs.
// TODO: Scalable architecture for multiple users
// TODO: Caching using Redis
// TODO: Use GraphQL for frontend

import { EditorContent, EditorContext } from "@tiptap/react";

// --- Hooks ---
import useConfiguredEditor from "@/hooks/use-configured-editor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useMemo, useState } from "react";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// --- Components ---
import { CollaborationCarets } from "@/components/collaboration/collaboration-carets";
import ConfirmDeleteTableModal from "@/components/page/editor/confirm-delete-table-modal";
import TableMenu from "@/components/page/editor/table-menu";
import Toolbar from "@/components/page/toolbar/toolbar";

// --- Yjs ---
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function SimpleEditor() {
  const isMobile = useIsMobile();

  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const [confirmDeleteTableOpen, setConfirmDeleteTableOpen] = useState(false);

  const ydoc = useMemo(() => new Y.Doc(), []);

  const user = useMemo(
    () => ({
      name: "Ahmed",
      color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
      cursor: {
        anchor: 0,
        head: 0,
        position: {
          x: 0,
          y: 0,
          height: 0,
          width: 0,
        },
      },
    }),
    []
  );

  const provider = useMemo(() => {
    const p = new WebsocketProvider("ws://localhost:1234", "my-room-id", ydoc);
    // Set user info for awareness
    p.awareness.setLocalStateField("user", user);
    return p;
  }, [ydoc, user]);

  // Cleanup provider on unmount
  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  const editor = useConfiguredEditor(ydoc);

  if (!editor) return null;

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
        />
        {editor && <CollaborationCarets editor={editor} provider={provider} />}
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
