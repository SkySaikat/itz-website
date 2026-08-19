/**
 * Type definitions for the programmatic geo-landing dataset that drives
 * /services/[service]/[city].
 *
 * Data lives in cities.json and service-locations.json next to this file and
 * is validated against these interfaces at build time by ./index.ts.
 */

export type UsStateCode = 'CO' | 'TX' | 'AZ' | 'WY' | 'FL';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NearbyCity {
  /** Slug of another city in the dataset, or null for a town with no page. */
  slug: string | null;
  name: string;
  driveMinutes: number;
}

/**
 * City-level review data.
 *
 * This is the ONLY source the schema builder will accept for
 * LocalBusiness.aggregateRating. It must be city-attributable — the site-wide
 * average is not a substitute. When null, no rating node is emitted.
 */
export interface CityReviews {
  ratingValue: number;
  reviewCount: number;
  /** Provenance, so the claim can be audited later. e.g. "Google Business Profile". */
  source: string;
  /** ISO date the figures were last pulled. */
  lastVerified: string;
}

export interface City {
  slug: string;
  /** "Denver" */
  name: string;
  /** "Colorado" */
  state: string;
  stateCode: UsStateCode;
  county: string;
  /** IANA zone. */
  timeZone: string;
  geo: GeoPoint;
  /** Radius quoted as the served area, in miles. */
  serviceRadiusMiles: number;
  /** Named areas for the localized trust section and body copy. */
  neighborhoods: string[];
  nearbyCities: NearbyCity[];
  /** One or two sentences of genuinely city-specific market context. */
  marketNote: string;
  reviews: CityReviews | null;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface LocalStat {
  value: string;
  label: string;
}

/** One record per generated page: the service x city join. */
export interface ServiceLocation {
  serviceSlug: string;
  citySlug: string;
  /** Overrides the default "Top-Rated {service} in {city}, {state}" H1. */
  headline?: string;
  /** Lede under the H1. Should reference the local market. */
  intro: string;
  /** Three-up band under the hero. */
  stats: [LocalStat, LocalStat, LocalStat];
  /** The "why this market is different" list. */
  localFactors: string[];
  /** Rendered in the accordion AND emitted as FAQPage — the two must match. */
  faqs: Faq[];
}
