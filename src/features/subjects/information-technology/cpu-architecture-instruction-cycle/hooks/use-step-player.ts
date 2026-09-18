"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CycleStep } from "../model";

export type PlaySpeed = 0.5 | 1 | 1.5 | 2;

const BASE_STEP_DURATION_MS = 1400;

export interface StepPlayer {
  stepIndex: number;
  step: CycleStep | undefined;
  isPlaying: boolean;
  isFinished: boolean;
  speed: PlaySpeed;
  setSpeed: (speed: PlaySpeed) => void;
  playPause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  playLabel: string;
}

/** Drives a fixed `CycleStep[]` timeline with play/pause/step/reset/speed
 *  controls, mirroring the convention used by the CPU–RAM–Storage Data
 *  Flow lab's own step player. Resets automatically whenever `steps`
 *  changes reference (new program compiled/run). */
export function useStepPlayer(steps: CycleStep[]): StepPlayer {
  const [stepIndex, setStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaySpeed>(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    setStepIndex(-1);
    setIsPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  const isFinished = stepIndex >= steps.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, BASE_STEP_DURATION_MS / speed);
    return clearTimer;
  }, [isPlaying, stepIndex, steps.length, speed, clearTimer]);

  const playPause = () => {
    if (steps.length === 0) return;
    if (stepIndex === -1 || isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const stepForward = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex((i) => (i === -1 ? 0 : Math.min(i + 1, steps.length - 1)));
  };

  const stepBackward = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex((i) => Math.max(i - 1, -1));
  };

  const reset = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex(-1);
  };

  const goTo = (index: number) => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex(Math.max(-1, Math.min(index, steps.length - 1)));
  };

  const playLabel = stepIndex === -1 ? "Start" : isFinished && !isPlaying ? "Replay" : isPlaying ? "Pause" : "Resume";

  return {
    stepIndex,
    step: stepIndex >= 0 ? steps[stepIndex] : undefined,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    playPause,
    stepForward,
    stepBackward,
    goTo,
    reset,
    playLabel,
  };
}
