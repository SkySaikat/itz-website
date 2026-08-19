/*
 * Titles and slugs are the real ones from the WordPress export
 * (post_type=case_study). The bodies live in Elementor/ACF fields that the
 * XML export does not carry, so `summary` here is a neutral, title-derived
 * description and there are deliberately NO result metrics — those need to be
 * migrated from the live pages rather than invented.
 *
 * See MIGRATION.md → "Content still to migrate".
 */
export type CaseStudy = {
  slug: string;
  /** Illustrative image from the industry library — one per study, no reuse. */
  image: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  channels: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'water-park',
    image: 'real-estate-property-owners-finding-buyers',
    title: 'Water Park’s Multi-Channel Campaign Makes a Splash',
    client: 'Regional water park',
    industry: 'Leisure & attractions',
    summary:
      'A seasonal attraction with a narrow selling window, reached across search, paid social and programmatic in the run-up to opening weekend.',
    channels: ['Programmatic Ads', 'Meta Ads', 'Google Ads'],
  },
  {
    slug: 'targeting-parents-for-a-private-school-open-house',
    image: 'education-private-schools',
    title: 'Targeting Parents for a Private School Open House',
    client: 'Independent private school',
    industry: 'Education',
    summary:
      'Open house attendance driven by targeting parents of school-age children inside a defined catchment, timed against the admissions calendar.',
    channels: ['Meta Ads', 'Programmatic Ads', 'Lead Generation'],
  },
  {
    slug: 'artists-repertory-theatre',
    image: 'education-universities',
    title: 'Artists Repertory Theatre',
    client: 'Artists Repertory Theatre',
    industry: 'Arts & culture',
    summary:
      'Season subscription and single-ticket demand built for a performing arts company competing against every other option for a Friday night.',
    channels: ['Programmatic Ads', 'Social Media Ads', 'SEO'],
  },
  {
    slug: 'finding-clients-for-a-new-york-attorney',
    image: 'lawyers-criminal-defense',
    title: 'Finding Clients for a New York Attorney',
    client: 'New York law firm',
    industry: 'Legal',
    summary:
      'Client acquisition in one of the most expensive legal ad markets in the country, where the win came from conversion rate rather than budget.',
    channels: ['Google Ads', 'SEO', 'Website Design'],
  },
  {
    slug: 'itega',
    image: 'lawyers-estate-planning',
    title: 'ITEGA',
    client: 'ITEGA',
    industry: 'Non-profit & media',
    summary:
      'Awareness and stakeholder engagement for a non-profit working on information trust and digital media standards.',
    channels: ['SEO', 'Content Marketing', 'Website Services'],
  },
  {
    slug: 'chronogram-media',
    image: 'real-estate-property-management',
    title: 'Chronogram Media',
    client: 'Chronogram Media',
    industry: 'Publishing',
    summary:
      'Audience and advertiser growth for a regional publisher navigating the shift from print revenue to digital.',
    channels: ['Programmatic Ads', 'SEO', 'Lead Generation'],
  },
];

/**
 * Two studies sharing an image reads as a bug on the index page (it shipped
 * once). Fail the build instead of letting it happen again.
 */
{
  const seen = new Set<string>();
  for (const study of caseStudies) {
    if (seen.has(study.image)) {
      throw new Error(
        `[case-studies] duplicate image "${study.image}" on "${study.slug}" — each study needs its own.`,
      );
    }
    seen.add(study.image);
  }
}
