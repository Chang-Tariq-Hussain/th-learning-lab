"use client";

import { FormulaExplanation } from "@/features/simulation/components/formula";
import { RectShape } from "./rect-shape";
import { AREA_FORMULA_RECTANGLE, rectangleArea } from "../perimeter-area-model";

/** Level 5 — Area Formula. Connects "number of squares" to length × width. */
export function AreaFormulaPanel() {
  const { length, width } = AREA_FORMULA_RECTANGLE;
  const area = rectangleArea(length, width);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <RectShape
        length={length}
        width={width}
        showGrid
        fillArea
        showDimensionLabels
        maxPixelWidth={260}
        ariaLabel={`A ${length} by ${width} unit-square grid`}
      />

      <div className="flex flex-col items-center gap-2 font-mono text-sm text-ink dark:text-bone">
        <p>number of squares = length × width</p>
        <p>
          A = {length} × {width} = <span className="text-subject-math">{area} square units</span>
        </p>
      </div>

      <FormulaExplanation
        formula="A = l \times w"
        caption="Area of a Rectangle"
        explanation="Each row has `length` squares, and there are `width` rows — so the total count is length times width."
      />
    </div>
  );
}
