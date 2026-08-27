"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Challenge } from "../model";

export function ChallengeBanner({ challenge, celebrating }: { challenge: Challenge; celebrating: boolean }) {
  return (
    <div
      role="status"
      className={cn(
        "mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-300",
        celebrating
          ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
          : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15",
      )}
    >
      {celebrating ? (
        <>
          <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
          Exactly right — that result is {challenge.targetParity}.
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
          {challenge.prompt}
        </>
      )}
    </div>
  );
}
