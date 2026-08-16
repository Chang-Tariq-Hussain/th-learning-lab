/**
 * Reusable 2D Physics Engine — the backbone for every Physics simulation
 * beyond Projectile Motion (which uses its own closed-form model for
 * speed and exactness; see `projectile-motion/physics.ts`'s doc comment
 * for why). This module knows nothing about pendulums, ramps, or
 * collisions-teaching-lessons specifically — it provides `Vector2`
 * math, `Particle`/`RigidBody` dynamics, `Force` generators, `Constraint`
 * solving, collision detection/resolution, and a `World` that ties them
 * together, all independent of any one simulation.
 *
 * ## How a future simulation would use this (worked example — Pendulum)
 *
 * ```ts
 * import { World, UniformGravity, createPendulum } from "@/features/subjects/physics/engine";
 *
 * const world = new World();
 * const { bob, constraint } = createPendulum(world, {
 *   pivot: { x: 0, y: 5 },
 *   length: 3,
 *   startAngleDeg: 30,
 * });
 * world.addForce(new UniformGravity(world.bodies, 9.81));
 *
 * // Inside a render loop (e.g. driven by the simulation framework's
 * // `useAnimation` / `SimulationCanvas`):
 * world.step(dt);
 * drawWorld(ctx, world, toScreen, pxPerMeter);
 *
 * // Educational readouts, straight off the bob:
 * bob.kineticEnergy;
 * bob.potentialEnergy(9.81, pivotY - length);
 * constraint.distance; // rod length, constant — shows the constraint is holding
 * ```
 *
 * Collisions (`World` already resolves circle/rect overlaps each step),
 * an inclined plane (`createRamp` + a `createBall` released on it, with
 * `UniformGravity`), a spring (`createHangingSpring`), and free fall
 * (`createBall` + `UniformGravity` + no constraints at all) all follow
 * the same shape: build bodies with the `objects/` factories (or the
 * `RigidBody` constructor directly), add the forces/constraints that
 * apply, and call `world.step(dt)` once a frame. See this folder's
 * `README.md` for a longer walkthrough covering all nine simulations
 * this engine was built to support.
 */

// --- Math ------------------------------------------------------------------
export { Vector2 } from "./math/vector2";

// --- Core bodies -------------------------------------------------------------
export { Particle, type ParticleOptions } from "./core/particle";
export { RigidBody, type RigidBodyOptions } from "./core/rigid-body";
export {
  circle,
  rect,
  computeMomentOfInertia,
  shapeAABB,
  type Shape,
  type CircleShape,
  type RectShape,
  type AABB,
} from "./core/shape";

// --- Forces ------------------------------------------------------------------
export type { ForceGenerator } from "./forces/force";
export { UniformGravity, NewtonianGravity } from "./forces/gravity";
export { Drag } from "./forces/drag";
export { Spring, type SpringOptions } from "./forces/spring";

// --- Constraints ---------------------------------------------------------------
export {
  DistanceConstraint,
  PinConstraint,
  type Constraint,
} from "./constraints/constraint";

// --- Collision -----------------------------------------------------------------
export {
  detectCollision,
  circleVsCircle,
  rectVsRect,
  circleVsRect,
  detectBoundaryCollisions,
  type Contact,
  type Boundary,
  type BoundaryContact,
} from "./collision/detection";
export {
  resolveCollision,
  resolveBoundaryCollision,
} from "./collision/resolution";

// --- Integration -----------------------------------------------------------------
export {
  semiImplicitEuler,
  explicitEuler,
  type Integrator,
} from "./integration/integrator";

// --- World -----------------------------------------------------------------------
export { World, type WorldOptions, type WorldEvents } from "./world/world";

// --- Rendering ---------------------------------------------------------------------
export {
  drawWorld,
  type ToScreen,
  type BodyStyle,
  type StyleResolver,
} from "./render/renderer-adapter";

// --- Debug -------------------------------------------------------------------------
export {
  drawDebugOverlay,
  type DebugOverlayOptions,
} from "./debug/debug-overlay";

// --- Reusable objects ----------------------------------------------------------------
export {
  createBall,
  createBox,
  createProjectile,
  createGround,
  createWall,
  createRamp,
  createPlatform,
  createPendulum,
  createHangingSpring,
  createTarget,
  isWithinTarget,
  type BallOptions,
  type BoxOptions,
  type ProjectileOptions,
  type PendulumResult,
  type SpringSystemResult,
  type TargetZone,
} from "./objects/objects";

// --- Utilities -----------------------------------------------------------------------
export {
  clamp,
  lerp,
  inverseLerp,
  mapRange,
  degToRad,
  radToDeg,
  smoothstep,
  randomRange,
  randomInt,
  randomSign,
  createSeededRandom,
} from "./utils/math-helpers";
export * as unitConversion from "./utils/unit-conversion";
export {
  createCoordinateTransform,
  type CoordinateTransformOptions,
} from "./utils/coordinates";
export { FpsTracker, FixedTimestepAccumulator } from "./utils/animation-timing";
