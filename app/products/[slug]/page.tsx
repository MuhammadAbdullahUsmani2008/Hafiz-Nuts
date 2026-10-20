import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductConfigurator, {
  type PackOption,
} from "@/components/ProductConfigurator";
import { formatPkr, PRODUCTS, SITE_URL } from "@/lib/catalog";
import { resolvePublicImage } from "@/lib/resolveImage";

/**
 * HAFIZ NUTS - product detail route (`/products/[slug]`).
 *
 * Server component. Each pack size is a real, statically generated page, so
 * `generateStaticParams` enumerates the catalog and every size gets its own
 * URL, `<title>`, and prerendered HTML. A slug that is not in the catalog
 * renders the 404.
 *
 * Image resolution happens here rather than in the configurator: the
 * configurator is a client component and `node:fs` has no browser equivalent,
 * so the resolved URLs are handed down as props.
 */

/** Pack size routes in catalog order. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((entry) => entry.slug === slug);

  if (!product) return { title: "Product Not Found | HAFIZ NUTS" };

  const title = `Premium Honey & Nut Mix (${product.size}) | HAFIZ NUTS`;
  const description = `${product.description} Priced at ${formatPkr(product.pricePkr)} for the ${product.size} pack. Cash on Delivery available across Pakistan.`;
  const url = `${SITE_URL}/products/${product.slug}`;

  /*
   * Next merges `openGraph` and `twitter` shallowly: setting either here
   * replaces the root layout's object wholesale rather than extending it. So
   * `siteName`, `locale`, and `type` are restated, and the share image is this
   * pack's own photograph instead of the site-wide card - without these, a
   * shared product link would preview with no image or site name.
   */
  const image = resolvePublicImage(product.imageCandidates) ?? product.image;
  const imageAlt = `Premium Honey & Nut Mix - ${product.size} pack`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Hafiz Nuts",
      images: [{ url: `${SITE_URL}${image}`, alt: imageAlt }],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${image}`],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((entry) => entry.slug === slug);

  if (!product) notFound();

  /* Every pack size, with its photograph resolved, for the selector + gallery. */
  const options: readonly PackOption[] = PRODUCTS.map((entry) => ({
    slug: entry.slug,
    size: entry.size,
    pricePkr: entry.pricePkr,
    image: resolvePublicImage(entry.imageCandidates),
  }));

  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      {/* Clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-6xl pt-16 md:pt-8">
        <ProductConfigurator
          product={product}
          image={resolvePublicImage(product.imageCandidates)}
          options={options}
        />
      </div>
    </main>
  );
}
