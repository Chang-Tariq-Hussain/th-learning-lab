"use client";

import { stepProgress } from "../model";

export interface EnergyBarProps {
  progress: number;
}

/**
 * One plain fill-bar, no numbers or units — just how much of it is
 * filled. Stays empty until the "energy" step starts, fills over that
 * step, and stays full afterward (energy has been produced; it
 * doesn't drain back out). Purely to communicate "cells release
 * usable energy from glucose" — not a real ATP count.
 */
export function EnergyBar({ progress }: EnergyBarProps) {
  const fraction = stepProgress(progress, "energy");
  const percent = Math.round(fraction * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Energy</p>
      <div className="h-6 w-full overflow-hidden rounded-full bg-white/70 shadow-card dark:bg-white/[0.04]">
        <div
          className="h-full rounded-full bg-amber-400 transition-[width] duration-150 ease-linear dark:bg-amber-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
