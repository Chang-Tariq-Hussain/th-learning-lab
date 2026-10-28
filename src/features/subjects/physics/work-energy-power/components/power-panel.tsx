"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import {
  SimulationLayout,
  SimulationReadouts,
  usePrefersReducedMotion,
  type SimulationRunState,
} from "@/features/simulation";
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
  const reducedMotion = usePrefersReducedMotion();
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
      // A hidden tab pauses rAF; clamp so the race does not jump when the learner returns.
      const delta = Math.min((now - lastTickRef.current) / 1000, 0.1);
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
    // Reduced motion: no animation loop; show the finished race straight away.
    if (reducedMotion) {
      setElapsed(maxTime);
      return;
    }
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

  const runState: SimulationRunState = running ? "running" : finished ? "finished" : fractionA > 0 || fractionB > 0 ? "paused" : "idle";
  return (
    <SimulationLayout
      stageLabel="Power race simulation"
      aspect={2.6}
      runState={runState}
      statusDetail={winner ? `Machine ${winner} is more powerful.` : "Both machines have equal power."}
      stage={<RaceStage fractionA={fractionA} fractionB={fractionB} isWinnerA={winner === "A"} isWinnerB={winner === "B"} />}
      readouts={
        <SimulationReadouts
          label="Power of each machine"
          items={[
            { id: "a", label: "Machine A", value: formatEnergyValue(powerA), unit: "W" },
            { id: "b", label: "Machine B", value: formatEnergyValue(powerB), unit: "W" },
          ]}
        />
      }
      actions={
        <>
          <Button variant="primary" size="md" onClick={handleRun} disabled={running || finished} className="min-w-28">
            <Play className="h-4 w-4" strokeWidth={1.75} />
            Run
          </Button>
          <Button variant="ghost" size="md" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset
          </Button>
        </>
      }
      controls={
        <div className="grid grid-cols-1 gap-3">
        <PlanSlider id="power-work" label="Work (both machines)" unit="J" value={work} min={WORK_MIN} max={WORK_MAX} step={WORK_STEP} onChange={setWork} disabled={running} />
        <PlanSlider id="power-time-a" label="Machine A time" unit="s" value={timeA} min={TIME_MIN} max={TIME_MAX} step={TIME_STEP} onChange={setTimeA} disabled={running} />
        <PlanSlider id="power-time-b" label="Machine B time" unit="s" value={timeB} min={TIME_MIN} max={TIME_MAX} step={TIME_STEP} onChange={setTimeB} disabled={running} />
        </div>
      }
      explanation={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MachineCard label="Machine A" power={powerA} time={timeA} work={work} isWinner={winner === "A"} />
          <MachineCard label="Machine B" power={powerB} time={timeB} work={work} isWinner={winner === "B"} />
        </div>
      }
    />
  );
}

/** Both machines racing the same track, kept in the sticky stage so the race stays visible while sliders change. */
function RaceStage({ fractionA, fractionB, isWinnerA, isWinnerB }: { fractionA: number; fractionB: number; isWinnerA: boolean; isWinnerB: boolean }) {
  const lanes = [
    { label: "Machine A", fraction: fractionA, win: isWinnerA },
    { label: "Machine B", fraction: fractionB, win: isWinnerB },
  ];
  return (
    <div className="flex h-full flex-col justify-around rounded-xl bg-white/50 px-2 py-1 dark:bg-white/[0.03]" role="img" aria-label={`Machine A has completed ${Math.round(fractionA * 100)}% of the work and Machine B ${Math.round(fractionB * 100)}%`}>
      {lanes.map((lane) => (
        <div key={lane.label} className="flex items-center gap-2">
          <span className="w-20 shrink-0 font-mono text-label uppercase text-ink-soft dark:text-bone-soft">
            {lane.label.replace("Machine ", "")}{lane.win ? " ★" : ""}
          </span>
          <svg viewBox="0 0 220 46" className="h-10 min-w-0 flex-1" aria-hidden="true">
            <rect x={4} y={34} width={212} height={8} rx={3} className="fill-ink/10 dark:fill-bone/10" />
            <rect
              x={4 + lane.fraction * 176}
              y={10}
              width={28}
              height={24}
              rx={5}
              className={lane.win ? "fill-subject-physics stroke-subject-physics" : "fill-subject-physics-soft stroke-subject-physics dark:fill-subject-physics/20"}
              strokeWidth={2}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function MachineCard({
  label,
  power,
  time,
  work,
  isWinner,
}: {
  label: string;
  power: number;
  time: number;
  work: number;
  isWinner: boolean;
}) {
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
      <p className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">Finishes in {time} s</p>
      <ReadoutCard label="Power" value={formatEnergyValue(power)} unit="W" substitution={`${work} J ÷ ${time} s`} />
    </div>
  );
}
