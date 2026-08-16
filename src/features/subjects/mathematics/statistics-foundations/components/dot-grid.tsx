"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface DotGridProps {
  total: number;
  /** Indices (0-based) that should render as highlighted/selected. */
  highlighted?: Set<number>;
  /** Optional per-index color override, e.g. for group membership. Falls back to the default dot color. */
  colorOf?: (index: number) => string | undefined;
  /** Color used for highlighted dots when `colorOf` isn't provided. */
  highlightColor?: string;
  dotSize?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

/**
 * A wrapping grid of small dots representing individuals in a
 * population or sample — the shared visual used across Sections 5–8
 * (Population vs Sample, Sample Size, Sampling Methods, Representative
 * Samples). Deliberately plain divs rather than canvas/SVG so it stays
 * lightweight even at a few hundred dots, per the brief's performance
 * note.
 */
export function DotGrid({
  total,
  highlighted,
  colorOf,
  highlightColor,
  dotSize = "sm",
  className,
  ariaLabel,
}: DotGridProps) {
  const sizeClass = dotSize === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `A grid of ${total} dots representing individuals`}
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const isHighlighted = highlighted?.has(i);
        const overrideColor = colorOf?.(i);
        const style: CSSProperties = {};
        if (overrideColor) {
          style.backgroundColor = overrideColor;
        } else if (isHighlighted && highlightColor) {
          style.backgroundColor = highlightColor;
        }

        return (
          <span
            key={i}
            className={cn(
              sizeClass,
              "rounded-full transition-all duration-300",
              !overrideColor && !isHighlighted && "bg-ink/15 dark:bg-bone/15",
              !overrideColor && isHighlighted && !highlightColor && "bg-subject-math",
              isHighlighted && !overrideColor && "scale-125 shadow-sm",
            )}
            style={style}
          />
        );
      })}
    </div>
  );
}
