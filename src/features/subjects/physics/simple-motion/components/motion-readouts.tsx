"use client";

import { cn } from "@/lib/utils";
import type { UnknownQuantity } from "../motion-model";

export interface MotionReadoutsProps {
  distance: number | null;
  time: number | null;
  speed: number | null;
  unknown: UnknownQuantity;
}

interface Stat {
  id: UnknownQuantity;
  label: string;
  value: string;
  unit: string;
}

function formatStat(raw: number | null, decimals: number): string {
  return raw === null ? "?" : raw.toFixed(decimals);
}

/**
 * Three large numbers, same idea as the other visualizations' data
 * panels but stripped down to exactly the three values this lesson is
 * about. Whichever one is currently the "unknown" gets the same
 * dashed-border solved-value treatment as Proportion Builder's
 * NumberSlot, so it reads as "this is the answer" rather than just
 * another input — and while its value is still null (the car hasn't
 * moved yet), it shows a bare "?" instead of a number, since the
 * answer is earned by watching the trip, not handed over up front.
 */
export function MotionReadouts({
  distance,
  time,
  speed,
  unknown,
}: MotionReadoutsProps) {
  const stats: Stat[] = [
    {
      id: "distance",
      label: "Distance",
      value: formatStat(distance, 0),
      unit: "m",
    },
    { id: "time", label: "Time", value: formatStat(time, 1), unit: "s" },
    { id: "speed", label: "Speed", value: formatStat(speed, 1), unit: "m/s" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const isUnknown = stat.id === unknown;
        return (
          <div
            key={stat.id}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl border px-3 py-5 text-center shadow-card backdrop-blur transition-colors duration-300",
              isUnknown
                ? "border-dashed border-subject-physics bg-subject-physics-soft/60 dark:border-subject-physics/60 dark:bg-subject-physics/10"
                : "border-line bg-white/70 dark:border-line-dark dark:bg-white/[0.04]",
            )}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
              {stat.label}
              {isUnknown ? " · ?" : ""}
            </p>
            <p className="font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone sm:text-4xl">
              {stat.value}
              <span className="ml-1 text-base font-normal text-ink-soft dark:text-bone-soft">
                {stat.unit}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
