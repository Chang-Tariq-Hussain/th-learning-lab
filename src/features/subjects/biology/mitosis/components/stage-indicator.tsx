import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES } from "../model";

export interface StageIndicatorProps {
  stageIndex: number;
}

/** The spec's "1 ─ 2 ─ 3 ─ 4 ─ 5 ─ 6" strip — a compact row of numbered dots connected by lines, current stage highlighted, earlier ones checked off. */
export function StageIndicator({ stageIndex }: StageIndicatorProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full max-w-xl items-center">
        {STAGES.map((stage, i) => {
          const isDone = i < stageIndex;
          const isCurrent = i === stageIndex;
          return (
            <div key={stage.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isCurrent && "bg-subject-biology text-white",
                    isDone && !isCurrent && "bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/20",
                    !isDone && !isCurrent && "bg-ink/[0.06] text-ink-soft/60 dark:bg-bone/[0.08] dark:text-bone-soft/50",
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : stage.number}
                </div>
                <span
                  className={cn(
                    "hidden text-[10px] font-medium sm:block",
                    isCurrent ? "text-subject-biology" : "text-ink-soft/60 dark:text-bone-soft/50",
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 ? (
                <div
                  className={cn(
                    "mx-1.5 h-px flex-1 transition-colors",
                    isDone ? "bg-subject-biology/50" : "bg-ink/10 dark:bg-bone/10",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
