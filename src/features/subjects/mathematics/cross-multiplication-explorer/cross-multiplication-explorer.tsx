"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrossDiagram } from "./components/cross-diagram";
import { ProductTrail } from "./components/product-trail";
import { ResultBanner } from "./components/result-banner";
import { DIAGONAL_COLORS } from "./colors";

const DEFAULTS = { a: 2, b: 3, c: 4, d: 6 };

// Stage timeline: each entry fires `delay` ms after the sequence (re)starts.
const STAGE_TIMELINE = [
  { stage: 1, delay: 150 }, // draw a → d
  { stage: 2, delay: 800 }, // reveal a × d
  { stage: 3, delay: 1050 }, // draw b → c
  { stage: 4, delay: 1700 }, // reveal b × c
  { stage: 5, delay: 1950 }, // reveal equal / not equal
];

export function CrossMultiplicationExplorer() {
  const [a, setA] = useState(DEFAULTS.a);
  const [b, setB] = useState(DEFAULTS.b);
  const [c, setC] = useState(DEFAULTS.c);
  const [d, setD] = useState(DEFAULTS.d);
  const [stage, setStage] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Every change to a number, or an explicit replay, re-runs the full
  // animated multiplication from the top — nothing skips straight to
  // the answer.
  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setStage(0);

    STAGE_TIMELINE.forEach(({ stage: targetStage, delay }) => {
      const id = setTimeout(() => setStage(targetStage), delay);
      timeoutsRef.current.push(id);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d, runToken]);

  const handleReset = () => {
    setA(DEFAULTS.a);
    setB(DEFAULTS.b);
    setC(DEFAULTS.c);
    setD(DEFAULTS.d);
    setRunToken((k) => k + 1);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="w-full max-w-2xl rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-1.5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Cross-multiply to compare</p>
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Two fractions are equivalent exactly when their cross products match.
          </p>
        </div>

        <CrossDiagram a={a} b={b} c={c} d={d} onChangeA={setA} onChangeB={setB} onChangeC={setC} onChangeD={setD} stage={stage} />

        <div className="mt-8 flex flex-col items-center gap-5">
          <ProductTrail a={a} b={b} c={c} d={d} stage={stage} />
          <ResultBanner productFirst={a * d} productSecond={b * c} visible={stage >= 5} />
        </div>
      </div>

      <Legend />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" variant="secondary" onClick={() => setRunToken((k) => k + 1)}>
          <Play className="h-4 w-4" strokeWidth={2} />
          Replay animation
        </Button>
        <Button size="lg" variant="ghost" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset to 2/3 = 4/6
        </Button>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-soft dark:text-bone-soft">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DIAGONAL_COLORS.first.hex }} />
        Numerator × opposite denominator
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DIAGONAL_COLORS.second.hex }} />
        Denominator × opposite numerator
      </span>
    </div>
  );
}
