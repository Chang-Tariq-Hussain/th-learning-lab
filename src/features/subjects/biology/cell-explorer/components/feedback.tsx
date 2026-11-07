import { CheckCircle2, Info, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedbackTone = "success" | "retry" | "info";

const TONES: Record<FeedbackTone, string> = {
  success: "border-emerald-700/40 bg-emerald-50 text-emerald-900 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200",
  retry: "border-amber-700/40 bg-amber-50 text-amber-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-200",
  info: "border-line bg-white/70 text-ink dark:border-line-dark dark:bg-white/[0.04] dark:text-bone",
};
const ICONS = { success: CheckCircle2, retry: RefreshCcw, info: Info } as const;

/** Result of an answer: always an icon plus words (never colour alone), announced politely to screen readers. */
export function Feedback({ tone, title, children, testId }: { tone: FeedbackTone; title: string; children?: React.ReactNode; testId?: string }) {
  const Icon = ICONS[tone];
  return (
    <div role="status" aria-live="polite" data-testid={testId} data-tone={tone} className={cn("flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed", TONES[tone])}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-0.5">{children}</div> : null}
      </div>
    </div>
  );
}

export function ProgressSteps({ index, total, finished }: { index: number; total: number; finished: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ol className="flex flex-1 gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={cn("h-1.5 flex-1 rounded-full", i < index || finished ? "bg-subject-biology" : i === index ? "bg-subject-biology/50" : "bg-ink/15 dark:bg-bone/20")} />
        ))}
      </ol>
      <p className="shrink-0 font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        {finished ? "Done" : `Question ${index + 1} of ${total}`}
      </p>
    </div>
  );
}

const CORRECT = ["Nice work!", "That's right!", "Exactly!", "Well spotted!", "You've got it!"];
const TRY_AGAIN = ["Not quite, but you're close to learning it.", "Good try. Have another look.", "Not that one. Mistakes are how we learn, so try again."];

export const praise = (i: number) => CORRECT[i % CORRECT.length]!;
export const tryAgain = (i: number) => TRY_AGAIN[i % TRY_AGAIN.length]!;

export function resultMessage(correct: number, total: number): string {
  const ratio = total === 0 ? 0 : correct / total;
  if (ratio === 1) return "Perfect round: every answer correct on the first try.";
  if (ratio >= 0.7) return "Great work! Review the few you missed, then try another round.";
  if (ratio >= 0.4) return "Good progress. Look over the ones below in Explore, then try again.";
  return "A solid start. Every cell biologist began here. Explore the structures below, then give it another go.";
}
