import type { ReactNode } from 'react';

import { Section, SectionHeading } from '@/components/ui/Section';

/**
 * A prose block for the longer-form context copy on template pages — two
 * columns of body text under a heading, so the page has something to read
 * rather than only cards and lists.
 */
export function ContextBlock({
  eyebrow,
  title,
  paragraphs,
  tone = 'white',
}: {
  eyebrow?: string;
  title: ReactNode;
  paragraphs: string[];
  tone?: 'white' | 'muted';
}) {
  if (paragraphs.length === 0) return null;

  return (
    <Section tone={tone}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-16">
        <div className="min-w-0 lg:col-span-4">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </div>
        <div className="min-w-0 space-y-5 lg:col-span-8" data-reveal="right">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="text-body-lg text-ink-600">
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
