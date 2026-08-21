import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";

export interface SectionShellProps {
  icon: ReactNode;
  label: string;
  colorToken: string;
  children: ReactNode;
  className?: string;
}

/**
 * The small "icon badge + eyebrow label" header every learning
 * section (Learn, Predict, Explain, Practice, Challenge, Mastery)
 * opens with, followed by its own content. Mirrors the visual
 * language of `SimulationLearnMore`'s section header without
 * importing from it directly, since that component isn't set up to
 * export its internals — this is the one small, intentional
 * duplication in this feature (a header pattern, not a data model),
 * kept in a single shared file so it's defined once for every
 * subject rather than once per section.
 */
export function SectionShell({ icon, label, colorToken, children, className }: SectionShellProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <section className={cn("scroll-mt-24", className)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", colors.bg, colors.text)}>
          {icon}
        </span>
        <p className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", colors.text)}>{label}</p>
      </div>
      {children}
    </section>
  );
}
