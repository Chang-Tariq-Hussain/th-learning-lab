"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import {
  GAS_EXCHANGE_DURATION_MS,
  INITIAL_BREATHING_STATE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  breathPhase,
  stepBreathing,
} from "./respiratory-model";
import type { AirStageId, BreathingState, GasId } from "./types";
import { LungScene } from "./components/lung-scene";
import { AutoBreathingToggle, BreathingControls } from "./components/breathing-controls";
import { AirPathway } from "./components/air-pathway";
import { AlveoliView } from "./components/alveoli-view";
import { GasJourney } from "./components/gas-journey";
import { InhaleExhaleCompare } from "./components/inhale-exhale-compare";
import { BreathingMechanics } from "./components/breathing-mechanics";
import { LearningPanel } from "./components/learning-panel";
import { MiniChallenge } from "./components/mini-challenge";

export function RespiratorySystem() {
  const [breathing, setBreathing] = useState<BreathingState>(INITIAL_BREATHING_STATE);
  const [airStage, setAirStage] = useState<AirStageId | null>(null);

  const [exchanging, setExchanging] = useState(false);
  const [exchangeDone, setExchangeDone] = useState(false);
  const exchangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [journeyGas, setJourneyGas] = useState<GasId | null>(null);
  const [journeyStep, setJourneyStep] = useState(0);

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
    if (!breathing.running) {
      stopLoop();
      return;
    }

    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setBreathing((prev) => stepBreathing(prev, dt));

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [breathing.running, stopLoop]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (exchangeTimeoutRef.current) clearTimeout(exchangeTimeoutRef.current);
    };
  }, []);

  const handleInhale = () => setBreathing((prev) => ({ ...prev, direction: "in", auto: false, running: true }));
  const handleExhale = () => setBreathing((prev) => ({ ...prev, direction: "out", auto: false, running: true }));
  const handleAuto = () =>
    setBreathing((prev) => ({
      ...prev,
      auto: true,
      running: true,
      direction: prev.seconds <= 0 ? "in" : prev.direction,
    }));
  const handlePause = () => setBreathing((prev) => ({ ...prev, running: false }));

  const handleReset = () => {
    setBreathing(INITIAL_BREATHING_STATE);
    setAirStage(null);
    setExchanging(false);
    setExchangeDone(false);
    if (exchangeTimeoutRef.current) clearTimeout(exchangeTimeoutRef.current);
    setJourneyGas(null);
    setJourneyStep(0);
    setChallengeStep(0);
    setChallengeFeedback(null);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
  };

  const handleGasExchange = () => {
    setExchanging(true);
    setExchangeDone(false);
    if (exchangeTimeoutRef.current) clearTimeout(exchangeTimeoutRef.current);
    exchangeTimeoutRef.current = setTimeout(() => {
      setExchanging(false);
      setExchangeDone(true);
    }, GAS_EXCHANGE_DURATION_MS);
  };

  const handleSelectJourney = (gas: GasId) => {
    setJourneyGas(gas);
    setJourneyStep(0);
  };

  const handleJourneyNext = () => setJourneyStep((s) => s + 1);
  const handleJourneyRestart = () => setJourneyStep(0);

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
  };

  const phase = breathPhase(breathing);

  const runState: SimulationRunState = breathing.running ? "running" : breathing.seconds > 0 ? "paused" : "idle";

  return (
    <div className="flex flex-col gap-6 py-4">
      <SimulationLayout
        stageLabel="Respiratory system simulation"
        aspect={VIEW_WIDTH / VIEW_HEIGHT}
        stageCap="28rem"
        runState={runState}
        stage={<LungScene phase={phase} direction={breathing.direction} running={breathing.running} activeStage={airStage} />}
        readouts={
          <p className="truncate text-center text-sm font-medium text-ink dark:text-bone">
            {breathing.running ? (breathing.direction === "in" ? "Breathing in" : "Breathing out") : "Ready"}
          </p>
        }
        actions={
          <BreathingControls
            running={breathing.running}
            onInhale={handleInhale}
            onExhale={handleExhale}
            onPause={handlePause}
            onReset={handleReset}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex justify-center lg:justify-start">
              <AutoBreathingToggle auto={breathing.auto} onAuto={handleAuto} />
            </div>
            <AirPathway activeId={airStage} onSelect={setAirStage} />
            <AlveoliView exchanging={exchanging} done={exchangeDone} onExchange={handleGasExchange} />
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-6">
            <GasJourney gas={journeyGas} step={journeyStep} onSelect={handleSelectJourney} onNext={handleJourneyNext} onRestart={handleJourneyRestart} />
            <BreathingMechanics direction={breathing.direction} running={breathing.running} />
          </div>
        }
      />

      <InhaleExhaleCompare />

      <LearningPanel />

      <MiniChallenge step={challengeStep} feedback={challengeFeedback} onAnswer={handleChallengeAnswer} onRestart={handleChallengeRestart} />
    </div>
  );
}
