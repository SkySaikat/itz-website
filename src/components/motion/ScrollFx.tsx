'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One controller for every scroll effect on the page.
 *
 * Pages stay server components — they just mark up elements with data
 * attributes and this picks them up:
 *
 *   data-reveal            fade + rise into view, once
 *   data-reveal-delay="2"  stagger step (x60ms), for grids
 *   data-count="38"        count up to 38 when scrolled into view
 *   data-count-prefix="+"  / data-count-suffix="%"
 *
 * The hidden-before-reveal state lives in CSS under `html.js`, which is set by
 * an inline script in the document head. So if JS never runs, nothing is ever
 * hidden — content renders normally rather than staying invisible.
 *
 * Everything here no-ops under prefers-reduced-motion.
 */
export function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        el.textContent = format(el, Number(el.dataset.count));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);

          if (el.hasAttribute('data-count')) {
            countUp(el);
          } else {
            const step = Number(el.dataset.revealDelay ?? 0);
            el.style.transitionDelay = `${Math.min(step, 8) * 60}ms`;
            el.classList.add('is-visible');
          }
        }
      },
      // Trigger slightly before the element is fully on screen so the motion
      // finishes about when the user's eye arrives.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    const scan = () => {
      document
        .querySelectorAll('[data-reveal]:not(.is-visible), [data-count]:not([data-counted])')
        .forEach((el) => observer.observe(el));
    };

    scan();
    // Content that mounts after hydration (accordion panels, filtered grids).
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}

function format(el: HTMLElement, value: number) {
  const { countPrefix = '', countSuffix = '' } = el.dataset;
  return `${countPrefix}${value.toLocaleString('en-US')}${countSuffix}`;
}

function countUp(el: HTMLElement) {
  el.setAttribute('data-counted', '');
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;

  const duration = 1100;
  const start = performance.now();

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutExpo — fast start, settles gently on the final figure
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = format(el, Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
