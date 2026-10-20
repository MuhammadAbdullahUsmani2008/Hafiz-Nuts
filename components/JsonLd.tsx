/**
 * HAFIZ NUTS - JSON-LD structured data tag.
 *
 * Server component. `<` is escaped to `<` so no string in the payload can
 * close the `<script>` early - the XSS guard the Next docs call for, since
 * `JSON.stringify` alone does not provide it.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
