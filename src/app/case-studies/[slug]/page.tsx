import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SplitHero } from '@/components/ui/SplitHero';
import { caseStudies } from '@/lib/case-studies';
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

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-4" data-reveal="left">
            <dl className="space-y-6 rounded-3xl border border-navy-100 bg-surface-muted p-8">
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
                        className="inline-flex min-h-tap items-center rounded-pill bg-white px-4 text-sm font-semibold text-blue-600 shadow-ring transition-colors hover:bg-blue-50"
                      >
                        {channel}
                      </Link>
                    ) : (
                      <span
                        key={channel}
                        className="inline-flex min-h-tap items-center rounded-pill bg-white px-4 text-sm font-semibold text-ink-600 shadow-ring"
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
            <h2 className="text-display-sm text-navy-700">The engagement</h2>
            <div className="prose prose-brand mt-6">
              <p>{study.summary}</p>
              <p>
                Work ran across {listChannels(study.channels)}. As with every engagement, the
                account, analytics and creative assets stayed in {study.client}&rsquo;s name
                throughout, and reporting was on booked outcomes rather than impressions.
              </p>
            </div>

            {/* Deliberately no metrics: the numbers for these campaigns were not
                in the content export, and inventing them is not an option. */}
            <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50/70 p-7">
              <h3 className="font-bold text-navy-700">Detailed results available on request</h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-700">
                Campaign-level figures for this engagement aren&rsquo;t published here. Ask us on a
                call and we&rsquo;ll walk you through what was measured and what it produced.
              </p>
              <Button href="/contact" variant="secondary" className="mt-5">
                Request the numbers
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="pb-section lg:pb-section-lg" data-reveal="scale">
        <CtaBanner
          title="Want results like these in your market?"
          highlight="your market"
          body="Start with a free audit. You'll get the findings whether or not you decide to work with us."
        />
      </div>

      {others.length > 0 ? (
        <Section tone="muted">
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

function listChannels(channels: string[]) {
  if (channels.length <= 1) return channels[0] ?? 'a single channel';
  return `${channels.slice(0, -1).join(', ')} and ${channels[channels.length - 1]}`;
}
