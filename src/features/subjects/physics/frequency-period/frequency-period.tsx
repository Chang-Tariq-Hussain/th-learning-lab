"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SimulationLayout,
  SimulationReadouts,
  usePrefersReducedMotion,
} from "@/features/simulation";
import { WaveActions } from "../basic-wave-motion/components/wave-actions";
import { FREQUENCY_DEFAULT, period } from "./wave-model";
import { WaveScene } from "./components/wave-scene";
import { CycleRing } from "./components/cycle-ring";
import { FrequencyPeriodDisplay } from "./components/frequency-period-display";
import { FrequencyControls } from "./components/frequency-controls";
import { OneSecondWindow } from "./components/one-second-window";
import { ComparisonPanel } from "./components/comparison-panel";
import { ExperimentCard } from "./components/experiment-card";
import { PeriodChallenge } from "./components/period-challenge";
import { LearningPanel } from "./components/learning-panel";
import { ScienceNote } from "./components/science-note";

interface ChallengeFeedback {
  correct: boolean;
  message: string;
}

export function FrequencyPeriod() {
  const reducedMotion = usePrefersReducedMotion();
  const [running, setRunning] = useState(true);
  // Reduced motion: do not auto-play; the learner can still press Play.
  useEffect(() => {
    if (reducedMotion) setRunning(false);
  }, [reducedMotion]);
  const [phase, setPhase] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [frequency, setFrequency] = useState(FREQUENCY_DEFAULT);
  const [watchingOneSecond, setWatchingOneSecond] = useState(false);

  const [challengeStep, setChallengeStep] = useState(0);
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const watchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const frequencyRef = useRef(frequency);
  frequencyRef.current = frequency;

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
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setPhase((prev) => prev + 2 * Math.PI * frequencyRef.current * dt);
      setElapsedSeconds((prev) => prev + dt);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [running, stopLoop]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      if (watchTimeoutRef.current) clearTimeout(watchTimeoutRef.current);
    };
  }, []);

  const handlePlayPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setRunning(true);
    setPhase(0);
    setElapsedSeconds(0);
    setFrequency(FREQUENCY_DEFAULT);
    setWatchingOneSecond(false);
    setChallengeStep(0);
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    if (watchTimeoutRef.current) clearTimeout(watchTimeoutRef.current);
  };

  const handleWatchOneSecond = () => {
    setWatchingOneSecond(true);
    if (watchTimeoutRef.current) clearTimeout(watchTimeoutRef.current);
    watchTimeoutRef.current = setTimeout(() => setWatchingOneSecond(false), 1200);
  };

  const handleAnswer = (correct: boolean, message: string) => {
    if (correct) {
      setFeedback({ correct: true, message });
      advanceTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setChallengeStep((s) => s + 1);
      }, 1400);
    } else {
      setFeedback({ correct: false, message });
    }
  };

  const handleChallengeRestart = () => {
    setChallengeStep(0);
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
  };

  const cyclesCompleted = Math.floor(phase / (2 * Math.PI));
  const sweepProgress = elapsedSeconds % 1;

  return (
    <SimulationLayout
      stageLabel="Frequency and period simulation"
      aspect={800 / 280}
      runState={running ? "running" : "paused"}
      stage={<WaveScene phase={phase} />}
      readouts={
        <SimulationReadouts
          label="Frequency, period and cycles"
          items={[
            { id: "f", label: "Frequency", value: String(frequency), unit: "Hz" },
            { id: "t", label: "Period", value: period(frequency).toFixed(2).replace(/\.?0+$/, "") || "0", unit: "s" },
            { id: "c", label: "Cycles", value: String(cyclesCompleted) },
          ]}
        />
      }
      actions={<WaveActions running={running} onPlayPause={handlePlayPause} onReset={handleReset} />}
      controls={
        <div className="flex flex-col gap-4">
          <FrequencyControls
            frequency={frequency}
            onFrequencyChange={setFrequency}
            watchingOneSecond={watchingOneSecond}
            onWatchOneSecond={handleWatchOneSecond}
          />
          <div className="flex justify-center">
            <CycleRing phase={phase} />
          </div>
          <FrequencyPeriodDisplay frequency={frequency} />
        </div>
      }
      explanation={
        <div className="flex flex-col gap-6">
          <OneSecondWindow frequency={frequency} sweepProgress={sweepProgress} highlighted={watchingOneSecond} />
          <ComparisonPanel elapsedSeconds={elapsedSeconds} />
          <div className="grid grid-cols-1 gap-4">
            <ExperimentCard frequency={frequency} />
            <PeriodChallenge
              step={challengeStep}
              feedback={feedback}
              onAnswer={handleAnswer}
              onRestart={handleChallengeRestart}
            />
          </div>
          <ScienceNote />
          <LearningPanel />
        </div>
      }
    />
  );
}
