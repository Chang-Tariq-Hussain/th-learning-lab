"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, FlaskConical, Lightbulb, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { PredictionScenario } from "../types";

type PredictionPhase = "predicting" | "experimenting" | "revealed";

export interface PredictionResult {
  scenarioId: string;
  predictedOptionId: string;
  actualResultOptionId: string;
  isCorrect: boolean;
}

export interface PredictionProps {
  scenario: PredictionScenario;
  colorToken: string;
  /** The live simulation experiment the student runs to check their
   *  guess. Only rendered once a prediction has been committed — a
   *  Prediction never shows the experiment (or its result) before the
   *  student has locked in an answer, since seeing it first would
   *  defeat the point of predicting. Any simulation/interactive
   *  component works here; this component knows nothing about what's
   *  inside it. */
  experiment: ReactNode;
  /** Called exactly once per scenario, the moment the result is
   *  revealed — this is step 7, "record prediction performance." The
   *  caller decides what to do with it (typically feeding
   *  `useLearningProgress().recordPrediction`). */
  onRecord: (result: PredictionResult) => void;
}

/**
 * A single Prediction, rendered through all seven steps end to end:
 *
 *  1. Present scenario   — `scenario.scenario` and `scenario.question`
 *                           are shown immediately, in every phase.
 *  2. Ask to predict      — the student picks one of `scenario.options`.
 *  3. Record prediction   — "Lock in my prediction" commits the
 *                           choice; it can't be changed afterward.
 *  4. Allow the experiment — the `experiment` node (the real
 *                           simulation) appears only now.
 *  5. Reveal/compare result — "Reveal what happened" shows the
 *                           predicted option next to the actual one.
 *  6. Explain why          — `scenario.explanation` is shown
 *                           alongside the reveal.
 *  7. Record performance   — `onRecord` fires once, at reveal time.
 *
 * This is the one generic component every subject's Predict section
 * renders — nothing here is specific to Physics, Chemistry, Biology,
 * or Mathematics; everything subject-specific lives in the
 * `PredictionScenario` data and in whatever `experiment` the caller
 * passes in.
 */
export function Prediction({ scenario, colorToken, experiment, onRecord }: PredictionProps) {
  const [phase, setPhase] = useState<PredictionPhase>("predicting");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [predictedOptionId, setPredictedOptionId] = useState<string | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const colors = resolveSubjectColors(colorToken);

  const predictedOption = scenario.options.find((option) => option.id === predictedOptionId) ?? null;
  const actualOption = scenario.options.find((option) => option.id === scenario.actualResultOptionId) ?? null;
  const isCorrect = predictedOptionId === scenario.actualResultOptionId;

  function handleLockIn() {
    if (!selectedOptionId || phase !== "predicting") return;
    setPredictedOptionId(selectedOptionId);
    setPhase("experimenting");
  }

  function handleReveal() {
    if (phase !== "experimenting" || !predictedOptionId) return;
    setPhase("revealed");
    onRecord({
      scenarioId: scenario.id,
      predictedOptionId,
      actualResultOptionId: scenario.actualResultOptionId,
      isCorrect,
    });
  }

  return (
    <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
      {/* Step 1 — present scenario. Always visible, in every phase. */}
      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{scenario.scenario}</p>
      <p className="mt-2 font-display text-base font-medium text-ink dark:text-bone">{scenario.question}</p>

      {/* Step 2/3 — ask for and record a prediction. */}
      <div className="mt-3 flex flex-wrap gap-2">
        {scenario.options.map((option) => {
          const isSelected = phase === "predicting" ? selectedOptionId === option.id : predictedOptionId === option.id;
          const isLocked = phase !== "predicting";
          return (
            <button
              key={option.id}
              type="button"
              disabled={isLocked}
              onClick={() => setSelectedOptionId(option.id)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-default",
                "border-line dark:border-line-dark",
                isSelected
                  ? "border-transparent bg-white dark:bg-white/[0.06]"
                  : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25",
                isLocked && !isSelected && "opacity-50",
              )}
              style={
                phase === "revealed" && isSelected
                  ? { boxShadow: `0 0 0 2px ${isCorrect ? "#5A9E6F" : "#E0663D"}` }
                  : undefined
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {phase === "predicting" ? (
        <>
          {scenario.hint ? (
            <div className="mt-3">
              {!hintShown ? (
                <button
                  type="button"
                  onClick={() => setHintShown(true)}
                  className={cn("inline-flex items-center gap-1.5 text-xs font-medium", colors.text)}
                >
                  <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  Show a hint
                </button>
              ) : (
                <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{scenario.hint}</p>
              )}
            </div>
          ) : null}

          <Button variant="secondary" size="sm" className="mt-3" disabled={!selectedOptionId} onClick={handleLockIn}>
            Lock in my prediction
          </Button>
        </>
      ) : null}

      {/* Step 4 — allow the simulation experiment, gated behind a committed prediction. */}
      {phase === "experimenting" || phase === "revealed" ? (
        <div className="mt-4 rounded-card border border-dashed border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]">
          <p className={cn("mb-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide", colors.text)}>
            <FlaskConical className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Run the experiment to check your prediction
          </p>
          {experiment}
        </div>
      ) : null}

      {phase === "experimenting" ? (
        <Button variant="primary" size="sm" className="mt-4" onClick={handleReveal}>
          Reveal what happened
        </Button>
      ) : null}

      {/* Step 5/6 — reveal, compare, and explain. */}
      {phase === "revealed" && predictedOption && actualOption ? (
        <div className="mt-4 flex flex-col gap-2 text-sm leading-relaxed">
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E0663D]" strokeWidth={1.75} aria-hidden="true" />
            )}
            <p className="text-ink dark:text-bone">
              <span className="font-medium">You predicted:</span> {predictedOption.label}
              {!isCorrect ? (
                <>
                  {" — "}
                  <span className="font-medium">actual result:</span> {actualOption.label}
                </>
              ) : (
                " — that's what happened."
              )}
            </p>
          </div>
          <p className="text-ink-soft dark:text-bone-soft">{scenario.explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
