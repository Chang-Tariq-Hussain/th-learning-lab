"use client";

import { useReducer, useState } from "react";
import { Check, Lightbulb, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { card, eyebrow, optionBase } from "./style";
import { newRound, roundReducer, shuffleIdx, type Q } from "./quiz-model";

/**
 * A round of multiple-choice questions with immediate feedback. Options are shuffled per question (the correct answer
 * is stored as an id, never a position). `onAsk` lets a lab highlight the part of its scene the question is about.
 */
export function QuizPanel({ title, intro, bank, size = 6, testId, onAsk }: { title: string; intro: string; bank: Q[]; size?: number; testId: string; onAsk?: (q: Q | null) => void }) {
  const [state, dispatch] = useReducer(roundReducer, undefined, () => newRound(bank.length, size, 7));
  const [hint, setHint] = useState(false);
  const q = bank[state.order[state.index] ?? 0]!;
  const opts = shuffleIdx(q.options.length, state.seed * 31 + state.index + 1).map((i) => q.options[i]!);
  const reveal = state.picked !== null;
  const ok = state.picked === q.correct;

  if (state.done) {
    return (
      <div className={card} data-testid={testId}>
        <p className={eyebrow}>{title}</p>
        <p className="mt-2 text-lg font-semibold text-ink dark:text-bone" data-testid={`${testId}-score`}>
          {state.score} of {state.order.length} correct
        </p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{state.score === state.order.length ? "Excellent — every answer was right." : "Review the explanations in the lab, then try a fresh round."}</p>
        <Button className="mt-3" variant="secondary" onClick={() => (onAsk?.(null), dispatch({ type: "restart", bankSize: bank.length, size, seed: state.seed + 11 }))}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          New round
        </Button>
      </div>
    );
  }
  return (
    <div className={card} data-testid={testId}>
      <div className="flex items-center justify-between gap-2">
        <p className={eyebrow}>{title}</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Question {state.index + 1} of {state.order.length} · {state.score} correct
        </p>
      </div>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{intro}</p>
      <p className="mt-3 text-sm font-semibold text-ink dark:text-bone" data-testid={`${testId}-question`}>
        {q.prompt}
      </p>
      <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label="Answer options">
        {opts.map((o) => {
          const picked = state.picked === o.id;
          const right = o.id === q.correct;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={reveal}
              data-option={o.id}
              onClick={() => (onAsk?.(q), dispatch({ type: "pick", option: o.id, correct: q.correct }))}
              className={cn(
                optionBase,
                !reveal && "border-line bg-white hover:border-subject-biology dark:border-line-dark dark:bg-white/[0.06]",
                reveal && right && "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15",
                reveal && picked && !right && "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
                reveal && !picked && !right && "border-line opacity-70 dark:border-line-dark",
              )}
            >
              {reveal && right ? <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : reveal && picked ? <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <span className="w-4" />}
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
      {!reveal && q.hint ? (
        <button type="button" className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-medium text-ink-soft underline dark:text-bone-soft" onClick={() => setHint((h) => !h)}>
          <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
          {hint ? "Hide hint" : "Show a hint"}
        </button>
      ) : null}
      {!reveal && hint && q.hint ? <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{q.hint}</p> : null}
      {reveal ? (
        <div role="status" aria-live="polite" className={cn("mt-3 rounded-xl border px-3 py-2 text-sm leading-snug", ok ? "border-subject-biology/50 bg-subject-biology-soft dark:bg-subject-biology/10" : "border-amber-500/60 bg-amber-50 dark:bg-amber-500/10")} data-testid={`${testId}-feedback`}>
          <p className="font-semibold">{ok ? "Correct" : "Not quite"}</p>
          <p className="mt-1">{q.why}</p>
          <Button className="mt-2" size="sm" variant="secondary" onClick={() => (setHint(false), onAsk?.(null), dispatch({ type: "next" }))} data-testid={`${testId}-next`}>
            {state.index + 1 >= state.order.length ? "See score" : "Next question"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
