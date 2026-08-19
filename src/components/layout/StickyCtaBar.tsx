'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquareText, Phone } from 'lucide-react';

import { cn } from '@/lib/cn';
import { site } from '@/lib/site';

/**
 * Sticky mobile conversion bar.
 *
 * Appears once the hero CTA has scrolled out of view, so it never competes
 * with the primary above-the-fold call to action. Mobile only — desktop keeps
 * the header CTA in view already.
 *
 * Adds bottom padding to <body> while visible so the footer cannot end up
 * underneath it.
 */
export function StickyCtaBar({ label = 'Get Free Quote' }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const cls = 'has-sticky-cta';
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 lg:hidden',
        'border-t border-navy-100 bg-white/95 backdrop-blur-md',
        'shadow-[0_-8px_24px_-12px_rgba(9,44,90,0.25)]',
        'transition-transform duration-300 ease-out',
        'pb-[env(safe-area-inset-bottom)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex items-stretch gap-3 px-4 py-3">
        <a
          href={site.phoneHref}
          className={cn(
            'inline-flex min-h-tap flex-1 items-center justify-center gap-2 rounded-pill',
            'border-2 border-blue-600 px-4 font-bold text-blue-600',
            'transition-colors active:bg-blue-50',
          )}
        >
          <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          Call Now
        </a>

        <Link
          href="/contact"
          className={cn(
            'inline-flex min-h-tap flex-1 items-center justify-center gap-2 rounded-pill',
            'bg-gradient-cta px-4 font-bold text-white shadow-cta',
            'transition-all active:brightness-95',
          )}
        >
          <MessageSquareText className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          {label}
        </Link>
      </div>
    </div>
  );
}
