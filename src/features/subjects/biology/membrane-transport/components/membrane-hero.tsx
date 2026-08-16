import { MembraneBand } from "./membrane-band";

const OUTSIDE_DOTS = [12, 24, 36, 48, 60, 72, 84, 20, 44, 68, 92, 32, 56, 80];
const INSIDE_DOTS = [30, 50, 70, 42];

/**
 * Purely decorative — no interaction, no state. Gives students the
 * "something is moving across this boundary" read at a glance before
 * they pick Diffusion or Osmosis below.
 */
export function MembraneHero() {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-[1.75rem] border border-line bg-white/70 px-6 py-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Outside Cell</p>
      <div className="flex w-full max-w-xl flex-wrap items-center justify-center gap-2.5">
        {OUTSIDE_DOTS.map((_, i) => (
          <span key={i} className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
        ))}
      </div>

      <div className="mt-2 w-full max-w-xl">
        <MembraneBand />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft/70 dark:text-bone-soft/70">
        Cell Membrane
      </p>

      <div className="mt-2 flex w-full max-w-xl flex-wrap items-center justify-center gap-2.5">
        {INSIDE_DOTS.map((_, i) => (
          <span key={i} className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
        ))}
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Inside Cell</p>
    </div>
  );
}
