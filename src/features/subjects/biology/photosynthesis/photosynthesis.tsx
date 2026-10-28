"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { ExplanationPanel } from "./components/explanation-panel";
import { FactorControls } from "./components/factor-controls";
import { FormulaSection } from "./components/formula-section";
import { LeafDetail } from "./components/leaf-detail";
import { PhotosynthesisControls } from "./components/photosynthesis-controls";
import { PlantScene } from "./components/plant-scene";
import { StatusMessage } from "./components/status-message";
import { factorRate, hasFinished, progressFor, statusMessage, INITIAL_PHOTOSYNTHESIS_STATE, PLAYBACK_DURATION_S } from "./model";
import type { PhotosynthesisFactors, PhotosynthesisState } from "./types";

export interface PhotosynthesisProps {
  /**
   * Reveals the Light Intensity / CO2 / Temperature sliders and a
   * live "Rate of Photosynthesis" readout — off by default, so the
   * plain simulation page and the Photosynthesis topic's Explore step
   * both keep the original fixed-rate 10-second scene unchanged.
   * Only the "Factors Affecting Photosynthesis" topic passes `true`.
   */
  showFactorControls?: boolean;
}

/**
 * Photosynthesis — one continuous plant scene driven by a single
 * playback clock (same rAF pattern as Simple Motion / Simple Forces).
 * Light, water, and CO2 each travel to the leaf in their own slice of
 * the 0–1 progress range, the leaf glows, then glucose appears and
 * oxygen drifts away. No chemistry engine, no per-particle physics —
 * everything is one number (`progress`) mapped through lerps.
 *
 * `showFactorControls` (see `PhotosynthesisProps`) is the one minimal
 * addition made for "Factors Affecting Photosynthesis": the same
 * clock now advances at `factorRate(state.factors)` × real time
 * instead of always 1×, so turning light or CO2 down, or temperature
 * away from its optimum, visibly slows the whole scene down rather
 * than introducing a second, disconnected model. Nothing about what
 * the scene shows changed — only how fast it plays.
 */
export function Photosynthesis({ showFactorControls = false }: PhotosynthesisProps) {
  const [state, setState] = useState<PhotosynthesisState>(INITIAL_PHOTOSYNTHESIS_STATE);
  const [leafDetailOpen, setLeafDetailOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  // Mirrors `state.factors` for the rAF loop below to read live —
  // sliders can move mid-animation, and the loop's own closure is
  // only re-created when `state.running` changes, not on every
  // factors change.
  const factorsRef = useRef(state.factors);
  factorsRef.current = state.factors;

  const finished = hasFinished(state);
  const progress = progressFor(state);
  const rate = factorRate(state.factors);

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
      const deltaSeconds = Math.min((now - lastTickRef.current) / 1000, 0.1) * factorRate(factorsRef.current);
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

  const handleFactorsChange = (factors: PhotosynthesisFactors) => {
    setState((prev) => ({ ...prev, factors }));
  };

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
    // Preserves the current factor settings across Reset — an
    // experiment is "change one variable, keep the others, rerun,"
    // not "lose your setup every time." Reset only rewinds playback.
    setState((prev) => ({ ...INITIAL_PHOTOSYNTHESIS_STATE, factors: prev.factors }));
  };

  const runState: SimulationRunState = state.running
    ? "running"
    : finished
      ? "finished"
      : state.playbackSeconds > 0
        ? "paused"
        : "idle";

  return (
    <>
      <SimulationLayout
        stageLabel="Photosynthesis simulation"
        aspect={1.25}
        stageCap="24rem"
        runState={runState}
        statusDetail={statusMessage(state)}
        stage={<PlantScene progress={progress} onLeafClick={() => setLeafDetailOpen((open) => !open)} />}
        readouts={<StatusMessage state={state} />}
        actions={
          <PhotosynthesisControls
            running={state.running}
            finished={finished}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        }
        controls={
          <div className="flex flex-col gap-6">
            {showFactorControls ? (
              <FactorControls factors={state.factors} rate={rate} onChange={handleFactorsChange} />
            ) : null}
            <FormulaSection />
          </div>
        }
        explanation={<ExplanationPanel />}
      />
      {leafDetailOpen ? <LeafDetail onClose={() => setLeafDetailOpen(false)} /> : null}
    </>
  );
}
