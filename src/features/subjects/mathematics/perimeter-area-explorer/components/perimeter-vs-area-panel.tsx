"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RectShape } from "./rect-shape";
import { INTRO_RECTANGLE, rectangleArea, rectanglePerimeter } from "../perimeter-area-model";

type View = "perimeter" | "area" | "both";

const VIEWS: { id: View; label: string }[] = [
  { id: "perimeter", label: "Perimeter" },
  { id: "area", label: "Area" },
  { id: "both", label: "Both" },
];

/** Level 1 — Perimeter vs Area. A single rectangle with a toggle that highlights the boundary, the interior, or both. */
export function PerimeterVsAreaPanel() {
  const [view, setView] = useState<View>("both");
  const { length, width } = INTRO_RECTANGLE;
  const perimeter = rectanglePerimeter(length, width);
  const area = rectangleArea(length, width);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        <strong className="text-ink dark:text-bone">Perimeter</strong> measures the distance around a shape.{" "}
        <strong className="text-ink dark:text-bone">Area</strong> measures the surface inside it.
      </p>

      <div className="flex justify-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              view === v.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <RectShape
        length={length}
        width={width}
        showDimensionLabels
        fillArea={view !== "perimeter"}
        boundaryReveal={view !== "area" ? 1 : undefined}
        maxPixelWidth={280}
        ariaLabel={`A ${length} by ${width} rectangle, showing ${view}`}
      />

      <div className="flex gap-6 font-mono text-sm">
        <span className={cn("transition-opacity", view === "area" && "opacity-30")}>
          Perimeter = <span className="text-subject-math">{perimeter} units</span>
        </span>
        <span className={cn("transition-opacity", view === "perimeter" && "opacity-30")}>
          Area = <span className="text-subject-math">{area} square units</span>
        </span>
      </div>
    </div>
  );
}
