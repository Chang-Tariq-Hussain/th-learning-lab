"use client";

import { cn } from "@/lib/utils";
import { PLACE_VALUES, type Bits } from "../model";

export interface BitToggleGridProps {
  bits: Bits;
  onToggle?: (index: number) => void;
  /** Bit indices that should glow to draw attention (e.g. just-toggled,
   *  or the bits that make up the correct answer during a reveal). */
  highlightIndices?: number[];
  disabled?: boolean;
  className?: string;
}

/** The core "toggle switches with place values above them" visual shared
 *  by every mode of the Binary Data Laboratory. Each column shows its
 *  place value, the 0/1 switch, and — while a bit is on — the amount it
 *  contributes, so the running sum is always visible in place, not just
 *  in a separate total. */
export function BitToggleGrid({ bits, onToggle, highlightIndices = [], disabled, className }: BitToggleGridProps) {
  return (
    <div className={cn("grid grid-cols-8 gap-1.5 sm:gap-2", className)} role="group" aria-label="8-bit byte, most significant bit first">
      {PLACE_VALUES.map((place, index) => {
        const isOn = bits[index] === 1;
        const isHighlighted = highlightIndices.includes(index);
        return (
          <div key={place} className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] text-ink-soft dark:text-bone-soft sm:text-xs">{place}</span>
            <button
              type="button"
              disabled={disabled || !onToggle}
              onClick={() => onToggle?.(index)}
              aria-pressed={isOn}
              aria-label={`Bit worth ${place}, currently ${isOn ? "on" : "off"}`}
              className={cn(
                "flex h-11 w-full items-center justify-center rounded-lg border-2 font-mono text-base font-semibold transition-all sm:h-14 sm:text-lg",
                isOn
                  ? "border-subject-it bg-subject-it text-paper shadow-[0_0_0_3px_rgba(0,0,0,0)]"
                  : "border-line bg-paper text-ink-soft dark:border-line-dark dark:bg-chalkboard dark:text-bone-soft",
                isHighlighted && "ring-2 ring-offset-2 ring-subject-it dark:ring-offset-chalkboard",
                onToggle && !disabled ? "cursor-pointer hover:opacity-90" : "cursor-default",
              )}
            >
              {isOn ? 1 : 0}
            </button>
            <span className={cn("h-4 font-mono text-[9px] sm:text-[10px]", isOn ? "text-subject-it" : "text-transparent")}>
              +{place}
            </span>
          </div>
        );
      })}
    </div>
  );
}
