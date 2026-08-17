import type { QuizMeta, QuizQuestion } from "../types";

/** Matches Calculus Foundations — functions, limits, and continuity, before derivatives. */
const questions: QuizQuestion[] = [
  {
    id: "mathematics-calculus-001",
    type: "multiple-choice",
    question: "A limit describes:",
    options: [
      "The exact value of a function at a point",
      "The value a function approaches as the input gets close to some value",
      "The highest point on a graph",
      "The area under a curve",
    ],
    correctAnswer: "The value a function approaches as the input gets close to some value",
    explanation:
      "A limit is about behavior *near* a point, not necessarily the function's value *at* that point — the two can even differ.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "calculus",
  },
  {
    id: "mathematics-calculus-002",
    type: "multiple-choice",
    question: "A function is continuous at a point if:",
    options: [
      "It has no gaps, jumps, or holes at that point",
      "It is always increasing there",
      "Its slope is zero there",
      "It has a maximum value there",
    ],
    correctAnswer: "It has no gaps, jumps, or holes at that point",
    explanation: "Continuity means you could trace the graph through that point without lifting your pen.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "calculus",
  },
  {
    id: "mathematics-calculus-003",
    type: "multiple-choice",
    question: "For a two-sided limit to exist at a point, what must be true?",
    options: [
      "The function must be defined at that exact point",
      "The left-hand and right-hand limits must be equal",
      "The function must be increasing on both sides",
      "The graph must have a sharp corner there",
    ],
    correctAnswer: "The left-hand and right-hand limits must be equal",
    explanation:
      "Approaching from the left and from the right must give the same value — if they disagree, the two-sided limit doesn't exist, even if the function is defined there.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "calculus",
  },
  {
    id: "mathematics-calculus-004",
    type: "multiple-choice",
    question: "A secant line connecting two points on a curve becomes a tangent line when:",
    options: [
      "The two points move infinitely far apart",
      "The two points merge together, in the limit",
      "The curve becomes a straight line",
      "The slope of the secant line reaches zero",
    ],
    correctAnswer: "The two points merge together, in the limit",
    explanation:
      "As the second point slides toward the first, the secant line's slope approaches the tangent line's slope — this limiting process is the core idea behind the derivative.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "calculus",
  },
  {
    id: "mathematics-calculus-005",
    type: "multiple-choice",
    question:
      "A function has a hole at x = 2 (it's undefined there), but the graph approaches y = 5 from both sides as x nears 2. What can you say?",
    options: [
      "The limit as x approaches 2 doesn't exist",
      "The limit as x approaches 2 is 5, even though the function isn't continuous there",
      "The function's value at x = 2 must also be 5",
      "This situation is impossible",
    ],
    correctAnswer: "The limit as x approaches 2 is 5, even though the function isn't continuous there",
    explanation:
      "A limit only cares about the approach, not the actual value at the point — so the limit can exist and equal 5 even while the function itself is undefined there, making it discontinuous.",
    difficulty: "hard",
    subject: "mathematics",
    topic: "calculus",
  },
];

export const mathematicsCalculusQuiz: QuizMeta = {
  id: "mathematics-calculus",
  title: "Calculus Basics Quiz",
  subjectSlug: "mathematics",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  backHref: "/dashboard/mathematics/calculus-foundations",
  description: "Test your understanding of functions, limits, continuity, and the idea behind the tangent line.",
  difficulty: "medium",
  estimatedTime: 4,
  questions,
};
