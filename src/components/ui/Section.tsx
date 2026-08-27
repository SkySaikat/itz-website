import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'white' | 'muted' | 'dark';

const tones: Record<Tone, string> = {
  white: 'bg-white',
  muted: 'bg-surface-muted',
  dark: 'on-dark bg-gradient-navy text-navy-100',
};

export function Section({
  tone = 'white',
  className,
  children,
  id,
  /** Paint the soft colour-mesh behind the section content. */
  mesh = false,
  /** Soft top fade instead of a hard edge against the previous section. */
  divider = false,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  id?: string;
  mesh?: boolean;
  divider?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'section-y',
        tones[tone],
        mesh && (tone === 'dark' ? 'mesh mesh-dark' : 'mesh'),
        divider && 'hairline-divider',
        className,
      )}
    >
      <div className="container relative">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowStyle = 'script',
  title,
  intro,
  align = 'left',
  tone = 'light',
  size = 'md',
  action,
}: {
  eyebrow?: string;
  eyebrowStyle?: 'script' | 'caps';
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  /** `lg` bumps the H2 to `display-lg` for section openers that carry weight. */
  size?: 'md' | 'lg';
  action?: ReactNode;
}) {
  const centered = align === 'center';

  return (
    <div
      data-reveal
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
      )}
    >
      <div className={cn(centered ? 'max-w-measure' : 'max-w-3xl')}>
        {eyebrow ? (
          <p
            className={cn(
              'mb-3',
              eyebrowStyle === 'script' ? 'eyebrow-script' : 'eyebrow-caps',
              tone === 'dark' && (eyebrowStyle === 'script' ? 'text-amber-400' : 'text-amber-300'),
            )}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2
          className={cn(
            size === 'lg' ? 'text-display-lg' : 'text-display-md',
            tone === 'dark' && 'text-white',
          )}
        >
          {title}
        </h2>

        {intro ? (
          <p
            className={cn(
              'mt-5 text-body-lg',
              tone === 'dark' ? 'text-navy-100' : 'text-ink-600',
              centered && 'mx-auto',
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
