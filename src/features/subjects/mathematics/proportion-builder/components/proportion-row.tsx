"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QUANTITY_COLORS, SLIDER_MAX, SLIDER_MIN } from "../colors";
import { RatioBar } from "./ratio-bar";

export type MissingSide = "first" | "second" | null;

export interface ProportionRowProps {
  label: string;
  first: number;
  second: number;
  missingSide: MissingSide;
  onGuessChange?: (value: number) => void;
  highlighted: boolean;
}

export function ProportionRow({
  label,
  first,
  second,
  missingSide,
  onGuessChange,
  highlighted,
}: ProportionRowProps) {
  const missingValue = missingSide === "first" ? first : second;
  const missingColor = missingSide ? QUANTITY_COLORS[missingSide].hex : undefined;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[1.75rem] border bg-white/70 p-5 shadow-card backdrop-blur transition-colors duration-300 dark:bg-white/[0.04] sm:p-6",
        highlighted ? "border-subject-chemistry/50" : "border-line dark:border-line-dark",
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
        {label}
      </p>

      <p className="text-center font-display text-4xl font-medium text-ink dark:text-bone sm:text-5xl">
        <NumberSlot value={first} color={QUANTITY_COLORS.first.hex} isMissing={missingSide === "first"} />
        <span className="mx-2 text-ink-soft/50 dark:text-bone-soft/50">:</span>
        <NumberSlot value={second} color={QUANTITY_COLORS.second.hex} isMissing={missingSide === "second"} />
      </p>

      <RatioBar a={first} b={second} />

      {missingSide && onGuessChange && missingColor && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">
              Drag to find the missing value
            </span>
            <span className="font-mono text-xs tabular-nums text-ink dark:text-bone">{missingValue}</span>
          </div>
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={1}
            value={missingValue}
            onChange={(event) => onGuessChange(Number(event.target.value))}
            aria-label="Drag to find the missing value"
            style={{ accentColor: missingColor }}
            className={cn(
              "h-2.5 w-full cursor-pointer touch-none appearance-none rounded-full bg-ink/10 dark:bg-bone/10",
              "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md",
              "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md",
            )}
          />
        </div>
      )}
    </div>
  );
}

function NumberSlot({ value, color, isMissing }: { value: number; color: string; isMissing: boolean }) {
  if (!isMissing) {
    return <span style={{ color }}>{value}</span>;
  }
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="mx-1 inline-block rounded-xl border-2 border-dashed px-2"
      style={{ color, borderColor: color }}
    >
      {value}
    </motion.span>
  );
}
