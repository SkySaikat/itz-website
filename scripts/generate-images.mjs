/**
 * generate-images.mjs — brand illustrations for the marketing templates.
 *
 * Calls Gemini's image model (`gemini-2.5-flash-image`) once per manifest entry,
 * then resizes + re-encodes the PNG to WebP with `sharp` so the repo stays light
 * (existing public/images is ~1.5 MB for 37 assets — we keep new art to a similar
 * budget). Transparent backgrounds are preserved.
 *
 *   node scripts/generate-images.mjs --api-key <KEY>       # or GEMINI_API_KEY
 *   node scripts/generate-images.mjs --only industries     # substring filter on file path
 *   node scripts/generate-images.mjs --force               # overwrite existing files
 *   node scripts/generate-images.mjs --list                # print the manifest and exit
 *
 * The key is read from --api-key or the environment only; it is never written to
 * disk. Cost: ~1290 output tokens per image on gemini-2.5-flash-image.
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';
import { GoogleGenAI } from '@google/genai';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'images');
const MODEL = 'gemini-2.5-flash-image';

/* Appended to every prompt so the whole set reads as one system. */
const STYLE =
  ' — flat vector editorial illustration on a plain solid pure-white background (#FFFFFF), ' +
  'the white fills the whole frame edge to edge. Absolutely no checkerboard pattern, no grey ' +
  'squares, no transparency grid, no drop shadow behind the artwork. Deep navy #00386C and ' +
  'bright blue #0974E4 as the primary colours with warm amber #FBBB5B used sparingly for ' +
  'accents, soft pale-blue circles and fine dot-grid textures in the negative space, clean ' +
  'minimal geometry, rounded shapes, subtle depth. Any people are simplified and stylised ' +
  'with minimal facial detail, shown small within the composition. No text, no lettering, no ' +
  'logos. Generous white space, balanced composition, professional and modern. Consistent ' +
  'line weight and colour palette across the set.';

/** @type {{file:string, aspect:string, prompt:string}[]} */
const MANIFEST = [
  // ── Homepage ───────────────────────────────────────────────────────────────
  {
    file: 'home/process.webp',
    aspect: '4:3',
    prompt:
      'A marketing strategy journey: a winding path with three or four milestone markers ' +
      'leading to a large upward-trending line chart, a magnifying glass hovering over the ' +
      'path, small floating cards showing a bar chart and a checkmark.',
  },
  {
    file: 'home/difference.webp',
    aspect: '4:3',
    prompt:
      'The idea of specialisation over volume: five distinct labelled doorways or arched ' +
      'portals in a row, each a slightly different shape, one glowing amber, versus a single ' +
      'generic grey box off to the side. A small figure choosing the amber doorway.',
  },
  {
    file: 'home/reporting.webp',
    aspect: '4:3',
    prompt:
      'Reporting on booked work rather than impressions: a clean analytics dashboard panel ' +
      'where the hero metric is a ringing phone icon and a calendar with a booked appointment ' +
      'slot highlighted in amber, secondary small sparkline charts behind it.',
  },

  // ── About ──────────────────────────────────────────────────────────────────
  {
    file: 'about/story.webp',
    aspect: '4:3',
    prompt:
      'Two decades of steady growth: a horizontal timeline road with small year markers, a ' +
      'seedling growing into a leafy plant along it, a cluster of simple city buildings in ' +
      'the background, a rising arrow.',
  },
  {
    file: 'about/approach-strategy.webp',
    aspect: '1:1',
    prompt:
      'Strategic guidance: a navigational compass overlaid on a folded map with a dotted ' +
      'route line and a destination pin, a small magnifying glass.',
  },
  {
    file: 'about/approach-ownership.webp',
    aspect: '1:1',
    prompt:
      'You own every account: a ring of keys and a simple open vault door, small floating ' +
      'tiles representing an ad account, an analytics graph and a globe/domain, all inside ' +
      'the vault.',
  },
  {
    file: 'about/approach-honesty.webp',
    aspect: '1:1',
    prompt:
      'Saying no to the wrong channel: a signpost at a fork in the road, one arm pointing to ' +
      'a clear amber checkmark path, the other arm crossed out, a small figure pausing to ' +
      'read it.',
  },
  {
    file: 'about/process.webp',
    aspect: '4:3',
    prompt:
      'A five-step engagement flow shown as connected rounded nodes left to right: a ' +
      'magnifying-glass audit, a wrench fixing tracking, a stacked-blocks foundation, a ' +
      'compounding upward curve, and a report card with a phone icon.',
  },
  {
    file: 'about/industries.webp',
    aspect: '4:3',
    prompt:
      'Five specialisms as a tidy row of emblem tiles: a balance scale, a medical cross with ' +
      'a heartbeat line, a house with a location pin, a graduation cap, and a car — each in ' +
      'its own rounded tile, unified by the palette.',
  },

  // ── Industries: <slug>-approach + <slug>-market ────────────────────────────
  {
    file: 'industries/lawyers-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a law firm: a practice-area folder set, a call-recording ' +
      'waveform being reviewed, a shield with a checkmark for bar compliance, a campaign ' +
      'dashboard card with a rising line.',
  },
  {
    file: 'industries/lawyers-market.webp',
    aspect: '4:3',
    prompt:
      'How legal buyers decide: a person late at night with several browser tab shapes ' +
      'floating above a laptop, comparing attorney profile cards and star ratings, a clock ' +
      'showing urgency, a phone about to be dialled.',
  },
  {
    file: 'industries/medical-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a medical practice: a clinic reception desk with an appointment ' +
      'calendar, a privacy shield for HIPAA, a review-stars card, a phone showing a booked ' +
      'call.',
  },
  {
    file: 'industries/medical-market.webp',
    aspect: '4:3',
    prompt:
      'How patients choose a clinic: a patient holding a phone showing a local map with pins ' +
      'and a nearby clinic card, an insurance card shape, a heartbeat line, a location marker.',
  },
  {
    file: 'industries/real-estate-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a real-estate team: listing cards fanned out, a lead funnel ' +
      'narrowing into a CRM contact card, a neighbourhood map with pins, a rising price ' +
      'chart.',
  },
  {
    file: 'industries/real-estate-market.webp',
    aspect: '4:3',
    prompt:
      'How buyers and sellers search: a person browsing property listing cards on a phone, a ' +
      'front-yard "for sale" sign, a simple house with a location pin, a heart/save icon.',
  },
  {
    file: 'industries/education-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a school: an admissions funnel from enquiry to enrolled student, ' +
      'a calendar marked with seasonal windows, a campus-tour walking route, program cards.',
  },
  {
    file: 'industries/education-market.webp',
    aspect: '4:3',
    prompt:
      'How families choose a school: a parent and a student looking together at a laptop ' +
      'showing program cards, a graduation cap, a financial-aid form shape, a campus building.',
  },
  {
    file: 'industries/automotive-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for an auto shop: a local map with a three-result map pack, a ' +
      'Google-business-style profile card, review stars, a phone ringing, a wrench and gear.',
  },
  {
    file: 'industries/automotive-market.webp',
    aspect: '4:3',
    prompt:
      'How drivers find a shop: a car with a small weather cloud above it (heat and a ' +
      'snowflake), a phone showing a local search result, a location pin, a calendar spike ' +
      'for seasonal demand.',
  },

  // Third industry illustration — the "strategy" row of the approach section.
  {
    file: 'industries/lawyers-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a law-firm marketing strategy: a set of labelled practice-area page ' +
      'cards arranged in a plan, a compliance shield with a checkmark, a route line ' +
      'connecting them to a rising results chart.',
  },
  {
    file: 'industries/medical-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a medical-practice marketing strategy: a Google-business-style profile ' +
      'card at the centre with service tags, review stars and a map pin, connected to a ' +
      'short booking flow ending in a calendar slot.',
  },
  {
    file: 'industries/real-estate-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a real-estate marketing strategy: neighbourhood map tiles feeding a ' +
      'lead funnel into an owned CRM contact list, with a follow-up sequence shown as ' +
      'connected message dots over time.',
  },
  {
    file: 'industries/education-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a school marketing strategy: an annual calendar ring marked with ' +
      'seasonal admissions windows, a funnel from enquiry to booked tour to enrolled ' +
      'student, two small figures representing a parent and a student.',
  },
  {
    file: 'industries/automotive-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building an auto-shop marketing strategy: a local map with a highlighted ' +
      'three-result map pack, specialisation badges (EV, diesel, European), and a ' +
      'seasonal demand curve with marked spikes.',
  },

  // ── Services: <slug>-process ──────────────────────────────────────────────
  {
    file: 'services/seo-process.webp',
    aspect: '4:3',
    prompt:
      'Local SEO compounding over time: a leafy plant growing out of a search bar, a ladder ' +
      'of rising ranking positions beside it, a Google-business-style profile card with ' +
      'stars, a steady upward curve.',
  },
  {
    file: 'services/google-ads-process.webp',
    aspect: '4:3',
    prompt:
      'Managing Google Ads: a search results page with the top ad slot highlighted amber, a ' +
      'bid-strategy dial, a conversion funnel ending in a phone call, negative-keyword ' +
      'filter shapes.',
  },
  {
    file: 'services/meta-ads-process.webp',
    aspect: '4:3',
    prompt:
      'Managing Meta ads: a phone showing a single sponsored post in a social feed, ' +
      'concentric audience-targeting rings, two creative variants side by side for an A/B ' +
      'test, a small results chart.',
  },
  {
    file: 'services/website-design-process.webp',
    aspect: '4:3',
    prompt:
      'Designing a website: a rough wireframe on the left resolving into a polished, fast ' +
      'website shown on both a phone and a desktop screen on the right, a speed gauge, a ' +
      'conversion button highlighted amber.',
  },
  {
    file: 'services/lead-generation-process.webp',
    aspect: '4:3',
    prompt:
      'Lead generation: a wide funnel at the top catching click and cursor shapes, narrowing ' +
      'down to a ringing phone and a booked-calendar card at the bottom, a couple of ' +
      'qualified-check badges.',
  },

  // ── Who We Serve ──────────────────────────────────────────────────────────
  {
    file: 'who-we-serve/hero.webp',
    aspect: '4:3',
    prompt:
      'Five industries, one method: five small emblem tiles (scale, medical cross, house, ' +
      'graduation cap, car) on the left, connected by converging lines into a single central ' +
      'upward-trending strategy chart on the right.',
  },
];

const WIDTHS = { '4:3': 1400, '1:1': 1200, '16:9': 1600, '3:2': 1500 };

function parseArgs(argv) {
  const args = { force: false, list: false, only: null, apiKey: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--list') args.list = true;
    else if (a === '--only') args.only = argv[(i += 1)];
    else if (a === '--api-key') args.apiKey = argv[(i += 1)];
  }
  return args;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(ai, entry, attempt = 1) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: entry.prompt + STYLE,
    config: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: entry.aspect },
    },
  });

  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    const text = parts.find((p) => p.text)?.text ?? 'no image in response';
    if (attempt < 3) {
      console.warn(`  retry ${attempt} (${text.slice(0, 80)})`);
      return generateOne(ai, entry, attempt + 1);
    }
    throw new Error(`no image after ${attempt} attempts: ${text.slice(0, 160)}`);
  }

  const png = Buffer.from(img.inlineData.data, 'base64');
  const width = WIDTHS[entry.aspect] ?? 1400;
  // Flatten onto white so any stray alpha the model returns can't render as a
  // grey checkerboard on the page. The art is designed to sit on white anyway.
  return sharp(png)
    .flatten({ background: '#ffffff' })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
}

async function main() {
  const args = parseArgs(process.argv);

  let manifest = MANIFEST;
  if (args.only) manifest = manifest.filter((e) => e.file.includes(args.only));

  if (args.list) {
    for (const e of manifest) console.log(`${e.aspect.padEnd(5)} ${e.file}`);
    console.log(`\n${manifest.length} images`);
    return;
  }

  const key = args.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error('Missing key: pass --api-key <KEY> or set GEMINI_API_KEY');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: key });
  let made = 0;
  let skipped = 0;
  const failures = [];

  for (const entry of manifest) {
    const outPath = join(OUT_DIR, entry.file);
    if (!args.force && (await exists(outPath))) {
      skipped += 1;
      console.log(`skip  ${entry.file}`);
      continue;
    }
    process.stdout.write(`gen   ${entry.file} … `);
    try {
      const webp = await generateOne(ai, entry);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, webp);
      made += 1;
      console.log(`${(webp.length / 1024).toFixed(0)} KB`);
    } catch (err) {
      failures.push(entry.file);
      console.log(`FAILED — ${err.message}`);
    }
  }

  console.log(`\n${made} generated, ${skipped} skipped, ${failures.length} failed`);
  if (failures.length) {
    console.log('failed:', failures.join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
