import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGES } from "../model";

export interface StageIndicatorProps {
  stageIndex: number;
}

/** A compact, horizontally scrollable row of nine numbered dots (Mitosis's strip only needed to fit six). Current stage highlighted, earlier ones checked off. */
export function StageIndicator({ stageIndex }: StageIndicatorProps) {
  return (
    <div className="w-full max-w-3xl overflow-x-auto pb-1">
      <div className="flex min-w-[560px] items-center px-1">
        {STAGES.map((stage, i) => {
          const isDone = i < stageIndex;
          const isCurrent = i === stageIndex;
          return (
            <div key={stage.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                    isCurrent && "bg-subject-biology text-white",
                    isDone && !isCurrent && "bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/20",
                    !isDone && !isCurrent && "bg-ink/[0.06] text-ink-soft/60 dark:bg-bone/[0.08] dark:text-bone-soft/50",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" strokeWidth={2.5} /> : stage.number}
                </div>
                <span className={cn("whitespace-nowrap text-[9.5px] font-medium", isCurrent ? "text-subject-biology" : "text-ink-soft/60 dark:text-bone-soft/50")}>
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 ? (
                <div className={cn("mx-1 h-px flex-1 transition-colors", isDone ? "bg-subject-biology/50" : "bg-ink/10 dark:bg-bone/10")} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
