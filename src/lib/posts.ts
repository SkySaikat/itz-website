import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import index from '@/content/posts-index.json';
import type { Faq } from './geo/types';

export type PostSummary = {
  slug: string;
  title: string;
  date: string | null;
  excerpt: string;
  categories: string[];
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  readingTime: number;
  /** Present on generated posts; the WordPress-imported posts omit it. */
  faqs?: Faq[];
};

export type Post = PostSummary & { content: string };

/** Where post images are served from. Set to a CDN or the legacy WP host. */
const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE ?? 'https://itzdigital.co/wp-content/uploads';

const POSTS_DIR = join(process.cwd(), 'src/content/posts');

export const allPosts = index as PostSummary[];

export const categories = [...new Set(allPosts.flatMap((p) => p.categories))].sort();

export function getPost(slug: string): Post | null {
  try {
    const raw = readFileSync(join(POSTS_DIR, `${slug}.json`), 'utf8');
    const post = JSON.parse(raw) as Post;
    // The importer leaves a `${MEDIA_BASE}` token so the host is a deploy-time
    // decision rather than something baked into 595 files.
    return { ...post, content: post.content.replaceAll('${MEDIA_BASE}', MEDIA_BASE) };
  } catch {
    return null;
  }
}

export function postsByCategory(category: string) {
  return allPosts.filter((p) => p.categories.includes(category));
}

export function relatedPosts(post: PostSummary, limit = 3) {
  return allPosts
    .filter((p) => p.slug !== post.slug && p.categories.some((c) => post.categories.includes(c)))
    .slice(0, limit);
}

export function paginate<T>(list: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: list.slice((current - 1) * perPage, current * perPage),
    page: current,
    totalPages,
    total: list.length,
  };
}

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
