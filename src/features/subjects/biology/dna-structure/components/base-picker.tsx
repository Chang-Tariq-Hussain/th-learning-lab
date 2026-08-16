"use client";

import { BASES, BASE_COLORS } from "../model";
import type { Base } from "../types";

export interface BasePickerProps {
  onPick: (base: Base) => void;
  disabled: boolean;
}

/** The four [A] [T] [C] [G] buttons the spec calls for — nothing more. */
export function BasePicker({ onPick, disabled }: BasePickerProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {BASES.map((base) => (
        <button
          key={base}
          type="button"
          disabled={disabled}
          onClick={() => onPick(base)}
          aria-label={`Answer with ${base}`}
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-card transition-transform duration-150 hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          style={{ backgroundColor: BASE_COLORS[base] }}
        >
          {base}
        </button>
      ))}
    </div>
  );
}
