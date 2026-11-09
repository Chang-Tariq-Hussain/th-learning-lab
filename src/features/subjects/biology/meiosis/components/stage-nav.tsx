"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES } from "../data/stages";
import { BEAT_COUNT, BEAT_STAGE } from "../engine/beats";
import { useClockPos, type BeatClock } from "../hooks/use-beat-timeline";

function Progress({ clock }: { clock: BeatClock }) {
  const pos = useClockPos(clock);
  const pct = (pos / (BEAT_COUNT - 1)) * 100;
  return (
    <div
      className="relative h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-bone/15"
      role="progressbar"
      aria-label="Meiosis progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      data-testid="meiosis-progress"
    >
      <div className="absolute inset-y-0 left-0 rounded-full bg-subject-biology" style={{ width: `${pct}%` }} />
      {Array.from({ length: BEAT_COUNT - 1 }, (_, i) => (BEAT_STAGE[i] !== BEAT_STAGE[i + 1] ? i + 0.5 : null)).map((x, i) =>
        x === null ? null : <span key={i} className="absolute inset-y-0 w-px bg-paper dark:bg-chalkboard" style={{ left: `${((x + 0.5) / (BEAT_COUNT - 1)) * 100}%` }} />,
      )}
    </div>
  );
}

export interface StageNavProps {
  clock: BeatClock;
  stageIndex: number;
  onSelect: (stage: number) => void;
  disabled?: boolean;
}

/** Progress bar (continuous, with a tick between stages) over nine stage chips that double as navigation. */
export function StageNav({ clock, stageIndex, onSelect, disabled }: StageNavProps) {
  return (
    <nav aria-label="Meiosis stages" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink dark:text-bone" data-testid="stage-count">
          Stage {stageIndex + 1} of {STAGES.length}
        </p>
        <p className="font-mono text-label uppercase tracking-eyebrow text-ink-soft dark:text-bone-soft">
          {STAGES[stageIndex]!.phase === "prep" ? "Before meiosis" : `Meiosis ${STAGES[stageIndex]!.phase}`}
        </p>
      </div>
      <Progress clock={clock} />
      <ol className="grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-3">
        {STAGES.map((s, i) => {
          const current = i === stageIndex;
          const done = i < stageIndex;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={disabled}
                aria-current={current ? "step" : undefined}
                data-stage-chip={i}
                onClick={() => onSelect(i)}
                className={cn(
                  "flex min-h-11 w-full flex-wrap items-center justify-center gap-x-1 rounded-xl border px-1 py-1 text-center text-[12px] font-medium leading-tight transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50 dark:focus-visible:outline-bone",
                  current
                    ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard"
                    : done
                      ? "border-subject-biology/40 bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15"
                      : "border-line bg-white/60 text-ink-soft hover:text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft dark:hover:text-bone",
                )}
              >
                {done ? <Check className="h-3 w-3 shrink-0" strokeWidth={3} aria-hidden="true" /> : <span className="tabular-nums">{s.number}</span>}
                <span>{s.short}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
