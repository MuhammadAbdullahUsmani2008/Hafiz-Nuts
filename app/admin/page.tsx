import type { Metadata } from "next";

import AdminDashboard from "@/components/AdminDashboard";

/**
 * HAFIZ NUTS - `/admin`.
 *
 * A static shell: no data is rendered on the server, so this page costs the
 * Worker nothing. The dashboard fetches its numbers from `/api/admin/orders`
 * after the admin signs in. Kept out of search results and the sitemap.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      {/* Clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-5xl pt-16 md:pt-8">
        <AdminDashboard />
      </div>
    </main>
  );
}
