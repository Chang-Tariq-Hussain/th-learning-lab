"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProportionRow, type MissingSide } from "./components/proportion-row";
import { InsightPanel } from "./components/insight-panel";
import { ConfettiBurst } from "./components/confetti-burst";
import {
  cValue,
  challengeKey,
  correctValue,
  dValue,
  nextChallenge,
  startingGuess,
  type ProportionChallenge,
} from "./challenges";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

export function ProportionBuilder() {
  const [challenge, setChallenge] = useState<ProportionChallenge>(() => nextChallenge());
  const [guess, setGuess] = useState(() => startingGuess(challenge));
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solved = guess === correctValue(challenge);

  // The only place success is checked. `guess` only ever replaces the
  // one missing slot, so comparing it to the challenge's own computed
  // correct value is exact — no floating point, no ambiguity.
  useEffect(() => {
    if (!solved || celebrating) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      const next = nextChallenge(challengeKey(challenge));
      setChallenge(next);
      setGuess(startingGuess(next));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, celebrating]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const next = nextChallenge();
    setChallenge(next);
    setGuess(startingGuess(next));
    setCelebrating(false);
  };

  const c = challenge.missing === "c" ? guess : cValue(challenge);
  const d = challenge.missing === "d" ? guess : dValue(challenge);
  const row2MissingSide: MissingSide = challenge.missing === "c" ? "first" : "second";

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        <ConfettiBurst triggerKey={confettiKey} />
        <ProportionRow
          label="Ratio 1"
          first={challenge.a}
          second={challenge.b}
          missingSide={null}
          highlighted={celebrating}
        />
        <ProportionRow
          label="Ratio 2"
          first={c}
          second={d}
          missingSide={row2MissingSide}
          onGuessChange={setGuess}
          highlighted={celebrating}
        />
      </div>

      <InsightPanel a={challenge.a} b={challenge.b} solved={celebrating} k={challenge.k} />

      <Button size="lg" variant="ghost" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Reset
      </Button>
    </div>
  );
}
