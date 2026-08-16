"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatioBox } from "./components/ratio-box";
import { InsightPanel } from "./components/insight-panel";
import { ConfettiBurst } from "./components/confetti-burst";
import { challengeKey, nextChallenge, randomScale, type RatioTarget } from "./challenges";
import { isEquivalent } from "./ratio-utils";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

const DEFAULT_A = { a: 2, b: 3 };
const DEFAULT_B = { a: 4, b: 6 };

export function RatioComparison() {
  const [aA, setAA] = useState(DEFAULT_A.a);
  const [bA, setBA] = useState(DEFAULT_A.b);
  const [aB, setAB] = useState(DEFAULT_B.a);
  const [bB, setBB] = useState(DEFAULT_B.b);
  const [challenge, setChallenge] = useState<RatioTarget | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const equivalent = isEquivalent(aA, bA, aB, bB);

  // The only place practice-mode success is checked. Ratio A is locked
  // to the target while a challenge is active, so this only needs to
  // watch Ratio B against it.
  useEffect(() => {
    if (!challenge || celebrating) return;
    if (!equivalent) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      startChallenge(challengeKey(challenge));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equivalent, challenge, celebrating]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startChallenge = (excludeId?: number) => {
    const target = nextChallenge(excludeId);
    const scale = randomScale();
    setAA(target.a * scale);
    setBA(target.b * scale);
    // A starting point for B that's deliberately not equivalent to the new target.
    setAB(target.b);
    setBB(target.a === target.b ? target.a + 1 : target.a);
    setChallenge(target);
  };

  const handleStopPractice = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCelebrating(false);
    setChallenge(null);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAA(DEFAULT_A.a);
    setBA(DEFAULT_A.b);
    setAB(DEFAULT_B.a);
    setBB(DEFAULT_B.b);
    setChallenge(null);
    setCelebrating(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <ConfettiBurst triggerKey={confettiKey} />
        <RatioBox
          label="Ratio A"
          a={aA}
          b={bA}
          onChangeA={setAA}
          onChangeB={setBA}
          matchState={challenge ? "idle" : equivalent ? "equivalent" : "different"}
          locked={!!challenge}
        />
        <RatioBox
          label="Ratio B"
          a={aB}
          b={bB}
          onChangeA={setAB}
          onChangeB={setBB}
          matchState={equivalent ? "equivalent" : "different"}
        />
      </div>

      <InsightPanel
        aA={aA}
        bA={bA}
        aB={aB}
        bB={bB}
        equivalent={equivalent}
        challenge={challenge}
        celebrating={celebrating}
        onStartPractice={() => startChallenge()}
        onNewChallenge={() => startChallenge(challenge ? challengeKey(challenge) : undefined)}
        onStopPractice={handleStopPractice}
      />

      <Button size="lg" variant="ghost" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Reset
      </Button>
    </div>
  );
}
