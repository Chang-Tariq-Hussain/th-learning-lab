"use client";

import { cn } from "@/lib/utils";
import {
  balanceLabel,
  isBalanced,
  netForce,
  type ForcesPlan,
} from "../forces-model";

export interface ForceReadoutsProps {
  plan: ForcesPlan;
}

/**
 * Three numbers plus one plain-language label — same "big number in a
 * card" idea as Simple Motion's readouts, with the Net Force card
 * getting the balanced/unbalanced treatment instead of a "solved
 * value" one, since there's nothing hidden here to reveal.
 */
export function ForceReadouts({ plan }: ForceReadoutsProps) {
  const net = netForce(plan);
  const balanced = isBalanced(plan);

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white/70 px-3 py-5 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Left Force
        </p>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone sm:text-4xl">
          {plan.leftForce}
          <span className="ml-1 text-base font-normal text-ink-soft dark:text-bone-soft">
            N
          </span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white/70 px-3 py-5 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Right Force
        </p>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone sm:text-4xl">
          {plan.rightForce}
          <span className="ml-1 text-base font-normal text-ink-soft dark:text-bone-soft">
            N
          </span>
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col items-center gap-1 rounded-2xl border px-3 py-5 text-center shadow-card backdrop-blur transition-colors duration-300",
          balanced
            ? "border-line bg-white/70 dark:border-line-dark dark:bg-white/[0.04]"
            : "border-dashed border-subject-physics bg-subject-physics-soft/60 dark:border-subject-physics/60 dark:bg-subject-physics/10",
        )}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Net Force
        </p>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone sm:text-4xl">
          {net > 0 ? "+" : ""}
          {net}
          <span className="ml-1 text-base font-normal text-ink-soft dark:text-bone-soft">
            N
          </span>
        </p>
      </div>

      <p className="col-span-3 text-center text-sm font-medium text-ink-soft dark:text-bone-soft">
        {balanceLabel(plan)}
      </p>
    </div>
  );
}
