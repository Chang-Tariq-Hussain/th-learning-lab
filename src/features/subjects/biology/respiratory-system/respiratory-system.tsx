"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GAS_EXCHANGE_DURATION_MS, INITIAL_BREATHING_STATE, breathPhase, stepBreathing } from "./respiratory-model";
import type { AirStageId, BreathingState, GasId } from "./types";
import { LungScene } from "./components/lung-scene";
import { BreathingControls } from "./components/breathing-controls";
import { AirPathway } from "./components/air-pathway";
import { AlveoliView } from "./components/alveoli-view";
import { GasJourney } from "./components/gas-journey";
import { InhaleExhaleCompare } from "./components/inhale-exhale-compare";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto h-[380px] w-full max-w-sm rounded-[1.75rem] border border-line bg-white/70 p-3 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:h-[420px]">
        <LungScene phase={phase} direction={breathing.direction} running={breathing.running} activeStage={airStage} />
      </div>

      <BreathingControls
        auto={breathing.auto}
        running={breathing.running}
        onInhale={handleInhale}
        onExhale={handleExhale}
        onAuto={handleAuto}
        onPause={handlePause}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AirPathway activeId={airStage} onSelect={setAirStage} />
        <AlveoliView exchanging={exchanging} done={exchangeDone} onExchange={handleGasExchange} />
      </div>

      <GasJourney gas={journeyGas} step={journeyStep} onSelect={handleSelectJourney} onNext={handleJourneyNext} onRestart={handleJourneyRestart} />

      <InhaleExhaleCompare />

      <LearningPanel />

      <MiniChallenge step={challengeStep} feedback={challengeFeedback} onAnswer={handleChallengeAnswer} onRestart={handleChallengeRestart} />
    </div>
  );
}
