"use client";

import { useState } from "react";
import { FormulaExplanation } from "@/features/simulation/components/formula";
import { RectShape } from "./rect-shape";
import { SQUARE_SIDE_DEFAULT, SQUARE_SIDE_MAX, SQUARE_SIDE_MIN, rectangleArea, rectanglePerimeter } from "../perimeter-area-model";

const sliderClass =
  "h-3 w-full max-w-xs cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md";

/** Level 7 — Square. A special rectangle where length = width = side. */
export function SquarePanel() {
  const [side, setSide] = useState(SQUARE_SIDE_DEFAULT);
  const perimeter = rectanglePerimeter(side, side);
  const area = rectangleArea(side, side);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <RectShape
        length={side}
        width={side}
        showGrid
        fillArea
        boundaryReveal={1}
        showDimensionLabels
        maxPixelWidth={240}
        ariaLabel={`A square with side ${side}`}
      />

      <div className="flex w-full flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-mono text-sm text-ink dark:text-bone">
          <span>Side</span>
          <span className="text-subject-math">{side}</span>
        </div>
        <input
          type="range"
          min={SQUARE_SIDE_MIN}
          max={SQUARE_SIDE_MAX}
          value={side}
          onChange={(e) => setSide(Number(e.target.value))}
          aria-label="Square side length"
          className={sliderClass}
        />
      </div>

      <div className="flex gap-6 font-mono text-sm text-ink dark:text-bone">
        <span>
          P = 4s = <span className="text-subject-math">{perimeter} units</span>
        </span>
        <span>
          A = s² = <span className="text-subject-math">{area} square units</span>
        </span>
      </div>

      <FormulaExplanation
        formula="P = 4s \qquad A = s^2"
        caption="Square"
        explanation="A square is just a rectangle where every side is the same length, so the general formulas simplify."
      />
    </div>
  );
}
