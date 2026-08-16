"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const handleRelease = () => {
    if (finished) return;
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

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <ExplanationPanel />

        <div className="flex flex-col gap-6">
          <div className="h-[220px] rounded-[1.75rem] border border-line bg-white/70 p-4 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[240px]">
            <EnergyStage plan={state} progress={progress} />
          </div>

          <EnergyBars plan={state} progress={progress} />
        </div>
      </div>

      <div className="w-full max-w-md">
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
      </div>

      <EnergyControls
        running={state.running}
        finished={finished}
        onRelease={handleRelease}
        onReset={handleReset}
      />
    </div>
  );
}
