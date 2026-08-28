import Image from 'next/image';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <section className="mesh relative overflow-hidden bg-white pb-16 pt-12 lg:pb-28 lg:pt-20">
      {/* Ambient colour behind the collage — drifting so the hero has life. */}
      <div
        aria-hidden="true"
        className="drift accent-orb right-0 top-0 h-[38rem] w-[52rem] translate-x-1/4 -translate-y-1/4 bg-blue-200/45"
      />
      <div
        aria-hidden="true"
        className="drift-slow accent-orb -left-40 bottom-0 h-[26rem] w-[26rem] bg-amber-200/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 hidden h-56 w-56 -translate-x-[36rem] bg-dot-grid bg-dots text-blue-300/45 xl:block"
      />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-6 xl:col-span-6" data-reveal="left">
            <p className="eyebrow-script mb-4 text-lg">Small business marketing</p>

            <h1 className="text-display-2xl text-navy-700">
              Premium Small Business{' '}
              <span className="relative whitespace-nowrap">
                <span className="text-gradient">Marketing</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-amber-400"
                >
                  <path
                    d="M2 8c60-5 130-7 296-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Agency
            </h1>

            <p className="mt-7 max-w-prose text-body-xl text-ink-600">
              Don&rsquo;t struggle to grow your customer base on your own. Two decades running SEO,
              paid ads and web design for law firms, medical practices, real estate teams, schools,
              auto shops and home-services companies — measured on booked work, not impressions.
            </p>

            {/* Two CTAs: the original had one. A secondary path stops the
                "not ready to talk to sales" visitor from bouncing. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="xl">
                Get a Free Quote Today
              </Button>
              <Button href="/case-studies" variant="ghost" size="xl">
                See Our Results
              </Button>
            </div>

            <div className="mt-9 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-pill glass px-5 py-3">
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-[1.125rem] w-[1.125rem] fill-amber-400 text-amber-400" />
                ))}
              </span>
              <p className="text-sm font-medium text-ink-600">
                <span className="font-bold text-navy-700">{site.rating.value}</span> average rating
                &middot; {site.rating.count}+ businesses served
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6 xl:col-span-6" data-reveal="right">
            <div className="relative">
              <Image
                src="/images/hero-collage.webp"
                alt="A lawyer, a real estate agent and a doctor reviewing campaign results on tablets"
                width={1200}
                height={1159}
                priority
                sizes="(min-width: 1280px) 680px, (min-width: 1024px) 52vw, 100vw"
                className="relative z-10 h-auto w-full max-w-2xl lg:ml-auto"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-6 bottom-6 z-0 h-40 rounded-[3rem] bg-blue-500/10 blur-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
