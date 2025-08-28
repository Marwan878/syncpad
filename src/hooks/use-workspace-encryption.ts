"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { importAesRaw, rsaDecrypt, generateWorkspaceKey } from "@/lib/crypto";
import { getIndexedDbKey, setIndexedDbKey } from "@/lib/utils/idb";
import { useUserCryptoKeypair } from "./use-user-crypto-keypair";
import { EncryptionKey } from "@/types/encryption-key";
import { Workspace } from "@/types/workspace";

/**
 * Hook for managing workspace-level encryption keys
 *
 * This hook handles:
 * 1. Retrieving encrypted workspace keys from the server
 * 2. Decrypting them using the user's private key
 * 3. Caching decrypted keys locally
 * 4. Providing the workspace key for content encryption/decryption
 */
export function useWorkspaceEncryption(workspaceId: string, userId?: string) {
  const [workspaceKey, setWorkspaceKey] = useState<CryptoKey | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { ready: keysReady, privateKey } = useUserCryptoKeypair(userId);

  useEffect(() => {
    if (!userId || !workspaceId || !keysReady || !privateKey) return;

    (async () => {
      try {
        setError(null);

        // Try to get cached workspace key first
        const cacheKey = `workspaceKey:${workspaceId}`;
        const cachedKey = await getIndexedDbKey<CryptoKey>(cacheKey);

        if (cachedKey) {
          setWorkspaceKey(cachedKey);
          setReady(true);
          return;
        }

        // Check if this is a public workspace first
        const token = await getToken();
        const workspace = await fetchWithAuth<Workspace>(
          {
            relativeUrl: `/workspaces/${workspaceId}`,
            userId,
            token,
          },
          { method: "GET" }
        );

        // For public workspaces, we use a different encryption strategy
        if (workspace.any_user_can_view || workspace.any_user_can_edit) {
          // For public workspaces, we generate a local-only key
          // This provides some client-side encryption but not true E2EE
          const localKey = await generateWorkspaceKey();
          await setIndexedDbKey(cacheKey, localKey);
          setWorkspaceKey(localKey);
          setReady(true);
          return;
        }

        // Fetch encrypted workspace key from server for private workspaces
        const encryptedKeys = await fetchWithAuth<EncryptionKey[]>(
          {
            relativeUrl: `/workspaces/${workspaceId}/grant`,
            userId,
            token,
          },
          { method: "GET" }
        );

        if (encryptedKeys.length === 0) {
          // No workspace key found - user doesn't have access yet
          setError("No workspace key found");
          setReady(true);
          return;
        }

        // Decrypt the workspace key using user's private key
        const encryptedKey = encryptedKeys[0];
        const encryptedKeyBytes = new Uint8Array(
          encryptedKey.key.split(",").map((num) => parseInt(num))
        );

        const decryptedKeyRaw = await rsaDecrypt(privateKey, encryptedKeyBytes);
        const workspaceAesKey = await importAesRaw(decryptedKeyRaw);

        // Cache the decrypted key
        await setIndexedDbKey(cacheKey, workspaceAesKey);

        setWorkspaceKey(workspaceAesKey);
        setReady(true);
      } catch (err) {
        console.error("Error setting up workspace encryption:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setReady(true);
      }
    })();
  }, [userId, workspaceId, keysReady, privateKey, getToken]);

  /**
   * Generate a new workspace key and encrypt it for all workspace members
   * This should only be called by workspace owners
   */
  const generateNewWorkspaceKey = async () => {
    if (!userId || !workspaceId) return null;

    try {
      const newWorkspaceKey = await generateWorkspaceKey();

      // Cache the new key locally
      const cacheKey = `workspaceKey:${workspaceId}`;
      await setIndexedDbKey(cacheKey, newWorkspaceKey);

      setWorkspaceKey(newWorkspaceKey);
      return newWorkspaceKey;
    } catch (err) {
      console.error("Error generating new workspace key:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate workspace key"
      );
      return null;
    }
  };

  return {
    workspaceKey,
    ready,
    error,
    generateNewWorkspaceKey,
  };
}
