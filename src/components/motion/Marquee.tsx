import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * CSS-only infinite marquee. The children are rendered twice and the track is
 * translated -50%, so the loop is seamless. Pauses on hover, and stops
 * entirely under prefers-reduced-motion (handled in globals.css).
 */
export function Marquee({
  children,
  speed = 46,
  className,
}: {
  children: ReactNode;
  /** Seconds for one full pass. Higher = slower. */
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn('marquee group', className)} aria-hidden="false">
      <div
        className="marquee-track group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="marquee-group">{children}</div>
        {/* Duplicate for the seamless loop — hidden from AT so the list isn't
            announced twice. */}
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
