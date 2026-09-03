import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { ClientLogos } from '@/components/sections/ClientLogos';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { FeatureRows } from '@/components/sections/FeatureRows';
import { Hero } from '@/components/sections/Hero';
import { IndustriesGrid } from '@/components/sections/IndustriesGrid';
import { Mission } from '@/components/sections/Mission';
import { ProcessSection } from '@/components/sections/ProcessTimeline';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { Section, SectionHeading } from '@/components/ui/Section';
import { home } from '@/lib/home-content';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />

      {/* Who We Serve leads — it's the sharper positioning. */}
      <IndustriesGrid tone="white" />

      <Section tone="muted">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-4">
            <SectionHeading eyebrow="Results that compound" title="Why local search marketing pays off over time" />
          </div>
          <div className="min-w-0 space-y-5 text-body-lg text-ink-600 lg:col-span-8" data-reveal="right">
            <p>
              Unlike a single ad campaign that stops the moment you stop paying for it, local SEO
              and a well-optimised Google Business Profile keep working month after month.
            </p>
            <p>
              Clients across our core industries typically see cost per lead fall as organic
              rankings climb, because free organic traffic starts doing the work that paid clicks
              used to do — which is why we treat paid as the fast lane and organic as the asset,
              and move budget between them as the account matures.
            </p>
          </div>
        </div>
      </Section>

      <ServicesGrid />
      <Stats />

      <FeatureRows
        eyebrow="Why teams switch to us"
        title="Three reasons clients move their marketing here"
        intro="Not a bigger media desk. A partner that shows its work, sticks to what it knows, and hands you the accounts."
        rows={home.differenceRows}
        mesh
      />

      <ProcessSection
        eyebrow="How we work"
        title="What the first six months look like"
        intro="Every account is different, but the sequence rarely is: fix what is broken, launch what is fast, compound what lasts."
        steps={home.howWeWork}
        tone="muted"
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Ready to level up your digital marketing plan?"
          highlight="level up"
          body="Tell us your market and your target job type. We'll come back with where the demand actually is and what it costs to capture it."
        />
      </div>

      <Mission />
      <Testimonials />

      <BlogTeaser tone="white" />

      <FaqSection
        faqs={home.faqs}
        path="/"
        title="The questions we get on the first call"
        intro="Straight answers to what most owners ask before they engage an agency."
        tone="muted"
      />
    </>
  );
}
