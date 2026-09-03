import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/ui/PostCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { allPosts } from '@/lib/posts';

/**
 * "From the blog" — the three most recent posts. Server component (reads the
 * server-only posts index). Used on the homepage and the pricing page.
 */
export function BlogTeaser({
  eyebrow = 'From the blog',
  title = 'Guides, benchmarks and pricing breakdowns',
  intro = 'Practical writing on the tactics behind every service — SEO fundamentals, paid ad setup, and what each channel actually costs.',
  tone = 'muted',
  limit = 3,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  tone?: 'white' | 'muted';
  limit?: number;
}) {
  const posts = [...allPosts]
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        action={
          <Button href="/blog" variant="secondary">
            View all articles
          </Button>
        }
      />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.slug} data-reveal data-reveal-delay={i}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
