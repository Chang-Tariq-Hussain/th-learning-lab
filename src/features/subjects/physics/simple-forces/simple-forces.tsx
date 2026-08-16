"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExplanationPanel } from "./components/explanation-panel";
import { ForceReadouts } from "./components/force-readouts";
import { ForceStage } from "./components/force-stage";
import { ForcesControls } from "./components/forces-controls";
// Reused as-is from Simple Motion — same big-number-over-a-slider control, no need for a second copy.
import { PlanSlider } from "../simple-motion/components/plan-slider";
import {
  hasFinished,
  progressFor,
  FORCE_MAX,
  FORCE_MIN,
  FORCE_STEP,
  INITIAL_FORCES_STATE,
  PLAYBACK_DURATION_S,
  type ForcesState,
} from "./forces-model";

/**
 * Simple Forces — a box on a surface, pushed or pulled by a force on
 * each side. Deliberately has no friction, no incline, no torque or
 * momentum: just two numbers and which one wins. The student sets
 * Left Force and Right Force, presses Start, and watches the box
 * slide toward whichever side is stronger (or sit still if they're
 * equal). Reuses the Container/Breadcrumbs page shell, the card/
 * button/slider styling, and Simple Motion's exact `PlanSlider`, but
 * the feature itself is fully self-contained (no shared engine).
 */
export function SimpleForces() {
  const [state, setState] = useState<ForcesState>(INITIAL_FORCES_STATE);
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

  const handleStart = () => {
    if (finished) return;
    setState((prev) => ({ ...prev, running: true }));
  };

  const handleReset = () => {
    stopLoop();
    setState((prev) => ({ ...prev, running: false, playbackSeconds: 0 }));
  };

  // Editing a slider restarts the trip, so the box never sits mid-slide with numbers that no longer match it.
  const handleLeftForceChange = (leftForce: number) => {
    setState((prev) => ({
      ...prev,
      leftForce,
      running: false,
      playbackSeconds: 0,
    }));
  };

  const handleRightForceChange = (rightForce: number) => {
    setState((prev) => ({
      ...prev,
      rightForce,
      running: false,
      playbackSeconds: 0,
    }));
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel />

        <div className="flex flex-col gap-6">
          <div className="h-[220px] rounded-[1.75rem] border border-line bg-white/70 p-4 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[240px]">
            <ForceStage plan={state} progress={progress} />
          </div>

          <ForceReadouts plan={state} />
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        <PlanSlider
          id="left-force-slider"
          label="Left Force"
          unit="N"
          value={state.leftForce}
          min={FORCE_MIN}
          max={FORCE_MAX}
          step={FORCE_STEP}
          onChange={handleLeftForceChange}
          disabled={state.running}
        />
        <PlanSlider
          id="right-force-slider"
          label="Right Force"
          unit="N"
          value={state.rightForce}
          min={FORCE_MIN}
          max={FORCE_MAX}
          step={FORCE_STEP}
          onChange={handleRightForceChange}
          disabled={state.running}
        />
      </div>

      <ForcesControls
        running={state.running}
        finished={finished}
        onStart={handleStart}
        onReset={handleReset}
      />
    </div>
  );
}
