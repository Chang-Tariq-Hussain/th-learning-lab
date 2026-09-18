"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { COMPARISONS } from "../model";

export function ComparisonsPanel() {
  const [activeId, setActiveId] = useState(COMPARISONS[0]!.id);
  const active = COMPARISONS.find((c) => c.id === activeId)!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Comparison">
        {COMPARISONS.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={activeId === c.id}
            onClick={() => setActiveId(c.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeId === c.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line dark:border-line-dark">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line dark:border-line-dark">
              <th className="p-3 text-left font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                Aspect
              </th>
              <th className="p-3 text-left font-mono text-[10px] uppercase tracking-wide text-subject-it">{active.leftLabel}</th>
              <th className="p-3 text-left font-mono text-[10px] uppercase tracking-wide text-subject-it">{active.rightLabel}</th>
            </tr>
          </thead>
          <tbody>
            {active.rows.map((row) => (
              <tr key={row.aspect} className="border-b border-line/60 last:border-0 dark:border-line-dark/60">
                <td className="p-3 align-top font-medium text-ink dark:text-bone">{row.aspect}</td>
                <td className="p-3 align-top text-ink-soft dark:text-bone-soft">{row.left}</td>
                <td className="p-3 align-top text-ink-soft dark:text-bone-soft">{row.right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ink-soft dark:text-bone-soft">{active.note}</p>
    </div>
  );
}
