"use client";

import { cn } from "@/lib/utils";
import { pointOnRectBoundary, rectanglePerimeter } from "../perimeter-area-model";

export interface RectShapeProps {
  length: number;
  width: number;
  /** Show the interior unit-square grid (Area). */
  showGrid?: boolean;
  /** Fill the interior with a soft area color. */
  fillArea?: boolean;
  /** Fraction (0–1) of the boundary to highlight, walking clockwise from the top-left. 1 = whole boundary highlighted. Omit for no boundary highlight. */
  boundaryReveal?: number;
  /** Show "Length = n" / "Width = n" labels along the top and left edges. */
  showDimensionLabels?: boolean;
  /** Maximum pixel width the shape should render at (it scales down to fit). */
  maxPixelWidth?: number;
  unitPx?: number;
  className?: string;
  ariaLabel?: string;
}

const AREA_FILL = "rgba(124, 79, 224, 0.12)"; // subject-math, low opacity
const BOUNDARY_COLOR = "#7C4FE0"; // subject-math

/**
 * The shared rectangle visual for this simulation — plain divs (no
 * SVG), same spirit as `NumberLineDisplay`/`DotGrid` from the
 * Statistics simulations: a CSS grid for the unit squares, and four
 * absolutely-positioned bars around the edge whose length reveals
 * fractionally for the perimeter-counting animation. Every level in
 * this simulation renders through this one component with different
 * props, rather than each level drawing its own shape.
 */
export function RectShape({
  length,
  width,
  showGrid = false,
  fillArea = false,
  boundaryReveal,
  showDimensionLabels = false,
  maxPixelWidth = 320,
  unitPx = 32,
  className,
  ariaLabel,
}: RectShapeProps) {
  const naturalWidth = length * unitPx;
  const naturalHeight = width * unitPx;
  const scale = Math.min(1, maxPixelWidth / naturalWidth);
  const pixelWidth = naturalWidth * scale;
  const pixelHeight = naturalHeight * scale;

  const perimeter = rectanglePerimeter(length, width);
  const revealDistance = boundaryReveal !== undefined ? boundaryReveal * perimeter : undefined;

  // How much of each side (0..1) is revealed, walking clockwise: top, right, bottom, left.
  const sideReveal =
    revealDistance !== undefined
      ? {
          top: Math.min(1, Math.max(0, revealDistance / length)),
          right: Math.min(1, Math.max(0, (revealDistance - length) / width)),
          bottom: Math.min(1, Math.max(0, (revealDistance - length - width) / length)),
          left: Math.min(1, Math.max(0, (revealDistance - 2 * length - width) / width)),
        }
      : null;

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `A ${length} by ${width} rectangle`}
      className={cn("relative mx-auto", showDimensionLabels && "mt-6 ml-8", className)}
      style={{ width: pixelWidth, height: pixelHeight }}
    >
      {/* Interior fill + unit-square grid. */}
      <div
        className="absolute inset-0 border border-ink/20 dark:border-bone/20"
        style={{ backgroundColor: fillArea ? AREA_FILL : undefined }}
      >
        {showGrid ? (
          <div
            className="grid h-full w-full"
            style={{ gridTemplateColumns: `repeat(${length}, 1fr)`, gridTemplateRows: `repeat(${width}, 1fr)` }}
          >
            {Array.from({ length: length * width }, (_, i) => (
              <div key={i} className="border border-ink/10 dark:border-bone/10" />
            ))}
          </div>
        ) : null}
      </div>

      {/* Boundary reveal bars. */}
      {sideReveal ? (
        <>
          <div
            className="absolute left-0 top-0 h-1 rounded-full transition-all duration-300"
            style={{ width: `${sideReveal.top * 100}%`, backgroundColor: BOUNDARY_COLOR }}
          />
          <div
            className="absolute right-0 top-0 w-1 rounded-full transition-all duration-300"
            style={{ height: `${sideReveal.right * 100}%`, backgroundColor: BOUNDARY_COLOR }}
          />
          <div
            className="absolute bottom-0 right-0 h-1 rounded-full transition-all duration-300"
            style={{ width: `${sideReveal.bottom * 100}%`, backgroundColor: BOUNDARY_COLOR }}
          />
          <div
            className="absolute bottom-0 left-0 w-1 rounded-full transition-all duration-300"
            style={{ height: `${sideReveal.left * 100}%`, backgroundColor: BOUNDARY_COLOR }}
          />
        </>
      ) : null}

      {showDimensionLabels ? (
        <>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-medium text-ink dark:text-bone">
            Length = {length}
          </span>
          <span
            className="absolute -left-7 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs font-medium text-ink dark:text-bone"
            style={{ writingMode: "vertical-rl" }}
          >
            Width = {width}
          </span>
        </>
      ) : null}
    </div>
  );
}

/** Placement helper re-exported for panels that animate a marker walking the boundary. */
export { pointOnRectBoundary };
