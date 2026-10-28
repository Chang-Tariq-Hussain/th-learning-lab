"use client";

import { useEffect, useState } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { CellScene } from "./components/cell-scene";
import { ExplanationPanel } from "./components/explanation-panel";
import { FinalResult } from "./components/final-result";
import { KeyConceptCallout } from "./components/key-concept-callout";
import { MeiosisOverview } from "./components/meiosis-overview";
import { MitosisComparison } from "./components/mitosis-comparison";
import { StageControls } from "./components/stage-controls";
import { StageIndicator } from "./components/stage-indicator";
import { WhyItMatters } from "./components/why-it-matters";
import { INITIAL_MEIOSIS_STATE, LAST_STAGE_INDEX, STAGES, STAGE_ADVANCE_MS, currentStage, isFinished } from "./model";
import type { MeiosisState } from "./types";

/**
 * Meiosis — How Sex Cells Are Formed. Same "one discrete stageIndex,
 * timer-driven Start, manual Next Stage, framer-motion tweens between
 * whatever two stages are adjacent" pattern as Mitosis, extended to
 * nine stages and a two-round division. `stageIndex` is still the
 * entire piece of state this component owns; every visual (the
 * overview strip, the cell scene, the explanation panel) is a plain
 * lookup against it.
 */
export function Meiosis() {
  const [state, setState] = useState<MeiosisState>(INITIAL_MEIOSIS_STATE);
  const { running, stageIndex } = state;
  const finished = isFinished(state);
  const stage = currentStage(state);

  useEffect(() => {
    if (!running || stageIndex >= LAST_STAGE_INDEX) return;

    const timeout = setTimeout(() => {
      setState((prev) => {
        if (!prev.running) return prev;
        const nextIndex = Math.min(prev.stageIndex + 1, LAST_STAGE_INDEX);
        return { stageIndex: nextIndex, running: nextIndex < LAST_STAGE_INDEX };
      });
    }, STAGE_ADVANCE_MS);

    return () => clearTimeout(timeout);
  }, [running, stageIndex]);

  const handleStart = () => {
    if (finished) return;
    setState((prev) => ({ ...prev, running: true }));
  };

  const handlePause = () => {
    setState((prev) => ({ ...prev, running: false }));
  };

  const handleNextStage = () => {
    setState((prev) => ({
      running: false,
      stageIndex: Math.min(prev.stageIndex + 1, LAST_STAGE_INDEX),
    }));
  };

  const handleReset = () => {
    setState(INITIAL_MEIOSIS_STATE);
  };

  const runState: SimulationRunState = running ? "running" : finished ? "finished" : stageIndex > 0 ? "paused" : "idle";

  return (
    <div className="flex flex-col gap-6 py-4">
      <MeiosisOverview stage={stage} />
      <SimulationLayout
        stageLabel="Meiosis simulation"
        aspect={440 / 320}
        stageCap="24rem"
        runState={runState}
        statusDetail="All stages complete."
        readouts={
          <p className="text-center text-sm font-medium text-ink dark:text-bone">
            Stage {stageIndex + 1} of {STAGES.length}: {STAGES[stageIndex]?.label}
          </p>
        }
        stage={<CellScene stageIndex={stageIndex} />}
        actions={
          <StageControls
        running={running}
        finished={finished}
        onStart={handleStart}
        onPause={handlePause}
        onNextStage={handleNextStage}
        onReset={handleReset}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
        <StageIndicator stageIndex={stageIndex} />
        <MeiosisOverview stage={stage} />
        <KeyConceptCallout stage={stage} />
          </div>
        }
        explanation={<ExplanationPanel stageIndex={stageIndex} />}
      />

        <FinalResult visible={finished} />
        <WhyItMatters visible={finished} />
        <MitosisComparison visible={finished} />
    </div>
  );
}
