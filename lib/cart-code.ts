const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Código aleatório curto para a URL do carrinho (ex.: "a8f3x2"). */
export function generateCartCode(length = 6): string {
  const cryptoObj =
    typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

  let out = "";
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(length);
    cryptoObj.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      out += ALPHABET[bytes[i] % ALPHABET.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }
  return out;
}
