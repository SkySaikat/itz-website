'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import { cn } from '@/lib/cn';

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
  /** Headshots crop; client logos must not. */
  imageFit?: 'cover' | 'contain';
};

/**
 * Accessible quote carousel.
 *
 * All slides stay in the DOM (inert ones are `hidden`), so the quotes remain
 * crawlable and copy-pasteable rather than being mounted on demand. Keyboard:
 * arrow keys move between slides when the region has focus. No autoplay —
 * auto-advancing carousels are a known accessibility problem and this one sits
 * next to a CTA.
 */
export function TestimonialCarousel({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const liveRef = useRef<HTMLDivElement>(null);
  const count = testimonials.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const el = liveRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go, index]);

  return (
    <div
      ref={liveRef}
      className={cn('relative', className)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={-1}
      data-reveal="scale"
    >
      {testimonials.map((t, i) => (
        <figure
          key={t.name}
          hidden={i !== index}
          id={`${baseId}-slide-${i}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          className="grid gap-10 rounded-4xl border border-navy-100 bg-white p-8 shadow-card lg:grid-cols-12 lg:items-center lg:gap-8 xl:gap-14 lg:p-14"
        >
          <div className="min-w-0 lg:col-span-4">
            {/* Headshots are portrait (Bill's is 400x626), so a square frame
                lopped off his chin. Match the frame to the source ratio and
                nothing gets cropped. Logos stay in a circle, contained. */}
            <div
              className={cn(
                'relative mx-auto overflow-hidden lg:mx-0',
                t.imageFit === 'contain'
                  ? 'h-40 w-40 rounded-full bg-surface-muted lg:h-48 lg:w-48'
                  : 'aspect-[5/8] w-40 rounded-3xl ring-4 ring-blue-50 lg:w-full lg:max-w-[13.5rem]',
              )}
            >
              <Image
                src={t.image}
                alt={t.name}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 14rem, 10rem"
                className={
                  t.imageFit === 'contain' ? 'object-contain p-7' : 'object-cover object-center'
                }
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <Quote className="h-9 w-9 text-amber-400" aria-hidden="true" />
            <blockquote className="mt-5 text-xl font-semibold leading-relaxed text-navy-700 lg:text-2xl">
              {t.quote}
            </blockquote>
            <figcaption className="mt-8 border-t border-navy-100 pt-6">
              <p className="font-bold text-navy-700">{t.name}</p>
              <p className="text-sm text-ink-500">{t.role}</p>
            </figcaption>
          </div>
        </figure>
      ))}

      {count > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="inline-flex h-tap w-tap items-center justify-center rounded-full border-2 border-navy-100 text-navy-700 transition-colors hover:border-blue-300 hover:text-blue-600"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <ul className="flex items-center gap-1">
            {testimonials.map((t, i) => (
              <li key={t.name}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1}: ${t.name}`}
                  aria-current={i === index}
                  className="tap-target inline-flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={cn(
                      'block h-2.5 w-2.5 rounded-full transition-all',
                      i === index ? 'w-6 bg-blue-600' : 'bg-navy-200 hover:bg-navy-300',
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="inline-flex h-tap w-tap items-center justify-center rounded-full border-2 border-navy-100 text-navy-700 transition-colors hover:border-blue-300 hover:text-blue-600"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
