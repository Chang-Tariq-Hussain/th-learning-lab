"use client";

import { useEffect, useState } from "react";
import { CellScene } from "./components/cell-scene";
import { ExplanationPanel } from "./components/explanation-panel";
import { FinalResult } from "./components/final-result";
import { StageControls } from "./components/stage-controls";
import { StageIndicator } from "./components/stage-indicator";
import { INITIAL_MITOSIS_STATE, LAST_STAGE_INDEX, STAGE_ADVANCE_MS, isFinished } from "./model";
import type { MitosisState } from "./types";

/**
 * Mitosis — One Cell Becomes Two. Six discrete stages (Interphase
 * through Cytokinesis), not one continuous playback clock: `stageIndex`
 * is the entire piece of state this component owns. Start schedules a
 * timer that advances it one stage at a time and stops itself at
 * Cytokinesis; Pause just clears that timer; Next Stage advances it
 * once by hand and always pauses first (same "manual and auto are
 * exclusive" rule Chemical Reaction Builder uses). Every visual reads
 * `stageIndex` straight off `cell-scene.tsx`'s lookup tables, so Start
 * and Next Stage always land on identical-looking stages.
 */
export function Mitosis() {
  const [state, setState] = useState<MitosisState>(INITIAL_MITOSIS_STATE);
  const { running, stageIndex } = state;
  const finished = isFinished(state);

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
    setState(INITIAL_MITOSIS_STATE);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <StageIndicator stageIndex={stageIndex} />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel stageIndex={stageIndex} />

        <div className="h-[300px] rounded-[1.75rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[340px]">
          <CellScene stageIndex={stageIndex} />
        </div>
      </div>

      <StageControls
        running={running}
        finished={finished}
        onStart={handleStart}
        onPause={handlePause}
        onNextStage={handleNextStage}
        onReset={handleReset}
      />

      <FinalResult visible={finished} />
    </div>
  );
}
