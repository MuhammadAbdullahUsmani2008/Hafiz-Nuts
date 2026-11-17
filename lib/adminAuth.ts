/**
 * HAFIZ NUTS - admin sign-in helpers.
 *
 * One shared password (`ADMIN_PASSWORD`, a Cloudflare secret). A successful
 * login sets an HttpOnly cookie holding an HMAC of that password, so the cookie
 * never contains the password itself and changing the password signs everyone
 * out. Uses Web Crypto only, so it runs unchanged on Cloudflare Workers.
 *
 * Per request this is one HMAC and a string compare - negligible CPU.
 */

export const ADMIN_COOKIE = "hn_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

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

/** The cookie value for a correct password, or null if admin is not configured. */
export async function adminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return hmacHex(password, "hafiz-nuts-admin-v1");
}

/** True when the request carries a valid admin cookie. */
export async function isAdminRequest(request: {
  cookies: { get(name: string): { value: string } | undefined };
}): Promise<boolean> {
  const expected = await adminToken();
  const actual = request.cookies.get(ADMIN_COOKIE)?.value;
  return Boolean(expected && actual && safeEqual(actual, expected));
}
