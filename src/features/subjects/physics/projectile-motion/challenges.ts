import type { Trajectory } from "./physics";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  hint: string;
  /**
   * Optional fixed target x-position (meters) drawn on the ground.
   * For the moving-target challenge this is the target's position at
   * t = 0; `targetSpeed` then shifts it over time.
   */
  targetX?: number;
  /** Meters/second the target moves (positive = away from launch point). Only set for moving targets. */
  targetSpeed?: number;
  toleranceMeters: number;
  /** Returns true if the trajectory satisfies the objective. */
  check: (trajectory: Trajectory) => boolean;
}

export const challenges: Challenge[] = [
  {
    id: "hit-50m",
    title: "Reach exactly 50 m",
    description: "Adjust velocity and angle so the projectile lands as close to 50 m as possible.",
    hint: "Try 45° first, then fine-tune velocity — range grows with the square of velocity.",
    targetX: 50,
    toleranceMeters: 2,
    check: (t) => Math.abs(t.range - 50) <= 2,
  },
  {
    id: "airtime-8s",
    title: "Stay airborne for 8 seconds",
    description: "Find a combination of velocity, angle, and gravity that keeps the projectile flying for 8 seconds.",
    hint: "Time of flight depends on vertical velocity and gravity — try a high angle and lower gravity.",
    toleranceMeters: 0,
    check: (t) => Math.abs(t.timeOfFlight - 8) <= 0.3,
  },
  {
    id: "hit-target-100m",
    title: "Hit a target at 100 m",
    description: "A fixed target sits 100 m from the launch point. Land the projectile within the marked zone.",
    hint: "100 m needs more velocity than the default — try increasing launch velocity before touching the angle.",
    targetX: 100,
    toleranceMeters: 3,
    check: (t) => Math.abs(t.range - 100) <= 3,
  },
  {
    id: "moving-target",
    title: "Hit the moving target",
    description:
      "The target starts at 40 m and drifts outward at 3 m/s. Time your launch parameters so the projectile lands where the target will be when it arrives.",
    hint: "Estimate the target's position at your expected time of flight: 40 + 3 × T, then aim for that range.",
    targetX: 40,
    targetSpeed: 3,
    toleranceMeters: 3,
    check: (t) => {
      const targetPositionAtLanding = 40 + 3 * t.timeOfFlight;
      return Math.abs(t.range - targetPositionAtLanding) <= 3;
    },
  },
];
