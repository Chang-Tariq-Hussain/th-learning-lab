"use client";

import { useEffect, useRef, useState } from "react";
import { ChallengeBanner } from "./components/challenge-banner";
import { Pizza } from "./components/pizza";
import { SliceControls } from "./components/slice-controls";
import {
  SLICE_COUNTS,
  challengeKey,
  nextChallenge,
  nextSliceCount,
  previousSliceCount,
  type Challenge,
} from "./challenges";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

export function FractionPizza() {
  const [sliceCount, setSliceCount] = useState(1);
  const [selected, setSelected] = useState<boolean[]>([false]);
  const [challenge, setChallenge] = useState<Challenge>(() => nextChallenge());
  const [celebrating, setCelebrating] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The only place challenge success is checked. Deliberately does NOT
  // auto-cut the pizza to match a new challenge's denominator — reaching
  // the right slice count with Slice +/- is part of the exercise, not
  // something done for the student.
  useEffect(() => {
    const selectedCount = selected.filter(Boolean).length;
    if (selectedCount === 0) return;
    if (selectedCount !== challenge.selected || sliceCount !== challenge.total)
      return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      setSelected(Array(sliceCount).fill(false));
      setChallenge((prev) => nextChallenge(challengeKey(prev)));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, sliceCount]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleToggleSlice = (index: number) => {
    setSelected((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const handleIncrease = () => {
    const next = nextSliceCount(sliceCount);
    setSliceCount(next);
    setSelected(Array(next).fill(false));
  };

  const handleDecrease = () => {
    const next = previousSliceCount(sliceCount);
    setSliceCount(next);
    setSelected(Array(next).fill(false));
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSliceCount(1);
    setSelected([false]);
    setCelebrating(false);
    setChallenge((prev) => nextChallenge(challengeKey(prev)));
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <ChallengeBanner challenge={challenge} celebrating={celebrating} />

      <Pizza
        sliceCount={sliceCount}
        selected={selected}
        onToggleSlice={handleToggleSlice}
        celebrating={celebrating}
        confettiKey={confettiKey}
      />

      <SliceControls
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onReset={handleReset}
        canIncrease={sliceCount !== SLICE_COUNTS[SLICE_COUNTS.length - 1]}
        canDecrease={sliceCount !== SLICE_COUNTS[0]}
      />
    </div>
  );
}
