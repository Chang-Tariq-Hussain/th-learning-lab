"use client";

import type { FrequencyRow } from "../data-collection-model";

interface FrequencyTableProps {
  rows: FrequencyRow[];
  total: number;
}

/** The "table" half of RAW DATA -> TABLE -> GRAPH. Tally marks are
 *  shown alongside the numeric count so the table reads as an actual
 *  frequency table (category / tally / frequency), not just a bar
 *  count — matching how frequency tables are conventionally taught. */
function tally(count: number): string {
  if (count === 0) return "—";
  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;
  return `${"|||| ".repeat(fullGroups)}${"|".repeat(remainder)}`.trim();
}

export function FrequencyTable({ rows, total }: FrequencyTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 dark:border-bone/10">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink-soft dark:bg-white/[0.04] dark:text-bone-soft">
            <th className="px-4 py-2 font-medium">Category</th>
            <th className="px-4 py-2 font-medium">Tally</th>
            <th className="px-4 py-2 text-right font-medium">Frequency</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.category.id} className="border-t border-ink/5 dark:border-bone/5">
              <td className="px-4 py-2">
                <span className="mr-1.5" aria-hidden="true">
                  {row.category.emoji}
                </span>
                {row.category.label}
              </td>
              <td className="px-4 py-2 font-mono text-xs tracking-wider text-ink-soft dark:text-bone-soft">
                {tally(row.count)}
              </td>
              <td className="px-4 py-2 text-right font-mono tabular-nums text-ink dark:text-bone">{row.count}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink/10 bg-ink/[0.02] dark:border-bone/10 dark:bg-white/[0.03]">
            <td className="px-4 py-2 font-medium text-ink dark:text-bone" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-2 text-right font-mono font-medium tabular-nums text-ink dark:text-bone">
              {total}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
