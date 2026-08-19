import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { industries } from '@/lib/industries';

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container max-w-2xl text-center">
        <p className="eyebrow-script text-blue-600">404</p>

        <h1 className="mt-3 text-display-lg text-navy-700">We couldn&rsquo;t find that page</h1>

        <p className="mt-6 text-body-lg text-ink-600">
          The link may be out of date, or the page may have moved during our site rebuild. Here are
          a few places worth trying instead.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Contact us
          </Button>
        </div>

        <div className="mt-14 border-t border-navy-100 pt-10">
          <h2 className="text-eyebrow uppercase text-ink-500">Popular sections</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: 'Blog', href: '/blog' },
              ...industries.map((i) => ({ label: i.name, href: `/${i.slug}` })),
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-tap items-center rounded-pill bg-surface-muted px-5 text-sm font-semibold text-ink-700 transition-colors hover:bg-navy-100 hover:text-navy-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
