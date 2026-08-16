import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  stepIndex: number;
}

const LABELS = ["Before", "Highlight", "Transfer", "After", "Explain"];

export function StepIndicator({ stepIndex }: StepIndicatorProps) {
  return (
    <div className="flex w-full max-w-md items-center">
      {LABELS.map((label, i) => {
        const isDone = i < stepIndex;
        const isCurrent = i === stepIndex;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors",
                  isCurrent && "bg-subject-chemistry text-paper",
                  isDone && !isCurrent && "bg-subject-chemistry/20 text-subject-chemistry",
                  !isDone && !isCurrent && "bg-ink/[0.06] text-ink-soft/60 dark:bg-bone/[0.08] dark:text-bone-soft/50",
                )}
              >
                {isDone ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </div>
              <span className={cn("whitespace-nowrap text-[9px] font-medium", isCurrent ? "text-subject-chemistry" : "text-ink-soft/60 dark:text-bone-soft/50")}>
                {label}
              </span>
            </div>
            {i < LABELS.length - 1 ? (
              <div className={cn("mx-1 h-px flex-1 transition-colors", isDone ? "bg-subject-chemistry/50" : "bg-ink/10 dark:bg-bone/10")} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
