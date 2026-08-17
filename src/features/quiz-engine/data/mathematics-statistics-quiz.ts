import type { QuizMeta, QuizQuestion } from "../types";

/** Matches Measures of Central Tendency and Measures of Dispersion. */
const questions: QuizQuestion[] = [
  {
    id: "mathematics-statistics-001",
    type: "multiple-choice",
    question: "How is the mean of a dataset calculated?",
    options: [
      "The sum of all values divided by how many values there are",
      "The middle value when the data is sorted",
      "The value that appears most often",
      "The largest value minus the smallest value",
    ],
    correctAnswer: "The sum of all values divided by how many values there are",
    explanation: "The mean (average) is the total of all values divided by the count of values.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "statistics",
  },
  {
    id: "mathematics-statistics-002",
    type: "multiple-choice",
    question: "The mode of a dataset is:",
    options: ["The middle value", "The average value", "The value that occurs most frequently", "The range of values"],
    correctAnswer: "The value that occurs most frequently",
    explanation: "The mode is whichever value shows up most often — a dataset can have one mode, several, or none.",
    difficulty: "easy",
    subject: "mathematics",
    topic: "statistics",
  },
  {
    id: "mathematics-statistics-003",
    type: "multiple-choice",
    question:
      "A dataset of test scores is mostly in the 70s and 80s, but one student scored a 5. Compared to the median, the mean will be:",
    options: [
      "Pulled noticeably lower by the outlier",
      "Completely unaffected by the outlier",
      "Pulled higher than the median",
      "Exactly equal to the median regardless",
    ],
    correctAnswer: "Pulled noticeably lower by the outlier",
    explanation:
      "The mean uses every value in its calculation, so one extreme score drags it down. The median only cares about the middle position, so it barely moves.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "statistics",
  },
  {
    id: "mathematics-statistics-004",
    type: "multiple-choice",
    question: "The range of a dataset is found by:",
    options: [
      "Subtracting the smallest value from the largest value",
      "Adding the smallest and largest values",
      "Dividing the largest value by the smallest",
      "Averaging the smallest and largest values",
    ],
    correctAnswer: "Subtracting the smallest value from the largest value",
    explanation: "Range = maximum − minimum. It's the simplest measure of how spread out a dataset is.",
    difficulty: "medium",
    subject: "mathematics",
    topic: "statistics",
  },
  {
    id: "mathematics-statistics-005",
    type: "multiple-choice",
    question: "Two datasets have the same mean, but Dataset A has a much larger standard deviation than Dataset B. This tells you:",
    options: [
      "Dataset A's values are more tightly clustered around the mean",
      "Dataset A's values are more spread out from the mean",
      "Dataset A must have a higher mean",
      "Standard deviation says nothing about spread",
    ],
    correctAnswer: "Dataset A's values are more spread out from the mean",
    explanation:
      "Standard deviation measures typical distance from the mean — a larger value means the data is more spread out, even if both datasets share the same average.",
    difficulty: "hard",
    subject: "mathematics",
    topic: "statistics",
  },
];

export const mathematicsStatisticsQuiz: QuizMeta = {
  id: "mathematics-statistics",
  title: "Statistics Quiz",
  subjectSlug: "mathematics",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  backHref: "/dashboard/mathematics/central-tendency",
  description: "Test your understanding of mean, median, mode, range, and standard deviation.",
  difficulty: "medium",
  estimatedTime: 4,
  questions,
};
