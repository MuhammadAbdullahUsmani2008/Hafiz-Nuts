import { DELIVERY_FEE_PKR } from "@/lib/catalog";
import { ordersConfigured, saveOrder } from "@/lib/orders";

/**
 * POST /api/orders - records a checkout in the order sheet.
 *
 * Called "fire and forget" by the checkout just before WhatsApp opens, so a
 * slow or failing sheet can never stop a customer from ordering. It does one
 * validation pass and one `fetch` to Google, nothing else.
 *
 * Totals are recomputed here from the line items rather than trusted from the
 * browser, and every text field is length-capped, so the sheet cannot be
 * flooded with huge payloads.
 */

const MAX_BODY_BYTES = 10_000;
const MAX_ITEMS = 30;

const PAYMENTS: Record<string, string> = {
  cod: "Cash on Delivery",
  easypaisa: "EasyPaisa",
};

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, max)
    : "";
}

export async function POST(request: Request) {
  /* Only our own site may post orders (browsers always send Origin on POST). */
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ ok: false }, { status: 403 });
  }

  /* Nothing connected yet: succeed quietly so checkout is unaffected. */
  if (!ordersConfigured()) return Response.json({ ok: true, saved: false });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const city = clean(body.city, 60);
  const address = clean(body.address, 300);
  const notes = clean(body.notes, 300);
  const payment = PAYMENTS[clean(body.paymentMethod, 20)];

  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  const lines: string[] = [];
  let subtotal = 0;
  for (const item of rawItems) {
    const entry = item as Record<string, unknown>;
    const quantity = Math.floor(Number(entry.quantity));
    const price = Math.floor(Number(entry.pricePkr));
    if (!(quantity >= 1 && quantity <= 99) || !(price >= 0 && price <= 1_000_000)) {
      continue;
    }
    subtotal += quantity * price;
    lines.push(
      `${quantity} x ${clean(entry.name, 80)} (${clean(entry.size, 30)})`,
    );
  }

  if (!name || !phone || !address || !city || !payment || lines.length === 0) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    await saveOrder({
      name,
      phone,
      city,
      address,
      notes,
      payment,
      items: lines.join("\n"),
      total: subtotal + DELIVERY_FEE_PKR,
    });
    return Response.json({ ok: true, saved: true });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
