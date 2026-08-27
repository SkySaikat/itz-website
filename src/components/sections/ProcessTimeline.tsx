import { Check } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

export type ProcessStep = {
  /** e.g. "Week 1", "Phase 2", "Ongoing". */
  phase: string;
  /** Optional — when omitted the phase carries the step on its own. */
  title?: string;
  body: string;
};

/**
 * Numbered vertical timeline. Used inside the sub-industry problem/fix split,
 * and as its own section (via `ProcessSection`) on the About, industry and
 * service templates. One implementation so the pattern never drifts.
 */
export function ProcessTimeline({
  steps,
  className,
}: {
  steps: ProcessStep[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        'relative space-y-8 before:absolute before:bottom-4 before:left-[1.0625rem] before:top-4 before:w-px before:bg-gradient-to-b before:from-blue-200 before:via-blue-200 before:to-transparent',
        className,
      )}
    >
      {steps.map((step, idx) => (
        <li key={`${step.phase}-${idx}`} className="relative flex gap-6" data-reveal data-reveal-delay={idx}>
          <span className="relative z-10 mt-0.5 inline-flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center rounded-full bg-gradient-cta text-white shadow-cta">
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          </span>
          <div className="pb-1">
            <p className="text-eyebrow uppercase text-blue-600">{step.phase}</p>
            {step.title ? (
              <h3 className="mt-1 text-lg font-bold text-navy-700">{step.title}</h3>
            ) : null}
            <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-600">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Full section: heading on the left, timeline on the right. */
export function ProcessSection({
  eyebrow = 'How it runs',
  title,
  intro,
  steps,
  tone = 'muted',
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  steps: ProcessStep[];
  tone?: 'white' | 'muted';
  id?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <Section tone={tone} id={id}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <ProcessTimeline steps={steps} className="mt-2" />
        </div>
      </div>
    </Section>
  );
}
