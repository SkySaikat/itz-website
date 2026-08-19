/**
 * Typed loader for the geo-landing dataset.
 *
 * The JSON files are authored by hand (or exported from a CMS/spreadsheet), so
 * they are validated against the interfaces in ./types.ts at module load. That
 * runs during `next build`, which means a malformed record fails the build
 * rather than silently rendering a broken page or, worse, emitting invalid
 * structured data to Google.
 */

import { serviceBySlug, type Service } from '../services';
import citiesData from './cities.json';
import serviceLocationsData from './service-locations.json';
import type { City, Faq, LocalStat, ServiceLocation } from './types';

export type * from './types';

// ── Validation ──────────────────────────────────────────────────────────────

class GeoDataError extends Error {
  constructor(where: string, message: string) {
    super(`[geo dataset] ${where}: ${message}`);
    this.name = 'GeoDataError';
  }
}

const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertCity(raw: unknown, i: number): City {
  const where = `cities[${i}]`;
  const c = raw as Record<string, unknown>;

  if (!isStr(c.slug) || !SLUG.test(c.slug)) throw new GeoDataError(where, 'slug must be kebab-case');
  if (!isStr(c.name)) throw new GeoDataError(where, 'name is required');
  if (!isStr(c.state)) throw new GeoDataError(where, 'state is required');
  if (!isStr(c.stateCode) || c.stateCode.length !== 2) {
    throw new GeoDataError(where, 'stateCode must be a 2-letter code');
  }
  if (!isStr(c.timeZone)) throw new GeoDataError(where, 'timeZone is required');

  const geo = c.geo as Record<string, unknown> | undefined;
  if (!geo || !isNum(geo.lat) || !isNum(geo.lng)) {
    throw new GeoDataError(where, 'geo.lat and geo.lng must be numbers');
  }
  if (Math.abs(geo.lat) > 90 || Math.abs(geo.lng) > 180) {
    throw new GeoDataError(where, 'geo coordinates out of range');
  }

  if (!isNum(c.serviceRadiusMiles) || c.serviceRadiusMiles <= 0) {
    throw new GeoDataError(where, 'serviceRadiusMiles must be a positive number');
  }
  if (!Array.isArray(c.neighborhoods) || c.neighborhoods.length === 0) {
    throw new GeoDataError(where, 'at least one neighborhood is required');
  }
  if (!isStr(c.marketNote)) throw new GeoDataError(where, 'marketNote is required');

  // Guard the structured-data policy decision in code, not just in a comment:
  // a rating without provenance never reaches the schema builder.
  if (c.reviews !== null) {
    const r = c.reviews as Record<string, unknown>;
    if (!isNum(r?.ratingValue) || r.ratingValue < 1 || r.ratingValue > 5) {
      throw new GeoDataError(where, 'reviews.ratingValue must be between 1 and 5');
    }
    if (!isNum(r.reviewCount) || r.reviewCount < 1) {
      throw new GeoDataError(where, 'reviews.reviewCount must be >= 1');
    }
    if (!isStr(r.source)) {
      throw new GeoDataError(where, 'reviews.source is required — aggregateRating must be attributable');
    }
    if (!isStr(r.lastVerified)) {
      throw new GeoDataError(where, 'reviews.lastVerified is required');
    }
  }

  return raw as City;
}

function assertServiceLocation(raw: unknown, i: number, citySlugs: Set<string>): ServiceLocation {
  const where = `serviceLocations[${i}]`;
  const sl = raw as Record<string, unknown>;

  if (!isStr(sl.serviceSlug)) throw new GeoDataError(where, 'serviceSlug is required');
  if (!isStr(sl.citySlug)) throw new GeoDataError(where, 'citySlug is required');

  if (!serviceBySlug.has(sl.serviceSlug)) {
    throw new GeoDataError(where, `unknown serviceSlug "${sl.serviceSlug}" — not in lib/services.ts`);
  }
  if (!citySlugs.has(sl.citySlug)) {
    throw new GeoDataError(where, `unknown citySlug "${sl.citySlug}" — not in cities.json`);
  }

  if (!isStr(sl.intro)) throw new GeoDataError(where, 'intro is required');

  if (!Array.isArray(sl.stats) || sl.stats.length !== 3) {
    throw new GeoDataError(where, 'stats must be exactly 3 entries (the hero band is a 3-up)');
  }
  for (const s of sl.stats as LocalStat[]) {
    if (!isStr(s?.value) || !isStr(s?.label)) {
      throw new GeoDataError(where, 'each stat needs a value and a label');
    }
  }

  if (!Array.isArray(sl.localFactors) || sl.localFactors.length === 0) {
    throw new GeoDataError(where, 'at least one localFactor is required');
  }

  // Google requires >= 2 Q&A pairs for FAQPage to be eligible, and every
  // answer must also be visible on the page.
  if (!Array.isArray(sl.faqs) || sl.faqs.length < 2) {
    throw new GeoDataError(where, 'at least 2 FAQs are required for valid FAQPage markup');
  }
  for (const f of sl.faqs as Faq[]) {
    if (!isStr(f?.question) || !isStr(f?.answer)) {
      throw new GeoDataError(where, 'each FAQ needs a question and an answer');
    }
  }

  return raw as ServiceLocation;
}

// ── Load ────────────────────────────────────────────────────────────────────

export const cities: City[] = citiesData.cities.map(assertCity);

export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

const citySlugSet = new Set(cities.map((c) => c.slug));

export const serviceLocations: ServiceLocation[] = serviceLocationsData.serviceLocations.map(
  (raw, i) => assertServiceLocation(raw, i, citySlugSet),
);

// Duplicate service x city pairs would produce two pages competing for the
// same query — catch it at build time.
{
  const seen = new Set<string>();
  for (const sl of serviceLocations) {
    const k = `${sl.serviceSlug}::${sl.citySlug}`;
    if (seen.has(k)) throw new GeoDataError('serviceLocations', `duplicate record for ${k}`);
    seen.add(k);
  }
}

// ── Lookups ─────────────────────────────────────────────────────────────────

export interface ResolvedServiceLocation {
  service: Service;
  city: City;
  content: ServiceLocation;
  /** "Denver, CO" */
  cityState: string;
  /** "Denver, Colorado" */
  cityStateLong: string;
  /** Canonical path. */
  path: string;
}

const contentByKey = new Map(
  serviceLocations.map((sl) => [`${sl.serviceSlug}::${sl.citySlug}`, sl]),
);

/**
 * Resolve a service x city pair, or null when the combination has no content.
 *
 * Returning null rather than falling back to generic copy is deliberate: a
 * programmatic page with no local substance is exactly what Google's
 * "thin affiliate / doorway page" guidance targets.
 */
export function getServiceLocation(
  serviceSlug: string,
  citySlug: string,
): ResolvedServiceLocation | null {
  const service = serviceBySlug.get(serviceSlug);
  const city = cityBySlug.get(citySlug);
  const content = contentByKey.get(`${serviceSlug}::${citySlug}`);

  if (!service || !city || !content) return null;

  return {
    service,
    city,
    content,
    cityState: `${city.name}, ${city.stateCode}`,
    cityStateLong: `${city.name}, ${city.state}`,
    path: `/services/${service.slug}/${city.slug}`,
  };
}

/** Every generated service x city path. Drives generateStaticParams + sitemap. */
export const serviceLocationParams = serviceLocations.map((sl) => ({
  service: sl.serviceSlug,
  city: sl.citySlug,
}));

/** Other cities where the same service is offered. */
export function siblingCities(serviceSlug: string, citySlug: string): City[] {
  return serviceLocations
    .filter((sl) => sl.serviceSlug === serviceSlug && sl.citySlug !== citySlug)
    .map((sl) => cityBySlug.get(sl.citySlug)!);
}

/** Other services offered in the same city. */
export function siblingServices(serviceSlug: string, citySlug: string): Service[] {
  return serviceLocations
    .filter((sl) => sl.citySlug === citySlug && sl.serviceSlug !== serviceSlug)
    .map((sl) => serviceBySlug.get(sl.serviceSlug)!);
}

/** Cities with a landing page for a given service. Used on /services/[service]. */
export function citiesForService(serviceSlug: string): City[] {
  return serviceLocations
    .filter((sl) => sl.serviceSlug === serviceSlug)
    .map((sl) => cityBySlug.get(sl.citySlug)!);
}
