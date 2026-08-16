import { THEORY_COMPARISON } from "../model";

/** A compact three-row card comparing Arrhenius, Brønsted–Lowry, and Lewis definitions — deliberately small, not a full lesson. */
export function TheoryComparison() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Comparing the acid–base theories</p>

      <div className="mt-3 flex flex-col divide-y divide-line dark:divide-line-dark">
        {THEORY_COMPARISON.map((theory) => (
          <div key={theory.name} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[9rem_1fr_1fr] sm:items-center sm:gap-3">
            <p className="font-mono text-sm font-semibold text-ink dark:text-bone">{theory.name}</p>
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              <span className="text-ink-soft/60 dark:text-bone-soft/50">Acid:</span> {theory.acid}
            </p>
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              <span className="text-ink-soft/60 dark:text-bone-soft/50">Base:</span> {theory.base}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
