"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CHAMBERS, type ChamberId } from "../circulation-model";

const GRID: { id: ChamberId; col: 0 | 1; row: 0 | 1 }[] = [
  { id: "right-atrium", col: 0, row: 0 },
  { id: "left-atrium", col: 1, row: 0 },
  { id: "right-ventricle", col: 0, row: 1 },
  { id: "left-ventricle", col: 1, row: 1 },
];

/** A simplified 2x2 heart, separate from the main loop scene — one dedicated spot to explore the four chambers. */
export function HeartChambers() {
  const [selected, setSelected] = useState<ChamberId | null>(null);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Heart Chambers</p>

      <div className="mx-auto mt-3 grid max-w-xs grid-cols-2 grid-rows-2 gap-1.5">
        {GRID.map(({ id }) => {
          const chamber = CHAMBERS.find((c) => c.id === id)!;
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(active ? null : id)}
              className={cn(
                "rounded-lg border px-3 py-4 text-center text-xs font-medium transition-colors",
                id.startsWith("right") ? "bg-sky-50 dark:bg-sky-900/20" : "bg-rose-50 dark:bg-rose-900/20",
                active
                  ? "border-subject-biology ring-2 ring-subject-biology/40"
                  : "border-ink/10 hover:border-ink/25 dark:border-bone/15 dark:hover:border-bone/30"
              )}
            >
              {chamber.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {selected ? CHAMBERS.find((c) => c.id === selected)!.explanation : "Click a chamber to learn what it does."}
      </p>

      <p className="mt-3 border-t border-line pt-3 text-center text-[11px] leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Valves help keep blood moving in one direction.
      </p>
    </div>
  );
}
