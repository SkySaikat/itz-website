import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MapPin, Phone, Star } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { StickyCtaBar } from '@/components/layout/StickyCtaBar';
import { FaqSection } from '@/components/sections/FaqSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { LinkCard } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import {
  getServiceLocation,
  serviceLocationParams,
  siblingCities,
  siblingServices,
} from '@/lib/geo';
import { buildGeoPageGraph } from '@/lib/schema';
import { site } from '@/lib/site';

/**
 * Programmatic geo-landing pages: /services/[service]/[city].
 *
 * Only service x city pairs with real localized content in the dataset are
 * generated. `dynamicParams = false` makes every other combination a 404
 * rather than a thin auto-filled page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceLocationParams;
}

type Params = { params: Promise<{ service: string; city: string }> };

function seo(resolved: NonNullable<ReturnType<typeof getServiceLocation>>) {
  const { service, city, cityState, content } = resolved;
  return {
    title: content.headline ?? `${service.name} in ${cityState}`,
    description: `${service.tagline} for ${city.name} businesses. ${content.intro.slice(0, 110)}…`,
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { service, city } = await params;
  const resolved = getServiceLocation(service, city);
  if (!resolved) return {};

  const { title, description } = seo(resolved);

  return {
    title,
    description,
    alternates: { canonical: resolved.path },
    openGraph: {
      type: 'website',
      title: `${title} | ${site.name}`,
      description,
      url: resolved.path,
    },
    other: {
      // Legacy geo meta. Ignored by Google but still read by some local
      // directory crawlers that scrape agency pages.
      'geo.region': `US-${resolved.city.stateCode}`,
      'geo.placename': resolved.city.name,
      'geo.position': `${resolved.city.geo.lat};${resolved.city.geo.lng}`,
    },
  };
}

export default async function ServiceCityPage({ params }: Params) {
  const { service: serviceSlug, city: citySlug } = await params;
  const resolved = getServiceLocation(serviceSlug, citySlug);
  if (!resolved) notFound();

  const { service, city, content, cityState, cityStateLong, path } = resolved;
  const otherCities = siblingCities(serviceSlug, citySlug);
  const otherServices = siblingServices(serviceSlug, citySlug);
  const graph = buildGeoPageGraph(resolved, seo(resolved));

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-gradient-navy pb-16 pt-10 lg:pb-24 lg:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-0 h-72 w-72 bg-dot-grid bg-dots text-blue-400/25"
        />
        <div
          aria-hidden="true"
          className="drift pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />

        <div className="container relative">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-1 text-sm text-navy-200">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: service.name, href: `/services/${service.slug}` },
              ].map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  <Link
                    href={crumb.href}
                    className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true" className="text-navy-300">
                    /
                  </span>
                </li>
              ))}
              <li>
                <span aria-current="page" className="px-1 font-medium text-white">
                  {city.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <div className="min-w-0 lg:col-span-7" data-reveal="left">
              <p className="eyebrow-script mb-3 text-amber-400">
                {service.navLabel ?? service.name} &middot; {cityState}
              </p>

              <h1 className="text-display-lg text-white">
                {content.headline ?? (
                  <>
                    Top-Rated {service.name} in{' '}
                    <span className="whitespace-nowrap">{cityStateLong}</span>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-prose text-body-lg text-navy-100">{content.intro}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="onDark" size="lg">
                  Get a Free {city.name} Audit
                </Button>
                <Button href={site.phoneHref} variant="outlineOnDark" size="lg">
                  <Phone className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  {site.phone}
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-[1.125rem] w-[1.125rem] fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <p className="text-sm text-navy-200">
                  <span className="font-bold text-white">{site.rating.value}</span> average rating
                  &middot; {site.rating.count}+ businesses served
                </p>
              </div>
            </div>

            {/* Hero stat band */}
            <div className="min-w-0 lg:col-span-5" data-reveal="right">
              <dl className="grid gap-4 rounded-4xl border border-white/15 bg-white/5 p-7 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-1">
                {content.stats.map((stat) => (
                  <div key={stat.label} className="lg:flex lg:items-baseline lg:gap-4">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="contents">
                      <span className="block text-3xl font-extrabold tracking-tight text-amber-400 lg:w-28 lg:shrink-0">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-sm leading-snug text-navy-100 lg:mt-0">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Localized trust ──────────────────────────────────────────────── */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow-script mb-3">Local coverage</p>

            <h2 className="text-display-md text-navy-700">
              Serving {city.name} and surrounding neighborhoods
            </h2>

            <p className="mt-5 max-w-prose text-body-lg text-ink-600">{city.marketNote}</p>

            <dl className="mt-8 space-y-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <div>
                  <dt className="font-bold text-navy-700">Service radius</dt>
                  <dd className="text-[0.9375rem] text-ink-600">
                    {city.serviceRadiusMiles} miles around {city.name}, covering{' '}
                    {city.county}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                <div>
                  <dt className="font-bold text-navy-700">Local response</dt>
                  <dd className="text-[0.9375rem] text-ink-600">
                    Calls answered by a person, Monday&ndash;Friday
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <h3 className="text-eyebrow uppercase text-ink-500">
              {city.name} areas we work in
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {city.neighborhoods.map((n) => (
                <li
                  key={n}
                  className="rounded-pill border border-navy-100 bg-white px-4 py-2 text-sm font-semibold text-navy-700 shadow-ring"
                >
                  {n}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-eyebrow uppercase text-ink-500">Nearby</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {city.nearbyCities.map((n) => (
                <li
                  key={n.name}
                  className="rounded-pill bg-white px-4 py-2 text-sm text-ink-600 shadow-ring"
                >
                  {n.name}{' '}
                  <span className="text-ink-400">&middot; {n.driveMinutes} min</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-3xl border border-navy-100 bg-white p-7 shadow-card">
              <h3 className="text-lg font-bold text-navy-700">
                What makes {city.name} different
              </h3>
              <ul className="mt-5 space-y-3">
                {content.localFactors.map((factor) => (
                  <li key={factor} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-ink-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ── What's included ──────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
              <Image src={service.icon} alt="" width={36} height={36} className="h-9 w-9" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-display-sm text-navy-700">
              What your {city.name} {service.navLabel ?? service.name} engagement includes
            </h2>
            <ul className="mt-7 space-y-4">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <h2 className="text-display-sm text-navy-700">How the engagement runs</h2>
            <ol className="mt-8 space-y-6">
              {service.deliverables.map((item, i) => (
                <li key={item.title} className="relative rounded-3xl border border-navy-100 bg-white p-7 shadow-card">
                  <span className="absolute -top-3 left-7 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-gradient-cta px-2.5 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-navy-700">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ── FAQ. Schema comes from the page graph below, not FaqSection. ─── */}
      <FaqSection
        faqs={content.faqs}
        path={path}
        title={`${service.navLabel ?? service.name} in ${city.name}: common questions`}
        intro={`The things ${city.name} business owners ask us most often before starting.`}
        tone="muted"
        emitSchema={false}
      />

      <Testimonials />

      {/* ── Internal linking ─────────────────────────────────────────────── */}
      {(otherCities.length > 0 || otherServices.length > 0) && (
        <Section>
          {otherCities.length > 0 && (
            <>
              <SectionHeading
                eyebrow="Other markets"
                title={`${service.name} in other cities`}
              />
              <ul className="mt-10 flex flex-wrap gap-3">
                {otherCities.map((c) => (
                  <li key={c.slug}>
                    <Button href={`/services/${service.slug}/${c.slug}`} variant="ghost">
                      {c.name}, {c.stateCode}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {otherServices.length > 0 && (
            <div className={otherCities.length > 0 ? 'mt-16' : undefined}>
              <SectionHeading
                eyebrow="Also in this market"
                title={`Other services we run in ${city.name}`}
              />
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {otherServices.map((s) => (
                  <li key={s.slug}>
                    <LinkCard
                      href={`/services/${s.slug}/${city.slug}`}
                      title={`${s.name} in ${city.name}`}
                      body={s.tagline}
                      className="h-full"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      <div className="pb-section lg:pb-section-lg">
        <CtaBanner
          title={`Ready to grow your ${city.name} business?`}
          highlight={city.name}
          body={`Free audit of your current ${city.name} visibility, your local competitors, and the gap between them. No obligation.`}
        />
      </div>

      <StickyCtaBar label="Free Quote" />
      <JsonLd data={graph} />
    </>
  );
}
