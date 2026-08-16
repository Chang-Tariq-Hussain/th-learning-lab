"use client";

import { useSimulation } from "../../context/simulation-context";
import { SPEED_MULTIPLIERS, type SpeedMultiplier } from "../../types";
import { cn } from "@/lib/utils";

export interface SpeedControllerProps {
  /** Restrict to a subset of the standard multipliers if a simulation doesn't need all of them. */
  options?: readonly SpeedMultiplier[];
  className?: string;
}

/**
 * Segmented control for the standard speed multipliers
 * (0.25×, 0.5×, 1×, 2×, 5×, 10×). Reads/writes shared playback state.
 */
export function SpeedController({
  options = SPEED_MULTIPLIERS,
  className,
}: SpeedControllerProps) {
  const { speed, setSpeed } = useSimulation();

  return (
    <div
      role="group"
      aria-label="Playback speed"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-ink/10 p-0.5 dark:border-bone/15",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option === speed;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setSpeed(option)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-2.5 py-1 font-mono text-xs transition-colors",
              isActive
                ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
            )}
          >
            {option}×
          </button>
        );
      })}
    </div>
  );
}
