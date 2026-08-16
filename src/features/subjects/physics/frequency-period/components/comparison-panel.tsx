"use client";

import { HIGH_FREQUENCY, LOW_FREQUENCY, VIEW_HEIGHT, VIEW_WIDTH, buildWavePath } from "../wave-model";

interface ComparisonPanelProps {
  /** Real elapsed seconds while running — drives each mini wave at its own fixed frequency, independent of the main frequency control. */
  elapsedSeconds: number;
}

function MiniWave({ label, frequency, elapsedSeconds }: { label: string; frequency: number; elapsedSeconds: number }) {
  const phase = 2 * Math.PI * frequency * elapsedSeconds;

  return (
    <div className="rounded-card border border-line p-3 dark:border-line-dark">
      <p className="font-display text-sm font-medium text-ink dark:text-bone">{label}</p>
      <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">{frequency} Hz</p>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="mt-2 h-20 w-full text-subject-physics"
        role="img"
        aria-label={`${label}, ${frequency} hertz`}
      >
        <path d={buildWavePath(phase)} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Same wavelength, same amplitude — the only difference is how fast the pattern animates, which is exactly the point. */
export function ComparisonPanel({ elapsedSeconds }: ComparisonPanelProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Low vs High Frequency</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MiniWave label="Low frequency" frequency={LOW_FREQUENCY} elapsedSeconds={elapsedSeconds} />
        <MiniWave label="High frequency" frequency={HIGH_FREQUENCY} elapsedSeconds={elapsedSeconds} />
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        Same wavelength, same amplitude — the high-frequency wave simply oscillates faster.
      </p>
    </div>
  );
}
