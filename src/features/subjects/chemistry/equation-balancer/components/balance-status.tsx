"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceStatusProps {
  balanced: boolean;
}

/** A single, unambiguous readout of whether the equation is balanced right now. */
export function BalanceStatus({ balanced }: BalanceStatusProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        balanced
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
          : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
      )}
      aria-live="polite"
    >
      {balanced ? (
        <>
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
          Balanced! Every element matches on both sides.
        </>
      ) : (
        <>
          <CircleDashed className="h-4 w-4" strokeWidth={2} />
          Not balanced yet — adjust the coefficients above.
        </>
      )}
    </div>
  );
}
