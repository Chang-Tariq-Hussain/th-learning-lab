import { waveSpeed } from "../wave-model";

interface ReadoutsProps {
  frequency: number;
  wavelength: number;
}

export function Readouts({ frequency, wavelength }: ReadoutsProps) {
  const v = waveSpeed(frequency, wavelength);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Wave Speed</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">v = {v} m/s</p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Frequency</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">
          f = {frequency} Hz
        </p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Wavelength</p>
        <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">
          λ = {wavelength} m
        </p>
      </div>

      <div className="sm:col-span-3 rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Formula</p>
        <p className="mt-2 font-display text-xl font-medium text-ink dark:text-bone">v = f × λ</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          v = {frequency} × {wavelength} = {v} m/s
        </p>
      </div>
    </div>
  );
}
