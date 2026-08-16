"use client";

import { cn } from "@/lib/utils";
import { QUANTITY_COLORS, SLIDER_MAX, SLIDER_MIN } from "../colors";
import { RatioBar } from "./ratio-bar";

export type MatchState = "idle" | "equivalent" | "different";

export interface RatioBoxProps {
  label: string;
  a: number;
  b: number;
  onChangeA: (value: number) => void;
  onChangeB: (value: number) => void;
  matchState: MatchState;
  locked?: boolean;
}

export function RatioBox({ label, a, b, onChangeA, onChangeB, matchState, locked }: RatioBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[1.75rem] border bg-white/70 p-5 shadow-card backdrop-blur transition-colors duration-300 dark:bg-white/[0.04] sm:p-6",
        matchState === "equivalent" && "border-subject-chemistry/50",
        matchState === "different" && "border-line dark:border-line-dark",
        matchState === "idle" && "border-line dark:border-line-dark",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          {label}
        </span>
        {locked && (
          <span className="rounded-full bg-subject-math-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-subject-math dark:bg-subject-math/15">
            Target
          </span>
        )}
      </div>

      <p className="text-center font-display text-4xl font-medium text-ink dark:text-bone sm:text-5xl">
        <span style={{ color: QUANTITY_COLORS.a.hex }}>{a}</span>
        <span className="mx-2 text-ink-soft/50 dark:text-bone-soft/50">:</span>
        <span style={{ color: QUANTITY_COLORS.b.hex }}>{b}</span>
      </p>

      <RatioBar a={a} b={b} />

      <SliderRow
        quantity="a"
        value={a}
        onChange={onChangeA}
        disabled={locked}
      />
      <SliderRow
        quantity="b"
        value={b}
        onChange={onChangeB}
        disabled={locked}
      />
    </div>
  );
}

function SliderRow({
  quantity,
  value,
  onChange,
  disabled,
}: {
  quantity: "a" | "b";
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const { hex, label } = QUANTITY_COLORS[quantity];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft dark:text-bone-soft">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hex }} />
          {label} quantity
        </span>
        <span className="font-mono text-xs tabular-nums text-ink dark:text-bone">{value}</span>
      </div>
      <input
        type="range"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label} quantity`}
        style={{ accentColor: hex }}
        className={cn(
          "h-2.5 w-full cursor-pointer touch-none appearance-none rounded-full bg-ink/10 dark:bg-bone/10",
          "[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md",
          disabled && "cursor-not-allowed opacity-50",
        )}
      />
    </div>
  );
}
