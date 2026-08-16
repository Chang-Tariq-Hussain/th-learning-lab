interface FeedbackBannerProps {
  status: "idle" | "correct" | "incorrect";
  message: string;
  guess: { x: number; y: number } | null;
  target: { x: number; y: number };
}

/**
 * Shows the student's own guess ("Your point: (x, y)"), then the
 * relevant feedback beneath it. On a correct answer this also shows a
 * one-line mini explanation of the point that just got plotted; it
 * naturally disappears when the next question replaces this banner.
 */
export function FeedbackBanner({ status, message, guess, target }: FeedbackBannerProps) {
  if (!guess) {
    return (
      <div className="rounded-card border border-line bg-white/60 p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
        Tap anywhere on the grid to place your point.
      </div>
    );
  }

  return (
    <div
      className={`rounded-card border p-4 text-center transition-colors duration-200 ${
        status === "correct"
          ? "border-pine-500/40 bg-pine-500/10 dark:border-pine-300/30 dark:bg-pine-300/10"
          : "border-amber-500/40 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10"
      }`}
    >
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Your point: <span className="font-mono font-semibold text-ink dark:text-bone">({guess.x}, {guess.y})</span>
      </p>

      {status === "correct" ? (
        <div className="mt-2 space-y-1">
          <p className="font-display text-base font-semibold text-pine-700 dark:text-pine-300">
            ✓ Correct! You plotted ({target.x}, {target.y}).
          </p>
          <p className="text-xs leading-relaxed text-ink-soft/90 dark:text-bone-soft/90">
            x = {target.x} → move {Math.abs(target.x)} units {target.x >= 0 ? "right" : "left"} · y = {target.y} → move{" "}
            {Math.abs(target.y)} units {target.y >= 0 ? "up" : "down"}
          </p>
        </div>
      ) : (
        <p className="mt-2 font-display text-base font-medium text-amber-700 dark:text-amber-300">{message}</p>
      )}
    </div>
  );
}
