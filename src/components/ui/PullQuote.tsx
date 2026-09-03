import { cn } from '@/lib/cn';

/**
 * Editorial pull quote for long-form prose blocks. Not a testimonial — this is
 * for surfacing a line of the agency's own copy, so it takes plain text and an
 * optional attribution label (a role or a section, never an invented name).
 */
export function PullQuote({
  children,
  cite,
  className,
}: {
  children: string;
  cite?: string;
  className?: string;
}) {
  return (
    <figure className={cn('relative my-2', className)} data-reveal>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-6 select-none font-display text-7xl leading-none text-amber-300"
      >
        &ldquo;
      </span>
      <blockquote className="relative border-l-2 border-amber-400 pl-6 text-display-sm font-semibold leading-snug text-navy-700">
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="mt-3 pl-6 text-eyebrow uppercase text-blue-600">{cite}</figcaption>
      ) : null}
    </figure>
  );
}
