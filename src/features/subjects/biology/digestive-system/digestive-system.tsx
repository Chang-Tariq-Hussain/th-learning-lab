"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ABSORPTION_DURATION_MS,
  INITIAL_JOURNEY_STATE,
  TOTAL_DURATION_S,
  clamp01,
  journeyComplete,
  stageAt,
} from "./digestive-model";
import type { NutrientId, OrganId } from "./types";
import { DigestiveScene } from "./components/digestive-scene";
import { JourneyControls } from "./components/journey-controls";
import { OrganExplorer } from "./components/organ-explorer";
import { VilliView } from "./components/villi-view";
import { NutrientTypes } from "./components/nutrient-types";
import { DigestionAbsorptionCompare } from "./components/digestion-absorption-compare";
import { LearningFlow } from "./components/learning-flow";
import { MiniChallenge } from "./components/mini-challenge";

export function DigestiveSystem() {
  const [seconds, setSeconds] = useState(INITIAL_JOURNEY_STATE.seconds);
  const [running, setRunning] = useState(INITIAL_JOURNEY_STATE.running);
  const [started, setStarted] = useState(false);

  const [activeOrgan, setActiveOrgan] = useState<OrganId | null>(null);

  const [absorptionExchanging, setAbsorptionExchanging] = useState(false);
  const [absorptionDone, setAbsorptionDone] = useState(false);
  const absorptionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [activeNutrient, setActiveNutrient] = useState<NutrientId | null>(null);

  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState<boolean | null>(
    null,
  );
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
    if (!running) {
      stopLoop();
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setSeconds((prev) => {
        const next = prev + dt;
        if (next >= TOTAL_DURATION_S) {
          setRunning(false);
          return TOTAL_DURATION_S;
        }
        return next;
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [running, stopLoop]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (absorptionTimeoutRef.current)
        clearTimeout(absorptionTimeoutRef.current);
    };
  }, []);

  const progress = clamp01(seconds / TOTAL_DURATION_S);
  const complete = journeyComplete(progress);

  const handleStart = () => {
    if (complete) {
      setSeconds(0);
    }
    setStarted(true);
    setRunning(true);
    setActiveOrgan(null);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setSeconds(0);
    setRunning(false);
    setStarted(false);
    setActiveOrgan(null);
    setAbsorptionExchanging(false);
    setAbsorptionDone(false);
    if (absorptionTimeoutRef.current)
      clearTimeout(absorptionTimeoutRef.current);
    setActiveNutrient(null);
    setChallengeStep(0);
    setChallengeFeedback(null);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  };

  const handleSelectOrgan = (id: OrganId | null) => {
    setActiveOrgan(id);
    if (id) {
      setRunning(false);
    }
  };

  const handleExplore = () => {
    setAbsorptionExchanging(true);
    setAbsorptionDone(false);
    if (absorptionTimeoutRef.current)
      clearTimeout(absorptionTimeoutRef.current);
    absorptionTimeoutRef.current = setTimeout(() => {
      setAbsorptionExchanging(false);
      setAbsorptionDone(true);
    }, ABSORPTION_DURATION_MS);
  };

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

  const currentStage = stageAt(progress);
  const sceneHighlight = activeOrgan ?? (started ? currentStage : null);

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto h-[420px] w-full max-w-sm rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[460px]">
        <DigestiveScene
          progress={progress}
          showFood={started}
          highlight={sceneHighlight}
        />
      </div>

      <JourneyControls
        running={running}
        started={started}
        complete={complete}
        currentStage={currentStage}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />

      <OrganExplorer activeId={activeOrgan} onSelect={handleSelectOrgan} />

      <VilliView
        exchanging={absorptionExchanging}
        done={absorptionDone}
        onExplore={handleExplore}
      />

      <NutrientTypes activeId={activeNutrient} onSelect={setActiveNutrient} />

      <DigestionAbsorptionCompare />

      <LearningFlow />

      <MiniChallenge
        step={challengeStep}
        feedback={challengeFeedback}
        onAnswer={handleChallengeAnswer}
        onRestart={handleChallengeRestart}
      />
    </div>
  );
}
