/**
 * PKCE (RFC 7636) — thay cho client_secret o app chay hoan toan tren trinh duyet.
 *
 * Game la public client: khong co backend nen khong co cho giu bi mat dai han.
 * `code_verifier` an toan o day vi no sinh moi moi lan dang nhap, song vai giay,
 * dung mot lan roi vut.
 */

const VERIFIER_BYTES = 32

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Chuoi ngau nhien base64url — dung cho ca code_verifier lan state. */
export function randomUrlSafeToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(VERIFIER_BYTES)).buffer)
}

/** challenge = BASE64URL(SHA256(ASCII(verifier))) — phuong thuc S256. */
export async function challengeOf(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return toBase64Url(digest)
}
