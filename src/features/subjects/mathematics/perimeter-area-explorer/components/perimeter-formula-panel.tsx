"use client";

import { FormulaExplanation } from "@/features/simulation/components/formula";
import { RectShape } from "./rect-shape";
import { FORMULA_RECTANGLE, rectanglePerimeter } from "../perimeter-area-model";

/** Level 3 — Perimeter Formula. Connects "length + width + length + width" to P = 2(l + w). */
export function PerimeterFormulaPanel() {
  const { length, width } = FORMULA_RECTANGLE;
  const perimeter = rectanglePerimeter(length, width);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <RectShape
        length={length}
        width={width}
        showDimensionLabels
        boundaryReveal={1}
        maxPixelWidth={260}
        ariaLabel={`A ${length} by ${width} rectangle with its perimeter highlighted`}
      />

      <div className="flex flex-col items-center gap-2 font-mono text-sm text-ink dark:text-bone">
        <p>
          length + width + length + width = {length} + {width} + {length} + {width}
        </p>
        <p className="text-ink-soft dark:text-bone-soft">↓ group the repeats</p>
        <p>
          2(length + width) = 2({length} + {width}) = 2 × {length + width} ={" "}
          <span className="text-subject-math">{perimeter} units</span>
        </p>
      </div>

      <FormulaExplanation
        formula="P = 2(l + w)"
        caption="Perimeter of a Rectangle"
        explanation="Every rectangle has two lengths and two widths, so doubling their sum gives the full distance around."
      />
    </div>
  );
}
