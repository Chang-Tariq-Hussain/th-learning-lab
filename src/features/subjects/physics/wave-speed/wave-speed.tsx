"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FREQUENCY_DEFAULT, WAVELENGTH_DEFAULT } from "./wave-model";
import { WaveScene } from "./components/wave-scene";
import { Readouts } from "./components/readouts";
import { SpeedControls } from "./components/speed-controls";
import { ExperimentPanel } from "./components/experiment-panel";
import { EquationExplorer } from "./components/equation-explorer";
import { SpeedChallenge } from "./components/speed-challenge";
import { LearningPanel } from "./components/learning-panel";
import { ScienceNote } from "./components/science-note";

interface ChallengeFeedback {
  correct: boolean;
  message: string;
}

export function WaveSpeed() {
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const [frequency, setFrequency] = useState(FREQUENCY_DEFAULT);
  const [wavelength, setWavelength] = useState(WAVELENGTH_DEFAULT);

  const [challengeStep, setChallengeStep] = useState(0);
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [running, stopLoop]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const handlePlayPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setRunning(true);
    setPhase(0);
    setFrequency(FREQUENCY_DEFAULT);
    setWavelength(WAVELENGTH_DEFAULT);
    setChallengeStep(0);
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="h-[280px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[320px] sm:p-5">
        <WaveScene phase={phase} wavelength={wavelength} />
      </div>

      <Readouts frequency={frequency} wavelength={wavelength} />

      <SpeedControls
        running={running}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        wavelength={wavelength}
        onWavelengthChange={setWavelength}
      />

      <ExperimentPanel
        frequency={frequency}
        wavelength={wavelength}
        onSetFrequency={setFrequency}
        onSetWavelength={setWavelength}
      />

      <EquationExplorer />

      <SpeedChallenge
        step={challengeStep}
        feedback={feedback}
        onAnswer={handleAnswer}
        onRestart={handleChallengeRestart}
      />

      <ScienceNote />

      <LearningPanel />
    </div>
  );
}
