"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChainLink {
  label: string;
  tone: "positive" | "negative" | "neutral";
}

function ChainArrow() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-soft/60 dark:text-bone-soft/60">
      <ArrowDown className="h-5 w-5 sm:hidden" strokeWidth={1.75} />
      <ArrowRight className="hidden h-5 w-5 sm:block" strokeWidth={1.75} />
    </div>
  );
}

const TONE_CLASSES: Record<ChainLink["tone"], string> = {
  positive: "border-pine-500 bg-pine-50 text-pine-700 dark:border-pine-300 dark:bg-pine-900/20 dark:text-pine-300",
  negative: "border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-900/20 dark:text-rose-300",
  neutral: "border-ink bg-ink/5 text-ink dark:border-bone dark:bg-bone/10 dark:text-bone",
};

/**
 * A horizontal-on-desktop, vertical-on-mobile chain of labeled boxes
 * connected by arrows — used for "Decreasing -> Critical Point ->
 * Increasing" (Level 4/5) and "Increasing -> Maximum -> Decreasing ->
 * Minimum -> Increasing" (Level 8), so the state transition reads as a
 * literal chain rather than a bulleted list.
 */
export function StateChain({ links }: { links: ChainLink[] }) {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
      {links.map((link, i) => (
        <div key={i} className="flex flex-col items-center gap-2 sm:flex-row">
          <div className={cn("rounded-full border-2 px-4 py-2 text-center font-mono text-xs font-semibold uppercase tracking-[0.1em]", TONE_CLASSES[link.tone])}>
            {link.label}
          </div>
          {i < links.length - 1 ? <ChainArrow /> : null}
        </div>
      ))}
    </div>
  );
}
