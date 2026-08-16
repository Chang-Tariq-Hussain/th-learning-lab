"use client";

import { useState } from "react";
import { ReactionChamber } from "./reaction-chamber";
import { PredictionPrompt } from "./prediction-prompt";
import { PREDICTION_QUESTIONS } from "../model";

const REFERENCE_TEMP = 25;

/** Level 5 — a temperature slider (20–100°C) next to a fixed low-temperature reference chamber. */
export function Level5Temperature() {
  const [tempC, setTempC] = useState(60);

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Temperature controls how fast particles move. Faster particles collide more often, and more of those
        collisions carry enough energy to actually react.
      </p>

      <PredictionPrompt question={PREDICTION_QUESTIONS.temperature} />

      <div>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          <span>20°C</span>
          <span className="text-ink dark:text-bone">Temperature — {tempC}°C</span>
          <span>100°C</span>
        </div>
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={tempC}
          onChange={(e) => setTempC(Number(e.target.value))}
          className="mt-2 w-full accent-[#2E9E5B]"
          aria-label="Temperature in degrees Celsius"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ReactionChamber numA={5} numB={5} tempC={REFERENCE_TEMP} label={`Reference · ${REFERENCE_TEMP}°C`} showControls={false} />
        <ReactionChamber numA={5} numB={5} tempC={tempC} label={`Your Chamber · ${tempC}°C`} />
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Higher temperature <span className="font-medium text-ink dark:text-bone">→</span> faster particles{" "}
        <span className="font-medium text-ink dark:text-bone">→</span> more frequent, more energetic collisions{" "}
        <span className="font-medium text-ink dark:text-bone">→</span> faster reaction.
      </p>
    </div>
  );
}
