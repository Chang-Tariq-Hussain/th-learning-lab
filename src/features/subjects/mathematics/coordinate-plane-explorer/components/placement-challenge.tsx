import { PLACEMENT_CHALLENGES } from "../coordinate-model";

interface PlacementChallengeProps {
  step: number;
  solved: boolean;
  onRestart: () => void;
}

/** "Place the point at (x, y)" — success is detected by the orchestrator comparing the live point to the current target. */
export function PlacementChallenge({ step, solved, onRestart }: PlacementChallengeProps) {
  const done = step >= PLACEMENT_CHALLENGES.length;
  const target = done ? null : PLACEMENT_CHALLENGES[step];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">Place the Point</p>
        {!done ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
            {step + 1} / {PLACEMENT_CHALLENGES.length}
          </span>
        ) : (
          <button
            type="button"
            onClick={onRestart}
            className="text-xs font-medium text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          >
            Try again
          </button>
        )}
      </div>

      {done ? (
        <p className="mt-2 text-sm font-medium text-pine-600 dark:text-pine-300">
          ✓ Nice work — you placed every point correctly.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
            Drag the point to ({target!.x}, {target!.y}). Its ghost outline marks the target on the grid.
          </p>
          {solved ? (
            <p className="mt-3 text-sm font-medium text-pine-600 dark:text-pine-300">
              ✓ Correct! You placed the point at ({target!.x}, {target!.y}).
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
