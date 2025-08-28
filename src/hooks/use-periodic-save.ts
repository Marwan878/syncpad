"use client";

import { aesEncrypt, randomIv } from "@/lib/crypto";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import uint8ArrayToBase64 from "@/lib/utils/uint8-array-to-base-64";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import * as Y from "yjs";
import { useWorkspaceEncryption } from "./use-workspace-encryption";

const AUTO_SAVE_INTERVAL_IN_MS = 30_000;

export default function usePeriodicSave(
  workspaceId: string,
  pageId: string,
  ydoc: Y.Doc,
  canUserEdit: boolean
) {
  const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();
  const { workspaceKey, ready: encryptionReady } = useWorkspaceEncryption(
    workspaceId,
    userId || undefined
  );

  // Auto save for backup
  useEffect(() => {
    if (!isAuthLoaded || !canUserEdit || !encryptionReady || !workspaceKey)
      return;

    let saveTimeout: NodeJS.Timeout;

    function setupAutoSave() {
      ydoc.on("update", async () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveToDB, AUTO_SAVE_INTERVAL_IN_MS);
      });
    }

    async function saveToDB() {
      if (!workspaceKey) return;

      const token = await getToken();
      const iv = randomIv();

      const content = uint8ArrayToBase64(Y.encodeStateAsUpdate(ydoc));
      const encoded = new TextEncoder().encode(content);
      const ciphertext = await aesEncrypt(workspaceKey, encoded, iv);

      // Store encrypted content with IV
      const encryptedData = {
        content: Array.from(ciphertext),
        iv: Array.from(iv),
      };

      await fetchWithAuth(
        {
          token,
          relativeUrl: `/workspaces/${workspaceId}/pages/${pageId}`,
          userId,
        },
        {
          body: JSON.stringify(encryptedData),
          method: "PATCH",
        }
      );
    }

    setupAutoSave();

    return () => {
      clearTimeout(saveTimeout);
    };
  }, [
    pageId,
    getToken,
    userId,
    workspaceId,
    isAuthLoaded,
    ydoc,
    canUserEdit,
    encryptionReady,
    workspaceKey,
  ]);
}
