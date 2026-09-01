import { ArrowDown } from "lucide-react";

/**
 * The brief's "visual cycle" — light energy in, photosynthesis makes
 * glucose and oxygen, cellular respiration uses them and produces
 * CO2 and water, which feed back into photosynthesis. Built as plain
 * stacked cards and arrows (matching the flat, illustrative style
 * `ExplanationPanel`/`FormulaSection` already use elsewhere in this
 * subject) rather than an SVG scene — there's no motion or state
 * here, so a canvas/animation component would be needless complexity
 * for a diagram that's meant to be read, not played.
 */
export function CycleDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        How the Two Processes Connect
      </p>

      <div className="mt-2 flex flex-col items-center gap-1 text-center">
        <span className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-ink shadow-card dark:bg-white/[0.06] dark:text-bone">
          ☀️ Light Energy
        </span>
        <ArrowDown className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/50" strokeWidth={1.75} />
        <span className="rounded-2xl border border-subject-biology/40 bg-subject-biology/10 px-5 py-2 font-display text-sm font-medium text-ink dark:text-bone">
          Photosynthesis
        </span>
        <ArrowDown className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/50" strokeWidth={1.75} />
        <span className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-ink shadow-card dark:bg-white/[0.06] dark:text-bone">
          Glucose + O₂
        </span>
        <ArrowDown className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/50" strokeWidth={1.75} />
        <span className="rounded-2xl border border-subject-biology/40 bg-subject-biology/10 px-5 py-2 font-display text-sm font-medium text-ink dark:text-bone">
          Cellular Respiration
        </span>
        <ArrowDown className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/50" strokeWidth={1.75} />
        <span className="rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-ink shadow-card dark:bg-white/[0.06] dark:text-bone">
          CO₂ + H₂O
        </span>
        <ArrowDown className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/50" strokeWidth={1.75} />
        <span className="rounded-2xl border border-dashed border-subject-biology/40 px-5 py-2 text-center text-sm text-ink-soft dark:text-bone-soft">
          Available again for Photosynthesis
        </span>
      </div>

      <p className="mt-5 max-w-xl text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        The atoms in CO₂ and H₂O can be reused by photosynthesis — that&apos;s
        matter cycling between the two processes. Energy doesn&apos;t cycle the
        same way: light energy is captured once, transferred into glucose,
        then released and spent as ATP during cellular work. It isn&apos;t
        recycled back into light.
      </p>
    </div>
  );
}
