/**
 * HAFIZ NUTS - admin sign-in helpers.
 *
 * One shared password (`ADMIN_PASSWORD`, a Cloudflare secret). A successful
 * login sets an HttpOnly cookie holding a signed expiry time, so the cookie
 * never contains the password, expires after 12 hours, and changing the
 * password signs everyone out. Uses Web Crypto only, so it runs unchanged on Cloudflare Workers.
 *
 * Per request this is one HMAC and a string compare - negligible CPU.
 */

export const ADMIN_COOKIE = "hn_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Compares without bailing out at the first differing character. */
export function safeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * A fresh session token: `<expiry>.<signature>`. The signature covers the
 * expiry, so it can't be extended by editing the cookie, and it is keyed by
 * the password, so changing `ADMIN_PASSWORD` invalidates every session.
 */
export async function issueAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const expires = Date.now() + ADMIN_COOKIE_MAX_AGE * 1000;
  return `${expires}.${await hmacHex(password, `hafiz-nuts-admin-v2:${expires}`)}`;
}

/** True when the request carries a valid, unexpired admin cookie. */
export async function isAdminRequest(request: {
  cookies: { get(name: string): { value: string } | undefined };
}): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!password || !token) return false;

  const [expiresText, signature = ""] = token.split(".");
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = await hmacHex(password, `hafiz-nuts-admin-v2:${expires}`);
  return safeEqual(signature, expected);
}
