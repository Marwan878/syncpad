import { fetchWithAuth } from "@/lib/fetch-with-auth";
import uint8ArrayToBase64 from "@/lib/utils/uint8-array-to-base-64";
import { User } from "@/types/user";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const AUTO_SAVE_INTERVAL_IN_MS = 5_000;

const ydoc = new Y.Doc();
const initialUser = {
  name: "Loading...",
  color: "#" + Math.floor(Math.random() * 0xffffff).toString(16),
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
};

export default function useLiveCollaboration(
  workspaceId: string,
  pageId: string
) {
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = await getToken();
      const user = await fetchWithAuth<User>({
        relativeUrl: `/users/${userId}`,
        token,
        userId,
      });

      return user;
    },
    enabled: isAuthLoaded,
  });

  const provider = useMemo(() => {
    if (!user) return null;

    const p = new WebsocketProvider("ws://localhost:1234", pageId, ydoc);
    // Set user info for awareness
    p.awareness.setLocalStateField("user", {
      ...initialUser,
      name: user?.name ?? "Loading...",
    });
    return p;
  }, [pageId, user?.name]);

  // Auto save
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

  return { ydoc, provider };
}
