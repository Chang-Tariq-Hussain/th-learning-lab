"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { PredictionPrompt } from "./prediction-prompt";
import { PREDICTION_QUESTIONS } from "../model";

const STEPS = [2, 4, 6, 8, 10];
const REFERENCE_COUNT = 2;

/** Level 4 — an interactive concentration slider next to a fixed low-concentration reference chamber. */
export function Level4Concentration() {
  const [stepIndex, setStepIndex] = useState(2);
  const count = STEPS[stepIndex] ?? STEPS[2]!;

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Concentration is simply how many reactant particles are packed into the same space. Drag the slider and
        watch how much more often particles find each other.
      </p>

      <PredictionPrompt question={PREDICTION_QUESTIONS.concentration} />

      <div>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          <span>Low</span>
          <span className="text-ink dark:text-bone">Reactant Concentration</span>
          <span>High</span>
        </div>
        <input
          type="range"
          min={0}
          max={STEPS.length - 1}
          step={1}
          value={stepIndex}
          onChange={(e) => setStepIndex(Number(e.target.value))}
          className="mt-2 w-full accent-[#2E9E5B]"
          aria-label="Reactant concentration"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReactionChamber
          key={`ref-${REFERENCE_COUNT}`}
          numA={REFERENCE_COUNT}
          numB={REFERENCE_COUNT}
          tempC={55}
          label="Reference · Low Concentration"
          showControls={false}
        />
        <ReactionChamber key={`your-${count}`} numA={count} numB={count} tempC={55} label="Your Chamber" />
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        More particles <span className="font-medium text-ink dark:text-bone">→</span> more collisions{" "}
        <span className="font-medium text-ink dark:text-bone">→</span> more successful collisions{" "}
        <span className="font-medium text-ink dark:text-bone">→</span> faster reaction.
      </p>
    </div>
  );
}
