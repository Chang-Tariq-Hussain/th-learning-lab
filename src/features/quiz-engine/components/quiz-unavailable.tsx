import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QuizUnavailableProps {
  backHref: string;
  backLabel: string;
}

/**
 * Rendered instead of the quiz whenever `validateQuizQuestions` finds
 * a problem — an empty question list, a missing prompt, too few
 * options, or a correct answer that doesn't match any option. Mirrors
 * the styling of the dashboard's route-level `error.tsx` so it reads
 * as "expected empty state," not a crash.
 */
export function QuizUnavailable({ backHref, backLabel }: QuizUnavailableProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-[1.75rem] border border-line bg-white/60 px-6 py-16 text-center shadow-card dark:border-line-dark dark:bg-white/[0.03]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-lg font-medium text-ink dark:text-bone">This quiz isn&apos;t ready yet.</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Its questions aren&apos;t set up correctly. Please check back soon.
        </p>
      </div>
      <Button variant="ghost" size="md" href={backHref}>
        {backLabel}
      </Button>
    </div>
  );
}
