import { resolveSubjectColors } from "@/features/subjects/subject-colors";

export interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  colorToken: string;
}

/** "Question X of Y" plus a horizontal progress bar. Pure/presentational
 *  — `<Quiz />` owns the numbers, this just renders them. */
export function QuizProgress({ currentIndex, totalQuestions, colorToken }: QuizProgressProps) {
  const colors = resolveSubjectColors(colorToken);
  const questionNumber = Math.min(currentIndex + 1, totalQuestions);
  const percentage = totalQuestions === 0 ? 0 : Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-ink-soft dark:text-bone-soft">
          {percentage}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]"
      >
        <div
          className={`h-full rounded-full ${colors.bar} transition-[width] duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
