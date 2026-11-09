"use client";

import { Check, X, RotateCcw, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { STAGES } from "../data/stages";
import {
  arrangeCorrectCount,
  type ArrangeAction,
  type ArrangeState,
  type ChallengeAction,
  type ChallengeRound,
  type IdentifyFeedback,
  type IdentifyQuestion,
  type PredictEvent,
} from "../activities/model";

const card = "rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]";
const optionBase =
  "flex min-h-11 w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone";

function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("mt-3 rounded-xl border px-3 py-2 text-sm leading-snug", ok ? "border-subject-biology/50 bg-subject-biology-soft text-ink dark:bg-subject-biology/10 dark:text-bone" : "border-amber-500/60 bg-amber-50 text-ink dark:bg-amber-500/10 dark:text-bone")}
    >
      <p className="flex items-center gap-1.5 font-semibold">
        {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <X className="h-4 w-4" aria-hidden="true" />}
        {ok ? "Correct" : "Not quite"}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Predict */

export interface PredictPanelProps {
  event: PredictEvent | null;
  choice: string | null;
  answeredCount: number;
  correctCount: number;
  total: number;
  onChoose: (id: string) => void;
  onReveal: () => void;
  onReset: () => void;
}

export function PredictPanel({ event, choice, answeredCount, correctCount, total, onChoose, onReveal, onReset }: PredictPanelProps) {
  return (
    <div className={card} data-testid="predict-panel">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Predict mode</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft" data-testid="predict-score">
          {correctCount} correct of {answeredCount} answered · {total} predictions
        </p>
      </div>
      {event ? (
        <>
          <p className="mt-2 text-sm font-semibold text-ink dark:text-bone" data-testid="predict-question">
            {event.question}
          </p>
          <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label="Your prediction">
            {event.options.map((o) => {
              const picked = choice === o.id;
              const reveal = choice !== null;
              const right = o.id === event.correct;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  disabled={reveal}
                  data-option={o.id}
                  onClick={() => onChoose(o.id)}
                  className={cn(
                    optionBase,
                    !reveal && "border-line hover:border-subject-biology dark:border-line-dark",
                    reveal && right && "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15",
                    reveal && picked && !right && "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
                    reveal && !picked && !right && "border-line opacity-60 dark:border-line-dark",
                  )}
                >
                  {reveal && right ? <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : reveal && picked ? <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-current opacity-50" aria-hidden="true" />}
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
          {choice ? (
            <>
              <Verdict ok={choice === event.correct}>{event.explanation}</Verdict>
              <Button className="mt-3" onClick={onReveal} data-testid="predict-reveal">
                Reveal what happens
              </Button>
            </>
          ) : null}
        </>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Press Play or Step forward. The simulation will pause just before an important event and ask what happens next. Choose an answer, then reveal the event in the picture.
        </p>
      )}
      {answeredCount > 0 ? (
        <Button variant="ghost" size="sm" className="mt-2" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset predictions
        </Button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Identify */

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
  const q = questions[index]!;
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
      {q.kind !== "name" ? <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Click it in the picture, or tab to it and press Enter.</p> : null}
      {q.kind === "name" ? (
        <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label="Answer">
          {q.options.map((o) => {
            const reveal = feedback?.ok === true;
            const picked = nameChoice === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={picked}
                disabled={reveal}
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
          <Verdict ok={feedback.ok}>{feedback.message}</Verdict>
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

/* ------------------------------------------------------------------ Arrange */

export interface ArrangePanelProps {
  state: ArrangeState;
  dispatch: (a: ArrangeAction) => void;
}

export function ArrangePanel({ state, dispatch }: ArrangePanelProps) {
  const full = state.placed.length === STAGES.length;
  const correct = arrangeCorrectCount(state.placed);
  return (
    <div className={card} data-testid="arrange-panel">
      <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Arrange the stages</p>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Put the nine stages of meiosis in order, from the first to the last. Tap a card to place it; tap a placed card&apos;s arrows to move it.</p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Stages to place</p>
      <ul className="mt-1 flex min-h-11 flex-wrap gap-1.5" aria-label="Stages to place">
        {state.pool.map((s) => (
          <li key={s}>
            <button type="button" data-pool={s} onClick={() => dispatch({ type: "place", stage: s })} className="min-h-11 rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink hover:border-subject-biology focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:border-line-dark dark:bg-white/[0.06] dark:text-bone dark:focus-visible:outline-bone">
              {STAGES[s]!.label}
            </button>
          </li>
        ))}
        {state.pool.length === 0 ? <li className="text-sm text-ink-soft dark:text-bone-soft">All placed.</li> : null}
      </ul>

      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Your order</p>
      <ol className="mt-1 flex flex-col gap-1.5" aria-label="Your order" data-testid="arrange-slots">
        {Array.from({ length: STAGES.length }, (_, i) => {
          const s = state.placed[i];
          const ok = state.checked && s === i;
          const bad = state.checked && s !== undefined && s !== i;
          return (
            <li key={i} className={cn("flex min-h-11 items-center gap-2 rounded-xl border px-2 py-1 text-sm", s === undefined ? "border-dashed border-line text-ink-soft dark:border-line-dark dark:text-bone-soft" : "border-line bg-white dark:border-line-dark dark:bg-white/[0.06]", ok && "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15", bad && "border-amber-500 bg-amber-50 dark:bg-amber-500/10")} data-slot={i} data-state={ok ? "ok" : bad ? "bad" : "idle"}>
              <span className="w-5 text-center text-xs font-semibold tabular-nums">{i + 1}</span>
              {s === undefined ? (
                <span>Empty</span>
              ) : (
                <>
                  <span className="flex-1 font-medium text-ink dark:text-bone">{STAGES[s]!.label}</span>
                  {ok ? <Check className="h-4 w-4 text-subject-biology" aria-label="In the right place" /> : null}
                  {bad ? <X className="h-4 w-4 text-amber-600" aria-label="Not in the right place" /> : null}
                  {!state.solved ? (
                    <>
                      <button type="button" aria-label={`Move ${STAGES[s]!.label} up`} disabled={i === 0} onClick={() => dispatch({ type: "move", stage: s, dir: -1 })} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5 disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/10">
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" aria-label={`Move ${STAGES[s]!.label} down`} disabled={i === state.placed.length - 1} onClick={() => dispatch({ type: "move", stage: s, dir: 1 })} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5 disabled:opacity-30 dark:text-bone-soft dark:hover:bg-bone/10">
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" aria-label={`Remove ${STAGES[s]!.label}`} onClick={() => dispatch({ type: "remove", stage: s })} className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10">
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => dispatch({ type: "check" })} disabled={!full || state.solved} data-testid="arrange-check">
          Check order
        </Button>
        <Button variant="secondary" onClick={() => dispatch({ type: "retry" })} data-testid="arrange-retry">
          Clear and retry
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "reshuffle" })}>
          New shuffle
        </Button>
      </div>

      {state.checked ? (
        state.solved ? (
          <Verdict ok>
            All nine stages are in the right order{state.attempts > 1 ? ` (after ${state.attempts} tries)` : ""}. Remember: DNA is copied once, in interphase. Meiosis I separates homologous chromosomes; meiosis II separates sister chromatids.
          </Verdict>
        ) : (
          <Verdict ok={false}>
            {correct} of {STAGES.length} are in the right place. Hint: Interphase comes first, then all of meiosis I (prophase, metaphase, anaphase, telophase), then all of meiosis II in the same four-step pattern. Fix the cards marked with a cross and check again.
          </Verdict>
        )
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Challenge */

export interface ChallengePanelProps {
  round: ChallengeRound;
  dispatch: (a: ChallengeAction) => void;
}

export function ChallengePanel({ round, dispatch }: ChallengePanelProps) {
  if (round.finished) {
    const score = round.results.filter(Boolean).length;
    return (
      <div className={card} data-testid="challenge-panel">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Meiosis challenge</p>
        <p className="mt-2 font-display text-2xl font-medium text-ink dark:text-bone" data-testid="challenge-score">
          {score} / {round.questions.length}
        </p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{score === round.questions.length ? "Perfect round." : "Review the explanations, then try a new round for a different set of questions."}</p>
        <Button className="mt-3" onClick={() => dispatch({ type: "restart" })} data-testid="challenge-restart">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          New round
        </Button>
      </div>
    );
  }
  const q = round.questions[round.index]!;
  const answered = round.picked !== null;
  const pickedOpt = q.options.find((o) => o.id === round.picked);
  return (
    <div className={card} data-testid="challenge-panel">
      <div className="flex items-center justify-between">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Meiosis challenge</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Question {round.index + 1} of {round.questions.length}
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink dark:text-bone" data-testid="challenge-prompt">
        {q.prompt}
      </p>
      <div className="mt-2 flex flex-col gap-1.5" role="radiogroup" aria-label="Answers">
        {q.options.map((o) => {
          const picked = round.picked === o.id;
          const right = o.id === q.correct;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={picked}
              disabled={answered}
              data-option={o.id}
              data-correct={right ? "true" : undefined}
              onClick={() => dispatch({ type: "pick", option: o.id })}
              className={cn(optionBase, !answered && "border-line hover:border-subject-biology dark:border-line-dark", answered && right && "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15", answered && picked && !right && "border-amber-500 bg-amber-50 dark:bg-amber-500/10", answered && !picked && !right && "border-line opacity-60 dark:border-line-dark")}
            >
              {answered && right ? <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : answered && picked ? <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>
      {answered ? (
        <>
          <Verdict ok={round.picked === q.correct}>
            {round.picked !== q.correct && pickedOpt?.why ? <p className="mb-1">{pickedOpt.why}</p> : null}
            <p>{q.explanation}</p>
          </Verdict>
          <Button className="mt-3" onClick={() => dispatch({ type: "next" })} data-testid="challenge-next">
            {round.index + 1 >= round.questions.length ? "See score" : "Next question"}
          </Button>
        </>
      ) : null}
    </div>
  );
}
