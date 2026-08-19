import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { site } from '@/lib/site';

export function Logo({
  variant = 'dark',
  className,
  priority = false,
}: {
  variant?: 'dark' | 'white';
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      // tap-target gives the link a 48px hit area without padding the logo
      // itself, which would eat into the header's vertical rhythm.
      className={cn('tap-target inline-flex items-center rounded-lg', className)}
      aria-label={`${site.name} — home`}
    >
      <Image
        src={variant === 'white' ? '/logo/itz-digital-white.svg' : '/logo/itz-digital.svg'}
        alt={site.name}
        width={168}
        height={45}
        priority={priority}
        className="h-8 w-auto lg:h-9"
      />
    </Link>
  );
}
