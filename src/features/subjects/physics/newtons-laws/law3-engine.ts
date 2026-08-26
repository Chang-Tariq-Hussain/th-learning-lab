"use client";

import {
  useSimulation,
  type FrameInfo,
  type ParameterValues,
} from "@/features/simulation";
import { useEffect, useRef, useState } from "react";
import {
  createCollisionRig,
  createSkatersRig,
  createSpringLaunchRig,
  createThrustRig,
  launchCollision,
  pushSkaters,
  releaseSpring,
  resetSpring,
  resolveFriction,
  resolveGravity,
  type CollisionRig,
  type Law3ScenarioKey,
  type SkatersRig,
  type SpringLaunchRig,
  type ThrustRig,
} from "./physics";

export type Law3Rig = SkatersRig | ThrustRig | CollisionRig | SpringLaunchRig;

function buildRig(kind: Law3ScenarioKey): Law3Rig {
  switch (kind) {
    case "skaters":
      return createSkatersRig();
    case "rocket":
      return createThrustRig("rocket");
    case "balloon":
      return createThrustRig("balloon");
    case "collision":
      return createCollisionRig();
    case "spring":
      return createSpringLaunchRig();
  }
}

export interface Law3Engine {
  rig: Law3Rig;
  scenario: Law3ScenarioKey;
  setScenario: (kind: Law3ScenarioKey) => void;
  /** Scenario-specific primary action: push (skaters), toggle thrust (rocket/balloon), launch (collision), release (spring). */
  primaryAction: () => void;
  reset: () => void;
}

/**
 * Owns whichever Law 3 rig is currently selected, steps its `World`
 * once a frame (only while that scenario is visible — `active` gates
 * this so switching tabs doesn't burn cycles on an off-screen rig), and
 * rebuilds the rig from scratch whenever the scenario key changes,
 * since — unlike Law 1/2's single shared cart — the four Law 3 setups
 * are genuinely different `World`s (different body counts, different
 * forces), not the same rig with different parameters.
 */
export function useLaw3Engine(active: boolean, initialScenario: Law3ScenarioKey = "skaters"): Law3Engine {
  const [scenario, setScenarioState] = useState<Law3ScenarioKey>(initialScenario);
  const rigRef = useRef<Law3Rig>(buildRig(scenario));
  const [, forceRender] = useState(0);

  const setScenario = (kind: Law3ScenarioKey) => {
    if (kind === scenario) return;
    rigRef.current = buildRig(kind);
    setScenarioState(kind);
    forceRender((n) => n + 1);
  };

  const { subscribeFrame } = useSimulation();

  // `subscribeFrame` is referentially stable (it only changes if the
  // underlying animation engine instance changes), so the effect below
  // subscribes exactly once. That means the callback it registers must
  // never close over `active` directly — a plain closure would freeze
  // at whatever `active` was on that first render and never update
  // again. Mirroring it into a ref (updated on every render, before the
  // frame subscription reads it) is the standard fix.
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      if (!activeRef.current) return;
      rigRef.current.world.step(frame.deltaTime);
    });
  }, [subscribeFrame]);

  const reset = () => {
    rigRef.current = buildRig(scenario);
    forceRender((n) => n + 1);
  };

  const primaryAction = () => {
    const rig = rigRef.current;
    switch (rig.kind) {
      case "skaters": {
        // Impulse scaled by mass so the *speed* imparted stays sensible
        // regardless of how heavy the skaters currently are.
        const impulseMagnitude = 4 * Math.min(rig.state.massA, rig.state.massB);
        pushSkaters(rig, impulseMagnitude);
        forceRender((n) => n + 1);
        return;
      }
      case "rocket":
      case "balloon":
        rig.state.thrustOn = !rig.state.thrustOn;
        forceRender((n) => n + 1);
        return;
      case "collision":
        launchCollision(rig);
        forceRender((n) => n + 1);
        return;
      case "spring":
        if (rig.released) {
          resetSpring(rig);
        } else {
          releaseSpring(rig);
        }
        forceRender((n) => n + 1);
        return;
    }
  };

  return { rig: rigRef.current, scenario, setScenario, primaryAction, reset };
}

/** Pushes live slider/dropdown values into whichever rig is active — same role as `syncCartState`. */
export function syncLaw3State(rig: Law3Rig, values: ParameterValues): void {
  const gravity = resolveGravity(
    String(values.gravityPreset ?? "earth"),
    Number(values.customGravity ?? 9.81),
  );

  switch (rig.kind) {
    case "skaters": {
      const massA = Number(values.massA ?? rig.state.massA);
      const massB = Number(values.massB ?? rig.state.massB);
      rig.state.massA = massA;
      rig.state.massB = massB;
      rig.state.gravity = gravity;
      if (rig.skaterA.mass !== massA) {
        rig.skaterA.mass = massA;
        rig.skaterA.invMass = massA > 0 ? 1 / massA : 0;
      }
      if (rig.skaterB.mass !== massB) {
        rig.skaterB.mass = massB;
        rig.skaterB.invMass = massB > 0 ? 1 / massB : 0;
      }
      return;
    }
    case "rocket":
    case "balloon": {
      const mass = Number(values.mass ?? rig.state.mass);
      const thrust = Number(values.thrust ?? rig.state.thrust);
      const surfaceKey = String(values.surface ?? "wood");
      rig.state.mass = mass;
      rig.state.thrust = thrust;
      rig.state.gravity = gravity;
      rig.state.frictionCoefficient =
        surfaceKey === "custom"
          ? Number(values.frictionCoefficient ?? 0.02)
          : resolveFriction(surfaceKey, 0);
      if (rig.body.mass !== mass) {
        rig.body.mass = mass;
        rig.body.invMass = mass > 0 ? 1 / mass : 0;
      }
      return;
    }
    case "collision": {
      rig.state.massA = Number(values.massA ?? rig.state.massA);
      rig.state.massB = Number(values.massB ?? rig.state.massB);
      rig.state.speedA = Number(values.speedA ?? rig.state.speedA);
      rig.state.restitution = Number(
        values.restitution ?? rig.state.restitution,
      );
      return; // applied on next launchCollision() call, not continuously — see physics.ts's launchCollision
    }
    case "spring": {
      rig.state.mass = Number(values.mass ?? rig.state.mass);
      rig.state.stiffness = Number(
        values.springStiffness ?? rig.state.stiffness,
      );
      rig.state.compression = Number(
        values.compression ?? rig.state.compression,
      );
      if (!rig.released) {
        rig.spring.stiffness = rig.state.stiffness;
        rig.cart.position.set(rig.spring.restLength - rig.state.compression, 0);
      }
      return;
    }
  }
}

export interface Law3Readouts {
  kind: Law3ScenarioKey;
  velocityA: number;
  velocityB: number;
  momentumA: number;
  momentumB: number;
  totalMomentum: number;
  forceOnA: number;
  forceOnB: number;
  extra?: string;
}

/** One combined readout shape covering all five scenarios — the Data Panel picks which fields to show per scenario. */
export function computeLaw3Readouts(rig: Law3Rig): Law3Readouts {
  switch (rig.kind) {
    case "skaters":
      return {
        kind: "skaters",
        velocityA: rig.skaterA.velocity.x,
        velocityB: rig.skaterB.velocity.x,
        momentumA: rig.skaterA.momentum.x,
        momentumB: rig.skaterB.momentum.x,
        totalMomentum: rig.skaterA.momentum.x + rig.skaterB.momentum.x,
        forceOnA: 0,
        forceOnB: 0,
        extra:
          rig.momentumAtPush !== null
            ? `${rig.momentumAtPush.toFixed(1)} kg·m/s at push`
            : undefined,
      };
    case "rocket":
    case "balloon": {
      const thrustForce = rig.state.thrustOn ? rig.state.thrust : 0;
      return {
        kind: rig.kind,
        velocityA: rig.body.velocity.x,
        velocityB: 0,
        momentumA: rig.body.momentum.x,
        momentumB: 0,
        totalMomentum: rig.body.momentum.x,
        forceOnA: thrustForce,
        forceOnB: -thrustForce,
        extra: rig.state.thrustOn
          ? "Thrust on — exhaust pushes back exactly as hard"
          : "Thrust off",
      };
    }
    case "collision":
      return {
        kind: "collision",
        velocityA: rig.ballA.velocity.x,
        velocityB: rig.ballB.velocity.x,
        momentumA: rig.ballA.momentum.x,
        momentumB: rig.ballB.momentum.x,
        totalMomentum: rig.ballA.momentum.x + rig.ballB.momentum.x,
        forceOnA: 0,
        forceOnB: 0,
        extra: rig.lastCollision
          ? `Before: ${rig.lastCollision.momentumBefore.toFixed(1)} · After: ${rig.lastCollision.momentumAfter.toFixed(1)} kg·m/s`
          : undefined,
      };
    case "spring": {
      const springForce = rig.spring.extension * -rig.spring.stiffness;
      return {
        kind: "spring",
        velocityA: rig.cart.velocity.x,
        velocityB: 0,
        momentumA: rig.cart.momentum.x,
        momentumB: 0,
        totalMomentum: rig.cart.momentum.x,
        forceOnA: springForce,
        forceOnB: -springForce,
        extra: `Spring PE: ${rig.spring.potentialEnergy.toFixed(1)} J`,
      };
    }
  }
}

/** Throttled (~10Hz) React mirror of the active Law 3 rig, for the Data Panel — same shape/purpose as `useCartSnapshot`. */
export function useLaw3Snapshot(engine: Law3Engine, values: ParameterValues, intervalMs = 100): Law3Readouts {
  const { subscribeFrame, status, time } = useSimulation();
  const [readouts, setReadouts] = useState<Law3Readouts>(() => computeLaw3Readouts(engine.rig));
  const lastSyncRef = useRef(0);

  // `values` is a fresh object every render, but this effect only
  // re-subscribes when `engine.rig`/`subscribeFrame`/`intervalMs`
  // change (i.e. roughly "once per scenario switch") — so the frame
  // callback must read live values through a ref, not close over the
  // `values` param directly, or slider edits made mid-playback would
  // silently stop reaching the physics until the next scenario switch.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      syncLaw3State(engine.rig, valuesRef.current);
      if (frame.time - lastSyncRef.current < intervalMs / 1000 && frame.frameCount > 1) return;
      lastSyncRef.current = frame.time;
      setReadouts(computeLaw3Readouts(engine.rig));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribeFrame, engine.rig, intervalMs]);

  useEffect(() => {
    if (status === "playing") return;
    syncLaw3State(engine.rig, values);
    setReadouts(computeLaw3Readouts(engine.rig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, status, engine.rig, time]);

  return readouts;
}
