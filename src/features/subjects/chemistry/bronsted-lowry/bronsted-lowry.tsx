"use client";

import { useEffect, useState } from "react";
import { ArrheniusConnection } from "./components/arrhenius-connection";
import { Challenge } from "./components/challenge";
import { ExplanationPanel } from "./components/explanation-panel";
import { ProtonTransferScene } from "./components/proton-transfer-scene";
import { ReactionPicker } from "./components/reaction-picker";
import { StepControls } from "./components/step-controls";
import { StepIndicator } from "./components/step-indicator";
import { LAST_STEP_INDEX, STEP_ADVANCE_MS, getReaction } from "./model";
import type { BronstedLowryState } from "./types";

const INITIAL_STATE: BronstedLowryState = {
  reactionSlug: "hcl-water",
  stepIndex: 0,
  running: false,
};

/**
 * Brønsted–Lowry Theory — a shared 5-step proton-transfer sequence
 * replayed against two reactions. Same "one discrete stepIndex,
 * timer-driven Start, manual Next Step" pattern used throughout this
 * project's step-based simulations.
 */
export function BronstedLowry() {
  const [state, setState] = useState<BronstedLowryState>(INITIAL_STATE);
  const { reactionSlug, stepIndex, running } = state;
  const reaction = getReaction(reactionSlug);
  const finished = stepIndex >= LAST_STEP_INDEX;

  useEffect(() => {
    if (!running || stepIndex >= LAST_STEP_INDEX) return;
    const timeout = setTimeout(() => {
      setState((prev) => {
        if (!prev.running) return prev;
        const nextIndex = Math.min(prev.stepIndex + 1, LAST_STEP_INDEX);
        return { ...prev, stepIndex: nextIndex, running: nextIndex < LAST_STEP_INDEX };
      });
    }, STEP_ADVANCE_MS);
    return () => clearTimeout(timeout);
  }, [running, stepIndex]);

  const handleSelectReaction = (slug: BronstedLowryState["reactionSlug"]) => {
    setState({ reactionSlug: slug, stepIndex: 0, running: false });
  };

  const handleStart = () => {
    if (finished) return;
    setState((prev) => ({ ...prev, running: true }));
  };

  const handlePause = () => setState((prev) => ({ ...prev, running: false }));

  const handleNextStep = () =>
    setState((prev) => ({ ...prev, running: false, stepIndex: Math.min(prev.stepIndex + 1, LAST_STEP_INDEX) }));

  const handleReset = () => setState((prev) => ({ ...prev, stepIndex: 0, running: false }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <ReactionPicker selected={reactionSlug} onSelect={handleSelectReaction} />
        <StepIndicator stepIndex={stepIndex} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_18rem]">
        <ProtonTransferScene reaction={reaction} stepIndex={stepIndex} />
        <ExplanationPanel reaction={reaction} stepIndex={stepIndex} />
      </div>

      <StepControls running={running} finished={finished} onStart={handleStart} onPause={handlePause} onNextStep={handleNextStep} onReset={handleReset} />

      <Challenge />

      <ArrheniusConnection />
    </div>
  );
}
