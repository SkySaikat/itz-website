import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A card whose entire surface is clickable. The <Link> is stretched over the
 * card with an ::after pseudo-element rather than wrapping the content, so
 * nested links and text selection keep working.
 */
export function LinkCard({
  href,
  eyebrow,
  title,
  body,
  icon,
  className,
  cta = 'Learn more',
}: {
  href: string;
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: ReactNode;
  className?: string;
  cta?: string;
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover',
        'focus-within:-translate-y-1 focus-within:border-blue-300 focus-within:shadow-card-hover',
        className,
      )}
    >
      {icon ? <div className="mb-5">{icon}</div> : null}

      {eyebrow ? <p className="eyebrow-script mb-2">{eyebrow}</p> : null}

      <h3 className="text-lg font-bold leading-snug text-navy-700 sm:text-xl">
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {title}
        </Link>
      </h3>

      {body ? <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">{body}</p> : null}

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
        {cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </div>
  );
}
