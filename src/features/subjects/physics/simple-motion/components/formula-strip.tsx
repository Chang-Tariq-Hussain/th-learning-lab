"use client";

import type { UnknownQuantity } from "../motion-model";

export interface FormulaStripProps {
  distance: number;
  time: number;
  speed: number;
  unknown: UnknownQuantity;
}

const HEADLINE: Record<UnknownQuantity, string> = {
  speed: "Speed = Distance ÷ Time",
  time: "Time = Distance ÷ Speed",
  distance: "Distance = Speed × Time",
};

/**
 * The one formula this lesson needs, shown as plain styled text — no
 * KaTeX, no expandable rows, per the "no complex equation editor"
 * requirement. Rearranges to match whichever quantity is currently
 * being solved for, and the numbers update live so students can
 * connect the formula to the animation.
 */
export function FormulaStrip({
  distance,
  time,
  speed,
  unknown,
}: FormulaStripProps) {
  const line =
    unknown === "speed"
      ? `${speed.toFixed(1)} m/s = ${distance.toFixed(0)} m ÷ ${time.toFixed(1)} s`
      : unknown === "time"
        ? `${time.toFixed(1)} s = ${distance.toFixed(0)} m ÷ ${speed.toFixed(1)} m/s`
        : `${distance.toFixed(0)} m = ${speed.toFixed(1)} m/s × ${time.toFixed(1)} s`;

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-subject-physics-soft/60 px-6 py-4 text-center dark:border-line-dark dark:bg-subject-physics/10">
      <p className="font-display text-xl font-medium text-ink dark:text-bone sm:text-2xl">
        {HEADLINE[unknown]}
      </p>
      <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
        {line}
      </p>
    </div>
  );
}
