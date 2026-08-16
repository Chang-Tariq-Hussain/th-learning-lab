"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONVERSION_STARTER_UNIT,
  CONVERSION_STARTER_VALUE,
  UNIT_ORDER,
  convertLength,
  formatLength,
  type LengthUnit,
} from "../measurement-model";

const STEP_FOR_UNIT: Record<LengthUnit, number> = { mm: 1, cm: 0.5, m: 0.1, km: 0.01 };

/**
 * Level 7 — Unit Conversion. Folds Sections 7 and 8 together: pick a
 * value and a unit, and every other unit's equivalent updates
 * instantly in a vertical mm → cm → m → km ladder — the same
 * interaction whether you think of it as "the conversion ladder" or
 * "the conversion tool."
 */
export function ConversionPanel() {
  const [value, setValue] = useState(CONVERSION_STARTER_VALUE);
  const [unit, setUnit] = useState<LengthUnit>(CONVERSION_STARTER_UNIT);

  const step = STEP_FOR_UNIT[unit];
  const adjust = (delta: number) => setValue((v) => Math.max(0, Math.round((v + delta) * 1000) / 1000));

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Set a value and unit — watch every other unit update instantly.
      </p>

      <div className="flex items-center gap-2 rounded-card border border-line bg-white/60 px-3 py-2 dark:border-line-dark dark:bg-white/[0.03]">
        <button type="button" aria-label="Decrease value" onClick={() => adjust(-step)} className="text-ink-soft hover:text-subject-math dark:text-bone-soft">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="min-w-[4rem] text-center font-mono text-lg font-semibold text-ink dark:text-bone">{formatLength(value)}</span>
        <button type="button" aria-label="Increase value" onClick={() => adjust(step)} className="text-ink-soft hover:text-subject-math dark:text-bone-soft">
          <ChevronUp className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {UNIT_ORDER.map((u) => {
          const isActive = u === unit;
          const equivalent = convertLength(value, unit, u);
          return (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={isActive}
              className={cn(
                "flex w-64 items-center justify-between rounded-card border px-4 py-2.5 transition-colors",
                isActive
                  ? "border-subject-math bg-subject-math-soft dark:bg-subject-math/15"
                  : "border-line hover:border-ink/30 dark:border-line-dark",
              )}
            >
              <span className={cn("font-mono text-sm font-semibold", isActive ? "text-subject-math" : "text-ink dark:text-bone")}>{u}</span>
              <span className={cn("font-mono text-sm", isActive ? "text-subject-math" : "text-ink-soft dark:text-bone-soft")}>
                {formatLength(equivalent)} {u}
              </span>
            </button>
          );
        })}
      </div>

      <p className="rounded-card border border-line px-4 py-3 text-center text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km.
      </p>
    </div>
  );
}
