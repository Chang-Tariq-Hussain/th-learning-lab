import type { QuizMeta, QuizQuestion } from "../types";

/** Matches Measurement Explorer and Perimeter & Area Explorer. */
const questions: QuizQuestion[] = [
  {
    id: "mathematics-measurement-001",
    type: "multiple-choice",
    question: "What is the base unit of length in the metric system?",
    options: ["The centimetre", "The metre", "The kilometre", "The millimetre"],
    correctAnswer: "The metre",
    explanation: "The metre is the base unit; centimetres, millimetres, and kilometres are all scaled from it.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "measurement",
  },
  {
    id: "mathematics-measurement-002",
    type: "multiple-choice",
    question: "The perimeter of a shape is:",
    options: [
      "The total distance around its boundary",
      "The number of unit squares it covers",
      "The distance across its widest point",
      "Half the distance around its boundary",
    ],
    correctAnswer: "The total distance around its boundary",
    explanation: "Perimeter is found by adding up the lengths of all the sides that make up the shape's boundary.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "measurement",
  },
  {
    id: "mathematics-measurement-003",
    type: "multiple-choice",
    question: "A rectangle is 5 m long and 3 m wide. What is its area?",
    options: ["8 m²", "15 m²", "16 m²", "10 m²"],
    correctAnswer: "15 m²",
    explanation: "Area of a rectangle is A = lw, so 5 m × 3 m = 15 m².",
    difficulty: "medium",
    subject: "mathematics",
    topic: "measurement",
  },
  {
    id: "mathematics-measurement-004",
    type: "multiple-choice",
    question: "What is 250 cm converted to metres?",
    options: ["0.25 m", "2.5 m", "25 m", "2500 m"],
    correctAnswer: "2.5 m",
    explanation: "Since 1 m = 100 cm, dividing 250 by 100 gives 2.5 m.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "measurement",
  },
  {
    id: "mathematics-measurement-005",
    type: "multiple-choice",
    question:
      "A 4 m × 4 m square and a 2 m × 6 m rectangle both have a perimeter of 16 m. What is true about their areas?",
    options: [
      "They must also be equal",
      "The square's area (16 m²) is larger than the rectangle's (12 m²)",
      "The rectangle's area is always larger for the same perimeter",
      "Area can't be compared without also knowing the shape's angles",
    ],
    correctAnswer: "The square's area (16 m²) is larger than the rectangle's (12 m²)",
    explanation:
      "Equal perimeter doesn't guarantee equal area — here the square encloses 16 m² while the more elongated rectangle only encloses 12 m². For a fixed perimeter, a square encloses the most area among rectangles.",
    difficulty: "hard",
    subject: "mathematics",
    topic: "measurement",
  },
];

export const mathematicsMeasurementQuiz: QuizMeta = {
  id: "mathematics-measurement",
  title: "Measurement Quiz",
  subjectSlug: "mathematics",
  subjectLabel: "Mathematics",
  topicLabel: "Measurement",
  colorToken: "math",
  backHref: "/dashboard/mathematics/measurement-explorer",
  description: "Test your understanding of units, perimeter, and area.",
  difficulty: "medium",
  estimatedTime: 4,
  questions,
};
