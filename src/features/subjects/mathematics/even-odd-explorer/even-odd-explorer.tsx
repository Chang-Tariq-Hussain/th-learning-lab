"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { ChallengeBanner } from "./components/challenge-banner";
import { DotGrid } from "./components/dot-grid";
import { NumberStepper } from "./components/number-stepper";
import { OperationToggle } from "./components/operation-toggle";
import { ResultCard } from "./components/result-card";
import { ConfettiBurst } from "./components/confetti-burst";
import {
  clampOperand,
  computeResult,
  nextChallenge,
  randomStartingOperand,
  resultParity,
  type Challenge,
  type Operation,
} from "./model";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

/**
 * The Even & Odd Numbers Explorer. Two operand pickers plus an
 * operation toggle drive a live equation; each operand is rendered
 * as paired dots so the "leftover dot" pattern behind parity is
 * visible, not just computed. A built-in target-parity challenge
 * (mirroring `number-line`'s target-value challenge) gives the
 * playground a goal beyond free exploration.
 */
export function EvenOddExplorer() {
  const [a, setA] = useState<number>(() => randomStartingOperand());
  const [b, setB] = useState<number>(() => randomStartingOperand());
  const [operation, setOperation] = useState<Operation>("add");
  const [challenge, setChallenge] = useState<Challenge>(() => nextChallenge());
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = computeResult(a, b, operation);
  const parity = resultParity(result);

  // The only place challenge success is checked — fires whenever the
  // live result's parity matches the current target.
  useEffect(() => {
    if (parity !== challenge.targetParity) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      setChallenge(nextChallenge(challenge.targetParity));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parity]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setA(randomStartingOperand());
    setB(randomStartingOperand());
    setOperation("add");
    setCelebrating(false);
    setChallenge(nextChallenge(challenge.targetParity));
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <ChallengeBanner challenge={challenge} celebrating={celebrating} />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        <DotGrid value={a} label="First number" />
        <div className="mt-8 hidden font-display text-2xl text-ink-soft/60 dark:text-bone-soft/60 sm:block">
          {operation === "add" ? "+" : "−"}
        </div>
        <DotGrid value={b} label="Second number" />
        <ConfettiBurst triggerKey={confettiKey} />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <NumberStepper label="First number" value={a} onChange={(next) => setA(clampOperand(next))} />
        <OperationToggle operation={operation} onChange={setOperation} />
        <NumberStepper label="Second number" value={b} onChange={(next) => setB(clampOperand(next))} />
      </div>

      <ResultCard a={a} b={b} operation={operation} result={result} />

      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Reset
      </button>
    </div>
  );
}
