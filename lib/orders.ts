/**
 * HAFIZ NUTS - order log (Google Sheet) plumbing, server side.
 *
 * The site never talks to Google directly from the browser. Both the checkout
 * (saving an order) and the admin page (reading totals) go through our own
 * `/api/...` routes, which call a small Google Apps Script web app attached to
 * the order sheet (`google-sheet/Code.gs`). That keeps the script URL and its
 * shared secret out of the browser.
 *
 * Every call here is a single `fetch` with a timeout - there is no polling, no
 * background work, and no caching layer to keep warm, so the load on the
 * Cloudflare Worker is one tiny request per order or per admin page view.
 */

export type OrderStatus =
  | "New"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type AdminOrder = {
  date: string;
  orderNo: string;
  name: string;
  phone: string;
  city: string;
  items: string;
  total: number;
  payment: string;
  status: string;
};

export type AdminStats = {
  ok: true;
  counts: {
    total: number;
    today: number;
    last7Days: number;
    thisMonth: number;
  };
  byStatus: Record<string, number>;
  revenue: { allTime: number; thisMonth: number };
  recent: AdminOrder[];
};

const TIMEOUT_MS = 8000;

function config() {
  const url = process.env.ORDERS_SCRIPT_URL;
  const secret = process.env.ORDERS_SECRET;
  return url && secret ? { url, secret } : null;
}

/** False until the Apps Script URL and secret have been set as secrets. */
export function ordersConfigured(): boolean {
  return config() !== null;
}

export type NewOrder = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  payment: string;
  items: string;
  total: number;
};

/** Appends one order row to the sheet. Throws on any failure. */
export async function saveOrder(order: NewOrder): Promise<void> {
  const cfg = config();
  if (!cfg) return;

  const response = await fetch(cfg.url, {
    method: "POST",
    /* text/plain keeps this a "simple" request; the script parses it as JSON. */
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: cfg.secret, ...order }),
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const result = (await response.json()) as { ok?: boolean; error?: string };
  if (!result.ok) throw new Error(result.error ?? "Sheet rejected the order");
}

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "New",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/** Changes one order's Status in the sheet. Throws on any failure. */
export async function setOrderStatus(orderNo: string, status: OrderStatus): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("Orders sheet is not connected");

  const response = await fetch(cfg.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: cfg.secret, action: "setStatus", orderNo, status }),
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const result = (await response.json()) as { ok?: boolean; error?: string };
  if (!result.ok) throw new Error(result.error ?? "Sheet rejected the change");
}

/** Reads the dashboard numbers (computed inside the script). Throws on failure. */
export async function fetchStats(): Promise<AdminStats> {
  const cfg = config();
  if (!cfg) throw new Error("Orders sheet is not connected");

  const url = `${cfg.url}?action=stats&key=${encodeURIComponent(cfg.secret)}`;
  const response = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const result = (await response.json()) as AdminStats | { ok: false; error?: string };
  if (!result.ok) throw new Error(("error" in result && result.error) || "Sheet error");
  return result;
}
