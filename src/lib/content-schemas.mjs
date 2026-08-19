/**
 * JSON Schemas for LLM-generated content.
 *
 * Used twice per generation:
 *   1. Sent to the Claude API as `output_config.format` — the response is
 *      constrained to the schema at the API layer, so there is no regex
 *      extraction, no brace matching, and no JSON.parse retry loop.
 *   2. Re-checked locally before writing, because schema conformance is not
 *      the same as *usable* (word counts, slug shape, exact array lengths that
 *      the structured-outputs subset can't express).
 *
 * Structured outputs does not support minLength/maxLength/minItems/maxItems or
 * numeric bounds — those live in the local validators below.
 *
 * Kept as .mjs so scripts/ can import it directly with no TypeScript build.
 */

const faqSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answer: { type: 'string' },
  },
  required: ['question', 'answer'],
  additionalProperties: false,
};

/** Blog post. Mirrors the shape src/lib/posts.ts consumes. */
export const POST_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    excerpt: { type: 'string' },
    categories: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
    faqs: { type: 'array', items: faqSchema },
    /** Body HTML: <h2>/<h3>/<p>/<ul>/<strong> only. No <h1> — the page renders it. */
    content: { type: 'string' },
  },
  required: ['title', 'seoTitle', 'seoDescription', 'excerpt', 'categories', 'tags', 'faqs', 'content'],
  additionalProperties: false,
};

/** Geo-landing record. Must satisfy assertServiceLocation in src/lib/geo/index.ts. */
export const GEO_SCHEMA = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    intro: { type: 'string' },
    stats: {
      type: 'array',
      items: {
        type: 'object',
        properties: { value: { type: 'string' }, label: { type: 'string' } },
        required: ['value', 'label'],
        additionalProperties: false,
      },
    },
    localFactors: { type: 'array', items: { type: 'string' } },
    faqs: { type: 'array', items: faqSchema },
  },
  required: ['headline', 'intro', 'stats', 'localFactors', 'faqs'],
  additionalProperties: false,
};

// ── Local validation ────────────────────────────────────────────────────────

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

function checkFaqs(faqs, errors, min) {
  if (!Array.isArray(faqs) || faqs.length < min) {
    errors.push(`expected at least ${min} FAQs, got ${faqs?.length ?? 0}`);
    return;
  }
  faqs.forEach((f, i) => {
    if (!f?.question?.trim()) errors.push(`faqs[${i}].question is empty`);
    if (!f?.answer?.trim()) errors.push(`faqs[${i}].answer is empty`);
    if (f?.answer && words(f.answer) < 15) {
      errors.push(`faqs[${i}].answer is too short to be useful (<15 words)`);
    }
  });
}

/** Returns a list of problems; empty means the post is safe to write. */
export function validatePost(post, { minWords = 1200 } = {}) {
  const errors = [];

  if (!post.title?.trim()) errors.push('title is empty');
  if (post.seoTitle && post.seoTitle.length > 70) {
    errors.push(`seoTitle is ${post.seoTitle.length} chars (max 70)`);
  }
  if (post.seoDescription && post.seoDescription.length > 165) {
    errors.push(`seoDescription is ${post.seoDescription.length} chars (max 165)`);
  }
  if (!post.excerpt?.trim()) errors.push('excerpt is empty');
  if (!Array.isArray(post.categories) || post.categories.length === 0) {
    errors.push('at least one category is required');
  }

  const count = words(post.content ?? '');
  if (count < minWords) errors.push(`content is ${count} words (minimum ${minWords})`);
  if (/<h1[\s>]/i.test(post.content ?? '')) errors.push('content must not contain <h1>');
  if (!/<h2[\s>]/i.test(post.content ?? '')) errors.push('content has no <h2> headings');

  checkFaqs(post.faqs, errors, 4);
  return errors;
}

/** Returns a list of problems; empty means the geo record is safe to write. */
export function validateGeo(record) {
  const errors = [];

  if (!record.intro?.trim()) errors.push('intro is empty');
  // The geo loader hard-requires exactly 3 — the hero band is a 3-up.
  if (!Array.isArray(record.stats) || record.stats.length !== 3) {
    errors.push(`stats must be exactly 3 entries, got ${record.stats?.length ?? 0}`);
  } else {
    record.stats.forEach((s, i) => {
      if (!s?.value?.trim() || !s?.label?.trim()) errors.push(`stats[${i}] is incomplete`);
    });
  }
  if (!Array.isArray(record.localFactors) || record.localFactors.length === 0) {
    errors.push('at least one localFactor is required');
  }

  checkFaqs(record.faqs, errors, 4);
  return errors;
}

export function slugify(title) {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/-+$/, '');
  return SLUG.test(slug) ? slug : null;
}

export const readingTime = (html) => Math.max(1, Math.round(words(html) / 220));
