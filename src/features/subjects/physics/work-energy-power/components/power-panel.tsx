"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanSlider } from "../../simple-motion/components/plan-slider";
import { ReadoutCard } from "./readout-card";
import {
  DEFAULT_TIME_A,
  DEFAULT_TIME_B,
  DEFAULT_WORK,
  TIME_MAX,
  TIME_MIN,
  TIME_STEP,
  WORK_MAX,
  WORK_MIN,
  WORK_STEP,
  computePower,
  formatEnergyValue,
} from "../model";

/** Two machines racing to finish the *same* amount of work — the
 *  Power panel deliberately shares one Work slider between them so
 *  the only variable a student can change per-machine is time,
 *  matching the topic's Learn/Predict framing ("same work, less
 *  time = more power") exactly. */
export function PowerPanel() {
  const [work, setWork] = useState(DEFAULT_WORK);
  const [timeA, setTimeA] = useState(DEFAULT_TIME_A);
  const [timeB, setTimeB] = useState(DEFAULT_TIME_B);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const maxTime = Math.max(timeA, timeB);
  const finished = elapsed >= maxTime;

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastTickRef.current = null;
  }, []);

  useEffect(() => {
    if (!running) {
      stopLoop();
      return;
    }
    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setElapsed((prev) => {
        const next = Math.min(prev + delta, maxTime);
        if (next >= maxTime) setRunning(false);
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stopLoop, maxTime]);

  const handleRun = () => {
    if (finished) return;
    setRunning(true);
  };
  const handleReset = () => {
    stopLoop();
    setRunning(false);
    setElapsed(0);
  };

  const powerA = computePower(work, timeA);
  const powerB = computePower(work, timeB);
  const fractionA = Math.min(1, elapsed / timeA);
  const fractionB = Math.min(1, elapsed / timeB);
  const winner = powerA === powerB ? null : powerA > powerB ? "A" : "B";

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <MachineCard label="Machine A" fraction={fractionA} power={powerA} time={timeA} work={work} isWinner={winner === "A"} />
        <MachineCard label="Machine B" fraction={fractionB} power={powerB} time={timeB} work={work} isWinner={winner === "B"} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={handleRun} disabled={running || finished}>
          <Play className="h-4 w-4" strokeWidth={1.75} />
          Run
        </Button>
        <Button variant="ghost" size="lg" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <PlanSlider id="power-work" label="Work (both machines)" unit="J" value={work} min={WORK_MIN} max={WORK_MAX} step={WORK_STEP} onChange={setWork} disabled={running} />
        <PlanSlider id="power-time-a" label="Machine A time" unit="s" value={timeA} min={TIME_MIN} max={TIME_MAX} step={TIME_STEP} onChange={setTimeA} disabled={running} />
        <PlanSlider id="power-time-b" label="Machine B time" unit="s" value={timeB} min={TIME_MIN} max={TIME_MAX} step={TIME_STEP} onChange={setTimeB} disabled={running} />
      </div>
    </div>
  );
}

function MachineCard({
  label,
  fraction,
  power,
  time,
  work,
  isWinner,
}: {
  label: string;
  fraction: number;
  power: number;
  time: number;
  work: number;
  isWinner: boolean;
}) {
  const percent = Math.round(fraction * 100);
  return (
    <div
      className={`flex flex-col gap-3 rounded-[1.5rem] border p-4 shadow-card backdrop-blur ${
        isWinner
          ? "border-subject-physics bg-subject-physics-soft dark:bg-subject-physics/10"
          : "border-line bg-white/70 dark:border-line-dark dark:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">{label}</p>
        {isWinner ? (
          <span className="rounded-full bg-subject-physics px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white">
            More powerful
          </span>
        ) : null}
      </div>
      {/* A box physically crossing the same fixed track — its position
          is `fraction` (real elapsed time / this machine's time), the
          exact number the requestAnimationFrame loop above is already
          driving, so a faster machine is something you watch arrive
          first rather than a number you have to compare separately. */}
      <svg viewBox="0 0 220 46" className="h-11 w-full" role="img" aria-label={`${label} has completed ${percent}% of ${work} joules of work`}>
        <rect x={4} y={34} width={212} height={8} rx={3} className="fill-ink/10 dark:fill-bone/10" />
        <rect
          x={4 + fraction * 176}
          y={10}
          width={28}
          height={24}
          rx={5}
          className={isWinner ? "fill-subject-physics stroke-subject-physics" : "fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20"}
          strokeWidth={2}
          style={{ transition: fraction === 0 ? "none" : "x 0.1s linear" }}
        />
      </svg>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70 shadow-card dark:bg-white/[0.04]">
        <div
          className="h-full rounded-full bg-subject-physics transition-[width] duration-100 ease-linear"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">Finishes in {time} s</p>
      <ReadoutCard label="Power" value={formatEnergyValue(power)} unit="W" substitution={`${work} J ÷ ${time} s`} />
    </div>
  );
}
