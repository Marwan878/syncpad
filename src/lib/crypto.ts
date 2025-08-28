export async function generateUserKeyPair() {
  // RSA-OAEP for wrapping (encrypting) small data like an AES key
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // public key exportable (to send to server). Private key is non-extractable by default.
    ["encrypt", "decrypt"]
  );
}

export async function exportPublicKeyJwk(pubKey: CryptoKey) {
  return crypto.subtle.exportKey("jwk", pubKey);
}

export async function importPublicKeyJwk(jwk: JsonWebKey) {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export async function generateWorkspaceKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

export function randomIv() {
  return crypto.getRandomValues(new Uint8Array(12));
}

export async function aesEncrypt(
  key: CryptoKey,
  plaintext: Uint8Array,
  iv: Uint8Array
) {
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );
  return new Uint8Array(ct);
}

export async function aesDecrypt(
  key: CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array
) {
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new Uint8Array(pt);
}

export async function rsaEncrypt(pubKey: CryptoKey, data: Uint8Array) {
  const ct = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, pubKey, data);
  return new Uint8Array(ct);
}

export async function rsaDecrypt(privKey: CryptoKey, data: Uint8Array) {
  const pt = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privKey, data);
  return new Uint8Array(pt);
}

export async function exportAesRaw(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

export async function importAesRaw(raw: Uint8Array) {
  return crypto.subtle.importKey("raw", raw, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
}
