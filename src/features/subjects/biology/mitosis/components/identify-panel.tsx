"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IdentifyFeedback, IdentifyQuestion } from "../activities/model";

const card = "rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]";
const optionBase =
  "flex min-h-11 w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone";

export interface IdentifyPanelProps {
  questions: IdentifyQuestion[];
  index: number;
  feedback: IdentifyFeedback | null;
  nameChoice: string | null;
  score: number;
  done: boolean;
  onNameChoice: (id: string) => void;
  onNext: () => void;
  onRestart: () => void;
}

/** Identify mode: click the structure the question names (chromatid, centromere, kinetochore, fiber...), or name a glowing structure. */
export function IdentifyPanel({ questions, index, feedback, nameChoice, score, done, onNameChoice, onNext, onRestart }: IdentifyPanelProps) {
  if (done) {
    return (
      <div className={card} data-testid="identify-panel">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Identify mode</p>
        <p className="mt-2 text-lg font-semibold text-ink dark:text-bone" data-testid="identify-final">
          You identified {score} of {questions.length} on the first try.
        </p>
        <Button className="mt-3" onClick={onRestart}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }
  const q = questions[Math.min(index, questions.length - 1)]!;
  return (
    <div className={card} data-testid="identify-panel">
      <div className="flex items-center justify-between">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Identify mode</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Question {index + 1} of {questions.length}
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink dark:text-bone" data-testid="identify-prompt">
        {q.prompt}
      </p>
      {q.kind !== "name" ? <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Click it in the picture. Zoom in with the buttons under the picture for small parts.</p> : null}
      {q.kind === "name" ? (
        <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label="Answer">
          {q.options.map((o) => {
            const picked = nameChoice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={picked}
                disabled={feedback?.ok === true}
                data-option={o.id}
                onClick={() => onNameChoice(o.id)}
                className={cn(optionBase, "border-line hover:border-subject-biology dark:border-line-dark", picked && feedback?.ok && "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15", picked && feedback && !feedback.ok && "border-amber-500 bg-amber-50 dark:bg-amber-500/10")}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      ) : null}
      {feedback ? (
        <>
          <div role="status" aria-live="polite" className={cn("mt-3 rounded-xl border px-3 py-2 text-sm leading-snug", feedback.ok ? "border-subject-biology/50 bg-subject-biology-soft text-ink dark:bg-subject-biology/10 dark:text-bone" : "border-amber-500/60 bg-amber-50 text-ink dark:bg-amber-500/10 dark:text-bone")}>
            <p className="flex items-center gap-1.5 font-semibold">
              {feedback.ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
              {feedback.ok ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1">{feedback.message}</p>
          </div>
          {feedback.ok ? (
            <Button className="mt-3" onClick={onNext} data-testid="identify-next">
              {index + 1 >= questions.length ? "Finish" : "Next question"}
            </Button>
          ) : (
            <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Try again.</p>
          )}
        </>
      ) : null}
    </div>
  );
}
