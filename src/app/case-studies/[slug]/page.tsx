import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SplitHero } from '@/components/ui/SplitHero';
import { caseStudies, caseStudyFaqs } from '@/lib/case-studies';
import { services } from '@/lib/services';
import { site } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

const bySlug = new Map(caseStudies.map((c) => [c.slug, c]));

/** Channel display names → the service pages they correspond to. */
const serviceForChannel = (channel: string) =>
  services.find((s) => s.name === channel || s.navLabel === channel);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = bySlug.get(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: `${study.title} | ${site.name}`,
      description: study.summary,
      url: `/case-studies/${study.slug}`,
      images: [{ url: `/images/industries/${study.image}.webp` }],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = bySlug.get(slug);
  if (!study) notFound();

  const others = caseStudies.filter((c) => c.slug !== study.slug).slice(0, 3);
  const hasMetrics = Boolean(study.metrics && study.metrics.length > 0);

  const sections = [
    { label: 'The challenge', body: study.challenge },
    { label: 'The strategy', body: study.strategy },
    { label: 'The results', body: study.results },
  ].filter((s): s is { label: string; body: string } => Boolean(s.body));

  const graph = {
    '@context': 'https://schema.org' as const,
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${site.url}/case-studies/${study.slug}#article`,
        headline: study.title,
        description: study.summary,
        about: study.industry,
        author: { '@id': `${site.url}/#organization` },
        publisher: { '@id': `${site.url}/#organization` },
        url: `${site.url}/case-studies/${study.slug}`,
      },
    ],
  };

  return (
    <>
      <SplitHero
        eyebrow={study.industry}
        title={study.title}
        intro={study.summary}
        image={`/images/industries/${study.image}.webp`}
        imageAlt=""
        fit="cover"
        crumbs={[{ label: 'Case Studies', href: '/case-studies' }, { label: study.client }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Get a Free Quote
          </Button>
          <Button href="/case-studies" variant="ghost" size="lg">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All case studies
          </Button>
        </div>
      </SplitHero>

      {/* ── Metrics band — only when real, verified numbers exist ────────── */}
      {hasMetrics ? (
        <Section>
          <ul className="grid gap-6 sm:grid-cols-3">
            {study.metrics!.map((m) => (
              <li
                key={m.label}
                className="rounded-[1.75rem] border border-navy-100 bg-white p-8 text-center shadow-card"
                data-reveal
              >
                <p className="text-3xl font-extrabold tracking-tight text-blue-600">{m.value}</p>
                <p className="mt-2 text-sm leading-snug text-ink-600">{m.label}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Client / channels panel + Challenge / Strategy / Results ─────── */}
      <Section tone={hasMetrics ? 'muted' : 'white'}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-4" data-reveal="left">
            <dl className="space-y-6 rounded-[1.75rem] border border-navy-100 bg-white p-8 shadow-card">
              <div>
                <dt className="text-eyebrow uppercase text-ink-500">Client</dt>
                <dd className="mt-1 text-lg font-bold text-navy-700">{study.client}</dd>
              </div>
              <div>
                <dt className="text-eyebrow uppercase text-ink-500">Industry</dt>
                <dd className="mt-1 font-semibold text-navy-700">{study.industry}</dd>
              </div>
              <div>
                <dt className="text-eyebrow uppercase text-ink-500">Channels</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {study.channels.map((channel) => {
                    const service = serviceForChannel(channel);
                    return service ? (
                      <Link
                        key={channel}
                        href={`/services/${service.slug}`}
                        className="inline-flex min-h-tap items-center rounded-pill bg-surface-muted px-4 text-sm font-semibold text-blue-600 shadow-ring transition-colors hover:bg-blue-50"
                      >
                        {channel}
                      </Link>
                    ) : (
                      <span
                        key={channel}
                        className="inline-flex min-h-tap items-center rounded-pill bg-surface-muted px-4 text-sm font-semibold text-ink-600 shadow-ring"
                      >
                        {channel}
                      </span>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-8" data-reveal="right">
            {sections.length > 0 ? (
              <div className="space-y-10">
                {sections.map((s) => (
                  <div key={s.label}>
                    <p className="text-eyebrow uppercase text-blue-600">{s.label}</p>
                    <p className="mt-3 text-body-lg leading-relaxed text-ink-600">{s.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h2 className="text-display-sm text-navy-700">The engagement</h2>
                <p className="mt-6 text-body-lg leading-relaxed text-ink-600">{study.summary}</p>
              </>
            )}

            {!hasMetrics ? (
              <div className="mt-10 rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-7">
                <h3 className="font-bold text-navy-700">Detailed results available on request</h3>
                <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-700">
                  Campaign-level figures for this engagement aren&rsquo;t published here. Ask us on a
                  call and we&rsquo;ll walk you through what was measured and what it produced.
                </p>
                <Button href="/contact" variant="secondary" className="mt-5">
                  Request the numbers
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      <FaqSection
        faqs={[...(study.faqs ?? []), ...caseStudyFaqs]}
        path={`/case-studies/${study.slug}`}
        title="Common questions about this case study"
        tone={hasMetrics ? 'white' : 'muted'}
      />

      <div className="py-section lg:py-section-lg" data-reveal="scale">
        <CtaBanner
          title="Want results like these in your market?"
          highlight="your market"
          body="Start with a free audit. You'll get the findings whether or not you decide to work with us."
        />
      </div>

      {others.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="More work" title="Other case studies" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <li key={other.slug} data-reveal data-reveal-delay={i}>
                <Link
                  href={`/case-studies/${other.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover"
                >
                  <div className="media-zoom relative aspect-[16/9] overflow-hidden bg-navy-50">
                    <Image
                      src={`/images/industries/${other.image}.webp`}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 30vw, 45vw"
                      className="object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-eyebrow uppercase text-blue-600">{other.industry}</p>
                    <p className="mt-2 font-bold leading-snug text-navy-700 group-hover:text-blue-600">
                      {other.title}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                      Read
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd data={graph} />
    </>
  );
}
