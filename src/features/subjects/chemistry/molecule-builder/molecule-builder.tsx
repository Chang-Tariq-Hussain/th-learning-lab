"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoleculeStage } from "./components/molecule-stage";
import { MoleculeTabs } from "./components/molecule-tabs";
import { StepStatus } from "./components/step-status";
import { AtomInfoPanel } from "./components/atom-info-panel";
import { MoleculeExplanation } from "./components/molecule-explanation";
import { MOLECULES, type BuildStep, type MoleculeId } from "./molecule-model";

const STEP_ADVANCE_DELAY_MS = 650;

/**
 * Molecule Builder — a small, focused visualization teaching that
 * molecules form when atoms bond together. Owns just the molecule
 * choice, the current build step (1–4), and which atom is selected for
 * its info popup; all rendering lives in `MoleculeStage` and its
 * children, reusing Bond Builder's `AtomOrb`/`ValenceElectron`/`BondDefs`
 * rather than duplicating that visual language.
 */
export function MoleculeBuilder() {
  const [moleculeId, setMoleculeId] = useState<MoleculeId>("h2");
  const [step, setStep] = useState<BuildStep>(1);
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const molecule = MOLECULES[moleculeId];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMoleculeChange = useCallback(
    (id: MoleculeId) => {
      clearTimer();
      setMoleculeId(id);
      setStep(1);
      setSelectedAtomId(null);
    },
    [clearTimer],
  );

  const handleNextStep = useCallback(() => {
    clearTimer();
    setStep((s) => (s < 4 ? ((s + 1) as BuildStep) : s));
  }, [clearTimer]);

  /** Auto-plays every remaining step, one after another, so the molecule-specific action button ("Join Atoms" / "Build Water" / …) finishes the whole sequence in one click. */
  const handleAutoBuild = useCallback(() => {
    clearTimer();
    const advance = (from: BuildStep) => {
      if (from >= 4) return;
      timeoutRef.current = setTimeout(() => {
        const next = (from + 1) as BuildStep;
        setStep(next);
        advance(next);
      }, STEP_ADVANCE_DELAY_MS);
    };
    advance(step);
  }, [clearTimer, step]);

  const handleReset = useCallback(() => {
    clearTimer();
    setStep(1);
    setSelectedAtomId(null);
  }, [clearTimer]);

  const handleSelectAtom = useCallback((id: string) => {
    setSelectedAtomId((current) => (current === id ? null : id));
  }, []);

  const selectedAtom =
    molecule.atoms.find((a) => a.id === selectedAtomId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MoleculeTabs moleculeId={moleculeId} onChange={handleMoleculeChange} />
        <StepStatus step={step} />
      </div>

      <div className="relative flex items-center justify-center overflow-hidden rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]">
        <div className="aspect-[7/3] w-full max-w-[640px]">
          <MoleculeStage
            molecule={molecule}
            step={step}
            selectedAtomId={selectedAtomId}
            onSelectAtom={handleSelectAtom}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          onClick={handleAutoBuild}
          disabled={step === 4}
        >
          <Zap className="h-4 w-4" strokeWidth={1.75} />
          {molecule.actionLabel}
        </Button>
        <Button
          variant="secondary"
          onClick={handleNextStep}
          disabled={step === 4}
        >
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          Next Step
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={step === 1}
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
      </div>

      <AtomInfoPanel
        molecule={molecule}
        selectedAtom={selectedAtom}
        onClose={() => setSelectedAtomId(null)}
      />
      <MoleculeExplanation molecule={molecule} />
    </div>
  );
}
