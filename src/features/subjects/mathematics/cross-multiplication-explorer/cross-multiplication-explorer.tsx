"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, usePrefersReducedMotion } from "@/features/simulation";
import { NumberField } from "./components/number-field";
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
  const reducedMotion = usePrefersReducedMotion();

  // Every change to a number, or an explicit replay, re-runs the full
  // animated multiplication from the top — nothing skips straight to
  // the answer.
  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (reducedMotion) {
      // No staged animation: show every step and the verdict straight away.
      setStage(5);
      return;
    }
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
  }, [a, b, c, d, runToken, reducedMotion]);

  const handleReset = () => {
    setA(DEFAULTS.a);
    setB(DEFAULTS.b);
    setC(DEFAULTS.c);
    setD(DEFAULTS.d);
    setRunToken((k) => k + 1);
  };

  const fields = [
    { key: "a", label: "Numerator a", value: a, set: setA, color: DIAGONAL_COLORS.first.hex },
    { key: "c", label: "Numerator c", value: c, set: setC, color: DIAGONAL_COLORS.second.hex },
    { key: "b", label: "Denominator b", value: b, set: setB, color: DIAGONAL_COLORS.second.hex },
    { key: "d", label: "Denominator d", value: d, set: setD, color: DIAGONAL_COLORS.first.hex },
  ];

  return (
    <div className="py-4">
      <SimulationLayout
        stageLabel="Cross-multiplication of two fractions"
        aspect={2.5}
        stageCap="14rem"
        stage={<CrossDiagram a={a} b={b} c={c} d={d} stage={stage} />}
        actions={
          <>
            <Button size="md" variant="secondary" onClick={() => setRunToken((k) => k + 1)}>
              <Play className="h-4 w-4" strokeWidth={2} />
              Replay animation
            </Button>
            <Button size="md" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
              Reset to 2/3 = 4/6
            </Button>
          </>
        }
        controls={
          <div className="flex min-w-0 flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-math">Cross-multiply to compare</p>
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                Two fractions are equivalent exactly when their cross products match.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 min-[420px]:grid-cols-2">
              {fields.map((f) => (
                <NumberField key={f.key} value={f.value} onChange={f.set} color={f.color} label={f.label} />
              ))}
            </div>
            <div className="min-h-[5.5rem] w-full">
              <ProductTrail a={a} b={b} c={c} d={d} stage={stage} />
            </div>
            <div className="min-h-[6rem] w-full">
              <div className="flex justify-center">
                <ResultBanner productFirst={a * d} productSecond={b * c} visible={stage >= 5} />
              </div>
            </div>
            <Legend />
          </div>
        }
      />
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
