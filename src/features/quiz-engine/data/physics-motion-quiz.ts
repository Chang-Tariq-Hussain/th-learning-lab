import type { QuizMeta, QuizQuestion } from "../types";

/**
 * Sample content for the Quiz Engine's first quiz: basic conceptual
 * Physics/Motion, matching the existing "Simple Motion" and
 * "Projectile Motion" simulations under the Kinematics topic. Kept
 * conceptual (no multi-step numerical problems) — this quiz exists to
 * prove the engine, not to be a finished Kinematics assessment.
 */
const questions: QuizQuestion[] = [
  {
    id: "physics-motion-001",
    type: "multiple-choice",
    question: "What does 'distance' measure?",
    options: [
      "The total length of the path an object travels",
      "The straight-line change in an object's position",
      "How fast an object is going",
      "The direction an object is moving",
    ],
    correctAnswer: "The total length of the path an object travels",
    explanation:
      "Distance is a scalar — it's the total length of the path travelled, regardless of direction, so it can never decrease during a journey.",
    difficulty: "easy",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-002",
    type: "multiple-choice",
    question: "What does 'displacement' measure?",
    options: [
      "The total length of the path travelled",
      "The straight-line distance and direction from start to end point",
      "The speed at the end of a journey",
      "The time taken to travel",
    ],
    correctAnswer: "The straight-line distance and direction from start to end point",
    explanation:
      "Displacement is a vector — it only cares about the straight-line change from start to end position, including direction, not the path taken.",
    difficulty: "easy",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-003",
    type: "multiple-choice",
    question: "A runner jogs 400 m around a track and finishes back at the start. What is their displacement?",
    options: ["400 m", "200 m", "0 m", "800 m"],
    correctAnswer: "0 m",
    explanation:
      "Displacement depends only on start and end position. Since the runner ends up back where they started, the displacement is zero — even though the distance travelled was 400 m.",
    difficulty: "medium",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-004",
    type: "multiple-choice",
    question: "What is speed?",
    options: [
      "Distance travelled per unit time",
      "Displacement per unit time",
      "The rate of change of velocity",
      "Force multiplied by mass",
    ],
    correctAnswer: "Distance travelled per unit time",
    explanation: "Speed is distance travelled per unit time. It's a scalar — it has a size but no direction.",
    difficulty: "easy",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-005",
    type: "multiple-choice",
    question: "What is velocity?",
    options: [
      "Distance travelled per unit time",
      "Displacement per unit time",
      "Force × mass",
      "Mass / acceleration",
    ],
    correctAnswer: "Displacement per unit time",
    explanation: "Velocity is displacement per unit time and includes direction, which is what makes it a vector.",
    difficulty: "easy",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-006",
    type: "multiple-choice",
    question: "Which pair correctly matches quantity to type?",
    options: [
      "Speed is a vector, velocity is a scalar",
      "Speed is a scalar, velocity is a vector",
      "Both speed and velocity are vectors",
      "Both speed and velocity are scalars",
    ],
    correctAnswer: "Speed is a scalar, velocity is a vector",
    explanation:
      "Speed has only a magnitude (a scalar), while velocity has both a magnitude and a direction (a vector) — that's the key distinction between the two.",
    difficulty: "medium",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-007",
    type: "multiple-choice",
    question: "What is acceleration?",
    options: [
      "The rate of change of distance",
      "The rate of change of velocity",
      "The total distance divided by total time",
      "A synonym for speed",
    ],
    correctAnswer: "The rate of change of velocity",
    explanation:
      "Acceleration measures how quickly velocity changes over time — an object can accelerate by speeding up, slowing down, or changing direction.",
    difficulty: "medium",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-008",
    type: "multiple-choice",
    question: "A car slows down while travelling in a straight line. What is happening to its acceleration?",
    options: [
      "It is zero, since the car isn't speeding up",
      "It is in the same direction as the car's motion",
      "It is in the opposite direction to the car's motion",
      "Acceleration only applies to speeding up, not slowing down",
    ],
    correctAnswer: "It is in the opposite direction to the car's motion",
    explanation:
      "Slowing down is still a change in velocity, so it's still acceleration — specifically, acceleration pointing opposite to the direction of travel (sometimes called deceleration).",
    difficulty: "hard",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-009",
    type: "multiple-choice",
    question: "Which unit correctly measures speed?",
    options: ["kg", "m/s", "N", "s"],
    correctAnswer: "m/s",
    explanation: "Speed is distance per unit time, so its SI unit is metres per second (m/s).",
    difficulty: "easy",
    subject: "physics",
    topic: "motion",
  },
  {
    id: "physics-motion-010",
    type: "multiple-choice",
    question: "Which unit correctly measures acceleration?",
    options: ["m/s", "m/s²", "kg·m/s", "m"],
    correctAnswer: "m/s²",
    explanation:
      "Acceleration is the rate of change of velocity (m/s) with respect to time (s), giving units of metres per second squared (m/s²).",
    difficulty: "medium",
    subject: "physics",
    topic: "motion",
  },
];

export const physicsMotionQuiz: QuizMeta = {
  id: "physics-motion",
  title: "Motion Basics",
  subjectSlug: "physics",
  subjectLabel: "Physics",
  topicLabel: "Motion",
  colorToken: "physics",
  backHref: "/dashboard/physics",
  questions,
};
