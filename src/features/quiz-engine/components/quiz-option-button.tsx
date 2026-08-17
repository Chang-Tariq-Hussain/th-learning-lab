import { forwardRef } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";

export interface QuizOptionButtonProps {
  optionText: string;
  isSelected: boolean;
  /** Only true once the question has been submitted — before that,
   *  the correct answer is never revealed. */
  isRevealed: boolean;
  isCorrectOption: boolean;
  colorToken: string;
  onSelect: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  tabIndex: number;
}

/**
 * One answer choice. Rendered as `role="radio"` inside the question
 * card's `role="radiogroup"` — a real `<button>` underneath so it's
 * reachable and activatable with just the keyboard, with a visible
 * focus ring (`focus-visible:ring-2`) and a large enough hit target
 * for touch (`min-h-11`, ~44px, the usual mobile tap-target floor).
 *
 * Correct/incorrect is never signalled by color alone — a check or
 * cross icon and the "Correct"/"Your answer" text both back it up,
 * for colorblind users and for anyone using a screen reader.
 */
export const QuizOptionButton = forwardRef<HTMLButtonElement, QuizOptionButtonProps>(
  ({ optionText, isSelected, isRevealed, isCorrectOption, colorToken, onSelect, onKeyDown, tabIndex }, ref) => {
    const colors = resolveSubjectColors(colorToken);

    const showAsCorrect = isRevealed && isCorrectOption;
    const showAsWrongSelection = isRevealed && isSelected && !isCorrectOption;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        tabIndex={tabIndex}
        disabled={isRevealed}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        className={cn(
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium leading-snug transition-colors sm:text-base",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
          "disabled:cursor-default",
          showAsCorrect
            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400/70 dark:bg-emerald-500/10 dark:text-emerald-300"
            : showAsWrongSelection
              ? "border-red-400 bg-red-50 text-red-700 dark:border-red-400/60 dark:bg-red-500/10 dark:text-red-300"
              : isRevealed
                ? "border-line text-ink-soft/60 dark:border-line-dark dark:text-bone-soft/40"
                : isSelected
                  ? cn("border-ink/40 bg-ink/[0.03] text-ink dark:border-bone/40 dark:bg-bone/[0.06] dark:text-bone")
                  : cn(
                      "border-ink/15 text-ink hover:bg-ink/[0.03] dark:border-bone/20 dark:text-bone dark:hover:bg-bone/[0.06]",
                      colors.border,
                    ),
        )}
      >
        <span>{optionText}</span>
        {showAsCorrect && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Correct
          </span>
        )}
        {showAsWrongSelection && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide">
            <X className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Your answer
          </span>
        )}
      </button>
    );
  },
);

QuizOptionButton.displayName = "QuizOptionButton";
