"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { initialState, isInFlight, labReducer, type LabState, type Mode } from "../lab-state";
import type { AgingSpeed, DeviceId, DstChoice } from "../model";

/** How long each stage stays on screen in Auto Run (ms). Stages 6–7 move the frame, so they get a little longer. */
const STAGE_MS: Record<number, number> = { 1: 1100, 2: 1100, 3: 1300, 4: 1300, 5: 1400, 6: 1500 };
const TICK_MS = 500;

export interface SwitchLab {
  state: LabState;
  inFlight: boolean;
  send: (src: DeviceId, dst: DstChoice) => void;
  next: () => void;
  play: () => void;
  pause: () => void;
  cancel: () => void;
  reset: () => void;
  clearTable: () => void;
  setPort: (port: number, enabled: boolean) => void;
  setSpeed: (speed: AgingSpeed) => void;
  setMode: (mode: Mode) => void;
  skip: (seconds: number) => void;
  clearLog: () => void;
}

/**
 * All lab state lives in one reducer so it survives re-renders. Two timers exist and both are cleaned up:
 *  - an Auto Run timer that advances the current frame one stage at a time (only while playing), and
 *  - the MAC-aging clock, which ticks only while the table has entries, aging is not paused and no frame is in flight.
 */
export function useSwitchLab(): SwitchLab {
  const [state, dispatch] = useReducer(labReducer, undefined, () => initialState());
  const inFlight = isInFlight(state);
  const stage = state.tx?.stage ?? 0;
  const txId = state.tx?.id;

  // Auto Run: one timeout per stage; re-armed after each stage change.
  useEffect(() => {
    if (!state.playing || !inFlight) return;
    const id = window.setTimeout(() => dispatch({ type: "next", now: Date.now() }), STAGE_MS[stage] ?? 1200);
    return () => window.clearTimeout(id);
  }, [state.playing, inFlight, stage, txId]);

  // Aging clock.
  const hasEntries = state.table.length > 0;
  const speed = state.speed;
  useEffect(() => {
    if (speed === 0 || !hasEntries || inFlight) return;
    const id = window.setInterval(() => dispatch({ type: "tick", dtSec: (TICK_MS / 1000) * speed, now: Date.now() }), TICK_MS);
    return () => window.clearInterval(id);
  }, [speed, hasEntries, inFlight]);

  const send = useCallback((src: DeviceId, dst: DstChoice) => dispatch({ type: "send", src, dst, now: Date.now() }), []);
  const next = useCallback(() => dispatch({ type: "next", now: Date.now() }), []);
  const play = useCallback(() => dispatch({ type: "play" }), []);
  const pause = useCallback(() => dispatch({ type: "pause" }), []);
  const cancel = useCallback(() => dispatch({ type: "cancel", now: Date.now() }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const clearTable = useCallback(() => dispatch({ type: "clear-table", now: Date.now() }), []);
  const setPort = useCallback((port: number, enabled: boolean) => dispatch({ type: "set-port", port, enabled, now: Date.now() }), []);
  const setSpeed = useCallback((s: AgingSpeed) => dispatch({ type: "set-speed", speed: s }), []);
  const setMode = useCallback((mode: Mode) => dispatch({ type: "set-mode", mode }), []);
  const skip = useCallback((seconds: number) => dispatch({ type: "skip", seconds, now: Date.now() }), []);
  const clearLog = useCallback(() => dispatch({ type: "clear-log" }), []);

  return useMemo(
    () => ({ state, inFlight, send, next, play, pause, cancel, reset, clearTable, setPort, setSpeed, setMode, skip, clearLog }),
    [state, inFlight, send, next, play, pause, cancel, reset, clearTable, setPort, setSpeed, setMode, skip, clearLog],
  );
}
