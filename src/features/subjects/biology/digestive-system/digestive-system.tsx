"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import {
  ABSORPTION_DURATION_MS,
  INITIAL_JOURNEY_STATE,
  STAGES,
  TOTAL_DURATION_S,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  clamp01,
  journeyComplete,
  stageAt,
} from "./digestive-model";
import type { AccessoryOrganId, NutrientId, OrganId } from "./types";
import { DigestiveScene } from "./components/digestive-scene";
import { JourneyControls, JourneyProgress } from "./components/journey-controls";
import { OrganExplorer } from "./components/organ-explorer";
import { AccessoryOrgans } from "./components/accessory-organs";
import { VilliView } from "./components/villi-view";
import { NutrientTypes } from "./components/nutrient-types";
import { DigestionAbsorptionCompare } from "./components/digestion-absorption-compare";
import { LearningFlow } from "./components/learning-flow";
import { MiniChallenge } from "./components/mini-challenge";

export function DigestiveSystem() {
  const [seconds, setSeconds] = useState(INITIAL_JOURNEY_STATE.seconds);
  const [running, setRunning] = useState(INITIAL_JOURNEY_STATE.running);
  const [started, setStarted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const [activeOrgan, setActiveOrgan] = useState<OrganId | null>(null);
  const [activeAccessoryOrgan, setActiveAccessoryOrgan] =
    useState<AccessoryOrganId | null>(null);

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
    setStarted(true);
    setActiveOrgan(null);
    // Reduced motion: no animation loop; show the end of the journey straight away.
    if (reducedMotion) {
      setSeconds(TOTAL_DURATION_S);
      setRunning(false);
      return;
    }
    if (complete) {
      setSeconds(0);
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setSeconds(0);
    setRunning(false);
    setStarted(false);
    setActiveOrgan(null);
    setActiveAccessoryOrgan(null);
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

  const stageIndex = STAGES.findIndex((stage) => stage.id === currentStage);
  const runState: SimulationRunState = running ? "running" : complete ? "finished" : started ? "paused" : "idle";

  return (
    <div className="flex flex-col gap-6 py-4">
      <SimulationLayout
        stageLabel="Digestive system simulation"
        aspect={VIEW_WIDTH / VIEW_HEIGHT}
        stageCap="28rem"
        runState={runState}
        statusDetail="The journey is complete."
        stage={<DigestiveScene progress={progress} showFood={started} highlight={sceneHighlight} />}
        readouts={
          <p className="truncate text-center text-sm font-medium text-ink dark:text-bone">
            {started
              ? `Stage ${stageIndex + 1} of ${STAGES.length}: ${STAGES[stageIndex]?.label}`
              : "Press Start Journey to begin."}
          </p>
        }
        actions={
          <JourneyControls
            running={running}
            started={started}
            complete={complete}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-6">
            <JourneyProgress started={started} currentStage={currentStage} />
            <OrganExplorer activeId={activeOrgan} onSelect={handleSelectOrgan} />
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-6">
            <AccessoryOrgans activeId={activeAccessoryOrgan} onSelect={setActiveAccessoryOrgan} />
            <VilliView exchanging={absorptionExchanging} done={absorptionDone} onExplore={handleExplore} />
            <NutrientTypes activeId={activeNutrient} onSelect={setActiveNutrient} />
          </div>
        }
      />

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
