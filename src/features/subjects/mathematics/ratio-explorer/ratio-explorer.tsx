"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircleField } from "./components/circle-field";
import { ObjectControls } from "./components/object-controls";
import { ExplanationPanel } from "./components/explanation-panel";
import { challengeKey, nextChallenge, type RatioChallenge } from "./challenges";
import { MAX_OBJECTS, type ObjectColor } from "./colors";
import { ratiosMatch } from "./ratio-utils";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;
const DEFAULT_BLUE = 4;
const DEFAULT_RED = 6;

export function RatioExplorer() {
  const [blueCount, setBlueCount] = useState(DEFAULT_BLUE);
  const [redCount, setRedCount] = useState(DEFAULT_RED);
  const [challenge, setChallenge] = useState<RatioChallenge | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The only place practice-mode success is checked. Matches on the
  // simplified ratio (e.g. 6:4 satisfies a target of 3:2) rather than
  // exact counts, since "make a ratio of 3 : 2" is a statement about
  // the ratio itself, not one specific pair of counts.
  useEffect(() => {
    if (!challenge || celebrating) return;
    if (!ratiosMatch(blueCount, redCount, challenge.a, challenge.b)) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      setChallenge((prev) => nextChallenge(prev ? challengeKey(prev) : undefined));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueCount, redCount, challenge, celebrating]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAdd = (color: ObjectColor) => {
    const setter = color === "blue" ? setBlueCount : setRedCount;
    setter((prev) => Math.min(MAX_OBJECTS, prev + 1));
  };

  const handleRemove = (color: ObjectColor) => {
    const setter = color === "blue" ? setBlueCount : setRedCount;
    setter((prev) => Math.max(0, prev - 1));
  };

  const handleStartPractice = () => setChallenge(nextChallenge());
  const handleNewChallenge = () => setChallenge((prev) => nextChallenge(prev ? challengeKey(prev) : undefined));
  const handleStopPractice = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCelebrating(false);
    setChallenge(null);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setBlueCount(DEFAULT_BLUE);
    setRedCount(DEFAULT_RED);
    setChallenge(null);
    setCelebrating(false);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <ObjectControls blueCount={blueCount} redCount={redCount} onAdd={handleAdd} onRemove={handleRemove} />

        <CircleField
          blueCount={blueCount}
          redCount={redCount}
          celebrating={celebrating}
          confettiKey={confettiKey}
        />

        <ExplanationPanel
          blueCount={blueCount}
          redCount={redCount}
          challenge={challenge}
          celebrating={celebrating}
          onStartPractice={handleStartPractice}
          onNewChallenge={handleNewChallenge}
          onStopPractice={handleStopPractice}
        />
      </div>

      <div className="flex justify-center">
        <Button size="lg" variant="ghost" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={2} />
          Reset
        </Button>
      </div>
    </div>
  );
}
