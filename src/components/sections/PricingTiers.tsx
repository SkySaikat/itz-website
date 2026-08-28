import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';
import type { PricingGroup } from '@/lib/pricing-content';

/**
 * One pricing group rendered as a responsive tier-card grid. Reuses the site's
 * `Section` / `SectionHeading` / `Button`; the featured card is ringed in blue
 * with a "Most popular" pill. Grid: 1-up on mobile, 2-up sm, then N-up
 * (capped at 4) on large.
 */
export function PricingTiers({
  group,
  tone = 'white',
}: {
  group: PricingGroup;
  tone?: 'white' | 'muted';
}) {
  const cols =
    group.tiers.length >= 4
      ? 'lg:grid-cols-4'
      : group.tiers.length === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-2';

  return (
    <Section tone={tone} id={group.slug}>
      <SectionHeading
        eyebrow={group.eyebrow}
        title={group.title}
        intro={group.intro}
        action={
          group.serviceHref ? (
            <Button href={group.serviceHref} variant="secondary">
              How it works
            </Button>
          ) : undefined
        }
      />

      {group.note ? (
        <p className="mt-4 text-sm font-medium text-ink-500">{group.note}</p>
      ) : null}

      <ul className={cn('mt-12 grid gap-6 sm:grid-cols-2', cols)}>
        {group.tiers.map((tier, i) => (
          <li key={tier.name} data-reveal data-reveal-delay={i}>
            <article
              className={cn(
                'relative flex h-full flex-col rounded-[1.75rem] border bg-white p-7',
                tier.featured
                  ? 'border-blue-500 shadow-card-lg ring-1 ring-blue-500'
                  : 'border-navy-100 shadow-card',
              )}
            >
              {tier.featured ? (
                <span className="absolute -top-3 left-7 inline-flex items-center rounded-pill bg-gradient-cta px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              ) : null}

              <p className="text-eyebrow uppercase text-ink-500">{tier.name}</p>

              <p className="mt-3 text-2xl font-extrabold tracking-tight text-navy-700">
                {tier.price}
                {tier.unit ? (
                  <span className="ml-1 text-sm font-semibold text-ink-500">{tier.unit}</span>
                ) : null}
              </p>

              <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                {tier.blurb}
              </p>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                Get a quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <Link
                href="/contact"
                className="absolute inset-0 rounded-[1.75rem]"
                aria-label={`Get a quote for ${group.title} — ${tier.name}`}
              />
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
