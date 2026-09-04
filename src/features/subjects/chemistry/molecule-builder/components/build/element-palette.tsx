"use client";

import { ATOM_INFO, ELEMENT_COLOR, PALETTE_ELEMENTS, elementLabel, type ElementSymbol } from "../../build-model";

interface ElementPaletteProps {
  onAdd: (element: ElementSymbol) => void;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * The "add an atom" row. Each button is a small color-swatch + symbol
 * matching the exact color every other part of the app already uses
 * for that element (`ELEMENT_COLOR`, shared with Explore mode and
 * Build an Atom), so the same element always looks like itself
 * everywhere in Chemistry.
 */
export function ElementPalette({ onAdd }: ElementPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-bone-soft/70">
        Add atom
      </span>
      {PALETTE_ELEMENTS.map((element) => (
        <button
          key={element}
          type="button"
          onClick={() => onAdd(element)}
          title={`Add ${capitalize(elementLabel(element))} (up to ${ATOM_INFO[element].valenceElectrons} valence electrons)`}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-2.5 py-1.5 text-sm font-medium text-ink transition hover:border-subject-chemistry/50 hover:bg-subject-chemistry-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone"
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: ELEMENT_COLOR[element] }}
            aria-hidden
          />
          {element}
        </button>
      ))}
    </div>
  );
}
