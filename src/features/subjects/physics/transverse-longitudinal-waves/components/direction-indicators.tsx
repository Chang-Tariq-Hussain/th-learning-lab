import { WAVE_SUMMARY, type WaveMode } from "../wave-model";

interface DirectionIndicatorsProps {
  mode: WaveMode;
}

/** Compact "wave direction vs particle motion" comparison row shown right under the visualization. */
export function DirectionIndicators({ mode }: DirectionIndicatorsProps) {
  const summary = WAVE_SUMMARY[mode];

  return (
    <div className="grid grid-cols-2 gap-3 rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Wave direction
        </p>
        <p className="mt-1 font-display text-xl tracking-widest text-subject-physics">→ → → → →</p>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Particle motion
        </p>
        <p className="mt-1 font-display text-xl tracking-widest text-amber-500">
          {summary.motionArrow} {summary.motionArrow} {summary.motionArrow} {summary.motionArrow}
        </p>
      </div>
    </div>
  );
}
