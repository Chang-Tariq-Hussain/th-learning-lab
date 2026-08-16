"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimationEngine } from "../engine/animation-engine";
import type { FrameInfo, PlaybackStatus, SpeedMultiplier } from "../types";

export interface UseAnimationOptions {
  /**
   * Called on every animation frame (up to 60/s). Intended for imperative
   * work — mutating refs, drawing to a canvas — NOT for setState, since
   * that would trigger a re-render on every frame.
   */
  onTick: (frame: FrameInfo) => void;
  initialSpeed?: SpeedMultiplier;
  /**
   * How often (ms) the reactive `time`/`frameCount` values exposed by this
   * hook are refreshed. UI chrome (a running clock, a frame counter) reads
   * these; they don't need to update 60 times a second to look smooth.
   * Set to 0 to sync every frame (only do this for lightweight UI).
   */
  displaySyncIntervalMs?: number;
}

export interface UseAnimationResult {
  status: PlaybackStatus;
  time: number;
  frameCount: number;
  speed: SpeedMultiplier;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  step: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;
  /** Escape hatch for advanced consumers that need the raw engine instance. */
  engine: AnimationEngine;
}

/**
 * React binding for `AnimationEngine`. One instance per simulation.
 *
 * Usage:
 * ```tsx
 * const anim = useAnimation({
 *   onTick: (frame) => updateMyRefsOrCanvas(frame),
 * });
 * ```
 */
export function useAnimation({
  onTick,
  initialSpeed = 1,
  displaySyncIntervalMs = 100,
}: UseAnimationOptions): UseAnimationResult {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [time, setTime] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [speed, setSpeedState] = useState<SpeedMultiplier>(initialSpeed);

  const engineRef = useRef<AnimationEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new AnimationEngine({
      onTick: (frame) => onTickRef.current(frame),
    });
    engineRef.current.setSpeed(initialSpeed);
  }
  const engine = engineRef.current;

  // Periodically pull time/frameCount/status from the engine into React
  // state so UI chrome can display them, without re-rendering every frame.
  useEffect(() => {
    if (displaySyncIntervalMs <= 0) return;
    const id = setInterval(() => {
      setTime(engine.getTime());
      setFrameCount(engine.getFrameCount());
      setStatus(engine.getStatus());
    }, displaySyncIntervalMs);
    return () => clearInterval(id);
  }, [engine, displaySyncIntervalMs]);

  useEffect(() => () => engine.destroy(), [engine]);

  const play = useCallback(() => {
    engine.play();
    setStatus("playing");
  }, [engine]);

  const pause = useCallback(() => {
    engine.pause();
    setStatus("paused");
  }, [engine]);

  const toggle = useCallback(() => {
    if (engine.getStatus() === "playing") {
      pause();
    } else {
      play();
    }
  }, [engine, play, pause]);

  const reset = useCallback(() => {
    engine.reset();
    setStatus("idle");
    setTime(0);
    setFrameCount(0);
  }, [engine]);

  const step = useCallback(() => {
    engine.step();
    setTime(engine.getTime());
    setFrameCount(engine.getFrameCount());
    setStatus(engine.getStatus());
  }, [engine]);

  const setSpeed = useCallback(
    (next: SpeedMultiplier) => {
      engine.setSpeed(next);
      setSpeedState(next);
    },
    [engine]
  );

  return useMemo(
    () => ({
      status,
      time,
      frameCount,
      speed,
      play,
      pause,
      toggle,
      reset,
      step,
      setSpeed,
      engine,
    }),
    [status, time, frameCount, speed, play, pause, toggle, reset, step, setSpeed, engine]
  );
}
