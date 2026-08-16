import { formatSlope, rise, run, slope, type SlopePoint } from "../model";

interface CoordinateReadoutProps {
  a: SlopePoint;
  b: SlopePoint;
}

export function CoordinateReadout({ a, b }: CoordinateReadoutProps) {
  const runVal = run(a, b);
  const riseVal = rise(a, b);
  const m = slope(a, b);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-pine-600 dark:text-pine-300">
          <span className="h-2 w-2 rounded-full bg-pine-500 dark:bg-pine-300" /> Point A
        </p>
        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink dark:text-bone">
          ({a.x}, {a.y})
        </p>
      </div>
      <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400" /> Point B
        </p>
        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink dark:text-bone">
          ({b.x}, {b.y})
        </p>
      </div>
      <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">Rise / Run</p>
        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink dark:text-bone">
          {riseVal} / {runVal}
        </p>
      </div>
      <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Slope m</p>
        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-ink dark:text-bone">{formatSlope(m)}</p>
      </div>
    </div>
  );
}
