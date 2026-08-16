"use client";

import { useState } from "react";
import { ArrheniusExplanation } from "./components/arrhenius-explanation";
import { ComparisonSummary } from "./components/comparison-summary";
import { ConnectionPanel } from "./components/connection-panel";
import { Controls, type LastAction } from "./components/controls";
import { DissociationContainer } from "./components/dissociation-container";
import { ExamplePicker } from "./components/example-picker";
import { MAX_DOSE, MIN_DOSE, type ArrheniusExample } from "./arrhenius-model";

/**
 * Arrhenius Theory — two side-by-side dissociation containers (an
 * acid and a base) plus Add Acid / Add Base controls. Same "small
 * pieces of local state, no numeric chemistry" approach as Acids &
 * Bases — The Basics: `acidDose` / `baseDose` only ever drive how
 * many ion chips are drawn, never an actual concentration.
 */
export function ArrheniusTheory() {
  const [acidDose, setAcidDose] = useState(MIN_DOSE);
  const [baseDose, setBaseDose] = useState(MIN_DOSE);
  const [lastAction, setLastAction] = useState<LastAction>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const handleAddAcid = () => {
    setAcidDose((d) => Math.min(MAX_DOSE, d + 1));
    setLastAction("acid");
  };

  const handleAddBase = () => {
    setBaseDose((d) => Math.min(MAX_DOSE, d + 1));
    setLastAction("base");
  };

  const handleReset = () => {
    setAcidDose(MIN_DOSE);
    setBaseDose(MIN_DOSE);
    setLastAction(null);
    setSelectedExample(null);
  };

  const handleSelectExample = (example: ArrheniusExample) => {
    setSelectedExample((prev) => (prev === example.slug ? null : example.slug));
  };

  return (
    <div className="flex flex-col gap-6">
      <ArrheniusExplanation />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DissociationContainer
          role="acid"
          formula="HCl"
          featuredIon="h-plus"
          spectatorLabel="Cl⁻"
          dose={acidDose}
          active={selectedExample === "hcl"}
        />
        <DissociationContainer
          role="base"
          formula="NaOH"
          featuredIon="oh-minus"
          spectatorLabel="Na⁺"
          dose={baseDose}
          active={selectedExample === "naoh"}
        />
      </div>

      <Controls
        acidDose={acidDose}
        baseDose={baseDose}
        maxDose={MAX_DOSE}
        lastAction={lastAction}
        onAddAcid={handleAddAcid}
        onAddBase={handleAddBase}
        onReset={handleReset}
      />

      <ExamplePicker selected={selectedExample} onSelect={handleSelectExample} />

      <ComparisonSummary />

      <ConnectionPanel />
    </div>
  );
}
