'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react';

import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { mainNav, type NavItem } from '@/lib/nav';
import { site } from '@/lib/site';

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Any navigation closes everything. Adjusted during render rather than in an
  // effect — the effect form causes a second render pass with the menu still
  // open (React's "adjusting state when a prop changes" pattern).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Swap to the solid, shadowed header once the hero starts scrolling away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the open dropdown and returns focus to its trigger.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        navRef.current?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu]);

  // Clicking or tabbing outside the nav closes the dropdown.
  useEffect(() => {
    if (!openMenu) return;
    const onOutside = (e: Event) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [openMenu]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Hover intent: a short grace period so diagonal travel from the trigger to
  // the panel does not dismiss the menu mid-move.
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const isActive = (item: NavItem) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href) || isChildActive(item, pathname);

  return (
    <>
      <a
        href="#main"
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]',
          'focus:inline-flex focus:min-h-tap focus:items-center focus:rounded-pill',
          'focus:bg-navy-700 focus:px-6 focus:font-semibold focus:text-white',
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300 supports-[backdrop-filter]:bg-white/70',
          'bg-white/95 backdrop-blur-lg backdrop-saturate-150',
          scrolled
            ? 'border-b border-navy-100 shadow-card'
            : 'border-b border-navy-100/40',
        )}
      >
        <div className="container flex h-[var(--header-height)] items-center justify-between gap-4">
          <Logo priority className="shrink-0" />

          {/* ---------------- Desktop nav ---------------- */}
          <nav ref={navRef} aria-label="Main" className="hidden lg:flex lg:items-center lg:gap-1">
            {mainNav.map((item) =>
              item.columns ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    data-menu-trigger={item.label}
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    className={cn(
                      'inline-flex min-h-tap items-center gap-1.5 rounded-xl px-4 text-[0.9375rem] font-bold',
                      'transition-colors duration-200',
                      isActive(item) || openMenu === item.label
                        ? 'text-blue-600'
                        : 'text-navy-700 hover:text-blue-600',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        openMenu === item.label && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {openMenu === item.label ? <MegaMenu item={item} pathname={pathname} /> : null}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'inline-flex min-h-tap items-center rounded-xl px-4 text-[0.9375rem] font-bold transition-colors duration-200',
                    isActive(item) ? 'text-blue-600' : 'text-navy-700 hover:text-blue-600',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* ---------------- Desktop actions ---------------- */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={site.phoneHref}
              className="inline-flex min-h-tap items-center gap-2 rounded-xl px-3 text-[0.9375rem] font-bold text-navy-700 transition-colors hover:text-blue-600"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Call us on </span>
              {site.phone}
            </a>
            <Button href="/contact">Get a Free Quote</Button>
          </div>

          {/* ---------------- Mobile actions ---------------- */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.name} on ${site.phone}`}
              className="inline-flex h-tap w-tap items-center justify-center rounded-xl text-navy-700 transition-colors hover:bg-navy-50 hover:text-blue-600 active:bg-navy-100"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-tap w-tap items-center justify-center rounded-xl text-navy-700 transition-colors hover:bg-navy-50 active:bg-navy-100"
            >
              {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </>
  );
}

function isChildActive(item: NavItem, pathname: string) {
  return (
    item.columns?.some(
      (col) => pathname.startsWith(col.href) || col.links.some((l) => pathname.startsWith(l.href)),
    ) ?? false
  );
}

function MegaMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const wide = (item.columns?.length ?? 0) > 2;

  return (
    <div
      className={cn(
        'z-50 -translate-x-1/2 pt-3',
        // Wide panels are centred on the viewport, not on their trigger:
        // anchoring a 72rem panel to a trigger sitting 418px from the left
        // pushed it ~160px off-screen.
        wide
          ? 'fixed left-1/2 top-[var(--header-height)] w-[min(72rem,calc(100vw-3rem))]'
          : 'absolute left-1/2 top-full w-[26rem]',
      )}
    >
      <div className="animate-slide-down overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card-hover">
        <div className={cn('grid gap-x-8 gap-y-6 p-7', wide ? 'grid-cols-5' : 'grid-cols-1')}>
          {item.columns!.map((col) => (
            <div key={col.label}>
              <Link
                href={col.href}
                className="mb-3 inline-flex min-h-[2rem] items-center text-eyebrow uppercase text-blue-600 transition-colors hover:text-blue-700"
              >
                {col.label}
              </Link>

              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors',
                        pathname === link.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-ink-700 hover:bg-navy-50 hover:text-navy-700',
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

        {item.blurb && item.seeAllLabel ? (
          <div className="flex flex-col gap-4 border-t border-navy-100 bg-surface-muted px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-ink-600">{item.blurb}</p>
            <Link
              href={item.href}
              className="inline-flex min-h-tap shrink-0 items-center gap-2 rounded-pill bg-white px-5 text-sm font-bold text-blue-600 shadow-ring transition-colors hover:bg-blue-50"
            >
              {item.seeAllLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
