"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { isPresent, ORGANELLE_ORDER, ORGANELLES } from "../data/organelles";
import type { CellKind } from "../types";
import { OrganelleGlyph } from "./organelle-glyph";

export interface CompareTableProps {
  kind: CellKind;
  selectedId: string | null;
  onSelect: (id: string) => void;
  highlightDifferences: boolean;
  onToggleHighlight: () => void;
}

function Cell({ present, current }: { present: boolean; current: boolean }) {
  return (
    <td className={cn("px-2 py-1.5 text-center", current && "bg-subject-biology-soft/70 dark:bg-subject-biology/10")}>
      {present ? (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-sm text-ink-soft dark:text-bone-soft">
          <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          No
        </span>
      )}
    </td>
  );
}

/** Reference table of what each cell has. Selecting a row shows that structure (switching to the plant cell for plant-only ones). */
export function CompareTable({ kind, selectedId, onSelect, highlightDifferences, onToggleHighlight }: CompareTableProps) {
  return (
    <section aria-label="Plant and animal cell comparison" className="flex flex-col gap-3" data-testid="compare-table">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          Switch between the cells above, or choose a row. The column for the cell you are viewing is shaded.
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={highlightDifferences}
          onClick={onToggleHighlight}
          className={cn(
            "flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
            highlightDifferences ? "border-subject-biology bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15" : "border-line text-ink dark:border-line-dark dark:text-bone",
          )}
        >
          <span aria-hidden="true" className={cn("h-3 w-3 rounded-full border-2 border-dashed", highlightDifferences ? "border-violet-600" : "border-ink-soft")} />
          Outline plant-only structures
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark">
        <table className="w-full min-w-[19rem] border-collapse text-left">
          <caption className="sr-only">Which structures are found in animal cells and plant cells</caption>
          <thead>
            <tr className="border-b border-line text-label uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
              <th scope="col" className="px-3 py-2 font-medium">Structure</th>
              <th scope="col" className={cn("px-2 py-2 text-center font-medium", kind === "animal" && "bg-subject-biology-soft/70 dark:bg-subject-biology/10")}>Animal cell</th>
              <th scope="col" className={cn("px-2 py-2 text-center font-medium", kind === "plant" && "bg-subject-biology-soft/70 dark:bg-subject-biology/10")}>Plant cell</th>
            </tr>
          </thead>
          <tbody>
            {ORGANELLE_ORDER.map((id) => {
              const o = ORGANELLES[id];
              return (
                <tr key={id} className="border-b border-line last:border-0 dark:border-line-dark">
                  <th scope="row" className="p-0 font-normal">
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      aria-pressed={selectedId === id}
                      data-row={id}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-ink hover:bg-ink/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink dark:text-bone dark:hover:bg-bone/[0.06] dark:focus-visible:outline-bone",
                        selectedId === id && "font-semibold",
                      )}
                    >
                      <OrganelleGlyph id={id} size={20} />
                      {o.name}
                    </button>
                  </th>
                  <Cell present={isPresent(id, "animal")} current={kind === "animal"} />
                  <Cell present={isPresent(id, "plant")} current={kind === "plant"} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-helper text-ink-soft dark:text-bone-soft">
        This simulation shows a simplified set of structures. Animal cells also contain others, such as lysosomes and centrioles, that are not drawn here.
      </p>
    </section>
  );
}
