"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { colorForValue } from "../colors";
import type { Challenge } from "../challenges";

export interface InfoCardProps {
  value: number;
  challenge: Challenge;
  justSucceeded: boolean;
  onReset: () => void;
}

export function InfoCard({ value, challenge, justSucceeded, onReset }: InfoCardProps) {
  const color = colorForValue(value);
  const sign = value > 0 ? "Positive" : value < 0 ? "Negative" : "Zero";
  const parity = value % 2 === 0 ? "Even" : "Odd";

  return (
    <div className="w-full max-w-md rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-6">
      <div
        role="status"
        className={cn(
          "mb-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300",
          justSucceeded
            ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
            : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
        )}
      >
        {justSucceeded ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Nice! That&apos;s exactly right.
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
            {challenge.prompt}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        <Stat label="Number" value={value > 0 ? `+${value}` : `${value}`} color={color} />
        <Stat label="Sign" value={sign} color={color} />
        <Stat label="Even / Odd" value={parity} />
        <Stat label="Absolute value" value={`${Math.abs(value)}`} />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full rounded-full border border-line py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
      >
        Reset
      </button>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 dark:text-bone-soft/70">
        {label}
      </span>
      <span className="text-lg font-semibold text-ink dark:text-bone" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}
