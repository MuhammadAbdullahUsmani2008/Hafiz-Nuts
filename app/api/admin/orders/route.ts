import type { NextRequest } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import { fetchStats, ordersConfigured } from "@/lib/orders";

/**
 * GET /api/admin/orders - dashboard numbers for the admin page.
 *
 * Signed-in admins only. One fetch to the Apps Script, which does the counting
 * next to the data; this route just passes the result through. Never cached,
 * and only called when the admin opens or refreshes the page.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  if (!ordersConfigured()) {
    return Response.json({ ok: false, error: "not-connected" }, { headers: NO_STORE });
  }

  try {
    return Response.json(await fetchStats(), { headers: NO_STORE });
  } catch {
    return Response.json({ ok: false, error: "sheet-unreachable" }, { status: 502, headers: NO_STORE });
  }
}
