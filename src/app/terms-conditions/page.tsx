import type { Metadata } from 'next';

import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { addressLine, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms and conditions for using the ${site.name} website and services.`,
  alternates: { canonical: '/terms-conditions' },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" crumbs={[{ label: 'Terms & Conditions' }]} />

      <Section>
        <div className="prose prose-brand">
          <p className="lead">
            <strong>Placeholder.</strong> The live site&rsquo;s terms were not included in the
            WordPress export used for this rebuild. Replace the content below with the reviewed
            legal copy from <code>itzdigital.co/terms-conditions/</code> before launch.
          </p>

          <h2>Use of this site</h2>
          <p>
            By accessing this website you agree to these terms. If you do not agree, please do not
            use the site.
          </p>

          <h2>Intellectual property</h2>
          <p>
            All content, branding and design on this site is owned by {site.legalName} unless
            otherwise credited. Client logos remain the property of their respective owners and
            appear here with permission.
          </p>

          <h2>Service engagements</h2>
          <p>
            Marketing services are governed by the individual agreement signed with each client.
            Nothing on this website constitutes a contract, a guarantee of results, or an offer.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> or posted to {addressLine}.
          </p>
        </div>
      </Section>
    </>
  );
}
