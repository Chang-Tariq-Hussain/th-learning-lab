import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { TopicMasterySummary } from "../mastery-types";

export interface ConceptMasteryPanelProps {
  summary: TopicMasterySummary;
  colorToken: string;
  className?: string;
}

/**
 * Shows what the student has already demonstrated for the topic
 * they're about to practice — one bar per concept, weakest first (see
 * `computeConceptMastery`), plus the same "Practice X next" line the
 * Practice Engine uses to prioritize question selection. Renders
 * nothing until there's at least one attempt on record, so a
 * first-time student sees a clean config screen instead of an empty
 * chart.
 */
export function ConceptMasteryPanel({ summary, colorToken, className }: ConceptMasteryPanelProps) {
  if (summary.totalAttempts === 0) return null;

  const colors = resolveSubjectColors(colorToken);

  return (
    <div className={cn("rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]", className)}>
      <p className="text-sm font-medium text-ink dark:text-bone">Your mastery so far</p>

      <div className="mt-3 flex flex-col gap-2.5">
        {summary.concepts.map((concept) => {
          const percent = Math.round(concept.accuracy * 100);
          return (
            <div key={concept.concept} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-ink-soft dark:text-bone-soft sm:w-36">
                {concept.concept}
              </span>
              <div
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-bone/10"
                role="progressbar"
                aria-label={`${concept.concept} accuracy`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={cn("h-full rounded-full", colors.bar)} style={{ width: `${percent}%` }} />
              </div>
              <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-ink-soft dark:text-bone-soft">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>

      {summary.recommendation ? (
        <p className={cn("mt-3 text-sm font-medium", colors.text)}>{summary.recommendation}</p>
      ) : null}
    </div>
  );
}
