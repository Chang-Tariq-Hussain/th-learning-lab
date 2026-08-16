"use client";

import {
  useSimulation,
  type FrameInfo,
  type ParameterValues,
} from "@/features/simulation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeCartReadouts,
  createCartRig,
  OBJECT_PRESETS,
  resolveFriction,
  resolveGravity,
  type CartReadouts,
  type CartRig,
} from "./physics";

export interface CartTrailSample {
  t: number;
  x: number;
  v: number;
  a: number;
}

export interface CartEngine {
  rig: CartRig;
  /** Whether a continuous applied force is currently being exerted — toggled by the "Apply force" / "Remove force" buttons, not a slider. Real state (not a ref) so the buttons' disabled-state updates immediately, including while paused. */
  forceOn: boolean;
  setForceOn: (on: boolean) => void;
  reset: () => void;
}

/**
 * Creates the cart rig once, keeps its live `state` in sync with the
 * simulation framework's parameter values every tick, and steps
 * `world.step(dt)` once a frame — the exact pattern the engine's own
 * README describes for how a future simulation should drive it. Runs
 * for the lifetime of the component (both Law 1 and Law 2 share one
 * instance, since they're the same physical rig).
 */
export function useCartEngine(): CartEngine {
  const rigRef = useRef<CartRig>();
  if (!rigRef.current) rigRef.current = createCartRig();
  const rig = rigRef.current;

  const [forceOn, setForceOnState] = useState(false);
  const setForceOn = (on: boolean) => {
    rig.state.forceOn = on;
    setForceOnState(on);
  };

  const { subscribeFrame } = useSimulation();

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      rig.world.step(frame.deltaTime);
    });
  }, [subscribeFrame, rig]);

  const reset = () => {
    rig.world.reset();
    rig.state.forceOn = false;
    setForceOnState(false);
  };

  return { rig, forceOn, setForceOn, reset };
}

/**
 * Reads live parameter values into the rig's `state` every tick — kept
 * separate from `useCartEngine` so it can be called from the component
 * that actually has `values` in scope (the framework passes `values`
 * into the canvas render callback and to `onTick`, not as a standalone
 * hook), without the engine hook itself depending on React context.
 */
export function syncCartState(rig: CartRig, values: ParameterValues): void {
  rig.state.mass = Number(values.mass ?? rig.state.mass);
  rig.state.appliedForce = Number(
    values.appliedForce ?? rig.state.appliedForce,
  );
  rig.state.frictionEnabled = values.frictionEnabled !== "off";
  const surfaceKey = String(values.surface ?? "wood");
  rig.state.frictionCoefficient =
    surfaceKey === "custom"
      ? Number(values.frictionCoefficient ?? rig.state.frictionCoefficient)
      : resolveFriction(surfaceKey, 0);
  rig.friction.kinetic = rig.state.frictionCoefficient;
  rig.friction.staticCoefficient = rig.state.frictionCoefficient * 1.2;
  rig.state.gravity = resolveGravity(
    String(values.gravityPreset ?? "earth"),
    Number(values.customGravity ?? 9.81),
  );

  // The Object selector (box/crate/sled) doesn't change the physics —
  // students set mass directly with its own slider — but it should at
  // least change what they're looking at, or the control is just
  // decorative. `userData` is the engine's own extension point for
  // exactly this (see `render/renderer-adapter.ts`'s `StyleResolver`).
  const objectPreset =
    OBJECT_PRESETS.find((o) => o.key === String(values.objectPreset ?? "box")) ?? OBJECT_PRESETS[0]!;
  rig.cart.userData.color = objectPreset.color;
  rig.cart.userData.label = objectPreset.label;

  // Mass can change live (slider), so keep invMass in sync — RigidBody
  // only computes this once in its constructor.
  if (rig.cart.mass !== rig.state.mass) {
    rig.cart.mass = rig.state.mass;
    rig.cart.invMass = rig.state.mass > 0 ? 1 / rig.state.mass : 0;
  }
}

export interface CartSnapshot {
  readouts: CartReadouts;
  trail: CartTrailSample[];
}

const EMPTY_READOUTS: CartReadouts = {
  mass: 0,
  velocity: 0,
  acceleration: 0,
  momentum: 0,
  netForce: 0,
  weight: 0,
  normalForce: 0,
  appliedForce: 0,
  frictionForce: 0,
  elapsedTime: 0,
  distance: 0,
};

const MAX_TRAIL_SAMPLES = 600;

/**
 * Throttled (~10Hz) mirror of the cart's state into React, for the Data
 * Panel and the five Law 2 graphs — the canvas itself reads `rig`
 * directly every animation frame instead of through this hook, since it
 * doesn't need to re-render React to draw.
 */
export function useCartSnapshot(engine: CartEngine, values: ParameterValues, intervalMs = 100): CartSnapshot {
  const { subscribeFrame, time, status } = useSimulation();
  const [snapshot, setSnapshot] = useState<CartSnapshot>({
    readouts: EMPTY_READOUTS,
    trail: [],
  });
  const trailRef = useRef<CartTrailSample[]>([]);
  const lastSyncRef = useRef(0);
  const startXRef = useRef(0);
  const lastResetTimeRef = useRef(-1);

  // See the matching comment in `law3-engine.ts`'s `useLaw3Snapshot`:
  // don't close over `values` directly in the per-frame callback below
  // — read it through a ref that's kept current every render instead,
  // so live slider edits reach the physics immediately during playback
  // regardless of how often this effect happens to re-subscribe.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      syncCartState(engine.rig, valuesRef.current);

      if (frame.time < lastResetTimeRef.current || frame.frameCount <= 1) {
        trailRef.current = [];
        startXRef.current = engine.rig.cart.position.x;
      }
      lastResetTimeRef.current = frame.time;

      if (frame.time - lastSyncRef.current < intervalMs / 1000 && frame.frameCount > 1) return;
      lastSyncRef.current = frame.time;

      const distance = Math.abs(engine.rig.cart.position.x - startXRef.current);
      const readouts = computeCartReadouts(engine.rig, frame.time, distance);

      trailRef.current = [
        ...trailRef.current,
        {
          t: Number(frame.time.toFixed(2)),
          x: engine.rig.cart.position.x,
          v: readouts.velocity,
          a: readouts.acceleration,
        },
      ].slice(-MAX_TRAIL_SAMPLES);

      setSnapshot({ readouts, trail: trailRef.current });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeFrame, engine.rig, intervalMs]);

  // Keep the panel accurate immediately after a parameter tweak while paused, matching SimulationCanvas's own "redraw while paused" behavior.
  useEffect(() => {
    if (status === "playing") return;
    syncCartState(engine.rig, values);
    const distance = Math.abs(engine.rig.cart.position.x - startXRef.current);
    setSnapshot((prev) => ({
      ...prev,
      readouts: computeCartReadouts(engine.rig, time, distance),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, status]);

  return useMemo(() => snapshot, [snapshot]);
}
