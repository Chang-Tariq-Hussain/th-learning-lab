"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useAnimation } from "../hooks/use-animation";
import { useSimulationParameters } from "../hooks/use-simulation-parameters";
import { SimulationEventEmitter } from "../utils/event-emitter";
import type {
  FrameInfo,
  ParameterSchema,
  ParameterValues,
  PlaybackStatus,
  SimulationUpdateFn,
  SpeedMultiplier,
} from "../types";

export interface SimulationContextValue {
  // parameters
  schema: ParameterSchema;
  values: ParameterValues;
  setNumeric: (key: string, value: number) => void;
  setSelect: (key: string, value: string) => void;
  resetParameters: () => void;
  resetParameter: (key: string) => void;

  // playback / time
  status: PlaybackStatus;
  time: number;
  frameCount: number;
  speed: SpeedMultiplier;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  step: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;

  /** Reset both playback time and parameters back to their defaults. */
  resetAll: () => void;

  /**
   * Register a per-frame listener that runs on the same shared
   * `requestAnimationFrame` loop as the simulation's own `onTick` —
   * used by `SimulationCanvas` to draw every frame without spinning up
   * a second animation loop. Returns an unsubscribe function.
   */
  subscribeFrame: (listener: (frame: FrameInfo) => void) => () => void;

  /** Emit/subscribe to simulation-specific events (collisions, thresholds, etc.) */
  events: SimulationEventEmitter;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export interface SimulationProviderProps {
  schema: ParameterSchema;
  /**
   * Called on every animation frame with timing info and the live
   * parameter values. This is where a concrete simulation advances its
   * own physics/chemistry/biology/math state — the framework never
   * looks inside this function.
   */
  onTick?: SimulationUpdateFn;
  initialSpeed?: SpeedMultiplier;
  displaySyncIntervalMs?: number;
  children: React.ReactNode;
}

/**
 * The reusable simulation state manager. Wrap any simulation's UI in
 * this provider and every framework component (ControlPanel,
 * ParameterSlider, PlaybackControls, SpeedController, SimulationCanvas...)
 * can read/drive shared state via `useSimulation()`, with no prop drilling
 * and no simulation-specific plumbing.
 */
export function SimulationProvider({
  schema,
  onTick,
  initialSpeed = 1,
  displaySyncIntervalMs = 100,
  children,
}: SimulationProviderProps) {
  const parameters = useSimulationParameters(schema);

  // onTick fires outside React's render cycle, so read the latest
  // parameter values from a ref rather than closing over stale state.
  const valuesRef = useRef(parameters.values);
  valuesRef.current = parameters.values;

  const handleTick = useCallback<Parameters<typeof useAnimation>[0]["onTick"]>(
    (frame) => {
      onTick?.(frame, valuesRef.current);
    },
    [onTick]
  );

  const animation = useAnimation({
    onTick: handleTick,
    initialSpeed,
    displaySyncIntervalMs,
  });

  const eventsRef = useRef<SimulationEventEmitter>();
  if (!eventsRef.current) {
    eventsRef.current = new SimulationEventEmitter();
  }

  const resetAll = useCallback(() => {
    animation.reset();
    parameters.resetToDefaults();
  }, [animation, parameters]);

  const subscribeFrame = useCallback(
    (listener: (frame: FrameInfo) => void) => animation.engine.subscribe(listener),
    [animation.engine]
  );

  const value = useMemo<SimulationContextValue>(
    () => ({
      schema,
      values: parameters.values,
      setNumeric: parameters.setNumeric,
      setSelect: parameters.setSelect,
      resetParameters: parameters.resetToDefaults,
      resetParameter: parameters.resetOne,

      status: animation.status,
      time: animation.time,
      frameCount: animation.frameCount,
      speed: animation.speed,
      play: animation.play,
      pause: animation.pause,
      toggle: animation.toggle,
      step: animation.step,
      setSpeed: animation.setSpeed,

      resetAll,
      subscribeFrame,
      events: eventsRef.current as SimulationEventEmitter,
    }),
    [schema, parameters, animation, resetAll, subscribeFrame]
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

/** Access shared simulation state from any descendant of `SimulationProvider`. */
export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error("useSimulation() must be used inside a <SimulationProvider>.");
  }
  return ctx;
}
