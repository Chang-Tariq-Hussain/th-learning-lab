"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// Reused as-is from Photosynthesis — identical Start/Pause/Reset control set, no need for a second copy.
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
      const deltaSeconds = (now - lastTickRef.current) / 1000;
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
    setState((prev) => ({ ...prev, running: true }));
  };

  const handlePause = () => {
    setState((prev) => ({ ...prev, running: false }));
  };

  const handleReset = () => {
    stopLoop();
    setState(INITIAL_RESPIRATION_STATE);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel />

        <div className="flex flex-col gap-6">
          <div className="h-[300px] rounded-[1.75rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[340px]">
            <CellScene progress={progress} />
          </div>

          <StatusMessage state={state} />

          <EnergyBar progress={progress} />

          <FormulaSection />
        </div>
      </div>

      <RespirationControls running={state.running} finished={finished} onStart={handleStart} onPause={handlePause} onReset={handleReset} />

      <ConnectionNote />
    </div>
  );
}
