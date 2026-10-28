"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SimulationLayout,
  SimulationReadouts,
  usePrefersReducedMotion,
  type SimulationRunState,
} from "@/features/simulation";
import { ExplanationPanel } from "./components/explanation-panel";
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
  balanceLabel,
  netForce,
  isBalanced,
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

  const handleStart = () => {
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

  const runState: SimulationRunState = state.running
    ? "running"
    : finished
      ? "finished"
      : state.playbackSeconds > 0
        ? "paused"
        : "idle";

  const net = netForce(state);
  return (
    <SimulationLayout
      stageLabel="Simple forces simulation"
      aspect={3.2}
      runState={runState}
      statusDetail={`${balanceLabel(state)}. Net force ${net} newtons.`}
      stage={<ForceStage plan={state} progress={progress} />}
      readouts={
        <SimulationReadouts
          label="Forces"
          items={[
            { id: "left", label: "Left", value: String(state.leftForce), unit: "N" },
            { id: "right", label: "Right", value: String(state.rightForce), unit: "N" },
            { id: "net", label: "Net", value: `${net > 0 ? "+" : ""}${net}`, unit: "N", unknown: !isBalanced(state) },
          ]}
        />
      }
      actions={
        <ForcesControls running={state.running} finished={finished} onStart={handleStart} onReset={handleReset} />
      }
      controls={
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-medium text-ink-soft dark:text-bone-soft">{balanceLabel(state)}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </div>
      }
      explanation={<ExplanationPanel />}
    />
  );
}
