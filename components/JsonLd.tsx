/**
 * JsonLd — injects structured data (Schema.org) as JSON-LD into <head>.
 *
 * JSON-LD is the Google-recommended format for structured data.
 * It helps search engines understand your content and can trigger
 * rich results (star ratings, breadcrumbs, sitelinks, etc.).
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", ... }} />
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint: JSON-LD must be rendered as raw HTML
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
