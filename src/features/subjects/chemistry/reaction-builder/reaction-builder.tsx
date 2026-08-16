"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactionTabs } from "./components/reaction-tabs";
import { ReactionEquationDiagram } from "./components/reaction-equation-diagram";
import { ReactionStage } from "./components/reaction-stage";
import { ReactionStepStatus } from "./components/reaction-step-status";
import { AtomCounter } from "./components/atom-counter";
import { ReactionExplanation } from "./components/reaction-explanation";
import {
  REACTIONS,
  REACTION_SCIENCE_NOTE,
  type ReactionId,
  type ReactionStep,
} from "./reaction-model";

const STEP_ADVANCE_DELAY_MS = 900;
const LAST_STEP: ReactionStep = 6;

/**
 * Chemical Reaction Builder — a small, focused visualization teaching
 * that reactants turn into products by rearranging atoms: bonds break,
 * atoms regroup, new bonds form, and the count of each element never
 * changes. Owns the selected reaction and the current step (1–6); all
 * rendering lives in `ReactionStage` and its sibling components,
 * reusing Bond Builder's/Molecule Builder's
 * `AtomOrb`/`BondLine`/`ValenceElectron`/`BondDefs`/`MoleculeDefs`
 * rather than duplicating that visual language. Every reaction itself
 * lives in `reaction-model.ts`, kept separate from this animation/
 * control logic so more reactions can be added there without touching
 * any component.
 */
export function ReactionBuilder() {
  const [reactionId, setReactionId] = useState<ReactionId>("water-formation");
  const [step, setStep] = useState<ReactionStep>(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reaction = REACTIONS[reactionId];

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

  const handleReactionChange = useCallback(
    (id: ReactionId) => {
      clearTimer();
      setReactionId(id);
      setStep(1);
    },
    [clearTimer],
  );

  const handleNextStep = useCallback(() => {
    clearTimer();
    setStep((s) => (s < LAST_STEP ? ((s + 1) as ReactionStep) : s));
  }, [clearTimer]);

  /** Auto-plays every remaining step, one after another. */
  const handlePlayReaction = useCallback(() => {
    clearTimer();
    const advance = (from: ReactionStep) => {
      if (from >= LAST_STEP) return;
      timeoutRef.current = setTimeout(() => {
        const next = (from + 1) as ReactionStep;
        setStep(next);
        advance(next);
      }, STEP_ADVANCE_DELAY_MS);
    };
    advance(step);
  }, [clearTimer, step]);

  const handleReset = useCallback(() => {
    clearTimer();
    setStep(1);
  }, [clearTimer]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ReactionTabs reactionId={reactionId} onChange={handleReactionChange} />
        <ReactionStepStatus reaction={reaction} step={step} />
      </div>

      <ReactionEquationDiagram reaction={reaction} step={step} />

      <div className="relative flex items-center justify-center overflow-hidden rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]">
        <div className="aspect-[9/4] w-full max-w-[720px]">
          <ReactionStage reaction={reaction} step={step} />
        </div>
      </div>

      <AtomCounter reaction={reaction} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          onClick={handlePlayReaction}
          disabled={step === LAST_STEP}
        >
          <Play className="h-4 w-4" strokeWidth={1.75} />
          {step === 1 ? "Start Reaction" : "Play Reaction"}
        </Button>
        <Button
          variant="secondary"
          onClick={handleNextStep}
          disabled={step === LAST_STEP}
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

      <ReactionExplanation step={step} />

      <p className="text-center text-xs italic text-ink-soft/70 dark:text-bone-soft/70">
        {REACTION_SCIENCE_NOTE}
      </p>
    </div>
  );
}
