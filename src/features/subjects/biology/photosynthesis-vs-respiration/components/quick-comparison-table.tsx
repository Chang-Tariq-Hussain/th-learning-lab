import { Fragment } from "react";
import { QUICK_COMPARISON_ROWS } from "../model";

/**
 * The brief's exact four-row comparison table, always visible (no
 * click needed) — same presentational shape as the existing
 * `MitosisComparison` component in `subjects/biology/meiosis`, reused
 * as a pattern rather than as code, since the columns and data here
 * are different.
 */
export function QuickComparisonTable() {
  return (
    <div className="rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Quick Comparison
      </p>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] gap-y-3 text-sm">
        <span />
        <span className="text-center font-display font-semibold text-ink dark:text-bone">Photosynthesis</span>
        <span className="text-center font-display font-semibold text-subject-biology">Cellular Respiration</span>
        {QUICK_COMPARISON_ROWS.map((row) => (
          <Fragment key={row.label}>
            <span className="self-center text-ink-soft dark:text-bone-soft">{row.label}</span>
            <span className="self-center text-center text-ink dark:text-bone">{row.photosynthesis}</span>
            <span className="self-center text-center text-ink dark:text-bone">{row.respiration}</span>
          </Fragment>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-soft/80 dark:text-bone-soft/70">
        *Cellular respiration is strongly associated with mitochondria, but not every step of it happens exclusively inside one.
      </p>
    </div>
  );
}
