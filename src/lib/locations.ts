/**
 * Location-hub content and helpers.
 *
 * The programmatic geo-landing pages (`/services/[service]/[city]`) already
 * exist and are driven by `./geo`. This layer adds the market hub pages
 * (`/locations`, `/locations/[city]`) that tie them together and give the
 * geo pages a way in from the navigation.
 *
 * `hubCopy` is genuinely city-specific and verifiable — market structure and
 * competitive context, not invented performance numbers. Cities without a
 * `serviceLocations` record (dallas, tampa) get a hub page but no deep
 * `<service> in <city>` pages until real localized content exists for them.
 */
import { cities, serviceLocations, type City } from './geo';
import { serviceBySlug, type Service } from './services';

export type CityHubCopy = {
  /** One line under the hero, referencing the local market. */
  hubIntro: string;
  /** "Why this market is different" — 1–2 sentences. */
  whyDifferent: string;
};

export const hubCopy: Record<string, CityHubCopy> = {
  denver: {
    hubIntro:
      'SEO and paid ad programs across the Denver metro, tuned for a market split between a dense downtown core and a ring of suburbs with their own map packs.',
    whyDifferent:
      'Denver-area search fragments block by block: a single citywide campaign leaves the suburban rings — Aurora, Lakewood, Littleton — uncovered, so we run Google Business Profile categories, service-area targeting and content per sub-market rather than one blanket push.',
  },
  austin: {
    hubIntro:
      'Local search programs for Austin businesses, in one of the fastest-growing and most competitive metro markets in the country.',
    whyDifferent:
      'Austin has one of the highest population-growth rates in the US, which means high search volume and a constant stream of new competitors bidding the same terms. Holding position here takes ongoing content and review velocity, not a one-time push.',
  },
  phoenix: {
    hubIntro:
      'SEO and paid ads for Phoenix and the wider Valley — a market where proximity ranking factors dominate more than almost anywhere else.',
    whyDifferent:
      'The Valley sprawls across more than 500 square miles, so ranking downtown does almost nothing for demand in Scottsdale, Mesa or Tempe. Multi-location or service-area targeting is usually required to cover the metro properly.',
  },
  dallas: {
    hubIntro:
      'Active across the Dallas-Fort Worth metro — one of the largest, densest and fastest-growing local search markets in the country.',
    whyDifferent:
      'DFW is competitive enough that a top-ten organic ranking often is not enough; only the map-pack three reliably drive calls. Demand also fragments across dozens of suburbs — Plano, Frisco, Arlington, Irving — each with its own map pack, so we target by sub-market rather than by "Dallas".',
  },
  tampa: {
    hubIntro:
      'Local search programs across the Tampa Bay market — Tampa, St. Petersburg and Clearwater, separated by water and searching differently.',
    whyDifferent:
      'A campaign that ranks in Tampa does little for St. Pete or Clearwater across the bay. Hurricane season also drives sharp, short-lived demand spikes for home-services and restoration categories, which the marketing has to be positioned to catch.',
  },
};

/** Every service that has a dedicated landing page in a given city. */
export function servicesForCity(citySlug: string): Service[] {
  return serviceLocations
    .filter((sl) => sl.citySlug === citySlug)
    .map((sl) => serviceBySlug.get(sl.serviceSlug)!)
    .filter(Boolean);
}

/** Cities that have at least one `<service> in <city>` page. */
export const activeLocations: City[] = cities.filter(
  (c) => serviceLocations.some((sl) => sl.citySlug === c.slug),
);

/** All cities, active ones first, for the index grid. */
export const allLocations: City[] = [
  ...activeLocations,
  ...cities.filter((c) => !activeLocations.includes(c)),
];

export function hasActivePages(citySlug: string): boolean {
  return activeLocations.some((c) => c.slug === citySlug);
}
