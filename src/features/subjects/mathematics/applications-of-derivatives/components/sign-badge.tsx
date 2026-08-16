"use client";

import { cn } from "@/lib/utils";
import { SIGN_COPY, signOf } from "../applications-model";

export interface SignBadgeProps {
  slope: number;
  className?: string;
}

/** A small colored badge reading "Derivative > 0 — increasing" (or < 0 / = 0), reusing Derivative Explorer's `SIGN_COPY` vocabulary. */
export function SignBadge({ slope, className }: SignBadgeProps) {
  const sign = signOf(slope);
  const copy = SIGN_COPY[sign];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-card border px-4 py-2 text-center",
        className
      )}
      style={{ borderColor: `${copy.color}55`, backgroundColor: `${copy.color}14` }}
    >
      <p className="font-mono text-sm font-semibold" style={{ color: copy.color }}>
        {copy.badge}
      </p>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{copy.explanation}</p>
    </div>
  );
}
