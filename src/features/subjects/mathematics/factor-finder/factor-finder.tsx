"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { FactorGrid } from "./components/factor-grid";
import { MultiplesGrid } from "./components/multiples-grid";
import { ModeToggle } from "./components/mode-toggle";
import { ProgressBanner } from "./components/progress-banner";
import { ConfettiBurst } from "./components/confetti-burst";
import {
  findableFactors,
  multiplesOf,
  nextFactorTarget,
  nextMultipleBase,
  MULTIPLES_GRID_MAX,
  type Mode,
} from "./model";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1600;

/**
 * The Factor Finder / Multiple Builder. One component, two modes,
 * toggled with `ModeToggle` — "Find Factors" gives a target number
 * and a 1-12 grid to tap the numbers that divide it evenly (each
 * correct tap reveals its pair partner, e.g. "3 × 4 = 12"); "Find
 * Multiples" gives a base number and a 1-50 grid to tap every
 * multiple of it. Both keep their own round state so switching modes
 * mid-round doesn't lose either one's progress.
 */
export function FactorFinder() {
  const [mode, setMode] = useState<Mode>("factors");

  // --- Factors mode state -------------------------------------------------
  const [factorTarget, setFactorTarget] = useState<number>(() => nextFactorTarget());
  const [factorTried, setFactorTried] = useState<Set<number>>(new Set());
  const [factorFound, setFactorFound] = useState<Set<number>>(new Set());

  // --- Multiples mode state ------------------------------------------------
  const [multipleBase, setMultipleBase] = useState<number>(() => nextMultipleBase());
  const [multipleTried, setMultipleTried] = useState<Set<number>>(new Set());
  const [multipleFound, setMultipleFound] = useState<Set<number>>(new Set());

  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const factorsToFind = findableFactors(factorTarget);
  const multiplesToFind = multiplesOf(multipleBase, MULTIPLES_GRID_MAX);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const celebrate = (advance: () => void) => {
    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      advance();
    }, CELEBRATION_MS);
  };

  const handleFactorTap = (candidate: number) => {
    if (celebrating || factorFound.has(candidate)) return;
    setFactorTried((prev) => new Set(prev).add(candidate));

    if (factorTarget % candidate !== 0) return;

    const nextFound = new Set(factorFound).add(candidate);
    setFactorFound(nextFound);

    if (nextFound.size === factorsToFind.length) {
      celebrate(() => {
        const next = nextFactorTarget(factorTarget);
        setFactorTarget(next);
        setFactorTried(new Set());
        setFactorFound(new Set());
      });
    }
  };

  const handleMultipleTap = (cell: number) => {
    if (celebrating || multipleFound.has(cell)) return;
    setMultipleTried((prev) => new Set(prev).add(cell));

    if (cell % multipleBase !== 0) return;

    const nextFound = new Set(multipleFound).add(cell);
    setMultipleFound(nextFound);

    if (nextFound.size === multiplesToFind.length) {
      celebrate(() => {
        const next = nextMultipleBase(multipleBase);
        setMultipleBase(next);
        setMultipleTried(new Set());
        setMultipleFound(new Set());
      });
    }
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCelebrating(false);
    if (mode === "factors") {
      setFactorTarget(nextFactorTarget(factorTarget));
      setFactorTried(new Set());
      setFactorFound(new Set());
    } else {
      setMultipleBase(nextMultipleBase(multipleBase));
      setMultipleTried(new Set());
      setMultipleFound(new Set());
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-6 py-4">
      <ModeToggle mode={mode} onChange={setMode} />

      {mode === "factors" ? (
        <>
          <ProgressBanner
            prompt={`Tap every factor of ${factorTarget}`}
            celebrating={celebrating}
            foundCount={factorFound.size}
            totalCount={factorsToFind.length}
          />
          <div className="w-full max-w-xl">
            <FactorGrid target={factorTarget} tried={factorTried} found={factorFound} onTap={handleFactorTap} />
          </div>
        </>
      ) : (
        <>
          <ProgressBanner
            prompt={`Tap every multiple of ${multipleBase} up to ${MULTIPLES_GRID_MAX}`}
            celebrating={celebrating}
            foundCount={multipleFound.size}
            totalCount={multiplesToFind.length}
          />
          <div className="w-full max-w-2xl">
            <MultiplesGrid base={multipleBase} tried={multipleTried} found={multipleFound} onTap={handleMultipleTap} />
          </div>
        </>
      )}

      <ConfettiBurst triggerKey={confettiKey} />

      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        New number
      </button>
    </div>
  );
}
