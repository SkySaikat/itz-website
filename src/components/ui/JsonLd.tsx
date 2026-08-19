import type { JsonLdGraph, JsonLdNode } from '@/lib/schema';

/**
 * Renders a JSON-LD script tag.
 *
 * `<` is escaped to `<` so a stray "</script>" inside any string value
 * cannot terminate the tag early. This is the standard mitigation and matters
 * here because FAQ answers are authored content.
 */
export function JsonLd({ data }: { data: JsonLdGraph | JsonLdNode }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
