"use client";

import { Button } from "@/components/ui/button";

export function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-5 rounded-[1.75rem] border border-line bg-white/70 p-8 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Remember</p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink dark:text-bone">(x, y)</p>
        <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
          First move along x. Then move along y.
        </p>
      </div>

      {/* Tiny worked example: (3, 4) */}
      <div className="flex items-center gap-4 rounded-card border border-line bg-white/60 px-5 py-4 dark:border-line-dark dark:bg-white/[0.03]">
        <span className="font-mono text-lg font-semibold text-ink dark:text-bone">(3, 4)</span>
        <span className="h-8 w-px bg-ink/10 dark:bg-bone/15" />
        <span className="flex items-center gap-1.5 text-sm text-pine-600 dark:text-pine-300">
          <span className="animate-pulse">→</span> 3 right
        </span>
        <span className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
          <span className="animate-pulse">↑</span> 4 up
        </span>
      </div>

      <Button onClick={onStart} size="lg">
        Start Plotting
      </Button>
    </div>
  );
}
