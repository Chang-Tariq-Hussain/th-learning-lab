"use client";

import { useEffect, useRef, useState } from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScenarioScene } from "./components/scenario-scene";
import { answerValue, nextChallenge, type Challenge } from "./scenarios";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

export function RealLifeRatios() {
  const [challenge, setChallenge] = useState<Challenge>(() => nextChallenge());
  const [guess, setGuess] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const solved = guess > 0 && guess === answerValue(challenge);

  // The only place a correct guess is checked. Once solved, celebrate
  // and roll a brand new scenario + ratio a beat later.
  useEffect(() => {
    if (!solved || celebrating) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const next = nextChallenge(challenge.scenario.id);
      setChallenge(next);
      setGuess(0);
      setCelebrating(false);
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

  const handleNewScenario = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const next = nextChallenge(challenge.scenario.id);
    setChallenge(next);
    setGuess(0);
    setCelebrating(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-full max-w-2xl">
        <ScenarioScene
          challenge={challenge}
          guess={guess}
          onGuess={setGuess}
          solved={celebrating}
          confettiKey={confettiKey}
        />
      </div>

      <Button size="lg" variant="ghost" onClick={handleNewScenario}>
        <Shuffle className="h-4 w-4" strokeWidth={2} />
        New scenario
      </Button>
    </div>
  );
}
