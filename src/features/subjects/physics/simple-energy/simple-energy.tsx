"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SimulationLayout,
  SimulationReadouts,
  usePrefersReducedMotion,
  type SimulationRunState,
} from "@/features/simulation";
import { EnergyBars } from "./components/energy-bars";
import { EnergyControls } from "./components/energy-controls";
import { EnergyStage } from "./components/energy-stage";
import { ExplanationPanel } from "./components/explanation-panel";
// Reused as-is from Simple Motion — same big-number-over-a-slider control, no need for a second copy.
import { PlanSlider } from "../simple-motion/components/plan-slider";
import {
  hasFinished,
  progressFor,
  HEIGHT_MAX,
  HEIGHT_MIN,
  HEIGHT_STEP,
  INITIAL_ENERGY_STATE,
  PLAYBACK_DURATION_S,
  type EnergyState,
} from "./energy-model";

/**
 * Simple Energy — a ball on a hill, released to roll to the bottom.
 * Deliberately has no friction, no numbers on the bars, no second
 * energy type: just one quantity (height) flowing from a "Potential"
 * bar into a "Kinetic" bar as the ball descends. Reuses the
 * Container/Breadcrumbs page shell, the card/button/slider styling,
 * and Simple Motion's exact `PlanSlider`, but the feature itself is
 * fully self-contained (no shared engine).
 */
export function SimpleEnergy() {
  const [state, setState] = useState<EnergyState>(INITIAL_ENERGY_STATE);
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
      // A hidden tab pauses rAF; clamp so the animation does not jump when the learner returns.
      const deltaSeconds = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setState((prev) => {
        if (!prev.running) return prev;
        const nextPlayback = Math.min(
          prev.playbackSeconds + deltaSeconds,
          PLAYBACK_DURATION_S,
        );
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

  const handleRelease = () => {
    if (finished) return;
    // Reduced motion: no animation loop; show the finished state straight away.
    if (reducedMotion) {
      setState((prev) => ({ ...prev, running: false, playbackSeconds: PLAYBACK_DURATION_S }));
      return;
    }
    setState((prev) => ({ ...prev, running: true }));
  };

  const handleReset = () => {
    stopLoop();
    setState((prev) => ({ ...prev, running: false, playbackSeconds: 0 }));
  };

  // Changing the height restarts the trip, so the ball never sits mid-roll with a bar reading that no longer matches it.
  const handleHeightChange = (heightM: number) => {
    setState((prev) => ({
      ...prev,
      heightM,
      running: false,
      playbackSeconds: 0,
    }));
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
      stageLabel="Simple energy simulation"
      aspect={3.2}
      runState={runState}
      statusDetail="The ball has reached the bottom of the hill."
      stage={<EnergyStage plan={state} progress={progress} />}
      readouts={<EnergyBars plan={state} progress={progress} />}
      actions={
        <EnergyControls running={state.running} finished={finished} onRelease={handleRelease} onReset={handleReset} />
      }
      controls={
        <PlanSlider
          id="height-slider"
          label="Height"
          unit="m"
          value={state.heightM}
          min={HEIGHT_MIN}
          max={HEIGHT_MAX}
          step={HEIGHT_STEP}
          onChange={handleHeightChange}
          disabled={state.running}
        />
      }
      explanation={<ExplanationPanel />}
    />
  );
}
