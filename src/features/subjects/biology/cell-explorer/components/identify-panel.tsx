"use client";

import { Eye, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrganelle } from "../data/organelles";
import { MAX_HINTS, type RoundAction, type RoundState } from "../activities/model";
import type { CellKind, OrganelleId } from "../types";
import { Feedback, praise, ProgressSteps, resultMessage, tryAgain } from "./feedback";
import { OrganelleGlyph } from "./organelle-glyph";

export interface IdentifyPanelProps {
  round: RoundState;
  dispatch: (a: RoundAction) => void;
  kind: CellKind;
  onRestart: () => void;
  onReview: (id: OrganelleId) => void;
}

/** "Find the ___" activity. The learner answers by selecting the structure in the diagram itself. */
export function IdentifyPanel({ round, dispatch, kind, onRestart, onReview }: IdentifyPanelProps) {
  const total = round.questions.length;
  const q = round.questions[round.index];
  const target = getOrganelle(q?.id);

  if (round.finished || !q || !target) return <RoundResult round={round} onRestart={onRestart} onReview={onReview} noun="found" />;

  const lastWrong = getOrganelle(round.wrong[round.wrong.length - 1]);
  const canReveal = round.wrong.length >= 2 || round.hints >= MAX_HINTS;

  return (
    <div className="flex flex-col gap-4" data-testid="identify-panel">
      <ProgressSteps index={round.index} total={total} finished={false} />
      <div>
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">Identify</p>
        <h3 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone">
          Find the <span data-testid="identify-target">{target.name}</span>
        </h3>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Select it in the {kind} cell diagram. Names are hidden so you can rely on what you have learned.
        </p>
      </div>

      {round.status === "asking" ? (
        <>
          {lastWrong ? (
            <Feedback tone="retry" title={tryAgain(round.wrong.length)} testId="identify-feedback">
              That was the {lastWrong.name}. You can try again{round.hints < MAX_HINTS ? ", or ask for a hint" : ""}.
            </Feedback>
          ) : null}
          {round.hints > 0 ? (
            <Feedback tone="info" title="Hint" testId="identify-hint">
              <ul className="list-disc pl-4">
                <li>{target.where}</li>
                {round.hints > 1 ? <li>{target.appearance}</li> : null}
              </ul>
            </Feedback>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button size="md" variant="secondary" onClick={() => dispatch({ type: "hint" })} disabled={round.hints >= MAX_HINTS}>
              <Lightbulb className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {round.hints === 0 ? "Hint" : round.hints < MAX_HINTS ? "Another hint" : "No more hints"}
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
          <Feedback tone="success" title={round.status === "correct" ? `${praise(round.index)} That's the ${target.name}.` : `Here it is: the ${target.name}.`} testId="identify-feedback">
            <span className="flex items-start gap-2">
              <OrganelleGlyph id={target.id} size={26} />
              <span>
                <strong>{target.function}</strong> {target.contribution}
              </span>
            </span>
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

export function RoundResult({ round, onRestart, onReview, noun }: { round: RoundState; onRestart: () => void; onReview: (id: OrganelleId) => void; noun: string }) {
  const total = round.questions.length;
  return (
    <div className="flex flex-col gap-4" data-testid="round-result">
      <ProgressSteps index={total} total={total} finished />
      <Feedback tone="success" title={`${round.firstTry} of ${total} ${noun} on the first try`} testId="round-score">
        {resultMessage(round.firstTry, total)}
      </Feedback>
      {round.missed.length > 0 ? (
        <section aria-label="Structures to review">
          <h3 className="mb-2 font-mono text-label uppercase tracking-eyebrow text-ink-soft dark:text-bone-soft">Worth another look (opens in Explore)</h3>
          <ul className="flex flex-wrap gap-2">
            {round.missed.map((id) => {
              const o = getOrganelle(id)!;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onReview(id)}
                    className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-white/60 px-3 text-sm text-ink hover:bg-ink/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone dark:hover:bg-bone/[0.06] dark:focus-visible:outline-bone"
                  >
                    <OrganelleGlyph id={id} size={20} />
                    {o.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
      <div>
        <Button size="md" onClick={onRestart} data-testid="play-again">
          <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Play again
        </Button>
      </div>
    </div>
  );
}
