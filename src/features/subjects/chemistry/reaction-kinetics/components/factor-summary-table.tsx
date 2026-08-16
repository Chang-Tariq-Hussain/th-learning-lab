import { FACTOR_SUMMARIES } from "../model";

/** Section 7's "what changes / what happens to collisions / what happens to rate" recap, folded into Level 8. */
export function FactorSummaryTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.04]">
            <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Factor</th>
            <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">What Changes?</th>
            <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Effect on Collisions</th>
            <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">Effect on Rate</th>
          </tr>
        </thead>
        <tbody>
          {FACTOR_SUMMARIES.map((factor) => (
            <tr key={factor.id} className="border-b border-line last:border-0 dark:border-line-dark">
              <td className="px-3 py-2 font-medium text-ink dark:text-bone">{factor.label}</td>
              <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{factor.whatChanges}</td>
              <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{factor.collisionEffect}</td>
              <td className="px-3 py-2 text-ink-soft dark:text-bone-soft">{factor.rateEffect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
