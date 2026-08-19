#!/usr/bin/env node
/*
 * WordPress WXR → JSON importer.
 *
 *   node scripts/import-wordpress.mjs ../itzdigital.WordPress.2026-08-18.xml
 *
 * Writes one JSON file per published post to src/content/posts/, plus an
 * index.json holding metadata only. Bodies are kept out of the index so the
 * blog listing does not pull ~5 MB of article HTML into the build graph.
 *
 * Post images are NOT copied into public/. Their URLs are rewritten to
 * NEXT_PUBLIC_MEDIA_BASE so the 1.4 GB uploads directory stays out of the
 * repo — see next.config.mjs `images.remotePatterns`.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/content/posts');

const xmlPath = process.argv[2];
if (!xmlPath) {
  console.error('Usage: node scripts/import-wordpress.mjs <export.xml>');
  process.exit(1);
}

const xml = readFileSync(resolve(process.cwd(), xmlPath), 'utf8');

const cdata = (s) => s.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? cdata(m[1]) : '';
}

function meta(block, key) {
  const m = block.match(
    new RegExp(
      `<wp:meta_key>(?:<!\\[CDATA\\[)?${key}(?:\\]\\]>)?</wp:meta_key>\\s*<wp:meta_value>([\\s\\S]*?)</wp:meta_value>`,
    ),
  );
  return m ? cdata(m[1]) : '';
}

function terms(block, domain) {
  return [...block.matchAll(new RegExp(`<category domain="${domain}"[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></category>`, 'g'))].map(
    (m) => m[1].trim(),
  );
}

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

// Point uploads at a media host instead of bundling them.
const rewriteMedia = (html) =>
  html.replace(
    /https?:\/\/itzdigital\.co\/wp-content\/uploads\//g,
    '${MEDIA_BASE}/',
  );

const excerptFrom = (html) => {
  const text = decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  if (text.length <= 180) return text;
  return `${text.slice(0, 177).replace(/\s+\S*$/, '')}…`;
};

const readingTime = (html) => {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

const slugFromLink = (link, fallback) => {
  try {
    const path = new URL(link).pathname.replace(/^\/|\/$/g, '');
    return path.split('/').pop() || fallback;
  } catch {
    return fallback;
  }
};

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const index = [];
let skipped = 0;

for (const item of items) {
  const type = tag(item, 'wp:post_type');
  const status = tag(item, 'wp:status');
  if (type !== 'post' || status !== 'publish') continue;

  const title = decode(tag(item, 'title'));
  const link = tag(item, 'link');
  const name = tag(item, 'wp:post_name');
  const slug = decodeURIComponent(slugFromLink(link, name));
  const contentRaw = (item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/) || [, ''])[1];
  const content = rewriteMedia(cdata(contentRaw));

  if (!slug || !title || content.trim().length < 200) {
    skipped += 1;
    continue;
  }

  const date = tag(item, 'wp:post_date_gmt') || tag(item, 'wp:post_date');
  const rawExcerpt = cdata((item.match(/<excerpt:encoded>([\s\S]*?)<\/excerpt:encoded>/) || [, ''])[1]);

  const post = {
    slug,
    title,
    date: date ? new Date(`${date.replace(' ', 'T')}Z`).toISOString() : null,
    excerpt: rawExcerpt ? excerptFrom(rawExcerpt) : excerptFrom(content),
    categories: terms(item, 'category'),
    tags: terms(item, 'post_tag'),
    seoTitle: decode(meta(item, 'rank_math_title')) || null,
    seoDescription: decode(meta(item, 'rank_math_description')) || null,
    readingTime: readingTime(content),
    content,
  };

  writeFileSync(resolve(OUT_DIR, `${slug}.json`), JSON.stringify(post));

  const { content: _omit, ...summary } = post;
  index.push(summary);
}

index.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
writeFileSync(resolve(OUT_DIR, '..', 'posts-index.json'), JSON.stringify(index, null, 2));

console.log(`Imported ${index.length} posts to src/content/posts/ (skipped ${skipped} empty).`);
console.log(`Categories: ${[...new Set(index.flatMap((p) => p.categories))].join(', ')}`);
