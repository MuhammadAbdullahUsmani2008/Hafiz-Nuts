import type { NextRequest } from "next/server";

import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminToken,
  safeEqual,
} from "@/lib/adminAuth";

/**
 * POST   /api/admin/login - check the password, set the session cookie.
 * DELETE /api/admin/login - sign out.
 */

const COOKIE_BASE = `${ADMIN_COOKIE}=`;
const FLAGS = "; Path=/; HttpOnly; SameSite=Strict";

function secureFlag() {
  return process.env.NODE_ENV === "production" ? "; Secure" : "";
}

export async function POST(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const token = await adminToken();
  if (!password || !token) {
    return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  let submitted = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    submitted = typeof body.password === "string" ? body.password : "";
  } catch {
    /* falls through to the wrong-password branch */
  }

  if (!safeEqual(submitted, password)) {
    /* A short pause makes password guessing slow without costing CPU. */
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Response.json({ ok: false, error: "wrong-password" }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${COOKIE_BASE}${token}${FLAGS}; Max-Age=${ADMIN_COOKIE_MAX_AGE}${secureFlag()}`,
    },
  });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${COOKIE_BASE}${FLAGS}; Max-Age=0${secureFlag()}`,
    },
  });
}
