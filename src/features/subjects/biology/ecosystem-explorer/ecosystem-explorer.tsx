"use client";

import { useEffect, useRef, useState } from "react";
import { idsForCategory, idsForRole } from "./ecosystem-model";
import type { CategoryId, ComponentId, ExploreRoleId } from "./types";
import { SimulationLayout } from "@/features/simulation";
import { ComponentChips, ComponentDetails, ComponentTitle } from "./components/component-explorer";
import { EcosystemScene } from "./components/ecosystem-scene";
import { BioticToggle } from "./components/biotic-toggle";
import { RolePicker } from "./components/role-picker";
import { BalanceActions, BalanceMessage } from "./components/balance-experiment";
import { LearningSummary } from "./components/learning-summary";
import { MiniChallenge } from "./components/mini-challenge";

export function EcosystemExplorer() {
  const [selectedId, setSelectedId] = useState<ComponentId | null>(null);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [role, setRole] = useState<ExploreRoleId | null>(null);

  const [plantsRemoved, setPlantsRemoved] = useState(false);
  const [waterReduced, setWaterReduced] = useState(false);

  const [challengeStep, setChallengeStep] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState<boolean | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const handleSelect = (id: ComponentId | null) => {
    setSelectedId(id);
    if (id) {
      setCategory(null);
      setRole(null);
    }
  };

  const handleCategory = (id: CategoryId | null) => {
    setCategory(id);
    setSelectedId(null);
    if (id) setRole(null);
  };

  const handleRole = (id: ExploreRoleId | null) => {
    setRole(id);
    setSelectedId(null);
    if (id) setCategory(null);
  };

  const highlightIds = category
    ? idsForCategory(category)
    : role
      ? idsForRole(role)
      : null;

  const handleReset = () => {
    setPlantsRemoved(false);
    setWaterReduced(false);
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

  return (
    <div className="flex flex-col gap-6">
      <SimulationLayout
        stageLabel="Pond and forest ecosystem scene"
        aspect={380 / 240}
        stageCap="22rem"
        stage={
          <EcosystemScene
            selectedId={selectedId}
            highlightIds={highlightIds}
            plantsRemoved={plantsRemoved}
            waterReduced={waterReduced}
            onSelect={(id) => handleSelect(selectedId === id ? null : id)}
          />
        }
        readouts={<ComponentTitle selectedId={selectedId} />}
        actions={
          <BalanceActions
            plantsRemoved={plantsRemoved}
            waterReduced={waterReduced}
            onToggleRemovePlants={() => setPlantsRemoved((v) => !v)}
            onToggleReduceWater={() => setWaterReduced((v) => !v)}
            onReset={handleReset}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <ComponentDetails selectedId={selectedId} />
            <ComponentChips selectedId={selectedId} onSelect={handleSelect} />
            <div className="grid grid-cols-1 gap-4">
              <BioticToggle active={category} onSelect={handleCategory} />
              <RolePicker active={role} onSelect={handleRole} />
            </div>
            <BalanceMessage plantsRemoved={plantsRemoved} waterReduced={waterReduced} />
          </div>
        }
        explanation={<LearningSummary />}
      />

      <MiniChallenge
        step={challengeStep}
        feedback={challengeFeedback}
        onAnswer={handleChallengeAnswer}
        onRestart={handleChallengeRestart}
      />
    </div>
  );
}
