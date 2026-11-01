"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SimulationLayout } from "@/features/simulation";
import { BasePicker } from "./components/base-picker";
import { DnaHelix, dnaHelixAspect } from "./components/dna-helix";
import { FeedbackMessage } from "./components/feedback-message";
import { InfoPanel } from "./components/info-panel";
import { COMPLEMENT, createInitialState, firstBlankIndex, isSequenceComplete } from "./model";
import type { Base, DnaState } from "./types";

const FEEDBACK_TIMEOUT_MS = 2200;

/**
 * DNA Structure & Base Pairing. One visualization does double duty:
 * clicking any already-answered position shows its complementary
 * pairing, and the still-blank positions are the "Complete the DNA
 * strand" activity — same widget, no separate demo diagram needed.
 * `DnaState` (in types.ts) is the entire model; every derived bit
 * (which position is next, whether the strand is complete) is a
 * plain function over that state, computed fresh each render.
 */
export function DnaStructure() {
  const [state, setState] = useState<DnaState>(() => createInitialState());
  const { sequence, filled, selectedIndex, feedback } = state;

  const complete = isSequenceComplete(filled);

  // Clear a correct/incorrect result after a couple of seconds so the message settles back to a plain pairing prompt.
  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => {
      setState((prev) => (prev.feedback === feedback ? { ...prev, feedback: null } : prev));
    }, FEEDBACK_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const handleSelect = (index: number) => {
    setState((prev) => ({ ...prev, selectedIndex: index, feedback: null }));
  };

  const handlePick = (base: Base) => {
    setState((prev) => {
      if (prev.selectedIndex === null || prev.filled[prev.selectedIndex] !== null) return prev;

      const index = prev.selectedIndex;
      const target = prev.sequence[index]!;
      const isCorrect = COMPLEMENT[target] === base;

      if (!isCorrect) {
        return { ...prev, feedback: { index, status: "incorrect" } };
      }

      const nextFilled = [...prev.filled];
      nextFilled[index] = base;
      const nextSelected = firstBlankIndex(nextFilled);

      return {
        ...prev,
        filled: nextFilled,
        selectedIndex: nextSelected,
        feedback: { index, status: "correct" },
      };
    });
  };

  const handleNewSequence = () => {
    setState(createInitialState());
  };

  const handleReset = () => {
    setState((prev) => ({
      sequence: prev.sequence,
      filled: prev.sequence.map(() => null),
      selectedIndex: 0,
      feedback: null,
    }));
  };

  const pickerDisabled = selectedIndex === null || filled[selectedIndex] !== null;

  return (
    <div className="py-4">
      <SimulationLayout
        stageLabel="DNA double helix with base pairs"
        aspect={dnaHelixAspect(sequence.length)}
        stageCap="14rem"
        stage={<DnaHelix sequence={sequence} filled={filled} selectedIndex={selectedIndex} onSelect={handleSelect} />}
        readouts={
          <div className="min-h-[3.5rem]">
            <FeedbackMessage feedback={feedback} selectedIndex={selectedIndex} sequence={sequence} filled={filled} complete={complete} />
          </div>
        }
        actions={
          <div className="flex flex-col items-center gap-2">
            <BasePicker onPick={handlePick} disabled={pickerDisabled} />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="primary" size="md" onClick={handleNewSequence}>
                New Sequence
              </Button>
              <Button variant="ghost" size="md" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        }
        controls={<InfoPanel />}
      />
    </div>
  );
}
