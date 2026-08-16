"use client";

import { useEffect, useState } from "react";
import { CellScene } from "./components/cell-scene";
import { ExplanationPanel } from "./components/explanation-panel";
import { FinalResult } from "./components/final-result";
import { KeyConceptCallout } from "./components/key-concept-callout";
import { MeiosisOverview } from "./components/meiosis-overview";
import { MitosisComparison } from "./components/mitosis-comparison";
import { StageControls } from "./components/stage-controls";
import { StageIndicator } from "./components/stage-indicator";
import { WhyItMatters } from "./components/why-it-matters";
import { INITIAL_MEIOSIS_STATE, LAST_STAGE_INDEX, STAGE_ADVANCE_MS, currentStage, isFinished } from "./model";
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

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <MeiosisOverview stage={stage} />

      <StageIndicator stageIndex={stageIndex} />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel stageIndex={stageIndex} />

        <div className="h-[300px] rounded-[1.75rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[340px]">
          <CellScene stageIndex={stageIndex} />
        </div>
      </div>

      <KeyConceptCallout stage={stage} />

      <StageControls
        running={running}
        finished={finished}
        onStart={handleStart}
        onPause={handlePause}
        onNextStage={handleNextStage}
        onReset={handleReset}
      />

      <FinalResult visible={finished} />
      <WhyItMatters visible={finished} />
      <MitosisComparison visible={finished} />
    </div>
  );
}
