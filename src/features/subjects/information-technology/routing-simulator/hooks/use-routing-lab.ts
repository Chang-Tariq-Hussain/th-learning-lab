"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { currentStep, initialState, isInFlight, labReducer, tablesOf, type LabState, type Mode } from "../lab-state";
import type { PlanStep, RoutingTables, ScenarioId, StaticRouteSeed, StepKind } from "../model";

/** How long each step stays on screen in Auto Run (ms). Steps with more to read stay longer. */
const STEP_MS: Record<StepKind, number> = {
  create: 1200,
  determine: 2600,
  "to-gateway": 1700,
  receive: 1500,
  lookup: 2600,
  select: 2600,
  forward: 1900,
  drop: 1500,
  deliver: 1500,
};

export interface RoutingLab {
  state: LabState;
  tables: RoutingTables;
  step: PlanStep | null;
  inFlight: boolean;
  send: (src: string, dstIp: string) => void;
  next: () => void;
  play: () => void;
  pause: () => void;
  cancel: () => void;
  reset: () => void;
  setScenario: (id: ScenarioId, seeds?: StaticRouteSeed[]) => void;
  addRoute: (seed: StaticRouteSeed) => void;
  removeRoute: (router: string, dest: string, prefix: number) => void;
  clearRoutes: (router: string) => void;
  setMode: (mode: Mode) => void;
  viewRouter: (router: string) => void;
  clearLog: () => void;
}

/**
 * All lab state lives in one reducer. The only timer is the Auto Run timeout, which exists only while a packet is
 * playing, is re-armed after each step, and is cleared on pause, cancel, reset and unmount.
 */
export function useRoutingLab(): RoutingLab {
  const [state, dispatch] = useReducer(labReducer, undefined, () => initialState());
  const inFlight = isInFlight(state);
  const step = currentStep(state);
  const stepKind = step?.kind;
  const planId = state.plan;

  useEffect(() => {
    if (!state.playing || !inFlight || !stepKind) return;
    const id = window.setTimeout(() => dispatch({ type: "next", now: Date.now() }), STEP_MS[stepKind]);
    return () => window.clearTimeout(id);
  }, [state.playing, inFlight, stepKind, state.idx, planId]);

  const { scenarioId, seeds } = state;
  const tables = useMemo(() => tablesOf({ scenarioId, seeds }), [scenarioId, seeds]);

  const send = useCallback((src: string, dst: string) => dispatch({ type: "send", src, dst, now: Date.now() }), []);
  const next = useCallback(() => dispatch({ type: "next", now: Date.now() }), []);
  const play = useCallback(() => dispatch({ type: "play" }), []);
  const pause = useCallback(() => dispatch({ type: "pause" }), []);
  const cancel = useCallback(() => dispatch({ type: "cancel", now: Date.now() }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const setScenario = useCallback((id: ScenarioId, seeds?: StaticRouteSeed[]) => dispatch({ type: "set-scenario", id, seeds, now: Date.now() }), []);
  const addRoute = useCallback((seed: StaticRouteSeed) => dispatch({ type: "add-route", seed, now: Date.now() }), []);
  const removeRoute = useCallback((router: string, dest: string, prefix: number) => dispatch({ type: "remove-route", router, dest, prefix, now: Date.now() }), []);
  const clearRoutes = useCallback((router: string) => dispatch({ type: "clear-routes", router, now: Date.now() }), []);
  const setMode = useCallback((mode: Mode) => dispatch({ type: "set-mode", mode }), []);
  const viewRouter = useCallback((router: string) => dispatch({ type: "view-router", router }), []);
  const clearLog = useCallback(() => dispatch({ type: "clear-log" }), []);

  return useMemo(
    () => ({ state, tables, step, inFlight, send, next, play, pause, cancel, reset, setScenario, addRoute, removeRoute, clearRoutes, setMode, viewRouter, clearLog }),
    [state, tables, step, inFlight, send, next, play, pause, cancel, reset, setScenario, addRoute, removeRoute, clearRoutes, setMode, viewRouter, clearLog],
  );
}
