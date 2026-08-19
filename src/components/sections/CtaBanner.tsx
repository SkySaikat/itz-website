import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function CtaBanner({
  eyebrow = 'Find out how we can help your business succeed.',
  title,
  highlight,
  body,
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Word inside `title` to wrap in the amber marker underline. */
  highlight?: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn('container', className)}>
      <div className="on-dark relative overflow-hidden rounded-4xl bg-gradient-navy px-6 py-14 text-center sm:px-12 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 bg-dot-grid bg-dots text-blue-400/30"
        />
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow-script text-amber-400">{eyebrow}</p>

          <h2 className="mt-3 text-display-md text-white">{renderTitle(title, highlight)}</h2>

          {body ? <p className="mt-5 text-body-lg text-navy-100">{body}</p> : null}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="onDark" size="lg">
              Get a Free Quote Today
            </Button>
            <Button href="/case-studies" variant="outlineOnDark" size="lg">
              See Case Studies
            </Button>
          </div>

          <p className="mt-6 text-sm text-navy-200">Free audit &middot; No obligation &middot; No long-term contract</p>
        </div>
      </div>
    </div>
  );
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) return title;
  const [before, ...rest] = title.split(highlight);
  return (
    <>
      {before}
      <span className="marker-underline px-0.5">{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}
