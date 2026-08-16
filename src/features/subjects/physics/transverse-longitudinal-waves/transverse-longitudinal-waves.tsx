"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_ANGULAR_SPEED,
  CHALLENGE_QUESTIONS,
  LONGITUDINAL_PARTICLE_COUNT,
  SPEED_DEFAULT,
  TRANSVERSE_PARTICLE_COUNT,
  WAVE_SUMMARY,
  type WaveMode,
} from "./wave-model";
import { WaveModeToggle } from "./components/wave-mode-toggle";
import { WaveScene } from "./components/wave-scene";
import { DirectionIndicators } from "./components/direction-indicators";
import { WaveControls } from "./components/wave-controls";
import { ComparisonPanel } from "./components/comparison-panel";
import { ConceptCheck } from "./components/concept-check";
import { LearningPanel } from "./components/learning-panel";

interface ChallengeFeedback {
  correct: boolean;
  message: string;
}

export function TransverseLongitudinalWaves() {
  const [mode, setMode] = useState<WaveMode>("transverse");
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState(0);
  const [speed, setSpeed] = useState(SPEED_DEFAULT);
  const [showParticlePaths, setShowParticlePaths] = useState(false);
  const [watching, setWatching] = useState(false);

  const [challengeStep, setChallengeStep] = useState(0);
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const watchedIndex = useMemo(() => {
    if (!watching) return null;
    const count = mode === "transverse" ? TRANSVERSE_PARTICLE_COUNT : LONGITUDINAL_PARTICLE_COUNT;
    return Math.floor(count / 2);
  }, [watching, mode]);

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

      setPhase((prev) => (prev + BASE_ANGULAR_SPEED * speed * dt) % (Math.PI * 2 * 1000));

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [running, speed, stopLoop]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const handlePlayPause = () => setRunning((v) => !v);

  const handleReset = () => {
    setRunning(true);
    setPhase(0);
    setSpeed(SPEED_DEFAULT);
    setShowParticlePaths(false);
    setWatching(false);
    setChallengeStep(0);
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
  };

  const handleModeChange = (next: WaveMode) => {
    setMode(next);
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

  const summary = WAVE_SUMMARY[mode];

  return (
    <div className="flex flex-col gap-6">
      <WaveModeToggle mode={mode} onChange={handleModeChange} />

      <div className="h-[280px] rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[320px] sm:p-5">
        <WaveScene mode={mode} phase={phase} showParticlePaths={showParticlePaths} watchedIndex={watchedIndex} />
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        {watching
          ? `This particle moves ${summary.motionLabel.toLowerCase()} to the wave direction.`
          : summary.description}
      </p>

      <DirectionIndicators mode={mode} />

      <WaveControls
        running={running}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        showParticlePaths={showParticlePaths}
        onToggleParticlePaths={() => setShowParticlePaths((v) => !v)}
        watching={watching}
        onToggleWatch={() => setWatching((v) => !v)}
      />

      <ComparisonPanel />

      <ConceptCheck
        step={challengeStep}
        feedback={feedback}
        onAnswer={handleAnswer}
        onRestart={handleChallengeRestart}
      />

      <LearningPanel />
    </div>
  );
}
