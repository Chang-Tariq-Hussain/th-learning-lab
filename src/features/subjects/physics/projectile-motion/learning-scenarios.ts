export interface LearningScenario {
  id: string;
  question: string;
  explanation: string;
  /** Parameter values to apply when this scenario is selected (partial — merged over current values). */
  apply: {
    speed?: number;
    angleDeg?: number;
    gravityPreset?: string;
    customGravity?: number;
    airResistance?: string;
  };
}

export const learningScenarios: LearningScenario[] = [
  {
    id: "angle-increase",
    question: "What happens if the launch angle increases?",
    explanation:
      "Range grows until 45°, then shrinks again — 45° gives the maximum range for a given speed on flat ground. Beyond 45°, the projectile spends more time going up than covering distance, so height increases but range falls off.",
    apply: { angleDeg: 70, speed: 40 },
  },
  {
    id: "gravity-decrease",
    question: "What happens if gravity decreases?",
    explanation:
      "Lower gravity means a weaker downward pull, so the projectile takes longer to fall back — time of flight and range both increase, and the trajectory arcs higher for the same launch conditions.",
    apply: { gravityPreset: "moon", speed: 40, angleDeg: 45 },
  },
  {
    id: "moon",
    question: "What happens on the Moon?",
    explanation:
      "Moon gravity is about 1/6th of Earth's. The same launch speed and angle sends the projectile roughly six times higher and six times farther, and it stays airborne much longer.",
    apply: { gravityPreset: "moon", speed: 25, angleDeg: 45 },
  },
  {
    id: "velocity-double",
    question: "What happens if velocity doubles?",
    explanation:
      "Range depends on the square of velocity (R = v² sin2θ / g), so doubling velocity quadruples the range — not just doubles it. Maximum height quadruples too, for the same reason.",
    apply: { speed: 50, angleDeg: 45, gravityPreset: "earth" },
  },
  {
    id: "low-angle",
    question: "What happens with a very low angle?",
    explanation:
      "A shallow angle sends most of the velocity horizontally, so the projectile barely rises before hitting the ground — short flight time, short range, and a nearly flat trajectory.",
    apply: { angleDeg: 10, speed: 40 },
  },
  {
    id: "high-angle",
    question: "What happens with a very high angle (near 90°)?",
    explanation:
      "Near 90°, almost all velocity is vertical — the projectile goes nearly straight up and comes straight back down close to the launch point. Maximum height is high, but range approaches zero.",
    apply: { angleDeg: 85, speed: 40 },
  },
];
