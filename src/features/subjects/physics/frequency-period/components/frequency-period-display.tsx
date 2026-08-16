import { period } from "../wave-model";

interface FrequencyPeriodDisplayProps {
  frequency: number;
}

export function FrequencyPeriodDisplay({ frequency }: FrequencyPeriodDisplayProps) {
  const T = period(frequency);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Frequency</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">
          f = {frequency} Hz
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          How many complete cycles occur every second.
        </p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Period</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">
          T = {T.toFixed(2).replace(/\.?0+$/, "") || "0"} s
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          The time required for one complete cycle.
        </p>
      </div>

      <div className="sm:col-span-2 rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Relationship</p>
        <p className="mt-2 font-display text-xl font-medium text-ink dark:text-bone">T = 1 / f</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          T = 1 / {frequency} = {T.toFixed(2).replace(/\.?0+$/, "") || "0"} s
        </p>
      </div>
    </div>
  );
}
