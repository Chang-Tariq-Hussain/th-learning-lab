"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { idsForLevel, organismById, relatedIds } from "./food-web-model";
import type { Mode, OrganismId, TrophicLevel } from "./types";
import { ModeToggle } from "./components/mode-toggle";
import { OrganismPicker } from "./components/scene-panel";
import { Scene } from "./components/scene";
import { TrophicLevelPicker } from "./components/trophic-level-picker";
import { EnergyFlowActions, EnergyFlowPanel } from "./components/energy-flow-panel";
import { RemoveOrganismExperiment } from "./components/remove-organism-experiment";
import { DecomposersPanel } from "./components/decomposers-panel";
import { ChainVsWebSummary } from "./components/chain-vs-web-summary";
import { MiniChallenge } from "./components/mini-challenge";

const LOOP_DURATION_S = 6;

export function FoodChainWeb() {
  const [mode, setMode] = useState<Mode>("chain");
  const [selectedId, setSelectedId] = useState<OrganismId | null>(null);
  const [level, setLevel] = useState<TrophicLevel | null>(null);
  const [grasshopperRemoved, setGrasshopperRemoved] = useState(false);

  const [flowRunning, setFlowRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  useEffect(() => {
    if (!flowRunning || mode !== "chain") {
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
  }, [flowRunning, mode, stopLoop]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    setSelectedId(null);
    setLevel(null);
  };

  const handleSelect = (id: OrganismId | null) => {
    setSelectedId(id);
    if (id) setLevel(null);
  };

  const handleLevel = (next: TrophicLevel | null) => {
    setLevel(next);
    if (next) setSelectedId(null);
  };

  const focusIds = selectedId
    ? [selectedId, ...relatedIds(selectedId, mode)]
    : level
      ? idsForLevel(level)
      : null;

  const handleFlowReset = () => {
    setFlowRunning(false);
    setElapsedSeconds(0);
  };

  const handleGrasshopperToggle = () => setGrasshopperRemoved((v) => !v);
  const handleGrasshopperRestore = () => setGrasshopperRemoved(false);

  const handleChallengeAnswer = (correct: boolean) => {
    setChallengeFeedback(correct);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(
      () => {
        setChallengeFeedback(null);
        if (correct) setChallengeStep((s) => s + 1);
      },
      correct ? 1200 : 1400,
    );
  };
  const handleChallengeRestart = () => {
    setChallengeStep(0);
    setChallengeFeedback(null);
  };

  const flowPhase =
    mode === "chain" && (flowRunning || elapsedSeconds > 0)
      ? (elapsedSeconds / LOOP_DURATION_S) % 1
      : null;

  // The status chip is only shown in Food Chain mode, where the energy-flow particles can run.
  const runState: SimulationRunState | undefined =
    mode === "chain" ? (flowRunning ? "running" : elapsedSeconds > 0 ? "paused" : "idle") : undefined;
  const selected = selectedId ? organismById(selectedId) : null;

  return (
    <div className="flex flex-col gap-6 py-4">
      <ModeToggle mode={mode} onChange={handleModeChange} />

      <SimulationLayout
        stageLabel={mode === "chain" ? "Food chain simulation" : "Food web simulation"}
        aspect={380 / 260}
        stageCap="26rem"
        runState={runState}
        stage={
          <Scene
            mode={mode}
            selectedId={selectedId}
            focusIds={focusIds}
            grasshopperRemoved={grasshopperRemoved}
            flowPhase={flowPhase}
            onSelect={(id) => handleSelect(selectedId === id ? null : id)}
          />
        }
        readouts={
          <p className="truncate text-center text-sm font-medium text-ink dark:text-bone">
            {selected ? `${selected.label} · ${selected.roleLabel}` : "Select an organism"}
          </p>
        }
        actions={
          mode === "chain" ? (
            <EnergyFlowActions
              running={flowRunning}
              onPlayPause={() => setFlowRunning((v) => !v)}
              onReset={handleFlowReset}
            />
          ) : undefined
        }
        controls={
          <div className="flex min-w-0 flex-col gap-6">
            <OrganismPicker mode={mode} selectedId={selectedId} onSelect={handleSelect} />
            <TrophicLevelPicker active={level} onSelect={handleLevel} />
            {mode === "chain" ? <EnergyFlowPanel /> : null}
            <RemoveOrganismExperiment
              removed={grasshopperRemoved}
              onToggle={handleGrasshopperToggle}
              onRestore={handleGrasshopperRestore}
            />
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-6">
            <DecomposersPanel />
            <ChainVsWebSummary />
          </div>
        }
      />

      <MiniChallenge
        step={challengeStep}
        feedback={challengeFeedback}
        onAnswer={handleChallengeAnswer}
        onRestart={handleChallengeRestart}
      />
    </div>
  );
}
