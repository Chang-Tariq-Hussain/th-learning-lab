"use client";

/**
 * The Orbit panel's physics — built entirely on the reusable engine
 * (`@/features/subjects/physics/engine`), exactly as that engine's own
 * module doc comment describes for "a future simulation": a `World`
 * holding two `RigidBody`s, `NewtonianGravity` as the one force
 * generator, and `world.step(dt)` called once a frame from
 * `subscribeFrame` — the identical wiring pattern
 * `newtons-laws/cart-engine.ts` and `newtons-laws/law3-engine.ts`
 * already use. No new integrator, force math, or physics engine is
 * introduced here; this file only composes the existing one.
 *
 * One deliberate adaptation: the engine's `isStatic` flag (used for
 * immovable bodies like a ground or wall) forces `mass = Infinity`,
 * which would make `NewtonianGravity`'s force calculation blow up for
 * a central body that needs a specific, adjustable finite mass. So the
 * central body is a normal (non-static) `RigidBody` that gets pinned
 * back to the origin every frame after `world.step()` runs — the same
 * "let the physics step run, then apply a manual position/velocity
 * correction" technique `cart-engine.ts`'s `clampToTrack` already uses
 * for its track walls, not a new pattern.
 */

import {
  useSimulation,
  type FrameInfo,
  type ParameterValues,
} from "@/features/simulation";
import { useEffect, useRef, useState } from "react";
import { NewtonianGravity, RigidBody, World, circle } from "../engine";
import {
  computeEscapeVelocity,
  computeGravitationalAcceleration,
  computeGravitationalForce,
  computeOrbitalSpeed,
} from "./physics";

/** Idealized G for the Orbit panel's toy units — see `physics.ts`'s doc comment on why this differs from `G_REAL`. */
export const ORBIT_G = 1;
/** Comparatively large softening (relative to the toy-unit body radii below) so a straight-in fall toward the center doesn't spike toward a numerical singularity — the same purpose the engine's own `NewtonianGravity.softening` doc comment describes. */
const SOFTENING = 0.5;
const CENTRAL_RADIUS = 0.5;
const SATELLITE_RADIUS = 0.22;
/** Distance beyond which the satellite is considered to have escaped rather than merely being on a wide orbit. */
const ESCAPE_DISTANCE = 30;
const TRAIL_MAX_POINTS = 400;

export type OrbitFlightStatus = "flying" | "crashed" | "escaped";

export interface OrbitRig {
  world: World;
  central: RigidBody;
  satellite: RigidBody;
  trail: { x: number; y: number }[];
  status: OrbitFlightStatus;
}

function buildOrbitRig(values: ParameterValues): OrbitRig {
  const world = new World();

  const central = new RigidBody({
    position: { x: 0, y: 0 },
    mass: Number(values.centralMass ?? 50),
    shape: circle(CENTRAL_RADIUS),
    restitution: 0.15,
    userData: { color: "#E0524F", label: "Central body" },
  });

  const initialRadius = Number(values.initialRadius ?? 4);
  const initialSpeed = Number(values.initialSpeed ?? 0);
  const satellite = new RigidBody({
    position: { x: initialRadius, y: 0 },
    velocity: { x: 0, y: initialSpeed },
    mass: Number(values.satelliteMass ?? 1),
    shape: circle(SATELLITE_RADIUS),
    restitution: 0.15,
    userData: { color: "#2E9E5B", label: "Satellite" },
  });

  world.addBody(central);
  world.addBody(satellite);
  world.addForce(new NewtonianGravity(world.bodies, ORBIT_G, SOFTENING));

  return {
    world,
    central,
    satellite,
    trail: [{ x: satellite.position.x, y: satellite.position.y }],
    status: "flying",
  };
}

/** Reads the live centralMass/satelliteMass sliders into the rig every tick — the two Orbit parameters that make sense to sync continuously during flight, since they only scale the force/acceleration, unlike initialRadius/initialSpeed which are launch conditions. Mirrors `syncCartState` in `cart-engine.ts`. */
function syncOrbitState(rig: OrbitRig, values: ParameterValues): void {
  rig.central.mass = Number(values.centralMass ?? rig.central.mass);
  rig.satellite.mass = Number(values.satelliteMass ?? rig.satellite.mass);
}

function classifyStatus(distance: number): OrbitFlightStatus {
  if (distance <= CENTRAL_RADIUS + SATELLITE_RADIUS + 0.05) return "crashed";
  if (distance >= ESCAPE_DISTANCE) return "escaped";
  return "flying";
}

export interface OrbitEngine {
  rig: OrbitRig;
  reset: () => void;
}

/**
 * Owns the Orbit rig, steps it once a frame while `active` (the Orbit
 * tab is visible), pins the central body back to the origin after each
 * step, tracks a fading trail, and rebuilds the rig from the current
 * initialRadius/initialSpeed sliders whenever `reset()` is called.
 */
export function useOrbitEngine(active: boolean, values: ParameterValues): OrbitEngine {
  const rigRef = useRef<OrbitRig>();
  if (!rigRef.current) rigRef.current = buildOrbitRig(values);
  const [, forceRender] = useState(0);

  const activeRef = useRef(active);
  activeRef.current = active;

  // See the matching comment in `newtons-laws/cart-engine.ts` — reading
  // live values through a ref (kept current every render) rather than
  // closing over `values` directly means this effect can subscribe
  // once and still see slider edits made mid-flight.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const { subscribeFrame } = useSimulation();

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      if (!activeRef.current) return;
      const rig = rigRef.current!;
      syncOrbitState(rig, valuesRef.current);

      if (rig.status === "flying") {
        rig.world.step(frame.deltaTime);
        // Pin the central body back to the origin — see this file's
        // top doc comment for why it isn't simply `isStatic`.
        rig.central.position.set(0, 0);
        rig.central.velocity.set(0, 0);

        const distance = rig.satellite.position.magnitude();
        rig.status = classifyStatus(distance);

        rig.trail.push({ x: rig.satellite.position.x, y: rig.satellite.position.y });
        if (rig.trail.length > TRAIL_MAX_POINTS) rig.trail.shift();
      }
    });
  }, [subscribeFrame]);

  const reset = () => {
    rigRef.current = buildOrbitRig(valuesRef.current);
    forceRender((n) => n + 1);
  };

  return { rig: rigRef.current, reset };
}

export interface OrbitReadouts {
  distance: number;
  speed: number;
  force: number;
  acceleration: number;
  circularOrbitalSpeed: number;
  escapeSpeed: number;
  status: OrbitFlightStatus;
}

function computeOrbitReadouts(rig: OrbitRig): OrbitReadouts {
  const distance = rig.satellite.position.magnitude();
  const speed = rig.satellite.speed;
  const force = computeGravitationalForce(rig.central.mass, rig.satellite.mass, distance, ORBIT_G);
  const acceleration = computeGravitationalAcceleration(rig.central.mass, distance, ORBIT_G);
  const circularOrbitalSpeed = computeOrbitalSpeed(rig.central.mass, distance, ORBIT_G);
  const escapeSpeed = computeEscapeVelocity(rig.central.mass, distance, ORBIT_G);
  return { distance, speed, force, acceleration, circularOrbitalSpeed, escapeSpeed, status: rig.status };
}

const EMPTY_READOUTS: OrbitReadouts = {
  distance: 0,
  speed: 0,
  force: 0,
  acceleration: 0,
  circularOrbitalSpeed: 0,
  escapeSpeed: 0,
  status: "flying",
};

/** Throttled (~10Hz) React mirror of the live rig, for the readouts panel — same shape/purpose as `useCartSnapshot`/`useLaw3Snapshot`. */
export function useOrbitSnapshot(engine: OrbitEngine, active: boolean, intervalMs = 100): OrbitReadouts {
  const { subscribeFrame } = useSimulation();
  const [readouts, setReadouts] = useState<OrbitReadouts>(() => computeOrbitReadouts(engine.rig));
  const lastSyncRef = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    return subscribeFrame((frame: FrameInfo) => {
      if (!activeRef.current) return;
      if (frame.time - lastSyncRef.current < intervalMs / 1000 && frame.frameCount > 1) return;
      lastSyncRef.current = frame.time;
      setReadouts(computeOrbitReadouts(engine.rig));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [subscribeFrame, engine.rig, intervalMs]);

  useEffect(() => {
    setReadouts(computeOrbitReadouts(engine.rig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.rig]);

  return active ? readouts : EMPTY_READOUTS;
}
