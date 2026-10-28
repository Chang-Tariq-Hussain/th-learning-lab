"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SimulationLayout,
  SimulationReadouts,
  usePrefersReducedMotion,
} from "@/features/simulation";
import { WaveActions } from "./components/wave-actions";
import {
  VIEW_WIDTH,
  VIEW_HEIGHT,
  AMPLITUDE_DEFAULT,
  ANGULAR_SPEED,
  CHALLENGE_CORRECT,
  CHALLENGE_RETRY,
  WAVELENGTH_DEFAULT,
  type ChallengeStep,
  type ExploreItem,
} from "./wave-model";
import { WaveCanvas } from "./components/wave-canvas";
import { WaveControls } from "./components/wave-controls";
import { ExploreWavePanel } from "./components/explore-wave-panel";
import { MiniChallenge } from "./components/mini-challenge";
import { LearningPanel } from "./components/learning-panel";

interface ChallengeFeedback {
  correct: boolean;
  message: string;
}

export function BasicWaveMotion() {
  const reducedMotion = usePrefersReducedMotion();
  const [running, setRunning] = useState(true);
  // Reduced motion: do not auto-play; the learner can still press Play.
  useEffect(() => {
    if (reducedMotion) setRunning(false);
  }, [reducedMotion]);
  const [phase, setPhase] = useState(0);
  const [amplitude, setAmplitude] = useState(AMPLITUDE_DEFAULT);
  const [wavelength, setWavelength] = useState(WAVELENGTH_DEFAULT);
  const [showParticles, setShowParticles] = useState(false);
  const [exploreSelection, setExploreSelection] = useState<ExploreItem | null>(null);

  const [challengeStep, setChallengeStep] = useState<ChallengeStep>("crest");
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (!running) {
      stopLoop();
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = Math.min((now - lastTickRef.current) / 1000, 0.1);
      lastTickRef.current = now;

      setPhase((prev) => (prev + ANGULAR_SPEED * dt) % (Math.PI * 2 * 1000));

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
    setRunning(false);
    setPhase(0);
    setAmplitude(AMPLITUDE_DEFAULT);
    setWavelength(WAVELENGTH_DEFAULT);
    setShowParticles(false);
    setExploreSelection(null);
    setChallengeStep("crest");
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
  };

  const handleExploreSelect = (item: ExploreItem | null) => {
    setExploreSelection(item);
    if (item) setRunning(false);
  };

  const handleChallengeHit = (hit: "crest" | "trough", correct: boolean) => {
    if (challengeStep === "done") return;
    if (correct) {
      setFeedback({ correct: true, message: CHALLENGE_CORRECT[challengeStep] });
      const isLastStep = challengeStep === "trough";
      advanceTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
        setChallengeStep(isLastStep ? "done" : "trough");
      }, 1400);
    } else {
      setFeedback({ correct: false, message: CHALLENGE_RETRY[challengeStep] });
    }
  };

  const handleChallengeRestart = () => {
    setChallengeStep("crest");
    setFeedback(null);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
  };

  return (
    <SimulationLayout
      stageLabel="Basic wave motion simulation"
      aspect={VIEW_WIDTH / VIEW_HEIGHT}
      runState={running ? "running" : "paused"}
      stage={
        <WaveCanvas
          phase={phase}
          amplitudePx={amplitude}
          wavelengthPx={wavelength}
          showParticles={showParticles}
          highlighted={exploreSelection}
          challengeTarget={challengeStep === "done" ? null : challengeStep}
          onChallengeHit={handleChallengeHit}
        />
      }
      readouts={
        <SimulationReadouts
          label="Wave settings"
          items={[
            { id: "amp", label: "Amplitude", value: String(amplitude), unit: "px" },
            { id: "wl", label: "Wavelength", value: String(wavelength), unit: "px" },
          ]}
        />
      }
      actions={<WaveActions running={running} onPlayPause={handlePlayPause} onReset={handleReset} />}
      controls={
        <div className="flex flex-col gap-4">
          <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            The wave pattern travels forward while the medium oscillates around its equilibrium position.
          </p>
          <WaveControls
            amplitude={amplitude}
            onAmplitudeChange={setAmplitude}
            wavelength={wavelength}
            onWavelengthChange={setWavelength}
            showParticles={showParticles}
            onToggleParticles={() => setShowParticles((v) => !v)}
          />
        </div>
      }
      explanation={
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <ExploreWavePanel selected={exploreSelection} onSelect={handleExploreSelect} />
            <MiniChallenge step={challengeStep} feedback={feedback} onRestart={handleChallengeRestart} />
          </div>
          <LearningPanel />
        </div>
      }
    />
  );
}
