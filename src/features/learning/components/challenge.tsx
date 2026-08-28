"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Lightbulb, ListChecks, Wrench, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { ExperimentFrame } from "./experiment-frame";
import type { ChallengeScenario } from "../types";

export interface ChallengeAttemptResult {
  scenarioId: string;
  isCorrect: boolean;
  attemptNumber: number;
}

export interface ChallengeProps {
  scenario: ChallengeScenario;
  colorToken: string;
  /** The topic's live simulation. Shown whenever
   *  `scenario.requiresExperiment` isn't explicitly `false` — "where
   *  appropriate, interact with the simulation." Optional: a
   *  reasoning-only challenge can simply omit it. */
  experiment?: ReactNode;
  /** Whether this scenario was already solved in an earlier session —
   *  renders it as already-complete on first mount instead of asking
   *  the student to redo it. */
  alreadySolved: boolean;
  /** Fires on every submit, correct or not — this is "record
   *  performance." The caller decides what to persist. */
  onAttempt: (result: ChallengeAttemptResult) => void;
}

/**
 * A single Challenge, rendered end to end: scenario, objective,
 * constraints, available tools, an optional embedded experiment, an
 * answer (multiple-choice or numeric, from `scenario.answer.mode`),
 * progressive hints, attempt tracking, and — once solved or out of
 * attempts — the worked solution. One generic component for every
 * subject; everything that varies is `scenario` data.
 */
export function Challenge({ scenario, colorToken, experiment, alreadySolved, onAttempt }: ChallengeProps) {
  const colors = resolveSubjectColors(colorToken);

  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(alreadySolved);
  const [revealed, setRevealed] = useState(alreadySolved);
  const [hintsShown, setHintsShown] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [numericValue, setNumericValue] = useState("");

  const showExperiment = Boolean(experiment) && scenario.requiresExperiment !== false;
  const hasAnswer = scenario.answer.mode === "choice" ? selectedOptionId !== null : numericValue.trim() !== "";
  const atMaxAttempts = scenario.maxAttempts != null && attempts >= scenario.maxAttempts;

  function isCorrect(): boolean {
    if (scenario.answer.mode === "choice") {
      return selectedOptionId === scenario.answer.correctOptionId;
    }
    const parsed = Number.parseFloat(numericValue);
    if (Number.isNaN(parsed)) return false;
    return Math.abs(parsed - scenario.answer.target) <= scenario.answer.tolerance;
  }

  function handleSubmit() {
    if (revealed || !hasAnswer) return;

    const attemptNumber = attempts + 1;
    setAttempts(attemptNumber);
    const correct = isCorrect();
    onAttempt({ scenarioId: scenario.id, isCorrect: correct, attemptNumber });

    if (correct) {
      setSolved(true);
      setRevealed(true);
    } else if (scenario.maxAttempts != null && attemptNumber >= scenario.maxAttempts) {
      // Out of attempts — reveal the solution rather than leaving the
      // student stuck with no way forward.
      setRevealed(true);
    }
  }

  return (
    <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-base font-medium text-ink dark:text-bone">{scenario.title}</p>
        {solved ? (
          <Badge className="shrink-0 border-transparent bg-pine-100 text-pine-700 dark:bg-pine-900/40 dark:text-pine-100">
            <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            Solved
          </Badge>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{scenario.scenario}</p>
      <p className="mt-2 text-sm font-medium text-ink dark:text-bone">{scenario.objective}</p>

      {scenario.constraints && scenario.constraints.length > 0 ? (
        <div className="mt-3">
          <p className={cn("mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide", colors.text)}>
            <ListChecks className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Constraints
          </p>
          <ul className="flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
            {scenario.constraints.map((constraint) => (
              <li key={constraint.id} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                {constraint.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {scenario.tools && scenario.tools.length > 0 ? (
        <div className="mt-3">
          <p className={cn("mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide", colors.text)}>
            <Wrench className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Available tools
          </p>
          <ul className="flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
            {scenario.tools.map((tool) => (
              <li key={tool.id} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                {tool.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showExperiment ? (
        <ExperimentFrame label="Use the simulation to work this out" colorTextClassName={colors.text} className="mt-4">
          {experiment}
        </ExperimentFrame>
      ) : null}

      {!revealed ? (
        <>
          {scenario.answer.mode === "choice" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {scenario.answer.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      "border-line dark:border-line-dark",
                      isSelected
                        ? "border-transparent bg-white dark:bg-white/[0.06]"
                        : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={numericValue}
                onChange={(event) => setNumericValue(event.target.value)}
                placeholder="Your answer"
                aria-label={scenario.objective}
                className="h-10 w-32 rounded-full border border-line bg-white px-4 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-pine-500 dark:border-line-dark dark:bg-white/[0.04] dark:text-bone"
              />
              {scenario.answer.unit ? <span className="text-sm text-ink-soft dark:text-bone-soft">{scenario.answer.unit}</span> : null}
            </div>
          )}

          {scenario.hints && scenario.hints.length > 0 ? (
            <div className="mt-3">
              {hintsShown < scenario.hints.length ? (
                <button
                  type="button"
                  onClick={() => setHintsShown((count) => count + 1)}
                  className={cn("inline-flex items-center gap-1.5 text-xs font-medium", colors.text)}
                >
                  <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Show a hint ({hintsShown}/{scenario.hints.length} used)
                </button>
              ) : null}
              {hintsShown > 0 ? (
                <ul className="mt-2 flex flex-col gap-1 text-xs text-ink-soft dark:text-bone-soft">
                  {scenario.hints.slice(0, hintsShown).map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" size="sm" disabled={!hasAnswer} onClick={handleSubmit}>
              Submit
            </Button>
            {attempts > 0 ? (
              <span className="text-xs text-ink-soft dark:text-bone-soft">
                Attempt {attempts}
                {scenario.maxAttempts ? ` / ${scenario.maxAttempts}` : ""}
                {!atMaxAttempts ? " — try again" : ""}
              </span>
            ) : null}
          </div>
        </>
      ) : null}

      {revealed ? (
        <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed">
          {solved ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E0663D]" strokeWidth={1.75} aria-hidden="true" />
          )}
          <div>
            <p className="font-medium text-ink dark:text-bone">
              {solved
                ? attempts > 0
                  ? `Solved after ${attempts} attempt${attempts === 1 ? "" : "s"}.`
                  : "Solved."
                : "Out of attempts — here's how to solve it."}
            </p>
            <p className="mt-1 text-ink-soft dark:text-bone-soft">{scenario.explanation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
