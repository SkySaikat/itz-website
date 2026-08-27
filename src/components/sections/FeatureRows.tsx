import Image from 'next/image';
import type { ReactNode } from 'react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

export type FeatureRow = {
  title: string;
  /** One or more paragraphs. */
  body: string[];
  image: string;
  imageAlt: string;
  /** Short kicker above the row title. */
  kicker?: string;
};

/**
 * Alternating image / text rows for the longer-form "how we actually do this"
 * sections. Images are the transparent brand illustrations, so they render
 * `object-contain` on a soft tinted field rather than in a hard frame.
 */
export function FeatureRows({
  eyebrow,
  title,
  intro,
  rows,
  tone = 'white',
  mesh = false,
  id,
  children,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  rows: FeatureRow[];
  tone?: 'white' | 'muted';
  mesh?: boolean;
  id?: string;
  children?: ReactNode;
}) {
  if (rows.length === 0) return null;

  return (
    <Section tone={tone} id={id} mesh={mesh}>
      {title ? <SectionHeading eyebrow={eyebrow} title={title} intro={intro} /> : null}

      <div className={cn('space-y-16 lg:space-y-24', Boolean(title) && 'mt-16')}>
        {rows.map((row, i) => (
          <div
            key={row.title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div
              className={cn('relative', i % 2 === 1 && 'lg:order-2')}
              data-reveal={i % 2 === 1 ? 'right' : 'left'}
            >
              <div className="media-zoom group relative aspect-[4/3] overflow-hidden rounded-4xl bg-gradient-to-br from-blue-50 to-surface-muted ring-1 ring-navy-100">
                <Image
                  src={row.image}
                  alt={row.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-contain p-4"
                />
              </div>
            </div>

            <div
              className={cn('min-w-0', i % 2 === 1 && 'lg:order-1')}
              data-reveal={i % 2 === 1 ? 'left' : 'right'}
            >
              {row.kicker ? (
                <p className="eyebrow-caps mb-3">{row.kicker}</p>
              ) : (
                <p className="mb-3 text-eyebrow font-bold uppercase tracking-[0.14em] text-blue-600">
                  {String(i + 1).padStart(2, '0')}
                </p>
              )}
              <h3 className="text-display-sm text-navy-700">{row.title}</h3>
              <div className="mt-4 space-y-4 text-body-lg text-ink-600">
                {row.body.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {children ? <div className="mt-14">{children}</div> : null}
    </Section>
  );
}
