import type { QuizMeta, QuizQuestion } from "../types";

/**
 * Matches the Coordinate Geometry topic's simulations — Coordinate
 * Plane Explorer, Plot a Point, Distance Between Two Points, and
 * Midpoint of a Line Segment.
 */
const questions: QuizQuestion[] = [
  {
    id: "mathematics-coordinate-geometry-001",
    type: "multiple-choice",
    question: "In the coordinate plane, which axis runs horizontally?",
    options: ["The x-axis", "The y-axis", "Both run horizontally", "Neither — they're diagonal"],
    correctAnswer: "The x-axis",
    explanation: "By convention the x-axis is horizontal and the y-axis is vertical; they meet at the origin.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "coordinate-geometry",
  },
  {
    id: "mathematics-coordinate-geometry-002",
    type: "multiple-choice",
    question: "What are the coordinates of the origin?",
    options: ["(1, 1)", "(0, 0)", "(0, 1)", "(1, 0)"],
    correctAnswer: "(0, 0)",
    explanation: "The origin is the point where the x-axis and y-axis cross, so both coordinates are zero.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "coordinate-geometry",
  },
  {
    id: "mathematics-coordinate-geometry-003",
    type: "multiple-choice",
    question: "The point (3, -2) lies in which quadrant?",
    options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
    correctAnswer: "Quadrant IV",
    explanation: "Quadrant IV has positive x and negative y — exactly the sign pattern of (3, -2).",
    difficulty: "medium",
    subject: "mathematics",
    topic: "coordinate-geometry",
  },
  {
    id: "mathematics-coordinate-geometry-004",
    type: "multiple-choice",
    question: "What is the distance between the points (1, 2) and (4, 6)?",
    options: ["5", "7", "3", "25"],
    correctAnswer: "5",
    explanation:
      "Using d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}: \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = \\sqrt{25} = 5.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "coordinate-geometry",
  },
  {
    id: "mathematics-coordinate-geometry-005",
    type: "multiple-choice",
    question: "What is the midpoint of the segment joining (2, 3) and (8, -1)?",
    options: ["(5, 1)", "(3, 4)", "(6, 2)", "(5, -1)"],
    correctAnswer: "(5, 1)",
    explanation:
      "The midpoint formula averages each coordinate: \\left(\\frac{2+8}{2}, \\frac{3+(-1)}{2}\\right) = (5, 1).",
    difficulty: "hard",
    subject: "mathematics",
    topic: "coordinate-geometry",
  },
];

export const mathematicsCoordinateGeometryQuiz: QuizMeta = {
  id: "mathematics-coordinate-geometry",
  title: "Coordinate Geometry Quiz",
  subjectSlug: "mathematics",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  backHref: "/dashboard/mathematics/coordinate-plane-explorer",
  description: "Test your understanding of the coordinate plane, quadrants, distance, and midpoint.",
  difficulty: "medium",
  estimatedTime: 4,
  questions,
};
