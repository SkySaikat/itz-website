import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { homepageServices } from '@/lib/services';

export function ServicesGrid() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What we do"
        title="Our Small Business Marketing Services"
        intro="Our team handles the complex process of ad buying on your behalf, so you can focus on running the business. Most clients don't need every channel at once — SEO is usually the foundation, with paid ads and a rebuilt site layered in once you know where the gaps are."
        action={
          <Button href="/services" variant="secondary">
            Explore Our Services
          </Button>
        }
      />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {homepageServices.map((service, i) => (
          <li key={service.slug} data-reveal data-reveal-delay={i}>
            <article className="group relative flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-8 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover focus-within:-translate-y-1 focus-within:shadow-card-hover">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                <Image
                  src={service.icon}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </span>

              <p className="eyebrow-script mt-6">{service.name}</p>

              <h3 className="mt-1 text-lg font-bold leading-snug text-navy-700">
                <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {service.tagline}
                </Link>
              </h3>

              <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                {service.summary}
              </p>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                Learn more
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
