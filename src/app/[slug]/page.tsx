import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { industries, industryBySlug } from '@/lib/industries';
import { allPosts } from '@/lib/posts';

import { IndustryPage, industryMetadata } from './IndustryPage';
import { PostPage, postMetadata } from './PostPage';

/*
 * The root dynamic segment serves two kinds of page, both keeping their
 * original WordPress paths:
 *
 *   /lawyers, /medical, ...   top-level industry pages (see IndustryPage)
 *   /some-post-title          blog posts (see PostPage)
 *
 * Next.js only allows one dynamic segment per level, so this file decides
 * which one a slug belongs to. Industries win if a slug ever appears in both;
 * generateStaticParams throws at build time so that can never ship silently.
 */
export const dynamicParams = false;

const industrySlugs = new Set(industries.map((i) => i.slug));

export function generateStaticParams() {
  const clash = allPosts.find((p) => industrySlugs.has(p.slug));
  if (clash) {
    throw new Error(`Blog post slug "${clash.slug}" collides with an industry page at /${clash.slug}`);
  }
  return [
    ...industries.map((i) => ({ slug: i.slug })),
    ...allPosts.map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (industryBySlug.has(slug)) return industryMetadata(slug);
  return postMetadata(slug);
}

export default async function RootSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (industryBySlug.has(slug)) return <IndustryPage slug={slug} />;
  if (allPosts.some((p) => p.slug === slug)) return <PostPage slug={slug} />;
  notFound();
}
