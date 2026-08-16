"use client";

import { useState } from "react";
import { RectShape } from "./rect-shape";
import {
  INTERACTIVE_DEFAULT,
  LENGTH_MAX,
  LENGTH_MIN,
  WIDTH_MAX,
  WIDTH_MIN,
  rectangleArea,
  rectanglePerimeter,
} from "../perimeter-area-model";

const sliderClass =
  "h-3 w-full cursor-pointer touch-none appearance-none rounded-full bg-subject-math-soft accent-subject-math dark:bg-subject-math/20 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-subject-math [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-subject-math [&::-moz-range-thumb]:shadow-md";

/**
 * Level 6 — Interactive Rectangle. Merges Section 4 (interactive
 * rectangle) and Section 7 (resizable grid) — both are "drag length
 * and width, watch everything update", just described twice in the
 * brief.
 */
export function InteractiveRectanglePanel() {
  const [length, setLength] = useState(INTERACTIVE_DEFAULT.length);
  const [width, setWidth] = useState(INTERACTIVE_DEFAULT.width);
  const perimeter = rectanglePerimeter(length, width);
  const area = rectangleArea(length, width);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <RectShape
        length={length}
        width={width}
        showGrid
        fillArea
        boundaryReveal={1}
        showDimensionLabels
        maxPixelWidth={280}
        ariaLabel={`A ${length} by ${width} rectangle you can resize`}
      />

      <div className="grid w-full max-w-sm grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-sm text-ink dark:text-bone">
            <span>Length</span>
            <span className="text-subject-math">{length}</span>
          </div>
          <input
            type="range"
            min={LENGTH_MIN}
            max={LENGTH_MAX}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            aria-label="Rectangle length"
            className={sliderClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-sm text-ink dark:text-bone">
            <span>Width</span>
            <span className="text-subject-math">{width}</span>
          </div>
          <input
            type="range"
            min={WIDTH_MIN}
            max={WIDTH_MAX}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            aria-label="Rectangle width"
            className={sliderClass}
          />
        </div>
      </div>

      <div className="flex gap-6 font-mono text-sm text-ink dark:text-bone">
        <span>
          Perimeter = <span className="text-subject-math">{perimeter} units</span>
        </span>
        <span>
          Area = <span className="text-subject-math">{area} square units</span>
        </span>
      </div>
    </div>
  );
}
