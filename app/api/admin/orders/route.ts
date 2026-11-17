import type { NextRequest } from "next/server";

import { isAdminRequest } from "@/lib/adminAuth";
import {
  fetchStats,
  ORDER_STATUSES,
  ordersConfigured,
  setOrderStatus,
  type OrderStatus,
} from "@/lib/orders";

/**
 * PATCH /api/admin/orders - change one order's status (Confirmed, Shipped...).
 * Admin cookie required (SameSite=Strict) plus a same-origin check.
 */
export async function PATCH(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!(await isAdminRequest(request)) || (origin && origin !== request.nextUrl.origin)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  let body: { orderNo?: unknown; status?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* validated below */
  }
  const orderNo = typeof body.orderNo === "string" ? body.orderNo : "";
  const status = body.status as OrderStatus;
  if (!/^HN-\d{4,}$/.test(orderNo) || !ORDER_STATUSES.includes(status)) {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400, headers: NO_STORE });
  }

  try {
    await setOrderStatus(orderNo, status);
    return Response.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return Response.json({ ok: false, error: "sheet-unreachable" }, { status: 502, headers: NO_STORE });
  }
}

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
