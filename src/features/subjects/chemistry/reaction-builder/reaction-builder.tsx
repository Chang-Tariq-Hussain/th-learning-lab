"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ArrowRight, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, usePrefersReducedMotion } from "@/features/simulation";
import { ReactionTabs } from "./components/reaction-tabs";
import { ReactionEquationDiagram } from "./components/reaction-equation-diagram";
import { ReactionStage } from "./components/reaction-stage";
import { SCENE_HEIGHT, SCENE_WIDTH } from "./layout";
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
  const reducedMotion = usePrefersReducedMotion();

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
    // Reduced motion: no auto-played sequence; go straight to the products (Next Step still moves one at a time).
    if (reducedMotion) {
      setStep(LAST_STEP);
      return;
    }
    const advance = (from: ReactionStep) => {
      if (from >= LAST_STEP) return;
      timeoutRef.current = setTimeout(() => {
        const next = (from + 1) as ReactionStep;
        setStep(next);
        advance(next);
      }, STEP_ADVANCE_DELAY_MS);
    };
    advance(step);
  }, [clearTimer, step, reducedMotion]);

  const handleReset = useCallback(() => {
    clearTimer();
    setStep(1);
  }, [clearTimer]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-4 py-4">
        <SimulationLayout
          stageLabel="Chemical reaction builder"
          aspect={SCENE_WIDTH / SCENE_HEIGHT}
          stageCap="26rem"
          stage={<ReactionStage reaction={reaction} step={step} />}
          readouts={<ReactionStepStatus reaction={reaction} step={step} />}
          actions={
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
              <Button
                variant="primary"
                onClick={handlePlayReaction}
                disabled={step === LAST_STEP}
                className="col-span-2 sm:col-auto"
              >
                <Play className="h-4 w-4" strokeWidth={1.75} />
                {step === 1 ? "Start Reaction" : "Play Reaction"}
              </Button>
              <Button variant="secondary" onClick={handleNextStep} disabled={step === LAST_STEP}>
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                Next Step
              </Button>
              <Button variant="ghost" onClick={handleReset} disabled={step === 1}>
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                Reset
              </Button>
            </div>
          }
          controls={
            <div className="flex min-w-0 flex-col gap-4">
              <ReactionTabs reactionId={reactionId} onChange={handleReactionChange} />
              <ReactionEquationDiagram reaction={reaction} step={step} />
              <AtomCounter reaction={reaction} />
            </div>
          }
          explanation={<ReactionExplanation step={step} />}
        />

        <p className="text-center text-xs italic text-ink-soft/70 dark:text-bone-soft/70">
          {REACTION_SCIENCE_NOTE}
        </p>
      </div>
    </MotionConfig>
  );
}
