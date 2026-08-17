"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handlePlayPause = () => {
    if (t >= VELOCITY_DURATION) setT(0);
    setPlaying((p) => !p);
  };
  const handleReset = () => {
    setPlaying(false);
    setT(0);
    lastTsRef.current = null;
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <div className="flex items-center gap-3 font-mono text-sm text-ink dark:text-bone">
        <span className="rounded-full border border-line px-3 py-1 dark:border-line-dark">
          Position
        </span>
        <ArrowRight
          className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/60"
          strokeWidth={1.75}
        />
        <span className="rounded-full border border-line px-3 py-1 dark:border-line-dark">
          derivative
        </span>
        <ArrowRight
          className="h-4 w-4 text-ink-soft/60 dark:text-bone-soft/60"
          strokeWidth={1.75}
        />
        <span className="rounded-full border border-subject-math bg-subject-math-soft px-3 py-1 text-subject-math dark:bg-subject-math/15">
          Velocity
        </span>
      </div>

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        The derivative of position with respect to time represents velocity.
        Watch the object speed up as it moves — that&apos;s the derivative
        growing.
      </p>

      <div className="relative h-14 w-full rounded-full border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]">
        <div
          className="absolute top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-subject-math shadow-md transition-[left] duration-75"
          style={{
            left: `calc(${trackPercent}% - ${trackPercent / 100} * 2rem)`,
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 font-mono text-sm">
        <div className="rounded-card border border-line px-4 py-2.5 text-center dark:border-line-dark">
          <p className="text-ink-soft dark:text-bone-soft">t</p>
          <p className="tabular-nums text-ink dark:text-bone">
            {formatValue(t)}s
          </p>
        </div>
        <div className="rounded-card border border-line px-4 py-2.5 text-center dark:border-line-dark">
          <p className="text-ink-soft dark:text-bone-soft">position</p>
          <p className="tabular-nums text-ink dark:text-bone">
            {formatValue(pos)}
          </p>
        </div>
        <div className="rounded-card border border-line px-4 py-2.5 text-center dark:border-line-dark">
          <p className="text-ink-soft dark:text-bone-soft">velocity</p>
          <p className="tabular-nums text-ink dark:text-bone">
            {formatValue(vel)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="primary" size="md" onClick={handlePlayPause}>
          {playing ? (
            <Pause className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Play className="h-4 w-4" strokeWidth={1.75} />
          )}
          {playing ? "Pause" : t >= VELOCITY_DURATION ? "Play Again" : "Play"}
        </Button>
        <Button variant="secondary" size="md" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
      </div>
    </div>
  );
}
