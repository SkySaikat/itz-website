import { Clock, TrendingDown, TrendingUp, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** `count` drives the scroll-triggered count-up in ScrollFx. */
const stats: {
  count: number;
  prefix: string;
  suffix: string;
  label: string;
  accent: boolean;
  Icon: LucideIcon;
}[] = [
  { count: 38, prefix: '+', suffix: '%', label: 'Average increase in qualified leads', accent: false, Icon: TrendingUp },
  { count: 24, prefix: '-', suffix: '%', label: 'Average reduction in cost per lead', accent: false, Icon: TrendingDown },
  { count: 20, prefix: '', suffix: '+', label: 'Years running local campaigns', accent: true, Icon: Clock },
  { count: 500, prefix: '', suffix: '+', label: 'Small businesses served', accent: false, Icon: Users },
];

export function Stats() {
  return (
    <section className="on-dark mesh mesh-dark relative bg-gradient-navy py-section lg:py-section-lg">
      <div className="container relative">
        <h2 className="sr-only">Results by the numbers</h2>

        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm"
              data-reveal
              data-reveal-delay={i}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                  stat.accent ? 'bg-amber-400/15 text-amber-300' : 'bg-blue-400/15 text-blue-200'
                }`}
              >
                <stat.Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span
                  className={`mt-5 block text-[3.25rem] font-extrabold leading-none tracking-tight tabular-nums lg:text-6xl ${
                    stat.accent ? 'text-amber-400' : 'text-white'
                  }`}
                  data-count={stat.count}
                  data-count-prefix={stat.prefix}
                  data-count-suffix={stat.suffix}
                >
                  {stat.prefix}
                  {stat.count}
                  {stat.suffix}
                </span>
                <span className="mt-3 block text-[0.9375rem] leading-relaxed text-navy-200">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
