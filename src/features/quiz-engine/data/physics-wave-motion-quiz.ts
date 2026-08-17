import type { QuizMeta, QuizQuestion } from "../types";

/** Matches Basic Wave Motion, Frequency & Period, and Wave Speed. */
const questions: QuizQuestion[] = [
  {
    id: "physics-wave-motion-001",
    type: "multiple-choice",
    question: "Wavelength is best described as:",
    options: [
      "The distance between two consecutive crests (or troughs) of a wave",
      "How high a wave rises above its resting position",
      "How many waves pass a point each second",
      "The speed at which a wave travels",
    ],
    correctAnswer: "The distance between two consecutive crests (or troughs) of a wave",
    explanation: "Wavelength is a length measurement — the distance over which the wave's pattern repeats.",
    difficulty: "easy",
    subject: "physics",
    topic: "wave-motion",
  },
  {
    id: "physics-wave-motion-002",
    type: "multiple-choice",
    question: "Amplitude describes:",
    options: [
      "How far the wave displaces from its resting (equilibrium) position",
      "How fast the wave moves",
      "The time for one full oscillation",
      "The number of oscillations per second",
    ],
    correctAnswer: "How far the wave displaces from its resting (equilibrium) position",
    explanation: "Amplitude is the maximum displacement from equilibrium — it relates to the wave's energy, not its speed.",
    difficulty: "easy",
    subject: "physics",
    topic: "wave-motion",
  },
  {
    id: "physics-wave-motion-003",
    type: "multiple-choice",
    question:
      "On the simulation, if you increase a wave's frequency while keeping the wave speed constant, what happens to its wavelength?",
    options: ["It increases", "It decreases", "It stays the same", "It depends on the amplitude"],
    correctAnswer: "It decreases",
    explanation:
      "Since v = fλ, if speed v is fixed and frequency f goes up, wavelength λ must go down to keep the product constant.",
    difficulty: "medium",
    subject: "physics",
    topic: "wave-motion",
  },
  {
    id: "physics-wave-motion-004",
    type: "multiple-choice",
    question: "How is a wave's period related to its frequency?",
    options: [
      "Period is the reciprocal of frequency: T = 1/f",
      "Period and frequency are always equal",
      "Period is frequency multiplied by wavelength",
      "Period has no relationship to frequency",
    ],
    correctAnswer: "Period is the reciprocal of frequency: T = 1/f",
    explanation: "Frequency counts oscillations per second, while period is the time for one oscillation — they're reciprocals of each other.",
    difficulty: "medium",
    subject: "physics",
    topic: "wave-motion",
  },
  {
    id: "physics-wave-motion-005",
    type: "multiple-choice",
    question: "A wave has a frequency of 2 Hz and a wavelength of 3 m. What is its speed?",
    options: ["1.5 m/s", "5 m/s", "6 m/s", "0.67 m/s"],
    correctAnswer: "6 m/s",
    explanation: "Using v = fλ: v = 2 \\text{ Hz} \\times 3 \\text{ m} = 6 \\text{ m/s}.",
    difficulty: "hard",
    subject: "physics",
    topic: "wave-motion",
  },
];

export const physicsWaveMotionQuiz: QuizMeta = {
  id: "physics-wave-motion",
  title: "Wave Motion Quiz",
  subjectSlug: "physics",
  subjectLabel: "Physics",
  topicLabel: "Wave Motion",
  colorToken: "physics",
  backHref: "/dashboard/physics/basic-wave-motion",
  description: "Test your understanding of wavelength, amplitude, frequency, period, and wave speed.",
  difficulty: "medium",
  estimatedTime: 4,
  questions,
};
