"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FREQUENCY_DEFAULT } from "./wave-model";
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
  const [running, setRunning] = useState(true);
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
      const dt = (now - lastTickRef.current) / 1000;
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:flex-row sm:gap-5 sm:p-5">
        <div className="h-[220px] flex-1 sm:h-[300px]">
          <WaveScene phase={phase} />
        </div>
        <div className="flex flex-row items-center justify-center gap-4 sm:w-32 sm:flex-col sm:gap-3">
          <CycleRing phase={phase} />
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
              Cycles completed
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums text-ink dark:text-bone">
              {cyclesCompleted}
            </p>
          </div>
        </div>
      </div>

      <FrequencyPeriodDisplay frequency={frequency} />

      <FrequencyControls
        running={running}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        watchingOneSecond={watchingOneSecond}
        onWatchOneSecond={handleWatchOneSecond}
      />

      <OneSecondWindow frequency={frequency} sweepProgress={sweepProgress} highlighted={watchingOneSecond} />

      <ComparisonPanel elapsedSeconds={elapsedSeconds} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
  );
}
