import type { Metadata } from 'next';
import Image from 'next/image';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { LinkCard } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { services } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Digital Marketing Services',
  description:
    'SEO, Google and Meta Ads, programmatic, website design and lead generation for small businesses. Every channel that puts you in front of local searches.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Every channel that puts you in front of local searches"
        intro="Most clients don't need all of it at once. SEO is usually the foundation, with paid ads and a rebuilt site layered in once an audit shows where the gaps actually are."
        crumbs={[{ label: 'Services' }]}
      >
        <Button href="/contact" variant="onDark" size="lg">
          Get a Free Audit
        </Button>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="The full stack"
          title="Nine services, priced and measured separately"
          intro="You should be able to see what each channel costs and what it returns. Every engagement reports on booked jobs, not impressions."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug} data-reveal data-reveal-delay={i}>
              <LinkCard
                href={`/services/${service.slug}`}
                title={service.name}
                body={service.tagline}
                icon={
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                    <Image src={service.icon} alt="" width={32} height={32} className="h-8 w-8" aria-hidden="true" />
                  </span>
                }
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </Section>

      <div className="pb-section lg:pb-section-lg">
        <CtaBanner
          title="Not sure which channel to start with?"
          highlight="which channel"
          body="A free audit tells you where the demand is in your market and which channel captures it cheapest. No obligation to buy anything afterwards."
        />
      </div>
    </>
  );
}
