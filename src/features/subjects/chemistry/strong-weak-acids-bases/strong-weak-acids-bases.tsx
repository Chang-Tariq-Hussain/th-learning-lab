"use client";

import { useState } from "react";
import { AcidBaseToggle } from "./components/acid-base-toggle";
import { ComparisonPractice } from "./components/comparison-practice";
import { ConcentrationNote } from "./components/concentration-note";
import { IonizeControls } from "./components/ionize-controls";
import { StrengthPanel } from "./components/strength-panel";
import { StrengthScale } from "./components/strength-scale";
import { getExample } from "./model";
import type { StrongWeakState } from "./types";

const INITIAL_STATE: StrongWeakState = {
  species: "acid",
  ionized: false,
};

/**
 * Strong vs Weak Acids and Bases — two side-by-side particle scenes
 * (strong vs weak) sharing one Ionize/Reset control. Switching the
 * Acid/Base toggle swaps which pair of examples is shown; it does
 * not reset the ionized state, so a student can compare acids and
 * bases both before and after ionizing.
 */
export function StrongWeakAcidsBases() {
  const [state, setState] = useState<StrongWeakState>(INITIAL_STATE);
  const { species, ionized } = state;

  const strongExample = getExample(species, "strong");
  const weakExample = getExample(species, "weak");

  const handleSelectSpecies = (next: StrongWeakState["species"]) =>
    setState((prev) => ({ ...prev, species: next }));

  const handleIonize = () => setState((prev) => ({ ...prev, ionized: true }));
  const handleReset = () => setState((prev) => ({ ...prev, ionized: false }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <AcidBaseToggle species={species} onSelect={handleSelectSpecies} />
        <p className="max-w-xl text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Strong vs weak describes the extent of ionization, not simply how much solution is present.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StrengthPanel species={species} example={strongExample} ionized={ionized} />
        <StrengthPanel species={species} example={weakExample} ionized={ionized} />
      </div>

      <IonizeControls ionized={ionized} onIonize={handleIonize} onReset={handleReset} />

      <ConcentrationNote />

      <StrengthScale />

      <ComparisonPractice />
    </div>
  );
}
