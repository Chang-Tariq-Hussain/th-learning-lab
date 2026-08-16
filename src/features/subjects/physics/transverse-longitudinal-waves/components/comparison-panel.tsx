import { WAVE_SUMMARY } from "../wave-model";

/** Always shows both wave types side by side, regardless of which mode is currently animating above. */
export function ComparisonPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">Compare</p>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(Object.keys(WAVE_SUMMARY) as (keyof typeof WAVE_SUMMARY)[]).map((key) => {
          const summary = WAVE_SUMMARY[key];
          return (
            <div key={key} className="rounded-card border border-line p-3 dark:border-line-dark">
              <p className="font-display text-sm font-medium text-ink dark:text-bone">{summary.label}</p>

              <div className="mt-2 flex items-center gap-4 text-xs text-ink-soft dark:text-bone-soft">
                <span>
                  Particle motion:{" "}
                  <span className="font-mono text-sm text-amber-500">{summary.motionArrow}</span>{" "}
                  {summary.motionLabel}
                </span>
              </div>
              <div className="mt-1 text-xs text-ink-soft dark:text-bone-soft">
                Wave direction: <span className="font-mono text-sm text-subject-physics">→</span>
              </div>

              <ul className="mt-2 list-disc pl-4 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
                {summary.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
