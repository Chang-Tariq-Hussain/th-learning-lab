"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AP_DURATION_S, clamp01, phaseAt } from "./nervous-model";
import type { NeuronPartId, NsNodeId } from "./types";
import { NeuronExplorer } from "./components/neuron-explorer";
import { ActionPotentialControls } from "./components/action-potential-controls";
import { SynapseExplorer } from "./components/synapse-explorer";
import { NsOrganization } from "./components/ns-organization";
import { MiniChallenge } from "./components/mini-challenge";

export function NervousSystem() {
  // Neuron anatomy
  const [activePart, setActivePart] = useState<NeuronPartId | null>(null);

  // Action potential playback (same continuous-clock pattern as the other sims)
  const [apSeconds, setApSeconds] = useState(0);
  const [apRunning, setApRunning] = useState(false);
  const [apStarted, setApStarted] = useState(false);
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
    if (!apRunning) {
      stopLoop();
      return;
    }
    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setApSeconds((prev) => {
        const next = prev + dt;
        if (next >= AP_DURATION_S) {
          setApRunning(false);
          return AP_DURATION_S;
        }
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return stopLoop;
  }, [apRunning, stopLoop]);

  const apProgress = clamp01(apSeconds / AP_DURATION_S);
  const apPhase = phaseAt(apProgress);

  const handleApStart = () => {
    if (apProgress >= 1) setApSeconds(0);
    setApStarted(true);
    setApRunning(true);
  };
  const handleApPause = () => setApRunning(false);
  const handleApReset = () => {
    setApSeconds(0);
    setApRunning(false);
    setApStarted(false);
  };

  // Synaptic transmission stepper
  const [synapseStep, setSynapseStep] = useState(0);

  // Nervous system organization tree
  const [activeNsNode, setActiveNsNode] = useState<NsNodeId | null>(null);

  // Mini challenge
  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState<boolean | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

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

  return (
    <div className="flex flex-col gap-6">
      <NeuronExplorer activeId={activePart} onSelect={setActivePart} />

      <ActionPotentialControls
        progress={apProgress}
        running={apRunning}
        started={apStarted}
        phase={apPhase}
        onStart={handleApStart}
        onPause={handleApPause}
        onReset={handleApReset}
      />

      <SynapseExplorer stepIndex={synapseStep} onStepChange={setSynapseStep} />

      <NsOrganization activeId={activeNsNode} onSelect={setActiveNsNode} />

      <MiniChallenge
        step={challengeStep}
        feedback={challengeFeedback}
        onAnswer={handleChallengeAnswer}
        onRestart={handleChallengeRestart}
      />
    </div>
  );
}
