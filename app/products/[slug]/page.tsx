import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import ProductConfigurator, {
  type PackOption,
} from "@/components/ProductConfigurator";
import { formatPkr, PRODUCTS } from "@/lib/catalog";
import { resolvePublicImage } from "@/lib/resolveImage";
import { pageMetadata, productJsonLd } from "@/lib/seo";

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
 *
 * Each pack also carries its own canonical, share card (its own photograph),
 * and Product + BreadcrumbList JSON-LD, so search results can show the price
 * and stock state per size.
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

  if (!product) return { title: "Product Not Found" };

  return pageMetadata({
    title: `Premium Honey & Nut Mix (${product.size})`,
    description: `${product.description} Priced at ${formatPkr(product.pricePkr)} for the ${product.size} pack. Cash on Delivery available across Pakistan.`,
    path: `/products/${product.slug}`,
    image: {
      path: resolvePublicImage(product.imageCandidates) ?? product.image,
      alt: `Premium Honey & Nut Mix - ${product.size} pack`,
    },
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((entry) => entry.slug === slug);

  if (!product) notFound();

  const image = resolvePublicImage(product.imageCandidates);

  /* Every pack size, with its photograph resolved, for the selector + gallery. */
  const options: readonly PackOption[] = PRODUCTS.map((entry) => ({
    slug: entry.slug,
    size: entry.size,
    pricePkr: entry.pricePkr,
    image: resolvePublicImage(entry.imageCandidates),
  }));

  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      <JsonLd data={productJsonLd(product, image ?? product.image)} />

      {/* Clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-6xl pt-16 md:pt-8">
        <ProductConfigurator product={product} image={image} options={options} />
      </div>
    </main>
  );
}
