"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopiesStrip } from "./copies-strip";

export interface InsightPanelProps {
  a: number;
  b: number;
  solved: boolean;
  k: number;
}

export function InsightPanel({ a, b, solved, k }: InsightPanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div
        role="status"
        className={cn(
          "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300",
          solved
            ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
            : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15",
        )}
      >
        {solved ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Solved! Both ratios stay equal.
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
            Drag the dashed number until Ratio 2&apos;s bar splits the same way as Ratio 1&apos;s.
          </>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-6">
        {solved ? (
          <CopiesStrip a={a} b={b} k={k} />
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            A proportion means two ratios describe the same relationship. Ratio 1 is{" "}
            <strong className="font-semibold text-ink dark:text-bone">
              {a} : {b}
            </strong>
            . Keep dragging until Ratio 2&apos;s bar lines up with it.
          </p>
        )}
      </div>
    </div>
  );
}
