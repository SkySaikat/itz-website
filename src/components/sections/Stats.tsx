/** `count` drives the scroll-triggered count-up in ScrollFx. */
const stats = [
  { count: 38, prefix: '+', suffix: '%', label: 'Average increase in qualified leads', accent: false },
  { count: 24, prefix: '-', suffix: '%', label: 'Average reduction in cost per lead', accent: false },
  { count: 20, prefix: '', suffix: '+', label: 'Years running local campaigns', accent: true },
  { count: 500, prefix: '', suffix: '+', label: 'Small businesses served', accent: false },
];

export function Stats() {
  return (
    <section className="on-dark bg-gradient-navy py-section lg:py-section-lg">
      <div className="container">
        <h2 className="sr-only">Results by the numbers</h2>

        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="border-t border-white/15 pt-6"
              data-reveal
              data-reveal-delay={i}
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span
                  className={`block text-5xl font-extrabold tracking-tight tabular-nums lg:text-6xl ${
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
