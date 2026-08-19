import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ClientLogos } from '@/components/sections/ClientLogos';
import { ContextBlock } from '@/components/sections/ContextBlock';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { PerksBand } from '@/components/sections/PerksBand';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { about } from '@/lib/about-content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Two decades running SEO, paid ads and web design for more than 500 small businesses. Meet the strategic consulting partner behind the campaigns.',
  alternates: { canonical: '/about-us' },
};

const values = [
  {
    title: 'We report on jobs, not impressions',
    body: 'Impressions and clicks are inputs. The only number that settles an argument is how many people called and how many of those became work. Every report we send leads with that.',
  },
  {
    title: 'You own everything',
    body: 'Your ad accounts, your analytics, your website, your data. If you leave, you leave with all of it. Agencies that hold the accounts hostage are solving their retention problem, not yours.',
  },
  {
    title: 'We say no to channels that will not work',
    body: 'Not every business needs TikTok, and some should not run display at all. Telling you that costs us revenue in the short term and keeps you as a client in the long term.',
  },
  {
    title: 'Specialisation over volume',
    body: 'Five industries, learned properly. We would rather know how a criminal defense intake actually works than run a hundred generic accounts.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our mission"
        title="We exist to empower businesses as a strategic consulting partner"
        intro="We achieve this by delivering clear, insightful guidance on digital marketing strategies and products that drive online presence and measurable growth."
        crumbs={[{ label: 'About Us' }]}
      >
        <Button href="/contact" variant="onDark" size="lg">
          Work With Us
        </Button>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow-script mb-3">Our story</p>
            <h2 className="text-display-md text-navy-700">
              {site.yearsInBusiness} years of local campaigns, {site.rating.count}+ businesses
            </h2>
          </div>

          <div className="space-y-5 text-body-lg text-ink-600 min-w-0 lg:col-span-7" data-reveal="right">
            <p>
              ITZ Digital started because local businesses kept getting sold enterprise marketing at
              a small business price — big retainers, big dashboards, and no clear answer to
              &ldquo;did the phone ring more?&rdquo;
            </p>
            <p>
              Two decades later we run SEO, paid search, paid social, programmatic and website work
              for law firms, medical practices, real estate teams, schools and auto shops across the
              United States. The through-line has not changed: local search results differ block by
              block, not just city by city, and the agency that understands your specific market
              beats the agency with the bigger media buying desk.
            </p>
            <p>
              Unlike a single ad campaign that stops the moment you stop paying for it, local SEO
              and a well-optimised Google Business Profile keep working month after month. Clients
              across our five core industries typically see cost per lead fall as organic rankings
              climb, because free organic traffic starts doing the work that paid clicks used to.
            </p>
          </div>
        </div>
      </Section>

      {/* Photo band — breaks up an otherwise all-type page and shows the
          industries rather than just naming them. */}
      <section aria-label="Industries we serve" className="bg-white pb-4">
        <div className="container">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { slug: 'lawyers', label: 'Legal', img: 'lawyers-criminal-defense' },
              { slug: 'medical', label: 'Medical', img: 'medical-dentists' },
              { slug: 'real-estate', label: 'Real Estate', img: 'real-estate-realtor' },
              { slug: 'education', label: 'Education', img: 'education-universities' },
              { slug: 'automotive', label: 'Automotive', img: 'automotive-auto-repair' },
            ].map((it, i) => (
              <li key={it.slug} data-reveal data-reveal-delay={i}>
                <Link
                  href={`/${it.slug}`}
                  className="group relative block overflow-hidden rounded-3xl shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                >
                  <div className="media-zoom relative aspect-[3/4] bg-navy-100">
                    <Image
                      src={`/images/industries/${it.img}.webp`}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 18vw, 45vw"
                      className="object-cover"
                      aria-hidden="true"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent"
                    />
                  </div>
                  <span className="absolute inset-x-4 bottom-4 text-lg font-bold text-white">
                    {it.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Stats />

      <ContextBlock
        eyebrow="Our mission"
        title={renderHighlight(about.missionHeadline, about.missionHighlight)}
        paragraphs={about.missionBody}
        tone="muted"
      />

      <PerksBand
        eyebrow="Why us"
        title="Some of the perks of working with us"
        perks={about.perks}
        cta={{ label: 'Get a Free Quote', href: '/contact' }}
      >
        <p>
          None of these are hard to promise. They are just uncommon enough to be
          worth writing down.
        </p>
      </PerksBand>

      <div className="pb-section lg:pb-section-lg" data-reveal="scale">
        <CtaBanner
          title="Ready to see what your market actually looks like?"
          highlight="your market"
          body="A free audit, and an honest answer about whether we're the right agency for you."
        />
      </div>

      <ContextBlock
        eyebrow="What we do"
        title={renderHighlight(about.whatWeDoHeadline, about.whatWeDoHighlight)}
        paragraphs={[about.whatWeDoBody]}
      />

      <div className="container -mt-8 pb-section lg:pb-section-lg" data-reveal>
        <Button href="/services" variant="secondary" size="lg">
          Explore Our Services
        </Button>
      </div>

      <Section tone="muted">
        <SectionHeading
          eyebrow="How we work"
          title="Four commitments we will not trade away"
          intro="These are the things clients tell us made the difference, and the things we turn down work over."
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {values.map((value, i) => (
            <li key={value.title} data-reveal data-reveal-delay={i}>
              <article className="h-full rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
                <span className="text-eyebrow uppercase text-blue-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug text-navy-700">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-600">{value.body}</p>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <ClientLogos />
      <Testimonials />

      <FaqSection
        faqs={about.faqs}
        path="/about-us"
        title="Frequently asked questions"
        intro="The things prospects ask us most often before signing anything."
        tone="white"
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Let's find out if we're a good fit"
          highlight="good fit"
          body="A free audit and an honest conversation. If we're not the right agency for you, we'll say so."
        />
      </div>
    </>
  );
}

/** Accents a phrase inside a headline, matching the live site's two-tone H2s. */
function renderHighlight(text: string, highlight: string) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, ...rest] = text.split(highlight);
  return (
    <>
      {before}
      <span className="text-blue-600">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}
