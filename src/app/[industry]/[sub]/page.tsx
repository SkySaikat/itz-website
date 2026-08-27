import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowRight, ChevronRight, CircleCheck } from 'lucide-react';

import { ContextBlock } from '@/components/sections/ContextBlock';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { industries, industryBySlug } from '@/lib/industries';
import { subIndustryExtras } from '@/lib/industry-content';
import { homepageServices } from '@/lib/services';
import { site } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.flatMap((industry) =>
    industry.children.map((child) => ({ industry: industry.slug, sub: child.slug })),
  );
}

function resolve(industrySlug: string, subSlug: string) {
  const industry = industryBySlug.get(industrySlug);
  const sub = industry?.children.find((c) => c.slug === subSlug);
  return industry && sub ? { industry, sub } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string; sub: string }>;
}): Promise<Metadata> {
  const { industry: i, sub: s } = await params;
  const found = resolve(i, s);
  if (!found) return {};

  const { industry, sub } = found;
  const image = `/images/industries/${industry.slug}-${sub.slug}.webp`;
  return {
    title: `${sub.name} Marketing`,
    description: sub.summary,
    alternates: { canonical: `/${industry.slug}/${sub.slug}` },
    openGraph: {
      title: `${sub.name} Marketing | ${site.name}`,
      description: sub.summary,
      url: `/${industry.slug}/${sub.slug}`,
      images: [{ url: image }],
    },
  };
}

const STEPS = [
  { phase: 'Week 1', title: 'Audit', body: (n: string) => `A full read of your current ${n} visibility: rankings, ad spend efficiency, tracking accuracy and the three competitors taking your calls.` },
  { phase: 'Weeks 2–3', title: 'Foundation', body: () => 'Tracking fixed first. There is no point optimising against numbers that are wrong, and most accounts we inherit have broken conversion tracking.' },
  { phase: 'Month 2+', title: 'Compound', body: () => 'SEO and content build the base while paid covers the gap. As organic rankings climb, paid spend gets reallocated rather than increased.' },
  { phase: 'Ongoing', title: 'Report on jobs', body: () => 'Monthly reporting on booked work, not impressions. If the number is not moving, we say so and change the plan.' },
];

export default async function SubIndustryPage({
  params,
}: {
  params: Promise<{ industry: string; sub: string }>;
}) {
  const { industry: i, sub: s } = await params;
  const found = resolve(i, s);
  if (!found) notFound();

  const { industry, sub } = found;
  const siblings = industry.children.filter((c) => c.slug !== sub.slug);
  const image = `/images/industries/${industry.slug}-${sub.slug}.webp`;
  const lower = sub.name.toLowerCase();
  const subExtra = subIndustryExtras[sub.slug];
  const steps = STEPS.map((s) => ({ phase: s.phase, title: s.title, body: s.body(lower) }));

  return (
    <>
      {/* ── Hero: full-bleed photo band with an overlaid copy card ───────── */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-800/60" />
          <div aria-hidden="true" className="absolute right-0 top-0 hidden h-64 w-64 bg-dot-grid bg-dots text-blue-300/20 lg:block" />
        </div>

        <div className="on-dark container relative py-16 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-1 text-sm text-navy-200">
              {[
                { label: 'Home', href: '/' },
                { label: 'Who We Serve', href: '/who-we-serve' },
                { label: industry.name, href: `/${industry.slug}` },
              ].map((c) => (
                <li key={c.href} className="flex items-center gap-1">
                  <Link href={c.href} className="tap-target inline-flex min-h-[2rem] items-center rounded px-1 hover:text-white">
                    {c.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-navy-300" aria-hidden="true" />
                </li>
              ))}
              <li>
                <span aria-current="page" className="px-1 font-medium text-white">{sub.name}</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-2xl" data-reveal="left">
            <p className="eyebrow-script mb-3 text-amber-400">{sub.name} marketing</p>
            <h1 className="text-display-lg text-white">{sub.headline}</h1>
            <p className="mt-6 max-w-prose text-body-lg text-navy-100">{sub.summary}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="onDark" size="lg">Get a Free Quote</Button>
              <Button href={site.phoneHref} variant="outlineOnDark" size="lg">{site.phone}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem / fix, as two visually opposed columns ───────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
          <div className="min-w-0 lg:col-span-5" data-reveal="left">
            <p className="eyebrow-caps">The problem</p>
            <h2 className="mt-3 text-display-sm text-navy-700">What usually goes wrong</h2>
            <p className="mt-4 text-ink-600">
              These are the problems we see most often in {lower} accounts before we take them over.
            </p>

            <ul className="mt-8 space-y-4">
              {sub.painPoints.map((point, idx) => (
                <li
                  key={point}
                  className="flex gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-5"
                  data-reveal
                  data-reveal-delay={idx}
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                  <span className="text-[0.9375rem] leading-relaxed text-ink-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical timeline rather than another card grid. */}
          <div className="min-w-0 lg:col-span-7" data-reveal="right">
            <p className="eyebrow-caps">The fix</p>
            <h2 className="mt-3 text-display-sm text-navy-700">How the engagement runs</h2>
            <ProcessTimeline steps={steps} className="mt-9" />
          </div>
        </div>
      </Section>

      {/* ── Niche context ────────────────────────────────────────────────── */}
      {sub.context || subExtra ? (
        <ContextBlock
          eyebrow="The niche"
          title={`What makes ${lower} different`}
          paragraphs={[
            ...(sub.context ? [sub.context] : []),
            ...(subExtra?.expandedContext ?? []),
          ]}
          tone="muted"
        />
      ) : null}

      {/* ── What a well-run account has in place ─────────────────────────── */}
      {subExtra ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
            <div className="min-w-0 lg:col-span-5">
              <SectionHeading
                eyebrow="The checklist"
                title={`What a well-run ${lower} account has in place`}
                intro="If you are already working with an agency, this is a useful list to hold them to. If you are not, it is what we build first."
              />
            </div>
            <div className="min-w-0 lg:col-span-7" data-reveal="right">
              <ul className="space-y-1 rounded-4xl bg-blue-50/70 p-7 sm:p-9">
                {subExtra.checklist.map((item, i) => (
                  <li key={item} className="flex gap-4 py-3" data-reveal data-reveal-delay={i}>
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                    <span className="text-[0.9375rem] leading-relaxed text-ink-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ── Channels ────────────────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Channels"
          title={`What we typically run for ${lower}`}
          action={<Button href="/services" variant="secondary">All services</Button>}
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homepageServices.slice(0, 3).map((service, idx) => (
            <li key={service.slug} data-reveal data-reveal-delay={idx}>
              <article className="group relative flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                  <Image src={service.icon} alt="" width={30} height={30} className="h-[1.875rem] w-[1.875rem]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-700">
                  <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {service.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">{service.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      {sub.faqs ? (
        <FaqSection
          faqs={sub.faqs}
          path={`/${industry.slug}/${sub.slug}`}
          title={`${sub.name}: common questions`}
          tone="white"
        />
      ) : null}

      <div className="py-section lg:py-section-lg" data-reveal="scale">
        <CtaBanner
          title={`Let's talk about your ${lower} pipeline`}
          highlight="pipeline"
          body="Free audit, no obligation, and you keep the findings whether you work with us or not."
        />
      </div>

      {siblings.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Related" title={`More in ${industry.name}`} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((sibling, idx) => (
              <li key={sibling.slug} data-reveal data-reveal-delay={idx}>
                <Link
                  href={`/${industry.slug}/${sibling.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover"
                >
                  <div className="media-zoom relative aspect-[3/2] overflow-hidden bg-navy-50">
                    <Image
                      src={`/images/industries/${industry.slug}-${sibling.slug}.webp`}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 23vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="p-5 font-bold text-navy-700 group-hover:text-blue-600">{sibling.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
