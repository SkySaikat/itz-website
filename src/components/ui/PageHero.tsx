import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="on-dark mesh mesh-dark relative overflow-hidden bg-gradient-navy pb-20 pt-10 lg:pb-28 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-0 h-72 w-72 bg-dot-grid bg-dots text-blue-400/25"
      />
      <div
        aria-hidden="true"
        className="drift accent-orb -bottom-24 left-1/3 h-72 w-72 bg-blue-500/25"
      />
      <div
        aria-hidden="true"
        className="drift-slow accent-orb -right-24 top-10 h-64 w-64 bg-amber-400/12"
      />

      <div className="container relative">
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-1 text-sm text-navy-200">
              <li>
                <Link href="/" className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-white">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-navy-300" aria-hidden="true" />
                  {crumb.href && i < crumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="px-1 font-medium text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="max-w-3xl" data-reveal="left">
          {eyebrow ? (
            <p className="mb-4 inline-flex items-center gap-2 rounded-pill glass-dark px-4 py-1.5 font-script text-xl font-bold leading-none text-amber-300">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-display-xl text-white">{title}</h1>

          {intro ? <p className="mt-6 max-w-prose text-body-xl text-navy-100">{intro}</p> : null}

          {children ? <div className="mt-9">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
