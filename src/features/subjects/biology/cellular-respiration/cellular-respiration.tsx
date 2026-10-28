"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Reused as-is from Photosynthesis — identical Start/Pause/Reset control set, no need for a second copy.
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { PhotosynthesisControls as RespirationControls } from "../photosynthesis/components/photosynthesis-controls";
import { CellScene } from "./components/cell-scene";
import { ConnectionNote } from "./components/connection-note";
import { EnergyBar } from "./components/energy-bar";
import { ExplanationPanel } from "./components/explanation-panel";
import { FormulaSection } from "./components/formula-section";
import { StatusMessage } from "./components/status-message";
import { hasFinished, progressFor, INITIAL_RESPIRATION_STATE, PLAYBACK_DURATION_S } from "./model";
import type { RespirationState } from "./types";

/**
 * Cellular Respiration — one continuous cell scene driven by a single
 * playback clock (same rAF pattern as Photosynthesis). Glucose and
 * oxygen each enter the cell in their own slice of the 0–1 progress
 * range, travel to the mitochondrion, which briefly highlights, then
 * energy, carbon dioxide, and water appear. No chemistry engine, no
 * per-particle physics, no glycolysis/Krebs-cycle detail — everything
 * is one number (`progress`) mapped through lerps, same as its sibling.
 */
export function CellularRespiration() {
  const [state, setState] = useState<RespirationState>(INITIAL_RESPIRATION_STATE);
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const finished = hasFinished(state);
  const progress = progressFor(state);

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastTickRef.current = null;
  }, []);

  useEffect(() => {
    if (!state.running) {
      stopLoop();
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = now;
      }
      // A hidden tab pauses rAF; clamp so the scene does not jump when the learner returns.
      const deltaSeconds = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setState((prev) => {
        if (!prev.running) return prev;
        const nextPlayback = Math.min(prev.playbackSeconds + deltaSeconds, PLAYBACK_DURATION_S);
        const finishedNow = nextPlayback >= PLAYBACK_DURATION_S;
        return {
          ...prev,
          playbackSeconds: nextPlayback,
          running: finishedNow ? false : prev.running,
        };
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.running, stopLoop]);

  const handleStart = () => {
    if (finished) return;
    // Reduced motion: no animation loop; show the finished scene straight away.
    if (reducedMotion) {
      setState((prev) => ({ ...prev, running: false, playbackSeconds: PLAYBACK_DURATION_S }));
      return;
    }
    setState((prev) => ({ ...prev, running: true }));
  };

  const handlePause = () => {
    setState((prev) => ({ ...prev, running: false }));
  };

  const handleReset = () => {
    stopLoop();
    setState(INITIAL_RESPIRATION_STATE);
  };

  const runState: SimulationRunState = state.running
    ? "running"
    : finished
      ? "finished"
      : state.playbackSeconds > 0
        ? "paused"
        : "idle";

  return (
    <SimulationLayout
      stageLabel="Cellular respiration simulation"
      aspect={400 / 320}
      stageCap="24rem"
      runState={runState}
      statusDetail="Respiration complete. Energy has been released as ATP."
      stage={<CellScene progress={progress} />}
      readouts={
        <div className="flex flex-col gap-2">
          <StatusMessage state={state} />
          <EnergyBar progress={progress} />
        </div>
      }
      actions={
        <RespirationControls
          running={state.running}
          finished={finished}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />
      }
      controls={<FormulaSection />}
      explanation={
        <div className="flex flex-col gap-6">
          <ExplanationPanel />
          <ConnectionNote />
        </div>
      }
    />
  );
}
