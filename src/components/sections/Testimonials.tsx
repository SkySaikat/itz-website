import { Star } from 'lucide-react';

import { TestimonialCarousel, type Testimonial } from '@/components/ui/TestimonialCarousel';
import { Section, SectionHeading } from '@/components/ui/Section';
import { site } from '@/lib/site';

/**
 * Verbatim client quotes only. Both of these are real — pulled from the live
 * site — and nothing here is paraphrased or composed. Add new entries only
 * when you have the client's actual words and permission to use them.
 */
const testimonials: Testimonial[] = [
  {
    quote:
      'Since partnering with ITZ Digital, we have had great success generating new revenues from target marketing and the various media channels they serve. The way ITZ Digital is on calls is of particular benefit and helps present numerous options to prospective customers. They do it in an informational manner and not a hard sell.',
    name: 'Bill Patterson',
    role: 'President, Denton Record-Chronicle',
    image: '/images/people/bill-patterson.webp',
    imageFit: 'cover',
  },
  {
    quote:
      'Our partnership with ITZ has been instrumental in product offerings to our clients and has made an impact on client business growth. When client requests are timely, ITZDigital brings their expertise and meets deadlines making a win-win for all.',
    name: 'Judi Lessard',
    role: 'Marketing Director, Flathead Beacon Productions',
    image: '/images/clients/flathead-beacon.webp',
    imageFit: 'contain',
  },
];

export function Testimonials() {
  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="What our clients are saying"
        title="Two decades of partnerships, not campaigns"
        size="lg"
      />

      <TestimonialCarousel testimonials={testimonials} className="mt-14" />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
        <span className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
          ))}
        </span>
        <p className="text-ink-600">
          <span className="font-bold text-navy-700">{site.rating.value} average rating</span> across{' '}
          {site.rating.count}+ businesses served
        </p>
      </div>
    </Section>
  );
}
