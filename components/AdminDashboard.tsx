"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, LogOut, RefreshCw } from "lucide-react";

import { formatPkr } from "@/lib/catalog";
import type { AdminStats } from "@/lib/orders";

/**
 * HAFIZ NUTS - admin dashboard (read-only).
 *
 * Shows order counts and revenue from the Google Sheet. Numbers are fetched
 * once on load and again only when the admin presses Refresh - no polling, so
 * an open tab costs the Worker nothing. The only write is the per-order Status
 * dropdown, which updates the sheet (still the source of truth).
 */

type View =
  | { kind: "loading" }
  | { kind: "login"; error?: string; notConfigured?: boolean }
  | { kind: "not-connected" }
  | { kind: "error" }
  | { kind: "ready"; stats: AdminStats };

const STATUS_ORDER = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const CARD = "rounded-2xl border border-[#E8DFC8]/70 bg-white p-5 shadow-sm";
const BUTTON =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A451F]";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 401) {
        setView({ kind: "login" });
        return;
      }
      const data = (await response.json()) as AdminStats | { ok: false; error?: string };
      if (data.ok) setView({ kind: "ready", stats: data });
      else if (data.error === "not-connected") setView({ kind: "not-connected" });
      else setView({ kind: "error" });
    } catch {
      setView({ kind: "error" });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load();
  }, [load]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setSigningIn(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setPassword("");
        setView({ kind: "loading" });
        await load();
      } else if (response.status === 503) {
        setView({ kind: "login", notConfigured: true });
      } else {
        setView({ kind: "login", error: "Wrong password. Please try again." });
      }
    } catch {
      setView({ kind: "login", error: "Could not reach the server." });
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setView({ kind: "login" });
  };

  if (view.kind === "loading") {
    return (
      <p className="flex items-center justify-center gap-2 py-24 text-sm text-[#5C4333]">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
      </p>
    );
  }

  if (view.kind === "login") {
    return (
      <form onSubmit={signIn} className={`${CARD} mx-auto max-w-sm`}>
        <h1 className="font-display text-xl font-bold text-[#2A170D]">Admin</h1>
        <p className="mt-1 text-sm text-[#5C4333]">Enter the admin password.</p>

        <label htmlFor="admin-password" className="mt-4 block text-xs font-semibold text-[#5C4333]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-md border border-[#E8DFC8] px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#7A451F] focus:outline-none"
        />

        {view.error && (
          <p role="alert" className="mt-2 text-xs text-red-700">
            {view.error}
          </p>
        )}
        {view.notConfigured && (
          <p role="alert" className="mt-2 text-xs text-red-700">
            Admin is not set up yet: the ADMIN_PASSWORD secret is missing.
          </p>
        )}

        <button
          type="submit"
          disabled={signingIn || !password}
          className={`${BUTTON} mt-4 w-full justify-center bg-[#7A451F] text-white hover:bg-[#603516] disabled:opacity-50`}
        >
          {signingIn ? "Signing in…" : "Sign in"}
        </button>
      </form>
    );
  }

  if (view.kind === "not-connected" || view.kind === "error") {
    return (
      <div className={`${CARD} mx-auto max-w-lg text-center`}>
        <h1 className="font-display text-xl font-bold text-[#2A170D]">
          {view.kind === "not-connected" ? "Orders sheet not connected yet" : "Could not load orders"}
        </h1>
        <p className="mt-2 text-sm text-[#5C4333]">
          {view.kind === "not-connected"
            ? "Finish the Google Sheet setup (see google-sheet/SETUP.md), then add the ORDERS_SCRIPT_URL and ORDERS_SECRET secrets."
            : "Google did not answer. Your orders are safe in the sheet - try again in a moment."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" onClick={load} className={`${BUTTON} bg-[#7A451F] text-white hover:bg-[#603516]`}>
            <RefreshCw className="h-4 w-4" aria-hidden /> Try again
          </button>
          <button type="button" onClick={signOut} className={`${BUTTON} border border-[#E8DFC8] bg-white text-[#7A451F]`}>
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      </div>
    );
  }

  const { stats } = view;

  /** Saves a new status to the sheet, then updates the page without a reload. */
  const changeStatus = async (orderNo: string, status: string) => {
    setSaving(orderNo);
    setStatusError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, status }),
      });
      if (response.status === 401) {
        setView({ kind: "login" });
        return;
      }
      if (!response.ok) throw new Error("failed");

      /* Re-read from the sheet so counts and sales (cancelled excluded) stay exact. */
      await load();
    } catch {
      setStatusError(`Could not update ${orderNo}. Nothing was changed - please try again.`);
    } finally {
      setSaving(null);
    }
  };

  const tiles = [
    { label: "Total orders", value: stats.counts.total },
    { label: "Today", value: stats.counts.today },
    { label: "Last 7 days", value: stats.counts.last7Days },
    { label: "This month", value: stats.counts.thisMonth },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-[#2A170D]">Orders</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={refreshing}
            className={`${BUTTON} bg-[#7A451F] text-white hover:bg-[#603516] disabled:opacity-60`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden /> Refresh
          </button>
          <button type="button" onClick={signOut} className={`${BUTTON} border border-[#E8DFC8] bg-white text-[#7A451F]`}>
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className={CARD}>
            <p className="text-xs font-semibold text-[#8C5228]">{tile.label}</p>
            <p className="mt-1 text-3xl font-bold text-[#2A170D]">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className={CARD}>
          <p className="text-xs font-semibold text-[#8C5228]">Sales this month (excl. cancelled)</p>
          <p className="mt-1 text-2xl font-bold text-[#2A170D]">{formatPkr(stats.revenue.thisMonth)}</p>
          <p className="mt-1 text-xs text-[#5C4333]">All time: {formatPkr(stats.revenue.allTime)}</p>
        </div>
        <div className={CARD}>
          <p className="text-xs font-semibold text-[#8C5228]">By status</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {STATUS_ORDER.map((status) => (
              <li key={status} className="rounded-full bg-[#FAF6F0] px-3 py-1 text-xs text-[#2A170D] ring-1 ring-[#E8DFC8]">
                {status}: <strong>{stats.byStatus[status] ?? 0}</strong>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[#5C4333]">Change an order&apos;s status from the list below.</p>
        </div>
      </div>

      <div className={`${CARD} overflow-x-auto p-0`}>
        <h2 className="px-5 pt-4 pb-2 text-sm font-semibold text-[#2A170D]">Latest orders</h2>
        {statusError && (
          <p role="alert" className="px-5 pb-2 text-xs text-red-700">
            {statusError}
          </p>
        )}
        {stats.recent.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-[#5C4333]">No orders yet. New orders appear here.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="text-[#8C5228]">
              <tr>
                {["Order", "When", "Customer", "City", "Items", "Total", "Payment", "Status"].map((heading) => (
                  <th key={heading} className="px-3 py-2 font-semibold first:pl-5 last:pr-5">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((order) => (
                <tr key={order.orderNo} className="border-t border-[#E8DFC8]/60 align-top text-[#2A170D]">
                  <td className="px-3 py-2 pl-5 font-semibold">{order.orderNo}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDate(order.date)}</td>
                  <td className="px-3 py-2">
                    {order.name}
                    <br />
                    <span className="text-[#8C5228]">{order.phone}</span>
                  </td>
                  <td className="px-3 py-2">{order.city}</td>
                  <td className="px-3 py-2 whitespace-pre-line">{order.items}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatPkr(order.total)}</td>
                  <td className="px-3 py-2">{order.payment}</td>
                  <td className="px-3 py-2 pr-5">
                    <select
                      value={STATUS_ORDER.includes(order.status) ? order.status : "New"}
                      onChange={(event) => changeStatus(order.orderNo, event.target.value)}
                      disabled={saving === order.orderNo}
                      aria-label={`Status of ${order.orderNo}`}
                      className="rounded-md border border-[#E8DFC8] bg-white px-2 py-1 text-xs text-[#2A170D] focus:ring-1 focus:ring-[#7A451F] focus:outline-none disabled:opacity-50"
                    >
                      {STATUS_ORDER.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
