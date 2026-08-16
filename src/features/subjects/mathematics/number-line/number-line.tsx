"use client";

import { useEffect, useRef, useState } from "react";
import { nextChallenge, type Challenge } from "./challenges";
import { NumberLineTrack } from "./components/number-line-track";
import { InfoCard } from "./components/info-card";
import { useChime } from "./use-chime";

const CELEBRATION_MS = 1400;

export function NumberLine() {
  const [value, setValue] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(() => nextChallenge(0));
  const [confettiKey, setConfettiKey] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const playChime = useChime();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fires whenever the marker lands exactly on the current target — the
  // only thing that actually checks challenge success. Depends only on
  // `value` (not `challenge`) on purpose: we want this to run once per
  // *arrival* at a target, not re-run just because a new challenge was
  // generated while the marker happened to already be sitting on it.
  useEffect(() => {
    if (value !== challenge.target) return;

    setCelebrating(true);
    setConfettiKey((k) => k + 1);
    playChime();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
      setChallenge(nextChallenge(value));
    }, CELEBRATION_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setValue(0);
    setCelebrating(false);
    setChallenge(nextChallenge(0));
  };

  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <NumberLineTrack value={value} onChange={setValue} celebrating={celebrating} confettiKey={confettiKey} />
      <InfoCard value={value} challenge={challenge} justSucceeded={celebrating} onReset={handleReset} />
    </div>
  );
}
