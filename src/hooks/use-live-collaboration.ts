"use client";

// --- Hooks ---
import { useEffect, useMemo, useState } from "react";

// --- Yjs ---
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

// --- Types ---
import { ConnectionStatus } from "@/types/page";

export default function useLiveCollaboration(
  workspaceId: string,
  pageId: string
) {
  const ydoc = useMemo(() => new Y.Doc(), []);

  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  new IndexeddbPersistence(pageId, ydoc);

  const provider = useMemo(() => {
    const p = new WebsocketProvider("ws://localhost:1234", pageId, ydoc);

    return p;
  }, [pageId, ydoc]);

  // Handles connection status
  useEffect(() => {
    const setOffline = () => {
      setStatus("disconnected");
    };

    const _setStatus = (event: { status: ConnectionStatus }) => {
      if (!navigator.onLine) {
        setOffline();
        return;
      }

      setStatus(event.status);
    };

    provider?.on("status", _setStatus);

    window.addEventListener("offline", setOffline);

    return () => {
      provider?.off("status", _setStatus);
      window.removeEventListener("offline", setOffline);
    };
  }, [provider]);

  // Cleanup provider on unmount
  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  return { ydoc, provider, status };
}
