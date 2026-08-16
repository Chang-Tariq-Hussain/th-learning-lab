import { SimulationEventEmitter } from "@/features/simulation";
import { RigidBody } from "../core/rigid-body";
import type { Particle } from "../core/particle";
import type { ForceGenerator } from "../forces/force";
import type { Constraint } from "../constraints/constraint";
import { semiImplicitEuler, type Integrator } from "../integration/integrator";
import {
  detectCollision,
  detectBoundaryCollisions,
  type Contact,
  type BoundaryContact,
  type Boundary,
} from "../collision/detection";
import {
  resolveCollision,
  resolveBoundaryCollision,
} from "../collision/resolution";

export interface WorldEvents extends Record<string, unknown> {
  collision: Contact;
  boundaryCollision: BoundaryContact;
  bodyAdded: Particle;
  bodyRemoved: Particle;
  reset: void;
  step: { dt: number; time: number };
}

export interface WorldOptions {
  /** Bodies are always free to move; the boundary is optional (omit for an "infinite" world, e.g. an orbital-motion scene). */
  boundary?: Boundary;
  integrator?: Integrator;
  /** How many times to re-run the collision resolution pass per step — more passes settle stacked bodies more accurately, at extra cost. */
  collisionIterations?: number;
}

/**
 * The reusable container every physics simulation is built around:
 * holds bodies, force generators, and constraints; advances them each
 * step in a fixed order (forces → integration → constraints →
 * collisions); and reports what happened via `on(...)`. Nothing in this
 * class knows about pendulums, ramps, or projectiles — those are
 * composed from `World` + `objects/` factories in a specific simulation
 * (see the module doc comment in `engine/index.ts` for a worked example).
 *
 * Reuses the framework's own `SimulationEventEmitter` (from
 * `@/features/simulation`) rather than a second bespoke pub/sub
 * implementation — the same instruction to avoid duplicating existing
 * reusable code applies inside the engine, not just to the UI layer.
 */
export class World {
  bodies: RigidBody[] = [];
  forces: ForceGenerator[] = [];
  constraints: Constraint[] = [];
  boundary: Boundary | null;
  integrator: Integrator;
  collisionIterations: number;

  time = 0;
  events = new SimulationEventEmitter<WorldEvents>();

  private initialState: {
    body: RigidBody;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    rotation: number;
    angularVelocity: number;
  }[] = [];

  constructor(options: WorldOptions = {}) {
    this.boundary = options.boundary ?? null;
    this.integrator = options.integrator ?? semiImplicitEuler;
    this.collisionIterations = options.collisionIterations ?? 2;
  }

  addBody(body: RigidBody): RigidBody {
    this.bodies.push(body);
    this.initialState.push({
      body,
      position: { x: body.position.x, y: body.position.y },
      velocity: { x: body.velocity.x, y: body.velocity.y },
      rotation: body.rotation,
      angularVelocity: body.angularVelocity,
    });
    this.events.emit("bodyAdded", body);
    return body;
  }

  removeBody(body: RigidBody): void {
    this.bodies = this.bodies.filter((b) => b !== body);
    this.initialState = this.initialState.filter((s) => s.body !== body);
    this.events.emit("bodyRemoved", body);
  }

  addForce(force: ForceGenerator): ForceGenerator {
    this.forces.push(force);
    return force;
  }

  removeForce(force: ForceGenerator): void {
    this.forces = this.forces.filter((f) => f !== force);
  }

  addConstraint(constraint: Constraint): Constraint {
    this.constraints.push(constraint);
    return constraint;
  }

  removeConstraint(constraint: Constraint): void {
    this.constraints = this.constraints.filter((c) => c !== constraint);
  }

  /** Restores every body to its position/velocity/rotation at the moment it was added — used for the framework's Reset control. */
  reset(): void {
    for (const state of this.initialState) {
      state.body.position.set(state.position.x, state.position.y);
      state.body.velocity.set(state.velocity.x, state.velocity.y);
      state.body.rotation = state.rotation;
      state.body.angularVelocity = state.angularVelocity;
    }
    this.time = 0;
    this.events.emit("reset", undefined);
  }

  /**
   * Advance the simulation by `dt` seconds. Fixed order every step:
   * 1. Force generators accumulate forces (gravity, drag, springs).
   * 2. The integrator turns accumulated force/torque into new velocity and position.
   * 3. Constraints correct positions/velocities (rods, pins).
   * 4. Collisions are detected and resolved, against both other bodies and the boundary.
   */
  step(dt: number): void {
    for (const force of this.forces) force.apply(dt);
    for (const body of this.bodies) this.integrator(body, dt);
    for (const constraint of this.constraints) constraint.solve(dt);

    for (let iteration = 0; iteration < this.collisionIterations; iteration++) {
      for (let i = 0; i < this.bodies.length; i++) {
        const a = this.bodies[i]!;
        for (let j = i + 1; j < this.bodies.length; j++) {
          const b = this.bodies[j]!;
          if (a.isStatic && b.isStatic) continue;
          const contact = detectCollision(a, b);
          if (contact) {
            resolveCollision(contact);
            if (iteration === 0) this.events.emit("collision", contact);
          }
        }
        if (this.boundary) {
          for (const boundaryContact of detectBoundaryCollisions(
            a,
            this.boundary,
          )) {
            resolveBoundaryCollision(boundaryContact);
            if (iteration === 0)
              this.events.emit("boundaryCollision", boundaryContact);
          }
        }
      }
    }

    this.time += dt;
    this.events.emit("step", { dt, time: this.time });
  }

  // --- Educational aggregate readouts --------------------------------------

  get totalKineticEnergy(): number {
    return this.bodies.reduce((sum, b) => sum + b.totalKineticEnergy, 0);
  }

  totalPotentialEnergy(g: number, groundY = 0): number {
    return this.bodies.reduce(
      (sum, b) => sum + b.potentialEnergy(g, groundY),
      0,
    );
  }

  get totalMomentum(): { x: number; y: number } {
    return this.bodies.reduce(
      (sum, b) => ({ x: sum.x + b.momentum.x, y: sum.y + b.momentum.y }),
      { x: 0, y: 0 },
    );
  }
}
