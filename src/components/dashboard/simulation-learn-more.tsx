import type { ReactNode } from "react";
import { BookOpen, FlaskConical, Sparkles, Target } from "lucide-react";
import { InstructionsPanel } from "@/features/simulation";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import { RulerDivider } from "@/components/ui/ruler-divider";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { cn } from "@/lib/utils";

export interface LearnMoreConcept {
  /** Short name of the concept, e.g. "Atomic number". */
  term: string;
  /** Plain-language explanation, one or two sentences. */
  explanation: string;
  /** Optional LaTeX formula, e.g. "A = Z + N". */
  formula?: string;
  /** Optional caption shown above the formula, e.g. "Mass number". */
  formulaCaption?: string;
}

export interface SimulationLearnMoreProps {
  /** Tints icons/accents to match the subject — same tokens as QuizCta ("physics" | "chemistry" | "biology" | "math"). */
  colorToken: string;
  /** 2–4 short bullets: what the student should be able to do after using this simulation. */
  objectives: string[];
  /** The core ideas the simulation illustrates, in plain language. */
  concepts: LearnMoreConcept[];
  /** Short ordered steps for using the simulation. Rendered in a collapsible panel so the page stays scannable. */
  howToUse: string[];
  /** One short paragraph connecting the concept to the real world. */
  whyItMatters: string;
  /** Optional short challenges or observation questions the student can try. */
  tryThis?: string[];
  className?: string;
}

function SectionCard({
  icon,
  label,
  colorClass,
  bgClass,
  children,
}: {
  icon: ReactNode;
  label: string;
  colorClass: string;
  bgClass: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", bgClass, colorClass)}>
          {icon}
        </span>
        <h3 className="font-display text-base font-medium text-ink dark:text-bone">{label}</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * The standard "learn more" block for a simulation page — dropped in
 * below the interactive simulation (and below `QuizCta`, if present).
 * Every simulation supplies the same five kinds of content
 * (objectives, concepts, how-to-use, why-it-matters, optional
 * try-this challenges) so pages stay consistent as more simulations
 * get this treatment, while the actual copy is fully per-page.
 *
 * "How to use" reuses the existing `InstructionsPanel` (collapsed by
 * default) so this whole block doesn't push the page too long.
 */
export function SimulationLearnMore({
  colorToken,
  objectives,
  concepts,
  howToUse,
  whyItMatters,
  tryThis,
  className,
}: SimulationLearnMoreProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <div className={cn("mt-10", className)}>
      <RulerDivider className="mb-8" />

      <p className={cn("mb-6 font-mono text-[11px] uppercase tracking-[0.2em]", colors.text)}>Learn more</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          icon={<Target className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
          label="Learning objectives"
          colorClass={colors.text}
          bgClass={colors.bg}
        >
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {objectives.map((objective, index) => (
              <li key={index} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
          label="Key concepts"
          colorClass={colors.text}
          bgClass={colors.bg}
        >
          <div className="flex flex-col gap-4">
            {concepts.map((concept, index) => (
              <div key={index}>
                <p className="text-sm font-medium text-ink dark:text-bone">{concept.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{concept.explanation}</p>
                {concept.formula ? (
                  <FormulaCard formula={concept.formula} caption={concept.formulaCaption} className="mt-2 py-3" />
                ) : null}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <InstructionsPanel title="How to use this simulation" steps={howToUse} defaultOpen={false} className="mt-4" />

      <div className={cn("mt-4 grid gap-4", tryThis && tryThis.length > 0 ? "lg:grid-cols-2" : "grid-cols-1")}>
        <SectionCard
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
          label="Why it matters"
          colorClass={colors.text}
          bgClass={colors.bg}
        >
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{whyItMatters}</p>
        </SectionCard>

        {tryThis && tryThis.length > 0 ? (
          <SectionCard
            icon={<FlaskConical className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            label="Try this"
            colorClass={colors.text}
            bgClass={colors.bg}
          >
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {tryThis.map((challenge, index) => (
                <li key={index} className="flex gap-2">
                  <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                  {challenge}
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}
