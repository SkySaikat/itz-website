import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { JsonLd } from '@/components/ui/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import type { Faq } from '@/lib/geo/types';
import { buildFaqNode } from '@/lib/schema';

/**
 * FAQ block + matching FAQPage structured data.
 *
 * The accordion keeps collapsed answers in the DOM, so the visible content and
 * the markup always agree — which is what keeps the FAQPage eligible.
 */
export function FaqSection({
  faqs,
  path,
  eyebrow = 'Questions',
  title = 'Frequently asked questions',
  intro,
  tone = 'muted',
  /** Set false when the page already emits a FAQPage node elsewhere. */
  emitSchema = true,
}: {
  faqs: Faq[];
  path: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: 'white' | 'muted';
  emitSchema?: boolean;
}) {
  if (faqs.length === 0) return null;

  return (
    <Section tone={tone} id="faq">
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <FaqAccordion faqs={faqs} className="mt-12" />
      {emitSchema ? (
        <JsonLd data={{ '@context': 'https://schema.org', '@graph': [buildFaqNode(faqs, path)] }} />
      ) : null}
    </Section>
  );
}
