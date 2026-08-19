import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type Crumb = { label: string; href?: string };

/**
 * Photo-led split hero used by the industry templates.
 *
 * Distinct from `PageHero` (centred, text-only, dark) on purpose — the two
 * templates should not read the same. Light background, editorial two-column,
 * image bleeding into a soft blue field on the right.
 */
export function SplitHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  crumbs = [],
  stat,
  children,
  tone = 'light',
  /** `contain` for transparent composites, `cover` for photographs. */
  fit = 'contain',
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  image: string;
  imageAlt: string;
  crumbs?: Crumb[];
  stat?: { value: string; label: string };
  children?: ReactNode;
  tone?: 'light' | 'dark';
  fit?: 'contain' | 'cover';
}) {
  const dark = tone === 'dark';

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        dark ? 'on-dark bg-gradient-navy' : 'bg-gradient-to-b from-blue-50/70 via-white to-white',
      )}
    >
      {/* Ambient drifting field behind the image side. */}
      <div
        aria-hidden="true"
        className={cn(
          'drift pointer-events-none absolute -right-24 top-0 h-[34rem] w-[34rem] rounded-full blur-3xl',
          dark ? 'bg-blue-500/25' : 'bg-blue-200/45',
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute right-10 top-24 hidden h-48 w-48 bg-dot-grid bg-dots lg:block',
          dark ? 'text-blue-400/25' : 'text-blue-300/50',
        )}
      />

      <div className="container relative pb-16 pt-8 lg:pb-24 lg:pt-12">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol
              className={cn(
                'flex flex-wrap items-center gap-x-1 text-sm',
                dark ? 'text-navy-200' : 'text-ink-500',
              )}
            >
              <li>
                <Link href="/" className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-blue-600">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href} className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-blue-600">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={cn('px-1 font-medium', dark ? 'text-white' : 'text-navy-700')}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="min-w-0 lg:col-span-6" data-reveal="left">
            {eyebrow ? (
              <p className={cn('eyebrow-script mb-3', dark && 'text-amber-400')}>{eyebrow}</p>
            ) : null}

            <h1 className={cn('text-display-lg', dark ? 'text-white' : 'text-navy-700')}>{title}</h1>

            {intro ? (
              <p className={cn('mt-6 max-w-prose text-body-lg', dark ? 'text-navy-100' : 'text-ink-600')}>
                {intro}
              </p>
            ) : null}

            {children ? <div className="mt-9">{children}</div> : null}
          </div>

          {/* Device mockups in this library are bleed-cropped at their own
              right edge, so let them run toward the viewport edge on desktop —
              the crop then reads as intentional rather than as a mistake. */}
          <div
            className={cn('min-w-0 lg:col-span-6', fit === 'contain' && 'lg:-mr-[6vw] xl:-mr-[8vw]')}
            data-reveal="right"
          >
            <div className="group relative">
              <div
                className={cn(
                  'media-zoom relative overflow-hidden',
                  fit === 'cover'
                    ? 'aspect-[4/3] rounded-4xl shadow-card-hover ring-1 ring-navy-100'
                    : 'aspect-[4/3]',
                )}
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className={fit === 'cover' ? 'object-cover' : 'object-contain'}
                />
              </div>

              {stat ? (
                <div
                  className="absolute -bottom-5 left-4 rounded-2xl border border-navy-100 bg-white/95 px-5 py-4 shadow-card-hover backdrop-blur-sm sm:left-8"
                  data-reveal
                  data-reveal-delay="3"
                >
                  <p className="text-2xl font-extrabold tracking-tight text-blue-600">{stat.value}</p>
                  <p className="mt-0.5 max-w-[13rem] text-xs leading-snug text-ink-600">{stat.label}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
