import { ClientLogos } from '@/components/sections/ClientLogos';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { Hero } from '@/components/sections/Hero';
import { IndustriesGrid } from '@/components/sections/IndustriesGrid';
import { Mission } from '@/components/sections/Mission';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <ServicesGrid />
      <Stats />
      <IndustriesGrid />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Ready to level up your digital marketing plan?"
          highlight="level up"
          body="Tell us your market and your target job type. We'll come back with where the demand actually is and what it costs to capture it."
        />
      </div>

      <Mission />
      <Testimonials />
    </>
  );
}
