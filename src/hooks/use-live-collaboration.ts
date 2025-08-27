"use client";

// --- Lib ---
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import uint8ArrayToBase64 from "@/lib/utils/uint8-array-to-base-64";

// --- Hooks ---
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

// --- Yjs ---
import { IndexeddbPersistence } from "y-indexeddb";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

// --- Types ---
import { ConnectionStatus } from "@/types/page";

const AUTO_SAVE_INTERVAL_IN_MS = 30_000;

const ydoc = new Y.Doc();

export default function useLiveCollaboration(
  workspaceId: string,
  pageId: string
) {
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  new IndexeddbPersistence(pageId, ydoc);

  const provider = useMemo(() => {
    const p = new WebsocketProvider("ws://localhost:1234", pageId, ydoc);

    return p;
  }, [pageId]);

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

  // Auto save for backup
  useEffect(() => {
    if (!isAuthLoaded) return;

    let saveTimeout: NodeJS.Timeout;

    function setupAutoSave() {
      ydoc.on("update", async () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveToDB, AUTO_SAVE_INTERVAL_IN_MS);
      });
    }

    async function saveToDB() {
      const content = Y.encodeStateAsUpdate(ydoc);
      const token = await getToken();
      await fetchWithAuth(
        {
          token,
          relativeUrl: `/workspaces/${workspaceId}/pages/${pageId}`,
          userId,
        },
        {
          body: JSON.stringify({ content: uint8ArrayToBase64(content) }),
          method: "PATCH",
        }
      );
    }

    setupAutoSave();

    return () => {
      clearTimeout(saveTimeout);
    };
  }, [pageId, getToken, userId, workspaceId, isAuthLoaded]);

  // Cleanup provider on unmount
  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  return { ydoc, provider, status };
}
