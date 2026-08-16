/**
 * 2D vector math — the foundation every other module in this engine is
 * built on (forces, velocities, collision normals, spring displacement).
 *
 * Design choice: instance methods with an `InPlace` suffix mutate `this`
 * and return `this`, so a hot loop (e.g. `world.step()` integrating a
 * few hundred bodies at 60 FPS) can update a vector without allocating
 * a new object every frame. Methods without that suffix return a new
 * `Vector2`, which reads more naturally for one-off math in teaching
 * code (e.g. `Vector2.reflect(velocity, normal)` inside a lesson).
 * Both styles share the same underlying formulas.
 *
 * Implements the plain `{x, y}` shape used throughout
 * `@/features/simulation` (`Point2D`), so a `Vector2` can be passed
 * anywhere a `Point2D` is expected (e.g. the framework's
 * `worldToScreen`) without conversion.
 */
export class Vector2 {
  constructor(
    public x = 0,
    public y = 0,
  ) {}

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static from(point: { x: number; y: number }): Vector2 {
    return new Vector2(point.x, point.y);
  }

  /** Unit vector pointing at `angleRad` radians, measured counter-clockwise from +x. */
  static fromAngle(angleRad: number, length = 1): Vector2 {
    return new Vector2(
      Math.cos(angleRad) * length,
      Math.sin(angleRad) * length,
    );
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copyFrom(v: { x: number; y: number }): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  // --- Non-mutating (return a new Vector2) -------------------------------

  add(v: { x: number; y: number }): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: { x: number; y: number }): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  normalize(): Vector2 {
    const m = this.magnitude();
    if (m === 0) return new Vector2(0, 0);
    return new Vector2(this.x / m, this.y / m);
  }

  /** Rotate counter-clockwise by `angleRad` radians about the origin. */
  rotate(angleRad: number): Vector2 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
    );
  }

  /** The vector rotated +90°, useful for deriving a normal from a tangent. */
  perpendicular(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  // --- Mutating (in place, no allocation) --------------------------------

  addInPlace(v: { x: number; y: number }): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subInPlace(v: { x: number; y: number }): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scaleInPlace(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  /** Add `v` scaled by `s` — the single most common operation in an integrator (`x += v * dt`). */
  addScaledInPlace(v: { x: number; y: number }, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }

  normalizeInPlace(): this {
    const m = this.magnitude();
    if (m === 0) return this;
    this.x /= m;
    this.y /= m;
    return this;
  }

  // --- Scalar-producing queries -------------------------------------------

  magnitude(): number {
    return Math.hypot(this.x, this.y);
  }

  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /** Angle of this vector from +x axis, radians, in (-π, π]. */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  toString(): string {
    return `(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  // --- Static two-argument operations -------------------------------------

  static add(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): Vector2 {
    return new Vector2(a.x + b.x, a.y + b.y);
  }

  static sub(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): Vector2 {
    return new Vector2(a.x - b.x, a.y - b.y);
  }

  static distance(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static distanceSquared(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /** a · b — projects one vector's magnitude onto the other; zero when perpendicular. */
  static dot(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * 2D "cross product" — really the z-component of the 3D cross product
   * of (a.x, a.y, 0) × (b.x, b.y, 0). A scalar, not a vector: positive
   * when `b` is counter-clockwise from `a`. Used for signed area, angular
   * momentum (r × v), and torque (r × F) in this engine.
   */
  static cross(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    return a.x * b.y - a.y * b.x;
  }

  /** Cross of a vector with a scalar (angular velocity ω): ω × v, giving tangential velocity. */
  static crossScalar(scalar: number, v: { x: number; y: number }): Vector2 {
    return new Vector2(-scalar * v.y, scalar * v.x);
  }

  /** Angle between two vectors, radians, always in [0, π] (unsigned). */
  static angleBetween(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    const denom = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y);
    if (denom === 0) return 0;
    const cos = Vector2.dot(a, b) / denom;
    return Math.acos(Math.min(1, Math.max(-1, cos)));
  }

  /** Component of `a` in the direction of `b` (scalar projection × direction of b). */
  static project(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): Vector2 {
    const bMagSq = b.x * b.x + b.y * b.y;
    if (bMagSq === 0) return new Vector2(0, 0);
    const scalar = Vector2.dot(a, b) / bMagSq;
    return new Vector2(b.x * scalar, b.y * scalar);
  }

  /**
   * Reflect `v` off a surface with unit normal `normal` — the standard
   * `v' = v - 2(v·n)n` formula, used for bounces off walls/ground when a
   * full impulse-based collision response would be overkill.
   */
  static reflect(
    v: { x: number; y: number },
    normal: { x: number; y: number },
  ): Vector2 {
    const n = Vector2.from(normal).normalize();
    const d = 2 * Vector2.dot(v, n);
    return new Vector2(v.x - d * n.x, v.y - d * n.y);
  }

  /** Linear interpolation between `a` and `b`; `t = 0` → a, `t = 1` → b. */
  static lerp(
    a: { x: number; y: number },
    b: { x: number; y: number },
    t: number,
  ): Vector2 {
    return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  }
}
