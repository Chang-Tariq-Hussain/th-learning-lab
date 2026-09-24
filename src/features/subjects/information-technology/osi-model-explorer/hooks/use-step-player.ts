"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PlaySpeed = 0.5 | 1 | 1.5 | 2;

const BASE_STEP_DURATION_MS = 1600;

export interface StepPlayer {
  stepIndex: number;
  isPlaying: boolean;
  isFinished: boolean;
  speed: PlaySpeed;
  setSpeed: (speed: PlaySpeed) => void;
  playPause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  playLabel: string;
}

/**
 * Drives a fixed-length step sequence (by count, not the steps' own
 * data — callers pass their own array only to size this and to reset
 * automatically if it changes) with play/pause/step-forward/step-back/
 * reset/speed controls. Mirrors the convention used by the CPU/RAM
 * data-flow, CPU architecture, and Deadlock simulations, kept as its
 * own small copy here rather than a shared import since each of those
 * also keeps its own — the hook is a handful of lines and each
 * simulation's `FlowStep`-equivalent type differs.
 */
export function useStepPlayer(stepCount: number): StepPlayer {
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
  }, [stepCount]);

  const isFinished = stepIndex >= stepCount - 1;

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= stepCount - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, stepCount - 1));
    }, BASE_STEP_DURATION_MS / speed);
    return clearTimer;
  }, [isPlaying, stepIndex, stepCount, speed, clearTimer]);

  const playPause = () => {
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
    setStepIndex((i) => (i === -1 ? 0 : Math.min(i + 1, stepCount - 1)));
  };

  const stepBack = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex((i) => Math.max(-1, i - 1));
  };

  const reset = () => {
    clearTimer();
    setIsPlaying(false);
    setStepIndex(-1);
  };

  const playLabel = stepIndex === -1 ? "Play" : isFinished && !isPlaying ? "Replay" : isPlaying ? "Pause" : "Resume";

  return {
    stepIndex,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    playPause,
    stepForward,
    stepBack,
    reset,
    playLabel,
  };
}
