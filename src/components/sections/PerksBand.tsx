import { CircleCheck } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

/**
 * "Perks of working with us" — a short heading on the left, a checked list in a
 * tinted panel on the right. Mirrors the pattern on the live About page and
 * gives text-heavy templates a change of rhythm.
 */
export function PerksBand({
  eyebrow,
  title,
  perks,
  cta,
  tone = 'white',
  children,
}: {
  eyebrow?: string;
  title: string;
  perks: string[];
  cta?: { label: string; href: string };
  tone?: 'white' | 'muted';
  children?: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
        <div className="min-w-0 lg:col-span-5" data-reveal="left">
          {eyebrow ? <p className="eyebrow-script mb-3">{eyebrow}</p> : null}
          <h2 className="text-display-sm text-navy-700">{title}</h2>
          {children ? <div className="mt-5 max-w-prose text-ink-600">{children}</div> : null}
          {cta ? (
            <Button href={cta.href} variant="secondary" className="mt-7">
              {cta.label}
            </Button>
          ) : null}
        </div>

        <div className="min-w-0 lg:col-span-7" data-reveal="right">
          <ul className="space-y-1 rounded-4xl bg-blue-50/70 p-7 sm:p-9">
            {perks.map((perk, i) => (
              <li key={perk} className="flex gap-4 py-3" data-reveal data-reveal-delay={i}>
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <span className="text-[0.9375rem] leading-relaxed text-ink-700">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
