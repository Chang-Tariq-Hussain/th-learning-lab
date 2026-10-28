"use client";

import { useEffect, useState } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { CellScene } from "./components/cell-scene";
import { ExplanationPanel } from "./components/explanation-panel";
import { FinalResult } from "./components/final-result";
import { StageControls } from "./components/stage-controls";
import { StageIndicator } from "./components/stage-indicator";
import { StructureInfoPanel } from "./components/structure-info-panel";
import { getStructureInfo } from "./data/structure-info";
import { INITIAL_MITOSIS_STATE, LAST_STAGE_INDEX, STAGES, STAGE_ADVANCE_MS, isFinished } from "./model";
import type { MitosisState } from "./types";

/**
 * Mitosis — One Cell Becomes Two. Six discrete stages (Interphase
 * through Cytokinesis), not one continuous playback clock: `stageIndex`
 * is the entire piece of state this component owns. Start schedules a
 * timer that advances it one stage at a time and stops itself at
 * Cytokinesis; Pause just clears that timer; Next Stage/Previous Stage
 * step it by hand one at a time and always pause first (same "manual
 * and auto are exclusive" rule Chemical Reaction Builder uses). Every
 * visual reads `stageIndex` straight off `cell-scene.tsx`'s lookup
 * tables, so Start and manual stepping always land on identical-looking
 * stages.
 */
export function Mitosis() {
  const [state, setState] = useState<MitosisState>(INITIAL_MITOSIS_STATE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { running, stageIndex } = state;
  const finished = isFinished(state);

  // A selected structure can go out of view as the stage changes (e.g. the
  // original nucleus is gone by Metaphase) — clear the selection whenever
  // the stage moves rather than leave the info panel pointing at something
  // no longer on screen.
  useEffect(() => {
    setSelectedId(null);
  }, [stageIndex]);

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

  const handlePreviousStage = () => {
    setState((prev) => ({
      running: false,
      stageIndex: Math.max(prev.stageIndex - 1, 0),
    }));
  };

  const handleReset = () => {
    setState(INITIAL_MITOSIS_STATE);
  };

  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  const selectedStructure = getStructureInfo(selectedId);

  const runState: SimulationRunState = running ? "running" : finished ? "finished" : stageIndex > 0 ? "paused" : "idle";

  return (
    <div className="flex flex-col gap-6 py-4">
      <SimulationLayout
        stageLabel="Mitosis simulation"
        aspect={440 / 320}
        stageCap="24rem"
        runState={runState}
        statusDetail="All stages complete."
        readouts={
          <p className="text-center text-sm font-medium text-ink dark:text-bone">
            Stage {stageIndex + 1} of {STAGES.length}: {STAGES[stageIndex]?.label}
          </p>
        }
        stage={<CellScene stageIndex={stageIndex} selectedId={selectedId} onSelect={handleSelect} />}
        actions={
          <StageControls
        running={running}
        finished={finished}
        atStart={stageIndex === 0}
        onPreviousStage={handlePreviousStage}
        onStart={handleStart}
        onPause={handlePause}
        onNextStage={handleNextStage}
        onReset={handleReset}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
        <StageIndicator stageIndex={stageIndex} />
        <StructureInfoPanel structure={selectedStructure} />
          </div>
        }
        explanation={<ExplanationPanel stageIndex={stageIndex} />}
      />

        <FinalResult visible={finished} />
    </div>
  );
}
