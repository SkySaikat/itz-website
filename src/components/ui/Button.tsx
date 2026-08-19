import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'outlineOnDark';
type Size = 'md' | 'lg';

/*
 * Measured contrast (AA needs 4.5:1 for a label at these sizes):
 *   primary    #FFF    on #0974E4 → 4.54:1  AA   (gradient darkens to #075CBC
 *                                                 → 6.43:1 across most of the fill)
 *   secondary  #075CBC on #FFF    → 6.43:1  AA
 *              — the original used #0974E4 here at 4.54:1, right on the line;
 *                one step darker buys real headroom at 13px small-caps.
 *   ghost      #00386C on #FFF    → 11.78:1 AAA
 *   onDark     #0B2D57 on #FBBB5B → 8.09:1  AAA
 * Every size clears a 48px hit area.
 */
const base =
  'group inline-flex items-center justify-center gap-2 rounded-pill font-semibold ' +
  'transition-all duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-cta text-white shadow-cta ring-blue-500 ' +
    'hover:shadow-cta-hover hover:brightness-110 active:brightness-95 active:shadow-cta',
  secondary:
    'bg-white text-blue-600 shadow-card ring-blue-500 ring-offset-white ' +
    'hover:bg-blue-50 hover:text-blue-700 hover:shadow-card-hover active:bg-blue-100',
  ghost:
    'border-2 border-navy-200 bg-transparent text-navy-700 ring-blue-500 ' +
    'hover:border-navy-700 hover:bg-navy-50 active:bg-navy-100',
  onDark:
    'bg-amber-400 text-navy-800 shadow-lg ring-amber-300 ring-offset-navy-800 ' +
    'hover:bg-amber-300 hover:shadow-xl active:bg-amber-500',
  // `bg-none` is load-bearing: without it the gradient background-image from a
  // sibling utility survives a background-color override.
  outlineOnDark:
    'border-2 border-white/40 bg-none bg-transparent text-white ring-amber-300 ring-offset-navy-800 ' +
    'hover:border-white/70 hover:bg-white/10 active:bg-white/20',
};

const sizes: Record<Size, string> = {
  md: 'min-h-tap px-6 text-[0.9375rem] tracking-wide',
  lg: 'min-h-[3.5rem] px-8 text-base tracking-wide',
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    'href' | 'className' | 'children'
  >;

type ButtonAsButton = BaseProps & { href?: never } & Omit<
    ComponentPropsWithoutRef<'button'>,
    'className' | 'children'
  >;

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in rest && rest.href) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');

    if (external) {
      return (
        <a href={href} className={classes} {...(linkProps as ComponentPropsWithoutRef<'a'>)}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<'button'>)}>
      {children}
    </button>
  );
}
