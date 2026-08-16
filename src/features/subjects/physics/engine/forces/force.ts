/**
 * A `ForceGenerator` applies a force to one or more bodies every step,
 * via `World.addForce()`. This is the same pattern real physics engines
 * (Box2D, matter.js) use: forces are objects with an `apply` method
 * rather than special-cased branches inside the integrator, so adding a
 * new kind of force (e.g. a magnetic field for an electric-field
 * simulation) never requires touching `World` itself.
 */
export interface ForceGenerator {
  /** Called once per `World.step()`, before integration. Call `body.applyForce(...)` here. */
  apply(dt: number): void;
}
