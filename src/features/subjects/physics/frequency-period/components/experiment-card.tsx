import { TARGET_EXPERIMENT_FREQUENCY } from "../wave-model";

interface ExperimentCardProps {
  frequency: number;
}

export function ExperimentCard({ frequency }: ExperimentCardProps) {
  const solved = frequency === TARGET_EXPERIMENT_FREQUENCY;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-base font-medium text-ink dark:text-bone">
        Can you make the wave complete 3 cycles in one second?
      </p>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Use the frequency control above.</p>

      {solved ? (
        <p className="mt-3 text-sm font-medium text-pine-600 dark:text-pine-300">
          ✓ Correct! 3 Hz means 3 complete cycles per second.
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">
          Adjust the frequency until you see 3 cycles in one second.
        </p>
      )}
    </div>
  );
}
