export default function base64ToUint8Array(base64: string | undefined) {
  if (!base64) {
    return new Uint8Array();
  }

  const binaryString = atob(base64); // decode base64 to bytes in form of characters

  const len = binaryString.length; // (number of bytes)

  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
