"use client";

import { cn } from "@/lib/utils";
import { COMMON_ELEMENT_COUNT, ELEMENTS } from "../elements";

/** Main-group layout of elements 1–20: group 1, 2, then 13–18 (the transition metals are left out). */
const ROWS: (number | null)[][] = [
  [1, null, null, null, null, null, null, 2],
  [3, 4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17, 18],
  [19, 20, null, null, null, null, null, null],
];

interface ElementPickerProps {
  protons: number;
  onPick: (atomicNumber: number) => void;
}

/** Periodic-table-style selector. Picking an element sets the proton count (and keeps the atom neutral with its most common isotope). */
export function ElementPicker({ protons, onPick }: ElementPickerProps) {
  return (
    <section aria-label="Periodic table selector" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <h3 className="font-display text-base font-medium text-ink dark:text-bone">Pick an element</h3>
      <p className="mt-1 text-helper text-ink-soft dark:text-bone-soft">
        Elements 1–{COMMON_ELEMENT_COUNT} in their periodic-table columns (the transition metals that sit between groups 2 and 13 are left out). Picking one gives a neutral atom of its most common isotope.
      </p>
      <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-1">
        <div className="grid min-w-[22rem] grid-cols-8 gap-1" role="group" aria-label="Elements">
          {ROWS.flat().map((z, i) => {
            if (z === null) return <span key={`gap-${i}`} aria-hidden="true" />;
            const el = ELEMENTS[z - 1]!;
            const selected = protons === z;
            return (
              <button
                key={z}
                type="button"
                onClick={() => onPick(z)}
                aria-pressed={selected}
                aria-label={`${el.name}, atomic number ${z}`}
                title={`${el.name} (${z})`}
                className={cn(
                  "flex min-h-11 min-w-11 flex-col items-center justify-center rounded-md border leading-none transition-colors",
                  selected ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone",
                )}
              >
                <span className="text-label opacity-80">{z}</span>
                <span className="font-mono text-sm font-semibold">{el.symbol}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
