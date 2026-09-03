import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export function Mission() {
  return (
    <Section>
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 right-0 hidden h-40 w-40 bg-dot-grid bg-dots text-blue-200 lg:block"
        />

        <div className="relative max-w-3xl" data-reveal="left">
          <p className="eyebrow-script mb-3">Our mission</p>

          <h2 className="text-display-lg text-navy-700">
            We exist to <span className="text-gradient">empower businesses</span> as a strategic
            consulting partner.
          </h2>

          <p className="mt-6 max-w-prose text-body-xl text-ink-600">
            We achieve this by delivering clear, insightful guidance on digital marketing strategies
            and products that drive online presence and measurable growth — over two decades of it,
            across more than 500 local businesses.
          </p>

          <Button href="/about-us" variant="secondary" size="lg" className="mt-8">
            Learn More About Us
          </Button>
        </div>
      </div>
    </Section>
  );
}
