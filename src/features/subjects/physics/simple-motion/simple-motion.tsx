"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ExplanationPanel } from "./components/explanation-panel";
import { FormulaStrip } from "./components/formula-strip";
import { MotionControls } from "./components/motion-controls";
import { MotionReadouts } from "./components/motion-readouts";
import { MotionTrack } from "./components/motion-track";
import { PlanSlider } from "./components/plan-slider";
import { UnknownSelect } from "./components/unknown-select";
import {
  hasFinished,
  liveUnknownValue,
  progressFor,
  solve,
  INITIAL_MOTION_STATE,
  PLAYBACK_DURATION_S,
  DISTANCE_MAX,
  DISTANCE_MIN,
  DISTANCE_STEP,
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
  TIME_MAX,
  TIME_MIN,
  TIME_STEP,
  type MotionState,
  type UnknownQuantity,
} from "./motion-model";

/**
 * Simple Motion — a single object moving at constant speed along a
 * straight track. Deliberately has no acceleration, no vectors, no
 * graphs: just distance, time, and speed, and the relationship
 * between them. The student picks ONE quantity to solve for; the
 * other two are plain sliders, and the unknown is always solved live
 * via Speed = Distance ÷ Time. Reuses the Container/Breadcrumbs page
 * shell and the card/slider/button styling from the other Physics
 * visualizations, but the feature itself is fully self-contained (no
 * shared engine).
 */
export function SimpleMotion() {
  // Unique per mounted instance, so the slider ids below never
  // collide — this simulation can now be embedded more than once at
  // a time (e.g. inside multiple Predict-section experiment steps).
  const instanceId = useId();
  const [state, setState] = useState<MotionState>(() =>
    solve(INITIAL_MOTION_STATE),
  );
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const finished = hasFinished(state);
  const progress = progressFor(state);
  const liveUnknown = liveUnknownValue(state, progress);
  const displayDistance =
    state.unknown === "distance" ? liveUnknown : state.distanceM;
  const displayTime = state.unknown === "time" ? liveUnknown : state.timeSec;
  const displaySpeed = state.unknown === "speed" ? liveUnknown : state.speedMps;

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

  const handlePause = () => {
    setState((prev) => ({ ...prev, running: false }));
  };

  const handleReset = () => {
    stopLoop();
    setState((prev) => ({ ...prev, running: false, playbackSeconds: 0 }));
  };

  // Switching which quantity is unknown re-solves from whatever the
  // other two currently are, and restarts playback.
  const handleUnknownChange = (unknown: UnknownQuantity) => {
    setState((prev) => ({
      ...solve({ ...prev, unknown }),
      running: false,
      playbackSeconds: 0,
    }));
  };

  // Editing a known value re-solves the unknown and restarts playback,
  // so the car never sits mid-way through a trip that no longer
  // matches the numbers on screen.
  const handleSpeedChange = (speedMps: number) => {
    setState((prev) => ({
      ...solve({ ...prev, speedMps }),
      running: false,
      playbackSeconds: 0,
    }));
  };

  const handleTimeChange = (timeSec: number) => {
    setState((prev) => ({
      ...solve({ ...prev, timeSec }),
      running: false,
      playbackSeconds: 0,
    }));
  };

  const handleDistanceChange = (distanceM: number) => {
    setState((prev) => ({
      ...solve({ ...prev, distanceM }),
      running: false,
      playbackSeconds: 0,
    }));
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <UnknownSelect
        unknown={state.unknown}
        onChange={handleUnknownChange}
        disabled={state.running}
      />

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel />

        <div className="flex flex-col gap-6">
          <div className="h-[220px] rounded-[1.75rem] border border-line bg-white/70 p-4 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[240px]">
            <MotionTrack progress={progress} distanceM={state.distanceM} />
          </div>

          <MotionReadouts
            distance={displayDistance}
            time={displayTime}
            speed={displaySpeed}
            unknown={state.unknown}
          />

          <FormulaStrip
            distance={state.distanceM}
            time={state.timeSec}
            speed={state.speedMps}
            unknown={state.unknown}
          />
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {state.unknown !== "distance" && (
          <PlanSlider
            id={`${instanceId}-distance-slider`}
            label="Distance"
            unit="m"
            value={state.distanceM}
            min={DISTANCE_MIN}
            max={DISTANCE_MAX}
            step={DISTANCE_STEP}
            onChange={handleDistanceChange}
            disabled={state.running}
          />
        )}
        {state.unknown !== "time" && (
          <PlanSlider
            id={`${instanceId}-time-slider`}
            label="Time"
            unit="s"
            value={state.timeSec}
            min={TIME_MIN}
            max={TIME_MAX}
            step={TIME_STEP}
            onChange={handleTimeChange}
            disabled={state.running}
          />
        )}
        {state.unknown !== "speed" && (
          <PlanSlider
            id={`${instanceId}-speed-slider`}
            label="Speed"
            unit="m/s"
            value={state.speedMps}
            min={SPEED_MIN}
            max={SPEED_MAX}
            step={SPEED_STEP}
            onChange={handleSpeedChange}
            disabled={state.running}
          />
        )}
      </div>

      <MotionControls
        running={state.running}
        finished={finished}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />
    </div>
  );
}
