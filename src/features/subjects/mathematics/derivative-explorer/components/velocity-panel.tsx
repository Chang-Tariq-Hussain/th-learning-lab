"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { formatValue } from "../../calculus-foundations/calculus-model";
import { VELOCITY_DURATION, position, velocity } from "../derivative-model";

const TRACK_WIDTH = 100; // percent

/**
 * A small conceptual bridge, not a physics engine: one object moving
 * along a track under s(t) = t², so the reader can see it visibly
 * speed up as v(t) = 2t grows — the derivative of position is
 * velocity, made concrete rather than proven.
 */
export function VelocityPanel() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setT((prev) => {
        const next = prev + dt;
        if (next >= VELOCITY_DURATION) {
          setPlaying(false);
          lastTsRef.current = null;
          return VELOCITY_DURATION;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing]);

  const pos = position(t);
  const vel = velocity(t);
  const maxPos = position(VELOCITY_DURATION);
  const trackPercent = Math.min(100, (pos / maxPos) * TRACK_WIDTH);

  const reducedMotion = usePrefersReducedMotion();

  const handlePlayPause = () => {
    // Reduced motion: no animation loop; jump to the end of the run.
    if (reducedMotion) {
      setPlaying(false);
      setT(VELOCITY_DURATION);
      return;
    }
    if (t >= VELOCITY_DURATION) setT(0);
    setPlaying((p) => !p);
  };
  const handleReset = () => {
    setPlaying(false);
    setT(0);
    lastTsRef.current = null;
  };

  const runState: SimulationRunState = playing ? "running" : t >= VELOCITY_DURATION ? "finished" : t > 0 ? "paused" : "idle";

  return (
    <SimulationLayout
      stageLabel="Position and velocity"
      aspect={6}
      stageCap="6rem"
      runState={runState}
      statusDetail="The run is complete."
      stage={
        <div className="relative h-full w-full rounded-full border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]">
          <div
            className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-subject-math shadow-md transition-[left] duration-75"
            style={{
              left: `calc(${trackPercent}% - ${trackPercent / 100} * 2rem)`,
            }}
          />
        </div>
      }
      readouts={
        <SimulationReadouts
          label="Time, position and velocity"
          items={[
            { id: "t", label: "t", value: formatValue(t), unit: "s" },
            { id: "pos", label: "position", value: formatValue(pos) },
            { id: "vel", label: "velocity", value: formatValue(vel) },
          ]}
        />
      }
      actions={
        <>
          <Button variant="primary" size="md" onClick={handlePlayPause} className="min-w-28">
            {playing ? (
              <Pause className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Play className="h-4 w-4" strokeWidth={1.75} />
            )}
            {playing ? "Pause" : t >= VELOCITY_DURATION ? "Play Again" : "Play"}
          </Button>
          <Button variant="secondary" size="md" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset
          </Button>
        </>
      }
      controls={
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm text-ink dark:text-bone">
            <span className="rounded-full border border-line px-3 py-1 dark:border-line-dark">Position</span>
            <ArrowRight className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />
            <span className="rounded-full border border-line px-3 py-1 dark:border-line-dark">derivative</span>
            <ArrowRight className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />
            <span className="rounded-full border border-subject-math bg-subject-math-soft px-3 py-1 text-subject-math dark:bg-subject-math/15">
              Velocity
            </span>
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            The derivative of position with respect to time represents velocity.
            Watch the object speed up as it moves — that&apos;s the derivative
            growing.
          </p>
        </div>
      }
    />
  );
}
