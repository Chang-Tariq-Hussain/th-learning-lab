"use client";

import { Check, Eye, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOrganelle, PRESENCE_SHORT } from "../data/organelles";
import { MAX_HINTS, SORT_NOTES, type RoundAction, type RoundState } from "../activities/model";
import type { CellKind, OrganelleId } from "../types";
import { Feedback, praise, ProgressSteps, tryAgain } from "./feedback";
import { RoundResult } from "./identify-panel";

export type ChoiceVariant = "function" | "sort";

export interface ChoicePanelProps {
  round: RoundState;
  dispatch: (a: RoundAction) => void;
  variant: ChoiceVariant;
  kind: CellKind;
  onRestart: () => void;
  onReview: (id: OrganelleId) => void;
}

/**
 * Multiple-choice activity used twice:
 *  - "function": a structure is highlighted in the diagram; pick its job from four options.
 *  - "sort": a structure's name is shown; say whether it is plant-only or shared.
 * Wrong options switch off (with an icon and text) so the learner can retry; right answers explain why.
 */
export function ChoicePanel({ round, dispatch, variant, kind, onRestart, onReview }: ChoicePanelProps) {
  const total = round.questions.length;
  const q = round.questions[round.index];
  const target = getOrganelle(q?.id);

  if (round.finished || !q || !target) return <RoundResult round={round} onRestart={onRestart} onReview={onReview} noun="correct" />;

  const asking = round.status === "asking";
  const canReveal = variant === "function" && (round.wrong.length >= 2 || round.hints >= MAX_HINTS);
  const lastWrongOption = round.wrong[round.wrong.length - 1];
  const wrongName = variant === "function" ? getOrganelle(lastWrongOption)?.name : undefined;

  const prompt =
    variant === "function" ? (
      asking ? (
        <>What does the <span className="underline decoration-amber-600 decoration-2 underline-offset-4">highlighted</span> structure do?</>
      ) : (
        <>The {target.name}</>
      )
    ) : (
      <>
        Where is the <span data-testid="sort-target">{target.name}</span> found?
      </>
    );

  const sortNote = SORT_NOTES[target.id];

  return (
    <div className="flex flex-col gap-4" data-testid={`${variant}-panel`}>
      <ProgressSteps index={round.index} total={total} finished={false} />
      <div>
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">{variant === "function" ? "Function" : "Quick check"}</p>
        <h3 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">{prompt}</h3>
        {variant === "function" && asking ? (
          <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Look at its shape in the {kind} cell, then choose the job that matches.</p>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2" aria-label="Answer choices">
        {(q.options ?? []).map((opt, i) => {
          const isWrong = round.wrong.includes(opt.value);
          const isRight = !asking && opt.value === q.answer;
          return (
            <li key={opt.value}>
              <button
                type="button"
                disabled={!asking || isWrong}
                onClick={() => dispatch({ type: "answer", value: opt.value })}
                data-option={opt.value}
                data-state={isWrong ? "wrong" : isRight ? "right" : "idle"}
                className={cn(
                  "flex min-h-12 w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-base leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
                  isRight
                    ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-300 dark:bg-emerald-300/10 dark:text-emerald-200"
                    : isWrong
                      ? "border-line bg-ink/[0.04] text-ink-soft line-through decoration-ink-soft/60 dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft"
                      : "border-line bg-white/70 text-ink hover:bg-ink/[0.04] disabled:opacity-60 dark:border-line-dark dark:bg-white/[0.04] dark:text-bone dark:hover:bg-bone/[0.06]",
                )}
              >
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold">
                  {isRight ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : isWrong ? <X className="h-3.5 w-3.5" strokeWidth={3} /> : String.fromCharCode(65 + i)}
                </span>
                <span>
                  {opt.label}
                  {isWrong ? <span className="sr-only"> (not correct)</span> : null}
                  {isRight ? <span className="sr-only"> (correct)</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {asking ? (
        <>
          {round.wrong.length > 0 ? (
            <Feedback tone="retry" title={tryAgain(round.wrong.length)} testId={`${variant}-feedback`}>
              {variant === "function" && wrongName ? `That describes the ${wrongName}, not the highlighted structure. ` : "That's not the one. "}
              Choose again.
            </Feedback>
          ) : null}
          {round.hints > 0 ? (
            <Feedback tone="info" title="Hint" testId={`${variant}-hint`}>
              {variant === "function" ? (
                <ul className="list-disc pl-4">
                  <li>{target.appearance}</li>
                  {round.hints > 1 ? <li>It is found in {PRESENCE_SHORT[target.presence].toLowerCase()}.</li> : null}
                </ul>
              ) : (
                <p>{target.function}</p>
              )}
            </Feedback>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button size="md" variant="secondary" onClick={() => dispatch({ type: "hint" })} disabled={round.hints >= (variant === "sort" ? 1 : MAX_HINTS)}>
              <Lightbulb className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {round.hints === 0 ? "Hint" : round.hints < MAX_HINTS && variant === "function" ? "Another hint" : "No more hints"}
            </Button>
            {canReveal ? (
              <Button size="md" variant="ghost" onClick={() => dispatch({ type: "reveal" })}>
                <Eye className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                Show me
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Feedback tone="success" title={round.status === "correct" ? praise(round.index) : "Here is the answer."} testId={`${variant}-feedback`}>
            {variant === "function" ? (
              <>
                The {target.name}: <strong>{target.function}</strong> {target.contribution}
              </>
            ) : (
              <>
                {target.name}: <strong>{PRESENCE_SHORT[target.presence].toLowerCase()}.</strong> {sortNote ?? ""}
              </>
            )}
          </Feedback>
          <div>
            <Button size="md" onClick={() => dispatch({ type: "next" })} data-testid="next">
              {round.index + 1 >= total ? "See results" : "Next question"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
