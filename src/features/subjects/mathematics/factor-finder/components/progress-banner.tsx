"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgressBanner({
  prompt,
  celebrating,
  foundCount,
  totalCount,
}: {
  prompt: string;
  celebrating: boolean;
  foundCount: number;
  totalCount: number;
}) {
  return (
    <div
      role="status"
      className={cn(
        "mx-auto flex w-fit flex-col items-center gap-1 rounded-2xl px-5 py-3 text-center text-sm font-medium shadow-sm transition-colors duration-300",
        celebrating
          ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
          : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15",
      )}
    >
      <span className="flex items-center gap-2">
        {celebrating ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Found them all!
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
            {prompt}
          </>
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">
        Found {foundCount} of {totalCount}
      </span>
    </div>
  );
}
