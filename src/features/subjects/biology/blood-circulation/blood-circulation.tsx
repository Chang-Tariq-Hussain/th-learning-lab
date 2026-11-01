"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import {
  LOOP_DURATION_S,
  ROUTE_STAGES,
  TRACE_STEPS,
  CIRCUITS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  type CircuitId,
  type Focus,
} from "./circulation-model";
import { CirculationScene } from "./components/circulation-scene";
import { CirculationControls, TraceToggle } from "./components/circulation-controls";
import { TracePanel } from "./components/trace-panel";
import { CircuitToggle } from "./components/circuit-toggle";
import { FollowTheBlood } from "./components/follow-the-blood";
import { HeartChambers } from "./components/heart-chambers";
import { InfoCards } from "./components/info-cards";
import { MiniChallenge } from "./components/mini-challenge";

type Mode = "free" | "trace";

export function BloodCirculation() {
  const [running, setRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const [mode, setMode] = useState<Mode>("free");
  const [traceStep, setTraceStep] = useState(0);
  const [circuit, setCircuit] = useState<CircuitId | null>(null);
  const [routeStage, setRouteStage] = useState<string | null>(null);

  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState<boolean | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    lastTickRef.current = null;
  }, []);

  // Reduced motion: the continuous loop does not start by itself; the learner presses Start.
  useEffect(() => {
    if (reducedMotion) setRunning(false);
  }, [reducedMotion]);

  useEffect(() => {
    if (!running) {
      stopLoop();
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setElapsedSeconds((prev) => prev + dt);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [running, stopLoop]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const phase = (elapsedSeconds / LOOP_DURATION_S) % 1;

  const traceComplete = traceStep >= TRACE_STEPS.length;

  const focus: Focus | null =
    mode === "trace"
      ? traceComplete
        ? null
        : TRACE_STEPS[traceStep]!
      : circuit
        ? CIRCUITS[circuit]
        : routeStage
          ? (ROUTE_STAGES.find((s) => s.id === routeStage) ?? null)
          : null;

  const handlePlayPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setRunning(true);
    setElapsedSeconds(0);
    setMode("free");
    setTraceStep(0);
    setCircuit(null);
    setRouteStage(null);
    setChallengeStep(0);
    setChallengeFeedback(null);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  };

  const handleToggleTrace = () => {
    if (mode === "trace") {
      setMode("free");
    } else {
      setMode("trace");
      setTraceStep(0);
      setCircuit(null);
      setRouteStage(null);
    }
  };

  const handleTraceNext = () => setTraceStep((s) => s + 1);
  const handleTraceRestart = () => setTraceStep(0);

  const handleSelectCircuit = (id: CircuitId | null) => {
    setCircuit(id);
    if (id) {
      setMode("free");
      setRouteStage(null);
    }
  };

  const handleSelectRouteStage = (id: string | null) => {
    setRouteStage(id);
    if (id) {
      setMode("free");
      setCircuit(null);
    }
  };

  const handleChallengeAnswer = (correct: boolean) => {
    setChallengeFeedback(correct);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(
      () => {
        setChallengeFeedback(null);
        if (correct) setChallengeStep((s) => s + 1);
      },
      correct ? 1200 : 1400
    );
  };

  const handleChallengeRestart = () => {
    setChallengeStep(0);
    setChallengeFeedback(null);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  };

  const runState: SimulationRunState = running ? "running" : elapsedSeconds > 0 ? "paused" : "idle";

  return (
    <div className="flex flex-col gap-6 py-4">
      <SimulationLayout
        stageLabel="Blood circulation simulation"
        aspect={VIEW_WIDTH / VIEW_HEIGHT}
        stageCap="28rem"
        runState={runState}
        stage={<CirculationScene phase={phase} focus={focus} />}
        actions={<CirculationControls running={running} onPlayPause={handlePlayPause} onReset={handleReset} />}
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex justify-center lg:justify-start">
              <TraceToggle tracing={mode === "trace"} onToggleTrace={handleToggleTrace} />
            </div>

            {mode === "trace" ? (
              <TracePanel step={traceStep} complete={traceComplete} onNext={handleTraceNext} onRestart={handleTraceRestart} />
            ) : null}

            <CircuitToggle active={circuit} onSelect={handleSelectCircuit} />
            <FollowTheBlood activeId={routeStage} onSelect={handleSelectRouteStage} />
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-6">
            <HeartChambers />
            <InfoCards />
          </div>
        }
      />

      <MiniChallenge step={challengeStep} feedback={challengeFeedback} onAnswer={handleChallengeAnswer} onRestart={handleChallengeRestart} />
    </div>
  );
}
