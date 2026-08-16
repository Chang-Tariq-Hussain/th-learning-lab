"use client";

import { useState } from "react";
import { FormulaExplanation } from "@/features/simulation/components/formula";
import { TRIANGLE_DEFAULT, TRIANGLE_SIDE_MAX, TRIANGLE_SIDE_MIN } from "../perimeter-area-model";

const sliderClass =
  "h-2.5 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md";

/**
 * Level 8 — Triangle Perimeter. An illustrative (not-to-scale)
 * triangle with three adjustable side lengths — perimeter is just
 * a + b + c, no triangle geometry beyond that.
 */
export function TrianglePanel() {
  const [sides, setSides] = useState(TRIANGLE_DEFAULT);
  const perimeter = sides.a + sides.b + sides.c;

  const update = (key: "a" | "b" | "c") => (value: number) => setSides((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <svg viewBox="0 0 200 160" className="h-40 w-48" aria-label="An illustrative triangle with three labeled sides">
        <polygon
          points="100,15 20,145 180,145"
          className="fill-subject-math/10 stroke-subject-math"
          strokeWidth={2}
        />
        <text x="100" y="10" textAnchor="middle" className="fill-ink text-[11px] font-mono dark:fill-bone">
          c = {sides.c}
        </text>
        <text x="40" y="85" textAnchor="middle" className="fill-ink text-[11px] font-mono dark:fill-bone">
          a = {sides.a}
        </text>
        <text x="160" y="85" textAnchor="middle" className="fill-ink text-[11px] font-mono dark:fill-bone">
          b = {sides.b}
        </text>
      </svg>

      <div className="grid w-full max-w-sm grid-cols-1 gap-4 sm:grid-cols-3">
        {(["a", "b", "c"] as const).map((key) => (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-xs text-ink dark:text-bone">
              <span>Side {key}</span>
              <span className="text-subject-math">{sides[key]}</span>
            </div>
            <input
              type="range"
              min={TRIANGLE_SIDE_MIN}
              max={TRIANGLE_SIDE_MAX}
              value={sides[key]}
              onChange={(e) => update(key)(Number(e.target.value))}
              aria-label={`Triangle side ${key}`}
              className={sliderClass}
            />
          </div>
        ))}
      </div>

      <p className="font-mono text-lg text-ink dark:text-bone">
        {sides.a} + {sides.b} + {sides.c} = <span className="text-subject-math">{perimeter} units</span>
      </p>

      <FormulaExplanation
        formula="P = a + b + c"
        caption="Perimeter of a Triangle"
        explanation="A triangle has no shortcut formula like a rectangle — just add its three side lengths."
      />
    </div>
  );
}
