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
      <div className="on-dark mesh mesh-dark relative overflow-hidden rounded-5xl bg-gradient-navy px-6 py-16 text-center shadow-card-lg sm:px-12 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 bg-dot-grid bg-dots text-blue-400/30"
        />
        <div
          aria-hidden="true"
          className="drift-slow accent-orb -bottom-16 -left-16 h-64 w-64 bg-blue-500/25"
        />
        <div
          aria-hidden="true"
          className="drift accent-orb -right-20 bottom-0 h-56 w-56 bg-amber-400/12"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow-script text-amber-400">{eyebrow}</p>

          <h2 className="mt-3 text-display-lg text-white">{renderTitle(title, highlight)}</h2>

          {body ? <p className="mt-5 text-body-xl text-navy-100">{body}</p> : null}

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
