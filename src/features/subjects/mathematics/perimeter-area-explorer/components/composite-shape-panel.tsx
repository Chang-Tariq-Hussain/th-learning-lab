"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  COMPOSITE_BOUNDING_BOX,
  COMPOSITE_NOTCH,
  COMPOSITE_OUTLINE,
  compositeArea,
  compositeOutlinePerimeter,
  rectangleArea,
} from "../perimeter-area-model";

const UNIT = 34;
const { length: boxLength, width: boxWidth } = COMPOSITE_BOUNDING_BOX;
const outlinePoints = COMPOSITE_OUTLINE.map(([x, y]) => `${x * UNIT},${y * UNIT}`).join(" ");
const perimeter = compositeOutlinePerimeter(COMPOSITE_OUTLINE);
const area = compositeArea();
const bigArea = rectangleArea(boxLength, boxWidth);
const notchArea = rectangleArea(COMPOSITE_NOTCH.length, COMPOSITE_NOTCH.width);

/** Level 11 — Composite Shape. One simple L-shape: perimeter by walking the outline, area as "big rectangle minus the notch". */
export function CompositeShapePanel() {
  const [showDecomposition, setShowDecomposition] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        An L-shaped figure — walk every outside edge for the perimeter, then split it into rectangles for the area.
      </p>

      <svg
        viewBox={`0 0 ${boxLength * UNIT} ${boxWidth * UNIT}`}
        className="h-auto w-full max-w-xs"
        aria-label="An L-shaped composite figure"
      >
        {showDecomposition ? (
          <>
            <rect
              x={0}
              y={0}
              width={boxLength * UNIT}
              height={boxWidth * UNIT}
              className="fill-amber-400/10 stroke-amber-500"
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />
            <rect
              x={(boxLength - COMPOSITE_NOTCH.length) * UNIT}
              y={0}
              width={COMPOSITE_NOTCH.length * UNIT}
              height={COMPOSITE_NOTCH.width * UNIT}
              className="fill-rose-400/20 stroke-rose-500"
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />
          </>
        ) : null}

        <polygon points={outlinePoints} className="fill-subject-math/15 stroke-subject-math" strokeWidth={2.5} />

        {/* Interior grid lines, clipped to the L-shape, only shown once decomposed for clarity. */}
        {showDecomposition
          ? Array.from({ length: boxLength - 1 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={(i + 1) * UNIT}
                y1={0}
                x2={(i + 1) * UNIT}
                y2={boxWidth * UNIT}
                className="stroke-ink/10 dark:stroke-bone/10"
                strokeWidth={1}
              />
            ))
          : null}
      </svg>

      <button
        type="button"
        onClick={() => setShowDecomposition((s) => !s)}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
          showDecomposition
            ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
            : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
        )}
      >
        {showDecomposition ? "Hide Rectangles" : "Split into Rectangles"}
      </button>

      <div className="flex flex-col items-center gap-1 font-mono text-sm text-ink dark:text-bone">
        <p>Perimeter (walk every outside edge) = <span className="text-subject-math">{perimeter} units</span></p>
        {showDecomposition ? (
          <p>
            Area = {boxLength}×{boxWidth} − {COMPOSITE_NOTCH.length}×{COMPOSITE_NOTCH.width} = {bigArea} − {notchArea} ={" "}
            <span className="text-subject-math">{area} square units</span>
          </p>
        ) : (
          <p>
            Area = <span className="text-subject-math">{area} square units</span>
          </p>
        )}
      </div>
    </div>
  );
}
