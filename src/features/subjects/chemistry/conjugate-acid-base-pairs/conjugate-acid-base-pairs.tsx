"use client";

import { useState } from "react";
import { ConjugatePairDiagram } from "./components/conjugate-pair-diagram";
import { ExplanationPanel } from "./components/explanation-panel";
import { GenericTransformation } from "./components/generic-transformation";
import { PairPicker } from "./components/pair-picker";
import { PracticeActivity } from "./components/practice-activity";
import { getPair, type ConjugatePair } from "./model";

/**
 * Conjugate Acid–Base Pairs — pick either member of a pair, its
 * conjugate partner lights up automatically. All local UI state
 * (which pair, which member was clicked) — no numeric chemistry.
 */
export function ConjugateAcidBasePairs() {
  const [selectedPairSlug, setSelectedPairSlug] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<"acid" | "base" | null>(null);

  const selectedPair: ConjugatePair | null = selectedPairSlug ? getPair(selectedPairSlug) ?? null : null;

  const handleSelect = (pair: ConjugatePair, member: "acid" | "base") => {
    setSelectedPairSlug(pair.slug);
    setSelectedMember(member);
  };

  return (
    <div className="flex flex-col gap-6">
      <GenericTransformation />

      <PairPicker selectedPairSlug={selectedPairSlug} selectedMember={selectedMember} onSelect={handleSelect} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConjugatePairDiagram pair={selectedPair} selectedMember={selectedMember} />
        <ExplanationPanel pair={selectedPair} selectedMember={selectedMember} />
      </div>

      <PracticeActivity />
    </div>
  );
}
