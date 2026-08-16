import { Vector2 } from "../math/vector2";
import { RigidBody } from "../core/rigid-body";
import { circle, rect } from "../core/shape";
import { DistanceConstraint } from "../constraints/constraint";
import { Spring, type SpringOptions } from "../forces/spring";
import type { World } from "../world/world";

/**
 * Thin factory functions over `RigidBody` for the shapes every
 * introductory-physics lesson reaches for. None of these are special
 * classes — they're just `new RigidBody(...)` with sensible defaults, so
 * a simulation can always drop down to the constructor directly for
 * anything these factories don't cover.
 */

export interface BallOptions {
  position: { x: number; y: number };
  radius?: number;
  mass?: number;
  velocity?: { x: number; y: number };
  restitution?: number;
  friction?: number;
  color?: string;
  label?: string;
}

export function createBall(options: BallOptions): RigidBody {
  return new RigidBody({
    position: options.position,
    velocity: options.velocity,
    mass: options.mass ?? 1,
    shape: circle(options.radius ?? 0.5),
    restitution: options.restitution ?? 0.7,
    friction: options.friction ?? 0.3,
    userData: {
      color: options.color ?? "#3D5AFE",
      label: options.label ?? "Ball",
    },
  });
}

export interface BoxOptions {
  position: { x: number; y: number };
  width?: number;
  height?: number;
  mass?: number;
  velocity?: { x: number; y: number };
  rotation?: number;
  restitution?: number;
  friction?: number;
  color?: string;
  label?: string;
}

export function createBox(options: BoxOptions): RigidBody {
  return new RigidBody({
    position: options.position,
    velocity: options.velocity,
    rotation: options.rotation ?? 0,
    mass: options.mass ?? 1,
    shape: rect(options.width ?? 1, options.height ?? 1),
    restitution: options.restitution ?? 0.3,
    friction: options.friction ?? 0.4,
    userData: {
      color: options.color ?? "#7C4FE0",
      label: options.label ?? "Box",
    },
  });
}

/** A projectile is just a small, low-friction ball with an initial velocity — modeled here as a specialization of `createBall` so it plugs directly into `World`'s general collision/gravity handling (unlike the closed-form model in `projectile-motion/physics.ts`, which trades that generality for exactness and speed). */
export interface ProjectileOptions {
  position: { x: number; y: number };
  speed: number;
  angleDeg: number;
  mass?: number;
  radius?: number;
  color?: string;
}

export function createProjectile(options: ProjectileOptions): RigidBody {
  const angleRad = (options.angleDeg * Math.PI) / 180;
  return createBall({
    position: options.position,
    velocity: Vector2.fromAngle(angleRad, options.speed),
    mass: options.mass ?? 1,
    radius: options.radius ?? 0.3,
    restitution: 0.4,
    friction: 0.2,
    color: options.color ?? "#E0524F",
    label: "Projectile",
  });
}

/** A static, infinitely wide ground plane — really just a very wide, thin, static box positioned so its top surface sits at `surfaceY`. */
export function createGround(
  surfaceY: number,
  width = 1000,
  thickness = 2,
): RigidBody {
  return new RigidBody({
    position: { x: 0, y: surfaceY - thickness / 2 },
    isStatic: true,
    shape: rect(width, thickness),
    friction: 0.5,
    restitution: 0.3,
    userData: { color: "#3D4A44", label: "Ground" },
  });
}

/** A static wall — a tall, thin box, useful as a left/right boundary distinct from `World.boundary` when a simulation wants a visible wall a ball can bounce off. */
export function createWall(x: number, height = 1000, thickness = 2): RigidBody {
  return new RigidBody({
    position: { x, y: height / 2 },
    isStatic: true,
    shape: rect(thickness, height),
    friction: 0.4,
    restitution: 0.5,
    userData: { color: "#3D4A44", label: "Wall" },
  });
}

/** An inclined static platform — a `Box` rotated to the given angle, for ramp/inclined-plane lessons. */
export function createRamp(options: {
  position: { x: number; y: number };
  length: number;
  angleDeg: number;
  thickness?: number;
  friction?: number;
}): RigidBody {
  return new RigidBody({
    position: options.position,
    isStatic: true,
    rotation: (options.angleDeg * Math.PI) / 180,
    shape: rect(options.length, options.thickness ?? 0.4),
    friction: options.friction ?? 0.4,
    restitution: 0.1,
    userData: { color: "#3D4A44", label: "Ramp" },
  });
}

/** A static horizontal platform — a shorthand for a level `createRamp` with 0° angle, e.g. a step for a ball to land on. */
export function createPlatform(
  position: { x: number; y: number },
  width: number,
  thickness = 0.4,
): RigidBody {
  return createRamp({ position, length: width, angleDeg: 0, thickness });
}

export interface PendulumResult {
  pivot: RigidBody;
  bob: RigidBody;
  constraint: DistanceConstraint;
}

/**
 * A complete pendulum: a fixed pivot point and a bob held at a constant
 * distance from it via `DistanceConstraint`, ready to swing once gravity
 * (added separately via a `UniformGravity` force) pulls on the bob.
 * Adds both bodies and the constraint to `world` directly, since a
 * pendulum only makes sense as this whole assembly.
 */
export function createPendulum(
  world: World,
  options: {
    pivot: { x: number; y: number };
    length: number;
    bobMass?: number;
    bobRadius?: number;
    startAngleDeg?: number;
  },
): PendulumResult {
  const pivot = new RigidBody({
    position: options.pivot,
    isStatic: true,
    shape: circle(0.05),
    userData: { color: "#142019", label: "Pivot" },
  });

  const startAngle = ((options.startAngleDeg ?? 30) * Math.PI) / 180;
  // Angle measured from straight down (the pendulum's rest position).
  const bobPosition = {
    x: options.pivot.x + Math.sin(startAngle) * options.length,
    y: options.pivot.y - Math.cos(startAngle) * options.length,
  };

  const bob = createBall({
    position: bobPosition,
    radius: options.bobRadius ?? 0.3,
    mass: options.bobMass ?? 1,
    restitution: 0.2,
    color: "#2E9E5B",
    label: "Bob",
  });

  const constraint = new DistanceConstraint(bob, pivot, options.length);

  world.addBody(pivot);
  world.addBody(bob);
  world.addConstraint(constraint);

  return { pivot, bob, constraint };
}

export interface SpringSystemResult {
  anchor: RigidBody;
  bob: RigidBody;
  spring: Spring;
}

/** A mass hanging from a fixed anchor by a spring — the standard "spring-mass" teaching setup. Adds both bodies and the spring force to `world`. */
export function createHangingSpring(
  world: World,
  options: {
    anchor: { x: number; y: number };
    bobMass?: number;
    bobRadius?: number;
  } & SpringOptions,
): SpringSystemResult {
  const anchorBody = new RigidBody({
    position: options.anchor,
    isStatic: true,
    shape: circle(0.05),
    userData: { color: "#142019", label: "Anchor" },
  });

  const bob = createBall({
    position: { x: options.anchor.x, y: options.anchor.y - options.restLength },
    mass: options.bobMass ?? 1,
    radius: options.bobRadius ?? 0.3,
    restitution: 0.1,
    color: "#7C4FE0",
    label: "Bob",
  });

  const spring = new Spring(bob, anchorBody, {
    stiffness: options.stiffness,
    restLength: options.restLength,
    damping: options.damping,
  });

  world.addBody(anchorBody);
  world.addBody(bob);
  world.addForce(spring);

  return { anchor: anchorBody, bob, spring };
}

/** A non-physical target zone for Challenge-Mode-style objectives — doesn't participate in collisions, just marks a region to check a body's position against. */
export interface TargetZone {
  position: Vector2;
  radius: number;
  label?: string;
}

export function createTarget(
  position: { x: number; y: number },
  radius = 1,
  label?: string,
): TargetZone {
  return { position: Vector2.from(position), radius, label };
}

export function isWithinTarget(
  point: { x: number; y: number },
  target: TargetZone,
): boolean {
  return Vector2.distance(point, target.position) <= target.radius;
}
