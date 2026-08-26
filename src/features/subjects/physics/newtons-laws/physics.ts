/**
 * Physics for the Newton's Laws lab — built entirely on the reusable 2D
 * engine (`@/features/subjects/physics/engine`), per that engine's own
 * README: "a Particle/RigidBody with applyForce() called directly from
 * UI sliders, demonstrating F = ma via the body's own acceleration
 * readout." Nothing here re-derives integration, collisions, or vector
 * math — those all come from the engine. What lives here is specific to
 * *this* lesson: the cart rig (Law 1 & 2), the action–reaction rig
 * (Law 3), and one small new force generator the engine didn't already
 * have — surface (kinetic + static) friction.
 *
 * Coordinate convention, matching `projectile-motion/physics.ts`: launch
 * point / rig center is the origin, +x is the direction of push, +y is
 * up. The cart rig deliberately never receives a vertical force (no
 * `UniformGravity` is added to its `World`), so its `RigidBody` never
 * leaves y = 0 — gravity's *effect* still shows up correctly through the
 * normal force (N = mg) that friction depends on, computed analytically
 * rather than via vertical collision, which keeps a "watch F = ma
 * happen" demo free of any vertical settling jitter. Law 3's collision
 * and spring scenarios, by contrast, use the engine's real collision
 * resolution and `Spring` force generator directly.
 */

import {
  RigidBody,
  Spring,
  Vector2,
  World,
  type ForceGenerator,
  type Particle,
} from "../engine";

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export interface GravityPreset {
  key: string;
  label: string;
  /** m/s^2 */
  value: number;
}

/** Same worlds as Projectile Motion, kept as this simulation's own small copy of the constants rather than an import — see this file's doc comment on cross-simulation coupling. */
export const GRAVITY_PRESETS: GravityPreset[] = [
  { key: "moon", label: "Moon", value: 1.62 },
  { key: "mars", label: "Mars", value: 3.71 },
  { key: "earth", label: "Earth", value: 9.81 },
  { key: "jupiter", label: "Jupiter", value: 24.79 },
  { key: "custom", label: "Custom", value: NaN },
];

export function resolveGravity(presetKey: string, customValue: number): number {
  if (presetKey === "custom") return customValue;
  return GRAVITY_PRESETS.find((p) => p.key === presetKey)?.value ?? 9.81;
}

export interface SurfacePreset {
  key: string;
  label: string;
  /** Coulomb friction coefficient μ (dimensionless). */
  coefficient: number;
}

export const SURFACE_PRESETS: SurfacePreset[] = [
  { key: "ice", label: "Ice", coefficient: 0.02 },
  { key: "wood", label: "Wood", coefficient: 0.35 },
  { key: "rubber", label: "Rubber mat", coefficient: 0.9 },
  { key: "custom", label: "Custom", coefficient: NaN },
];

export function resolveFriction(
  surfaceKey: string,
  customValue: number,
): number {
  if (surfaceKey === "custom") return customValue;
  return SURFACE_PRESETS.find((s) => s.key === surfaceKey)?.coefficient ?? 0.35;
}

export interface ObjectPreset {
  key: string;
  label: string;
  color: string;
  /** Suggested default mass (kg) — students can still override with the mass slider. */
  suggestedMass: number;
}

export const OBJECT_PRESETS: ObjectPreset[] = [
  { key: "box", label: "Cardboard box", color: "#7C4FE0", suggestedMass: 3 },
  { key: "crate", label: "Wooden crate", color: "#8A5A2B", suggestedMass: 8 },
  { key: "sled", label: "Steel sled", color: "#3D5AFE", suggestedMass: 15 },
];

// ---------------------------------------------------------------------------
// Surface friction — a new ForceGenerator, following the engine's own
// plug-in pattern ("adding a new kind of force never requires touching
// World itself")
// ---------------------------------------------------------------------------

export interface SurfaceFrictionOptions {
  /** Coefficient of kinetic friction, μ_k — opposes existing motion. */
  kinetic: number;
  /** Coefficient of static friction, μ_s — resists motion starting. Defaults to 1.2× kinetic, a standard rule-of-thumb ratio. */
  static?: number;
  /** Normal force in Newtons for each tracked body, e.g. `() => mass * g` for a level surface. Read every step, so it stays correct if mass or gravity changes live. */
  normalForce: (body: Particle) => number;
  /** When false, friction is not applied at all — used for the Law 1 "toggle friction" control. */
  enabled: () => boolean;
}

const AT_REST_EPSILON = 0.01; // m/s — below this we treat a body as "at rest" for static-vs-kinetic purposes

/**
 * Classic two-regime Coulomb friction on a horizontal surface:
 *  - **Kinetic** (`μ_k N`), opposing an already-moving body's velocity.
 *  - **Static**, which opposes whatever *other* forces are trying to
 *    start the body moving, up to a maximum of `μ_s N` — exactly enough
 *    to keep a body at rest balanced (this is Law 1's "an object at rest
 *    stays at rest" made concrete: push gently and static friction
 *    cancels the push exactly; push past `μ_s N` and the body finally
 *    breaks free).
 *
 * This is the one genuinely new physics component this lesson needed —
 * the engine's own friction (in `collision/resolution.ts`) only fires
 * *during* a collision impulse, not continuously for a body resting on a
 * surface, so a `ForceGenerator` was the right extension point rather
 * than a change to the engine itself.
 */
export class SurfaceFriction implements ForceGenerator {
  kinetic: number;
  staticCoefficient: number;

  constructor(
    private bodies: Particle[],
    private options: SurfaceFrictionOptions,
  ) {
    this.kinetic = options.kinetic;
    this.staticCoefficient = options.static ?? options.kinetic * 1.2;
  }

  apply(): void {
    if (!this.options.enabled()) return;

    for (const body of this.bodies) {
      if (body.isStatic) continue;
      const normal = Math.max(0, this.options.normalForce(body));
      if (normal === 0) continue;

      const speed = Math.abs(body.velocity.x);

      if (speed > AT_REST_EPSILON) {
        // Kinetic friction: fixed magnitude, opposing current motion.
        const magnitude = this.kinetic * normal;
        const direction = body.velocity.x > 0 ? -1 : 1;
        body.applyForce(new Vector2(direction * magnitude, 0));
      } else {
        // Static friction: cancel whatever net horizontal force has
        // accumulated *so far this step* (e.g. an applied push), up to
        // the static maximum — so a small push produces zero motion,
        // exactly matching the real behavior of static friction.
        const netForce = body.netForce;
        const maxStatic = this.staticCoefficient * normal;
        const opposing = Math.min(Math.abs(netForce.x), maxStatic);
        body.applyForce(new Vector2(-Math.sign(netForce.x) * opposing, 0));
      }
    }
  }
}

// ---------------------------------------------------------------------------
// The cart rig — Law 1 (Inertia) & Law 2 (F = ma) share this exact setup;
// only which controls/readouts are surfaced differs between the two.
// ---------------------------------------------------------------------------

/**
 * Half-length (meters) of the fixed experimental track the cart moves
 * within. The floor/background never scrolls (see `cart-canvas.tsx`),
 * so this bounds how far the box can physically travel on screen — a
 * wall at each end, not a camera limit. Chosen so a hard push at max
 * force still has meaningful room to visibly accelerate before
 * reaching either wall.
 */
export const CART_TRACK_LIMIT_M = 7;

/** Half-width (meters) of the cart's box shape — matches `createCartRig`'s `shape.width / 2` below. Exported so `cart-canvas.tsx` can position the two person overlays against the box's actual edges without needing a `RigidBody` reference. */
export const CART_HALF_WIDTH_M = 0.8;

/** Whether a person is pushing the box away from themselves, or pulling it toward themselves — see the force generator in `createCartRig` for how this flips the sign of their contribution. */
export type PushPullMode = "push" | "pull";

export interface CartRig {
  world: World;
  cart: RigidBody;
  friction: SurfaceFriction;
  /** Mutable knobs the tick handler reads every frame — see `newtons-laws.tsx` for how these are kept in sync with the sliders and the two draggable people. */
  state: {
    mass: number;
    gravity: number;
    frictionCoefficient: number;
    frictionEnabled: boolean;
    /** How far each person is currently leaning into their push, 0 (resting, not touching) to 1 (fully engaged) — written directly by the person drag handles every pointer move, read here every physics step. */
    leftLean: number;
    rightLean: number;
    /** Push or pull, per person — independent, so one can push while the other pulls. */
    leftMode: PushPullMode;
    rightMode: PushPullMode;
    /** Ceiling each person's full lean maps to, in Newtons — set by the "Max push force" slider. */
    maxPushForce: number;
  };
}

/** Builds one cart on an (implicitly) horizontal, infinite surface, with a `SurfaceFriction` generator wired to the live `state`. No `UniformGravity` is added — see this file's doc comment for why. */
export function createCartRig(): CartRig {
  const world = new World({ collisionIterations: 1 });

  const cart = world.addBody(
    new RigidBody({
      position: { x: 0, y: 0 },
      mass: 5,
      shape: { kind: "rect", width: CART_HALF_WIDTH_M * 2, height: 1 },
      restitution: 0,
      friction: 0,
      userData: { color: "#7C4FE0", label: "Cart" },
    }),
  );

  const state: CartRig["state"] = {
    mass: 5,
    gravity: 9.81,
    frictionCoefficient: 0.35,
    frictionEnabled: true,
    leftLean: 0,
    rightLean: 0,
    leftMode: "push",
    rightMode: "push",
    maxPushForce: 80,
  };

  const friction = new SurfaceFriction([cart], {
    kinetic: state.frictionCoefficient,
    normalForce: () => state.mass * state.gravity,
    enabled: () => state.frictionEnabled,
  });
  // Order matters: the applied-force generator must run first so that,
  // by the time `friction.apply()` reads `body.netForce` to compute
  // static friction, this step's push has already been accumulated.
  //
  // Pushing: the left person pushes +x (toward the box from the left,
  // sending it away from them), the right person pushes -x — two
  // people converging on the box from opposite sides. Pulling flips
  // that person's sign: a left pull drags the box toward the left
  // person (-x), a right pull drags it toward the right person (+x).
  // `signedForce` below is exactly `leftForce`/`rightForce` from
  // `computeCartReadouts`, so the readouts and the physics can never
  // disagree about which way a given lean actually pushes/pulls.
  world.addForce({
    apply: () => {
      const net = signedForce(state.leftLean, "left", state.leftMode, state.maxPushForce)
        + signedForce(state.rightLean, "right", state.rightMode, state.maxPushForce);
      if (net !== 0) cart.applyForce(new Vector2(net, 0));
    },
  });
  world.addForce(friction);

  return { world, cart, friction, state };
}

/**
 * Signed force (Newtons) one person contributes, given their lean
 * (0–1), which side they're on, and whether they're pushing or
 * pulling. Pure function shared by the force generator above and
 * `computeCartReadouts`, so "what the physics does" and "what the
 * readouts/arrows say" are computed from the same rule rather than two
 * hand-kept-in-sync copies of it.
 */
export function signedForce(
  lean: number,
  side: "left" | "right",
  mode: PushPullMode,
  maxPushForce: number,
): number {
  const sideSign = side === "left" ? 1 : -1;
  const modeSign = mode === "push" ? 1 : -1;
  return lean * maxPushForce * sideSign * modeSign;
}

// ---------------------------------------------------------------------------
// Pure readouts — every quantity the Data Panel needs, derived from a
// `RigidBody` snapshot plus the current `state`. No physics happens
// here; `Particle`/`RigidBody` getters (`momentum`, `kineticEnergy`, ...)
// already computed the hard part.
// ---------------------------------------------------------------------------

export interface CartReadouts {
  mass: number;
  velocity: number;
  acceleration: number;
  momentum: number;
  netForce: number;
  weight: number;
  normalForce: number;
  /** Net of the two people's signed contributions (push = away from that person, pull = toward them), before friction. */
  appliedForce: number;
  /** Left person's push/pull magnitude, ≥0. */
  leftForce: number;
  /** Right person's push/pull magnitude, ≥0. */
  rightForce: number;
  frictionForce: number;
  elapsedTime: number;
  distance: number;
  /** The cart's raw world-space x position (meters) — used by `cart-canvas.tsx` to keep the two person overlays attached to the box's actual edges as it moves along the track, instead of pinned to fixed screen positions. */
  positionX: number;
}

export function computeCartReadouts(
  rig: CartRig,
  elapsedTime: number,
  distance: number,
): CartReadouts {
  const { cart, state } = rig;
  const weight = state.mass * state.gravity;
  const normalForce = weight; // level surface: N balances weight exactly
  const leftForce = state.leftLean * state.maxPushForce;
  const rightForce = state.rightLean * state.maxPushForce;
  const appliedForce =
    signedForce(state.leftLean, "left", state.leftMode, state.maxPushForce) +
    signedForce(state.rightLean, "right", state.rightMode, state.maxPushForce);

  const speed = cart.velocity.x;
  const maxStatic = friction_staticMax(rig);
  const frictionForce =
    Math.abs(speed) > AT_REST_EPSILON
      ? state.frictionEnabled
        ? rig.friction.kinetic * normalForce * (speed > 0 ? -1 : 1)
        : 0
      : state.frictionEnabled
        ? -Math.sign(appliedForce) * Math.min(Math.abs(appliedForce), maxStatic)
        : 0;

  const netForce = appliedForce + frictionForce;

  return {
    mass: state.mass,
    velocity: cart.velocity.x,
    acceleration: cart.acceleration.x,
    momentum: cart.momentum.x,
    netForce,
    weight,
    normalForce,
    appliedForce,
    leftForce,
    rightForce,
    frictionForce,
    elapsedTime,
    distance,
    positionX: cart.position.x,
  };
}

function friction_staticMax(rig: CartRig): number {
  return rig.friction.staticCoefficient * rig.state.mass * rig.state.gravity;
}

// ---------------------------------------------------------------------------
// Law 3 — Action & Reaction rigs
// ---------------------------------------------------------------------------

export type Law3ScenarioKey =
  | "skaters"
  | "rocket"
  | "balloon"
  | "collision"
  | "spring";

export interface SkatersRig {
  kind: "skaters";
  world: World;
  skaterA: RigidBody;
  skaterB: RigidBody;
  friction: SurfaceFriction;
  state: {
    massA: number;
    massB: number;
    gravity: number;
    frictionCoefficient: number;
  };
  /** Set once, right after a push, so the UI can show "conserved at the moment of push" even as friction later erodes it. */
  momentumAtPush: number | null;
}

/** Two skaters at rest, back to back. `push()` applies an equal-and-opposite impulse pair — the cleanest possible demonstration that momentum is conserved when the only forces are internal (skater-on-skater). */
export function createSkatersRig(): SkatersRig {
  const world = new World({ collisionIterations: 1 });
  const skaterA = world.addBody(
    new RigidBody({
      position: { x: -0.6, y: 0 },
      mass: 60,
      shape: { kind: "circle", radius: 0.45 },
      restitution: 0,
      friction: 0,
      userData: { color: "#3D5AFE", label: "Skater A" },
    }),
  );
  const skaterB = world.addBody(
    new RigidBody({
      position: { x: 0.6, y: 0 },
      mass: 60,
      shape: { kind: "circle", radius: 0.45 },
      restitution: 0,
      friction: 0,
      userData: { color: "#E0524F", label: "Skater B" },
    }),
  );

  const state = {
    massA: 60,
    massB: 60,
    gravity: 9.81,
    frictionCoefficient: 0.05,
  };
  const friction = new SurfaceFriction([skaterA, skaterB], {
    kinetic: state.frictionCoefficient,
    normalForce: (body) =>
      (body === skaterA ? state.massA : state.massB) * state.gravity,
    enabled: () => true,
  });
  world.addForce(friction);

  return {
    kind: "skaters",
    world,
    skaterA,
    skaterB,
    friction,
    state,
    momentumAtPush: null,
  };
}

/** Applies the push: equal-and-opposite impulses, scaled so the *lighter* skater always ends up moving faster — exactly Newton's Third Law's consequence for unequal masses (same |F|, different |a|). */
export function pushSkaters(rig: SkatersRig, impulseMagnitude: number): void {
  rig.skaterA.applyImpulse(new Vector2(-impulseMagnitude, 0));
  rig.skaterB.applyImpulse(new Vector2(impulseMagnitude, 0));
  rig.momentumAtPush = rig.skaterA.momentum.x + rig.skaterB.momentum.x;
}

export interface ThrustRig {
  kind: "rocket" | "balloon";
  world: World;
  body: RigidBody;
  state: {
    mass: number;
    thrust: number;
    thrustOn: boolean;
    gravity: number;
    frictionCoefficient: number;
  };
}

/** A single body under continuous thrust — shared by the "rocket" and "balloon" scenarios, which differ only in labeling/visuals (see the doc comment in `physics.ts`'s module header). */
export function createThrustRig(kind: "rocket" | "balloon"): ThrustRig {
  const world = new World({ collisionIterations: 1 });
  const body = world.addBody(
    new RigidBody({
      position: { x: -2, y: 0 },
      mass: 2,
      shape: { kind: "rect", width: 1.2, height: 0.6 },
      restitution: 0,
      friction: 0,
      userData: {
        color: kind === "rocket" ? "#E0524F" : "#2E9E5B",
        label: kind === "rocket" ? "Rocket" : "Balloon",
      },
    }),
  );
  const state = {
    mass: 2,
    thrust: 15,
    thrustOn: false,
    gravity: 9.81,
    frictionCoefficient: 0.02,
  };
  const friction = new SurfaceFriction([body], {
    kinetic: state.frictionCoefficient,
    normalForce: () => state.mass * state.gravity,
    enabled: () => true,
  });
  world.addForce({
    apply: () => {
      if (state.thrustOn) body.applyForce(new Vector2(state.thrust, 0));
    },
  });
  world.addForce(friction);
  return { kind, world, body, state };
}

export interface CollisionRig {
  kind: "collision";
  world: World;
  ballA: RigidBody;
  ballB: RigidBody;
  state: { massA: number; massB: number; speedA: number; restitution: number };
  lastCollision: { momentumBefore: number; momentumAfter: number } | null;
}

/** Two balls on a frictionless line — isolated so momentum conservation is exact and the pre/post readout is unambiguous, letting `restitution` alone control elastic vs. inelastic. */
export function createCollisionRig(): CollisionRig {
  const world = new World({ collisionIterations: 4 });
  const ballA = world.addBody(
    new RigidBody({
      position: { x: -3, y: 0 },
      mass: 4,
      shape: { kind: "circle", radius: 0.4 },
      restitution: 1,
      friction: 0,
      userData: { color: "#3D5AFE", label: "Ball A" },
    }),
  );
  const ballB = world.addBody(
    new RigidBody({
      position: { x: 2, y: 0 },
      mass: 2,
      shape: { kind: "circle", radius: 0.4 },
      restitution: 1,
      friction: 0,
      userData: { color: "#E0524F", label: "Ball B" },
    }),
  );
  const state = { massA: 4, massB: 2, speedA: 4, restitution: 1 };

  const rig: CollisionRig = {
    kind: "collision",
    world,
    ballA,
    ballB,
    state,
    lastCollision: null,
  };

  world.events.on("collision", () => {
    // Frictionless, wall-less rig: momentum is exactly conserved from
    // launch up until the moment of impact, so "before" is simply the
    // launch value — no need to track it collision-to-collision.
    rig.lastCollision = {
      momentumBefore: state.massA * state.speedA,
      momentumAfter: ballA.momentum.x + ballB.momentum.x,
    };
  });

  return rig;
}

export function launchCollision(rig: CollisionRig): void {
  rig.ballA.position.set(-3, 0);
  rig.ballB.position.set(2, 0);
  rig.ballA.velocity.set(rig.state.speedA, 0);
  rig.ballB.velocity.set(0, 0);
  rig.ballA.restitution = rig.state.restitution;
  rig.ballB.restitution = rig.state.restitution;
  rig.lastCollision = null;
}

export interface SpringLaunchRig {
  kind: "spring";
  world: World;
  cart: RigidBody;
  spring: Spring;
  state: { mass: number; stiffness: number; compression: number };
  released: boolean;
}

/** A cart held against a compressed spring; `release()` lets `Spring`'s real Hooke's-law force generator push it away — the spring pushes the cart (action) exactly as hard as the cart's inertia resists being pushed (reaction), converting stored spring PE into the cart's KE. */
export function createSpringLaunchRig(): SpringLaunchRig {
  const world = new World({ collisionIterations: 1 });
  const restLength = 2;
  const cart = world.addBody(
    new RigidBody({
      position: { x: restLength - 0.6, y: 0 },
      mass: 3,
      shape: { kind: "rect", width: 1, height: 0.8 },
      restitution: 0,
      friction: 0,
      isStatic: true, // held in place until release() flips this off
      userData: { color: "#7C4FE0", label: "Cart" },
    }),
  );
  const spring = new Spring(
    cart,
    { x: 0, y: 0 },
    { stiffness: 120, restLength, damping: 0.4 },
  );
  world.addForce(spring);
  const friction = new SurfaceFriction([cart], {
    kinetic: 0.05,
    normalForce: () => 3 * 9.81,
    enabled: () => true,
  });
  world.addForce(friction);

  return {
    kind: "spring",
    world,
    cart,
    spring,
    state: { mass: 3, stiffness: 120, compression: 0.6 },
    released: false,
  };
}

export function releaseSpring(rig: SpringLaunchRig): void {
  rig.cart.isStatic = false;
  rig.cart.mass = rig.state.mass;
  rig.cart.invMass = 1 / rig.state.mass;
  rig.released = true;
}

export function resetSpring(rig: SpringLaunchRig): void {
  const restLength = rig.spring.restLength;
  rig.cart.position.set(restLength - rig.state.compression, 0);
  rig.cart.velocity.set(0, 0);
  rig.cart.isStatic = true;
  rig.cart.invMass = 0;
  rig.spring.stiffness = rig.state.stiffness;
  rig.released = false;
}
