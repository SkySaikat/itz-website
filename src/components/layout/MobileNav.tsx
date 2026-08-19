'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { mainNav } from '@/lib/nav';
import { addressLine, site } from '@/lib/site';

/**
 * Full-height slide-over drawer. Sections are accordions rather than nested
 * flyouts — on a phone, a three-level flyout is unusable, and the original
 * WordPress mobile menu hid the sub-industry pages entirely.
 *
 * Every row is min-h-tap (48px).
 */
export function MobileNav({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(() => sectionFor(pathname));
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while the drawer is open, without the layout shift that
  // `overflow: hidden` alone causes on desktop-width scrollbars.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  // Escape closes; focus moves into the panel on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Open the accordion containing the current page. Adjusted during render
  // rather than in an effect, so the drawer never paints with the wrong
  // section open first.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setExpanded(sectionFor(pathname));
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        id="mobile-nav"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden',
          'top-[var(--header-height)] transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
      >
        <nav aria-label="Mobile" className="flex-1 px-5 py-6">
          <ul className="divide-y divide-navy-100">
            {mainNav.map((item) => {
              const isOpen = expanded === item.label;

              if (!item.columns) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex min-h-[3.5rem] items-center text-lg font-bold',
                        pathname === item.href ? 'text-blue-600' : 'text-navy-700',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-panel-${slug(item.label)}`}
                    className="flex min-h-[3.5rem] w-full items-center justify-between gap-3 text-left text-lg font-bold text-navy-700"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-blue-600',
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`mobile-panel-${slug(item.label)}`}
                    hidden={!isOpen}
                    className="pb-4"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="mb-2 flex min-h-tap items-center text-sm font-bold text-blue-600"
                    >
                      {item.seeAllLabel ?? `${item.label} overview`}
                    </Link>

                    {item.columns.map((col) => (
                      <div key={col.label} className="mb-3 last:mb-0">
                        <Link
                          href={col.href}
                          onClick={onClose}
                          className="flex min-h-tap items-center text-eyebrow uppercase text-ink-500"
                        >
                          {col.label}
                        </Link>

                        <ul className="border-l-2 border-navy-100 pl-4">
                          {col.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className={cn(
                                  'flex min-h-tap items-center text-[0.9375rem] font-medium',
                                  pathname === link.href ? 'text-blue-600' : 'text-ink-700',
                                )}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sticky bottom-0 space-y-4 border-t border-navy-100 bg-white px-5 pb-8 pt-5 shadow-[0_-8px_24px_-12px_rgba(9,44,90,0.18)]">
          <Button href="/contact" size="lg" className="w-full" onClick={onClose}>
            Get a Free Quote Today
          </Button>

          <div className="space-y-2 text-sm">
            <a
              href={site.phoneHref}
              className="flex min-h-tap items-center gap-3 font-semibold text-navy-700"
            >
              <Phone className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              {site.phone}
            </a>
            <p className="flex items-start gap-3 py-2 text-ink-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              {addressLine}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

/** Which top-level nav section contains this path, if any. */
function sectionFor(pathname: string): string | null {
  return (
    mainNav.find((item) =>
      item.columns?.some(
        (col) => pathname.startsWith(col.href) || col.links.some((l) => pathname.startsWith(l.href)),
      ),
    )?.label ?? null
  );
}
