import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import ProductConfigurator, {
  type PackOption,
} from "@/components/ProductConfigurator";
import { formatPkr, PRODUCT_LINES, PRODUCTS, productsInLine } from "@/lib/catalog";
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

  const lineName = PRODUCT_LINES[product.line].name;

  return pageMetadata({
    title: `${lineName} (${product.size})`,
    description: `${product.description} Priced at ${formatPkr(product.pricePkr)} for the ${product.size} pack. Cash on Delivery available across Pakistan.`,
    path: `/products/${product.slug}`,
    image: {
      /* No photograph yet -> the site card, never a path that 404s. */
      path: resolvePublicImage(product.imageCandidates) ?? "/og-image.jpg",
      alt: `${lineName} - ${product.size} pack`,
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

  /*
   * Every pack size in this product line, with its photograph resolved, for
   * the selector + gallery. Lines never mix: a honey jar page offers only
   * honey sizes.
   */
  const options: readonly PackOption[] = productsInLine(product.line).map((entry) => ({
    slug: entry.slug,
    size: entry.size,
    pricePkr: entry.pricePkr,
    image: resolvePublicImage(entry.imageCandidates),
  }));

  return (
    <main className="flex-1 bg-[#FAF6F0] px-4 py-8 md:px-8 md:py-12">
      <JsonLd data={productJsonLd(product, image ?? "/og-image.jpg")} />

      {/* Clears the fixed header, which overlays the top of the viewport. */}
      <div className="mx-auto max-w-6xl pt-16 md:pt-8">
        <ProductConfigurator product={product} image={image} options={options} />
      </div>
    </main>
  );
}
