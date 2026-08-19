import Image from 'next/image';

import { Marquee } from '@/components/motion/Marquee';

// Intrinsic dimensions read off each asset so the aspect-ratio box is correct
// and the row does not shift as logos decode.
const clients = [
  { name: 'AT&T', src: '/images/clients/att.webp', w: 320, h: 131 },
  { name: 'Keller Williams Realty', src: '/images/clients/keller-williams.webp', w: 320, h: 174 },
  { name: 'Live Nation', src: '/images/clients/live-nation.svg', w: 189, h: 42 },
  { name: 'Orangetheory Fitness', src: '/images/clients/orangetheory.webp', w: 320, h: 80 },
  { name: 'Oregon State University', src: '/images/clients/oregon-state.svg', w: 222, h: 72 },
  { name: 'Portland Center Stage', src: '/images/clients/portland-center-stage.svg', w: 123, h: 60 },
  { name: 'Stafford Virginia', src: '/images/clients/stafford-virginia.svg', w: 167, h: 60 },
  { name: 'United Way', src: '/images/clients/united-way.webp', w: 320, h: 136 },
];

export function ClientLogos() {
  return (
    <section className="bg-surface-muted py-16 lg:py-20" aria-labelledby="clients-heading">
      <div className="container">
        <h2
          id="clients-heading"
          className="text-center text-xl font-bold text-blue-600 sm:text-2xl"
        >
          Some of our notable clients &amp; partners
        </h2>

        {/* A drifting marquee rather than a static grid — it reads as a
            living client roster and sidesteps the mobile squeeze the old
            fixed 4-up had. Pauses on hover; static under reduced motion. */}
        <Marquee className="mt-12" speed={52}>
          <ul className="flex items-center">
            {clients.map((client) => (
              <li key={client.name} className="flex shrink-0 items-center justify-center px-8 sm:px-12">
                <Image
                  src={client.src}
                  alt={client.name}
                  width={client.w}
                  height={client.h}
                  loading="lazy"
                  className="h-10 w-auto max-w-[9rem] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12"
                />
              </li>
            ))}
          </ul>
        </Marquee>

      </div>
    </section>
  );
}
