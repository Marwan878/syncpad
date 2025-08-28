"use client";

import { useEffect, useState } from "react";
import { generateUserKeyPair, exportPublicKeyJwk } from "@/lib/crypto";
import { getIndexedDbKey, setIndexedDbKey } from "@/lib/utils/idb";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { useAuth } from "@clerk/nextjs";

export function useUserCryptoKeypair(userId?: string) {
  const [ready, setReady] = useState(false);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    if (!userId) return;

    (async () => {
      let _privateKey = await getIndexedDbKey<CryptoKey>("privateKey");
      if (!_privateKey) {
        const { publicKey, privateKey } = await generateUserKeyPair();
        await setIndexedDbKey("privateKey", privateKey);
        const jwk = await exportPublicKeyJwk(publicKey);
        const token = await getToken();

        // Send public key to server
        await fetchWithAuth(
          {
            relativeUrl: `/users/${userId}`,
            userId,
            token,
          },
          {
            method: "PATCH",
            body: JSON.stringify({ publicKeyJwk: jwk }),
          }
        );

        _privateKey = privateKey;
      }

      setPrivateKey(_privateKey);
      setReady(true);
    })();
  }, [userId, getToken]);

  return { ready, privateKey };
}
