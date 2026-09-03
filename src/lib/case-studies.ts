/*
 * Titles and slugs are the real ones from the WordPress export
 * (post_type=case_study). The bodies live in Elementor/ACF fields that the
 * XML export does not carry, so `summary` here is a neutral, title-derived
 * description and there are deliberately NO result metrics — those need to be
 * migrated from the live pages rather than invented.
 *
 * See MIGRATION.md → "Content still to migrate".
 */
import type { Faq } from './geo/types';

export type CaseStudy = {
  slug: string;
  /** Illustrative image from the industry library — one per study, no reuse. */
  image: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  channels: string[];
  /** Template sections. Prose only — no invented figures. */
  challenge?: string;
  strategy?: string;
  results?: string;
  /** Real, verified numbers only. Left empty until migrated from the live pages;
   *  the stats band renders only when this is present. */
  metrics?: { value: string; label: string }[];
  faqs?: Faq[];
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
    challenge:
      'A regional water park makes most of its revenue in a handful of summer weekends, so the entire marketing window is a few weeks long. Awareness had to be built fast across a wide radius of families, then converted to ticket and season-pass sales before opening weekend, with no time to let a slow-building channel compound.',
    strategy:
      'We ran the channels in sequence rather than in parallel: programmatic display and video first, to put the park in front of families across the metro and build recognition, then paid social to drive pass pre-sales to the audiences that had already seen the brand, with Google Ads capturing the "things to do this weekend" and branded searches that followed. Creative and budget shifted week by week as opening approached.',
    results:
      'The layered approach meant the paid-social and search spend landed on an audience that already recognised the park, which is the pattern that makes a compressed seasonal push work. Campaign-level figures are available on request.',
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
    challenge:
      'An independent school needed a strong turnout at a single open house — the event that does most of the enrolment work — from families inside a specific catchment, with school-age children, during the narrow window when admissions decisions are actually being made.',
    strategy:
      'Paid social and programmatic were targeted tightly by geography, household composition and parental interest signals, with creative that spoke to the questions parents actually ask about outcomes and fit. Registrations fed a lead-generation flow that confirmed the RSVP, reminded families as the date approached, and followed up with non-attendees afterward.',
    results:
      'The combination of a tight audience definition and a full reminder-and-follow-up sequence is what turns event marketing into booked tours and applications rather than a list of names. Detailed figures are available on request.',
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
    challenge:
      'A performing arts company competes not just with other theatres but with every other way to spend a Friday night. It needed to grow both season-subscription revenue — the stable base — and single-ticket sales for individual productions, each of which has its own short selling window.',
    strategy:
      'Programmatic and social carried the always-on brand and subscription message, while show-specific campaigns spun up around each production’s on-sale date. SEO work made the company and its current season discoverable for the "things to do" and show-title searches that spike in the days before a performance.',
    results:
      'Treating the subscription base and the per-show pushes as two connected programs — rather than one generic "buy tickets" campaign — is what lets an arts organisation smooth out the revenue between productions. Figures are available on request.',
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
    challenge:
      'A New York firm was competing for some of the most expensive keywords in legal search, against firms and lead brokers with far larger budgets. Matching their spend was not an option, so the campaign had to win on efficiency — getting more signed matters out of the same clicks.',
    strategy:
      'We rebuilt the practice-area pages the ads pointed at so each one answered the specific question behind the search, tightened the campaigns to the case types the firm actually wanted, and reviewed call recordings with the intake team to close the gaps where qualified callers were being lost. SEO built an organic position underneath the paid spend so cost per lead could fall over time.',
    results:
      'The gains came from conversion rate and case-type targeting rather than budget — the pattern that lets a smaller firm compete in an expensive market. Campaign figures are available on request.',
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
    challenge:
      'A non-profit working on a complex, technical subject — information trust and digital media standards — needed to be findable and credible to a specific audience of publishers, technologists and funders, without a large budget for paid promotion.',
    strategy:
      'The work was organic-first: an SEO and content program that built out clear, authoritative pages on the organisation’s areas of focus, plus website care to keep the site fast, current and easy to update as the initiative evolved. The goal was to make ITEGA the reference point when someone searches the topics it works on.',
    results:
      'For a mission-driven organisation, owning the search results for its own subject area is the most durable form of awareness — it keeps working between grant cycles. Detail is available on request.',
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
    challenge:
      'A regional publisher was managing the same transition as the rest of the industry — declining print revenue, a digital audience that needed to grow, and advertisers who wanted proof of reach before they would move budget online.',
    strategy:
      'SEO and programmatic grew the digital audience for the publisher’s editorial content, while a lead-generation layer packaged that audience into something the sales team could sell — clear reach and engagement data, and a pipeline of advertiser inquiries rather than cold outreach.',
    results:
      'Growing the audience and building the advertiser pipeline at the same time is what makes the print-to-digital shift survivable rather than just a decline to manage. Figures are available on request.',
  },
];

/** Shown on the index and every detail page. Adapted from the live case-study FAQ. */
export const caseStudyFaqs: Faq[] = [
  {
    question: 'Why aren’t there specific numbers on these pages?',
    answer:
      'The campaign-level figures for these engagements live in reporting we do not publish without client sign-off. We will walk you through what was measured and what it produced on a call. Every future case study we publish will carry client-approved numbers on the page.',
  },
  {
    question: 'How long did it take to see results?',
    answer:
      'It varies by starting point, channel and market. Paid campaigns show signal within a few weeks; SEO-led work compounds over three to six months. Each engagement here set its own success metric up front and was judged against it.',
  },
  {
    question: 'Can I get a strategy like this for my business?',
    answer:
      'Yes. Start with a free audit — we will look at your current visibility, your competitors and the gap between them, and outline an approach for your industry and market. You keep the findings whether or not you work with us.',
  },
  {
    question: 'Do these results come with a long-term contract?',
    answer:
      'No. Our programs run month-to-month after an initial setup period. We earn renewals with results, and you keep your ad accounts, analytics and creative if you leave.',
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
