"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { NODES, NODE_POSITIONS, CONNECTORS, SCENARIOS, type NodeId } from "./model";

/** Milliseconds a single step's packet animation + read time takes while auto-playing. */
const STEP_DURATION_MS = 2200;

function nodeCenter(id: NodeId) {
  const box = NODE_POSITIONS[id];
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

export function CpuRamStorageDataFlow() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started yet
  const [isPlaying, setIsPlaying] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<NodeId | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const packetRafRef = useRef<number | null>(null);

  const scenario = SCENARIOS[scenarioIndex]!;
  const step = stepIndex >= 0 ? scenario.steps[stepIndex] : undefined;
  const isFinished = stepIndex >= scenario.steps.length - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    setStepIndex((i) => {
      const next = i + 1;
      if (next >= scenario.steps.length) return i;
      return next;
    });
  }, [scenario.steps.length]);

  // Auto-play loop: advance one step every STEP_DURATION_MS while playing.
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= scenario.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(advance, STEP_DURATION_MS);
    return clearTimer;
  }, [isPlaying, stepIndex, scenario.steps.length, advance, clearTimer]);

  const handleSelectScenario = (index: number) => {
    clearTimer();
    setScenarioIndex(index);
    setStepIndex(-1);
    setIsPlaying(false);
    setInspectedNode(null);
  };

  const handlePlayPause = () => {
    if (stepIndex === -1 || isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleStep = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex((i) => (i === -1 ? 0 : Math.min(i + 1, scenario.steps.length - 1)));
  };

  const handleReset = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex(-1);
    setInspectedNode(null);
  };

  // The moving packet's on-screen position. Set in two phases (jump to
  // the step's "from" position with no transition, then on the next
  // frame move it to "to" with the transition enabled) so the CSS
  // cx/cy transition below always animates from the right starting
  // point, even though the underlying step object is a fresh value
  // every time (rather than a mutated one the browser could diff
  // against on its own).
  const [packetPos, setPacketPos] = useState<{ x: number; y: number } | null>(null);
  const [packetTransition, setPacketTransition] = useState(false);

  useEffect(() => {
    if (!step) {
      setPacketPos(null);
      return;
    }
    setPacketTransition(false);
    setPacketPos(nodeCenter(step.from));
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setPacketTransition(true);
        setPacketPos(nodeCenter(step.to));
      });
      packetRafRef.current = raf2;
    });
    packetRafRef.current = raf1;
    return () => {
      if (packetRafRef.current) cancelAnimationFrame(packetRafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id]);

  const inspected = inspectedNode ? NODES[inspectedNode] : null;

  const playLabel = useMemo(() => {
    if (stepIndex === -1) return "Start";
    if (isFinished && !isPlaying) return "Replay";
    return isPlaying ? "Pause" : "Resume";
  }, [stepIndex, isFinished, isPlaying]);

  return (
    <div className="flex flex-col gap-6">
      {/* Scenario picker */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Data flow scenario">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === scenarioIndex}
            onClick={() => handleSelectScenario(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              i === scenarioIndex
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-soft dark:text-bone-soft">{scenario.intro}</p>

      {/* Diagram */}
      <div className="rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard sm:p-4">
        <svg
          viewBox="0 0 760 300"
          className="mx-auto w-full max-w-3xl"
          role="img"
          aria-label={`Diagram of ${scenario.title}. ${step ? step.explanation : "No step active yet."}`}
        >
          {/* connectors */}
          {CONNECTORS.map((c) => {
            const a = nodeCenter(c.from);
            const b = nodeCenter(c.to);
            return (
              <line
                key={`${c.from}-${c.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={2}
                className="stroke-ink/15 dark:stroke-bone/15"
              />
            );
          })}

          {/* nodes */}
          {(Object.keys(NODE_POSITIONS) as NodeId[]).map((id) => {
            const box = NODE_POSITIONS[id];
            const node = NODES[id];
            const isActive = step ? step.from === id || step.to === id : false;
            return (
              <g
                key={id}
                onClick={() => setInspectedNode(id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${node.label}. ${node.description}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setInspectedNode(id);
                }}
              >
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  rx={12}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "fill-subject-it-soft stroke-subject-it dark:fill-subject-it/20"
                      : inspectedNode === id
                        ? "fill-paper stroke-subject-it dark:fill-chalkboard"
                        : "fill-paper stroke-ink/20 dark:fill-chalkboard dark:stroke-bone/20"
                  )}
                  strokeWidth={isActive || inspectedNode === id ? 2.5 : 1.5}
                />
                <text
                  x={box.x + box.w / 2}
                  y={box.y + box.h / 2 + 5}
                  textAnchor="middle"
                  className={cn(
                    "select-none font-mono text-[15px] font-medium",
                    isActive ? "fill-subject-it" : "fill-ink dark:fill-bone"
                  )}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* moving data packet */}
          {packetPos && step && (
            <g>
              <circle
                cx={packetPos.x}
                cy={packetPos.y}
                r={9}
                className="fill-subject-it"
                style={{
                  transition: packetTransition
                    ? `cx ${STEP_DURATION_MS * 0.55}ms ease-in-out, cy ${STEP_DURATION_MS * 0.55}ms ease-in-out`
                    : "none",
                }}
              />
              <text
                x={packetPos.x}
                y={packetPos.y - 16}
                textAnchor="middle"
                className="select-none fill-subject-it font-mono text-[11px] font-medium"
                style={{
                  transition: packetTransition
                    ? `x ${STEP_DURATION_MS * 0.55}ms ease-in-out, y ${STEP_DURATION_MS * 0.55}ms ease-in-out`
                    : "none",
                }}
              >
                {step.packetLabel}
              </text>
            </g>
          )}
        </svg>

        {/* live-region + explanation for the current step */}
        <div aria-live="polite" className="mt-3 min-h-[3.5rem] rounded-card bg-ink/[0.03] p-3 text-sm text-ink dark:bg-bone/[0.05] dark:text-bone">
          {step ? (
            <>
              <span className="font-mono text-xs uppercase tracking-wide text-subject-it">
                Step {stepIndex + 1} of {scenario.steps.length} · {step.packetLabel}
              </span>
              <p className="mt-1 leading-relaxed">{step.explanation}</p>
            </>
          ) : (
            <p className="text-ink-soft dark:text-bone-soft">
              Press Start to follow this scenario&apos;s data, step by step. Click any component at any time to read what it does.
            </p>
          )}
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-subject-it px-5 text-sm font-medium text-paper hover:opacity-90"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playLabel}
        </button>
        <button
          onClick={handleStep}
          disabled={isFinished}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <StepForward className="h-4 w-4" />
          Step
        </button>
        <button
          onClick={handleReset}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* inspected node panel */}
      {inspected && (
        <div className="rounded-card border border-line p-4 dark:border-line-dark">
          <p className="font-mono text-xs uppercase tracking-wide text-subject-it">{inspected.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{inspected.description}</p>
        </div>
      )}

      <p className="text-xs text-ink-soft dark:text-bone-soft">
        The moving dot represents conceptual data or instructions moving between components — not a physical object
        traveling through the machine. Real computers run this kind of exchange millions of times per second; this is a
        simplified model built for understanding, not a literal picture of what&apos;s inside a computer.
      </p>
    </div>
  );
}

