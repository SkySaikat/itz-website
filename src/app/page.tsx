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
import { home } from '@/lib/home-content';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <ServicesGrid />
      <Stats />

      <FeatureRows
        eyebrow="Why teams switch to us"
        title="Three reasons clients move their marketing here"
        intro="Not a bigger media desk. A partner that shows its work, sticks to what it knows, and hands you the accounts."
        rows={home.differenceRows}
        mesh
      />

      <IndustriesGrid />

      <ProcessSection
        eyebrow="How we work"
        title="What the first six months look like"
        intro="Every account is different, but the sequence rarely is: fix what is broken, launch what is fast, compound what lasts."
        steps={home.howWeWork}
        tone="white"
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

      <FaqSection
        faqs={home.faqs}
        path="/"
        title="The questions we get on the first call"
        intro="Straight answers to what most owners ask before they engage an agency."
        tone="white"
      />
    </>
  );
}
