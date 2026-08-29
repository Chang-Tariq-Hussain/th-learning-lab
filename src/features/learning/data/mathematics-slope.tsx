import type { TopicContent } from "../types";

/**
 * Slope of a Line, Mathematics Batch 3 topic 5 of 6 (Coordinate
 * Geometry). Reuses the existing Slope of a Line simulation
 * (`@/features/subjects/mathematics/slope-of-a-line`) as-is — two
 * draggable points, a live rise/run right-triangle breakdown, a
 * Slope Types selector (positive/negative/zero/undefined presets),
 * and its own Calculate mode. No simulation changes were needed.
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-slope-quiz.ts`), distinct
 * from the older shared `mathematics-straight-line` bank (which mixes
 * slope and equation-of-line questions together). The GLE Challenge
 * section embeds the live simulation for "create a line with this
 * slope" scenarios, per the spec's "Slope Target" idea.
 */
export const mathematicsSlopeContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "slope-of-a-line",
  title: "Slope of a Line",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/slope-of-a-line",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Calculate the slope of a line given two points.",
      "Explain slope as a ratio of vertical change (rise) to horizontal change (run).",
      "Identify a line as having positive, negative, zero, or undefined slope just by looking at it.",
      "Predict how a line's steepness and direction change as its slope changes.",
    ],
    concepts: [
      {
        term: "Rise and run",
        explanation:
          "\"Rise\" is how far you move vertically between two points; \"run\" is how far you move horizontally. Slope is simply rise divided by run.",
      },
      {
        term: "Slope formula",
        explanation: "Given two points, subtract their y-values for the rise and their x-values for the run.",
        formula: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}",
        formulaCaption: "m = slope",
      },
      {
        term: "Reading the sign",
        explanation:
          "Positive slope means the line rises left to right. Negative slope means it falls. Zero slope is a flat, horizontal line. A vertical line has undefined slope, since the run is zero and division by zero isn't defined.",
      },
      {
        term: "Steepness",
        explanation:
          "The larger the absolute value of the slope, the steeper the line. A slope of 5 rises much faster than a slope of 0.5.",
      },
    ],
    whyItMatters:
      "Slope shows up everywhere once you start looking — it's the grade of a road, the pitch of a roof, the rate a savings account grows, or how fast a car's speed changes over time. In every one of these, slope is answering the same question: for every step forward, how much does the other quantity change? That's exactly what makes it one of the most reused ideas in math and science.",
    keyTerms: [
      { term: "Slope (m)", definition: "A measure of a line's steepness and direction: rise divided by run." },
      { term: "Rise", definition: "The vertical change between two points on a line." },
      { term: "Run", definition: "The horizontal change between two points on a line." },
      { term: "Undefined slope", definition: "The slope of a vertical line, where run = 0 and division by zero isn't defined." },
    ],
    misconceptions: [
      {
        id: "misconception-slope-implies-position",
        misconception: "A line with a larger slope value must be positioned higher up on the graph.",
        correction:
          "Slope only describes steepness and direction — how fast the line rises or falls. Where the line actually sits on the graph is controlled separately, by its y-intercept, which slope alone says nothing about.",
      },
      {
        id: "misconception-slope-order-matters",
        misconception: "You have to pick the two points in the \"right\" order, or the slope formula gives a different answer.",
        correction:
          "Swapping which point is (x₁,y₁) and which is (x₂,y₂) negates both the rise and the run at the same time. A negative divided by a negative is positive, so the final slope value comes out exactly the same either way.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each answer, then check it by dragging the points in Slope of a Line below.",
    scenarios: [
      {
        id: "mathematics-slope-predict-001",
        scenario: "You compare two lines: one with slope 5 and one with slope 2.",
        question: "Which line has the greater slope, and which is steeper?",
        options: [
          { id: "five", label: "Slope 5 — it's steeper" },
          { id: "two", label: "Slope 2 — it's steeper" },
          { id: "same", label: "They're equally steep" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "five",
        explanation: "A larger absolute slope value always means a steeper line — 5 rises much faster than 2 for the same horizontal step.",
        hint: "Compare the absolute values of the two slopes.",
      },
      {
        id: "mathematics-slope-predict-002",
        scenario: "You drag point B so the line between A and B becomes steeper and steeper, tilting toward vertical.",
        question: "What happens to the slope value as the line approaches vertical?",
        options: [
          { id: "grows-then-undefined", label: "It grows larger and larger, becoming undefined exactly at vertical" },
          { id: "shrinks-to-zero", label: "It shrinks toward zero" },
          { id: "stays-constant", label: "It stays constant" },
          { id: "flips-sign", label: "It immediately flips sign" },
        ],
        actualResultOptionId: "grows-then-undefined",
        explanation: "As the run shrinks toward zero, the slope (rise/run) grows without bound, becoming undefined exactly when the line is perfectly vertical.",
        hint: "What happens to a fraction's value as its denominator shrinks toward zero?",
      },
      {
        id: "mathematics-slope-predict-003",
        scenario: "You're about to make the line perfectly horizontal.",
        question: "What sign or value will the slope have?",
        options: [
          { id: "zero", label: "Exactly zero" },
          { id: "undefined", label: "Undefined" },
          { id: "positive", label: "Some positive value" },
          { id: "negative", label: "Some negative value" },
        ],
        actualResultOptionId: "zero",
        explanation: "A horizontal line has no vertical change at all, so rise = 0, making the slope exactly 0.",
        hint: "What is the rise for a perfectly flat line?",
      },
      {
        id: "mathematics-slope-predict-004",
        scenario: "You have a line with negative slope, then drag point B so the line starts rising instead of falling, without moving point A.",
        question: "What sign will the slope have now?",
        options: [
          { id: "positive", label: "Positive" },
          { id: "still-negative", label: "Still negative" },
          { id: "zero", label: "Zero" },
          { id: "undefined", label: "Undefined" },
        ],
        actualResultOptionId: "positive",
        explanation: "A line that rises from left to right always has positive slope, regardless of what it looked like before.",
        hint: "What sign of slope corresponds to a rising line?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag point A or point B anywhere on the grid.",
      "Watch the right triangle appear, showing the rise and run between the two points.",
      "Read the calculated slope value and its type (positive, negative, zero, or undefined) as you move the points.",
      "Use the Slope Types selector to jump straight to a positive, negative, zero, or undefined example.",
      "Switch to Calculate mode to practice finding the slope of fixed point pairs.",
    ],
    tryThis: [
      "Place the two points so the line has a slope of exactly 1. What do you notice about the triangle?",
      "Make the line perfectly vertical. What happens to the slope value, and why?",
      "Pick two points with a negative slope, then move point B so the slope becomes positive without moving point A.",
      "Try each of the four Slope Types presets and describe what makes each one look the way it does.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-slope-explain-001",
        question: "Why is slope defined as rise divided by run, rather than rise minus run or rise times run?",
        answer:
          "Slope is meant to capture a rate — how much y changes for each unit x changes. Dividing rise by run is exactly what turns \"total vertical change\" and \"total horizontal change\" into a per-unit rate, which is what makes it possible to compare steepness between lines of any length.",
      },
      {
        id: "mathematics-slope-explain-002",
        question: "Why does a vertical line have undefined slope instead of some very large number?",
        answer:
          "As a line gets closer and closer to vertical, its run shrinks toward zero while its rise stays nonzero, so rise/run grows without any upper bound. Exactly at vertical, the run is precisely zero, and division by zero has no defined value — so \"undefined\" is the mathematically honest answer, not a very large number.",
      },
      {
        id: "mathematics-slope-explain-003",
        question: "Why doesn't it matter which of the two points you subtract first in the slope formula?",
        answer:
          "Swapping the two points flips the sign of both the rise and the run at the same time, since both differences get reversed together. A negative divided by a negative equals a positive, so the ratio — and therefore the slope — comes out identical either way.",
      },
      {
        id: "mathematics-slope-explain-004",
        question: "Why can two very different-looking lines have the exact same slope?",
        answer:
          "Slope only measures steepness and direction, which depends purely on the ratio of rise to run — it says nothing about where the line is positioned. Two parallel lines can sit far apart on the graph yet still rise at identical rates, giving them the same slope.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-slope",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Slope Target
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Slope of a Line simulation above — drag point B to create each target slope, then answer below.",
    scenarios: [
      {
        id: "mathematics-slope-challenge-001",
        title: "Slope Target: Slope of 2",
        scenario: "Keep point A at its default position and drag point B until the simulation reads a slope of exactly 2.",
        objective: "What did you have to make the run equal, if the rise you chose was 6?",
        tools: [{ id: "points", label: "Draggable points A and B with a live rise/run/slope readout" }],
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        explanation: "Slope = rise/run, so 2 = 6/run means run = 3.",
        hints: [
          "Slope = rise ÷ run — rearrange to solve for run.",
          "6 ÷ run = 2, so run = 3.",
        ],
      },
      {
        id: "mathematics-slope-challenge-002",
        title: "Slope Target: Negative Slope",
        scenario: "Create a line with a negative slope in the simulation, where the rise is -4 and the run is 2.",
        objective: "What is the slope of this line?",
        tools: [{ id: "points", label: "Draggable points A and B with a live rise/run/slope readout" }],
        answer: { mode: "numeric", target: -2, tolerance: 0 },
        explanation: "Slope = rise/run = -4/2 = -2.",
        hints: [
          "Divide the rise by the run, keeping the sign.",
          "-4 ÷ 2 = -2.",
        ],
      },
      {
        id: "mathematics-slope-challenge-003",
        title: "Identify the Slope Type",
        scenario: "Load the \"undefined\" preset in Slope Types and observe the line.",
        objective: "What kind of line has undefined slope?",
        answer: {
          mode: "choice",
          options: [
            { id: "vertical", label: "A vertical line" },
            { id: "horizontal", label: "A horizontal line" },
            { id: "diagonal", label: "A diagonal line" },
            { id: "none", label: "No line has undefined slope" },
          ],
          correctOptionId: "vertical",
        },
        explanation: "A vertical line has zero run, and dividing by zero is undefined — that's exactly what \"undefined slope\" means.",
        hints: [
          "Think about which type of line has zero horizontal change.",
        ],
      },
      {
        id: "mathematics-slope-challenge-004",
        title: "Slope Target: Zero Slope",
        scenario: "Drag point B so the line becomes perfectly flat.",
        objective: "What is the slope of a perfectly flat (horizontal) line?",
        tools: [{ id: "points", label: "Draggable points A and B with a live rise/run/slope readout" }],
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "A horizontal line has zero rise, so its slope is always exactly 0.",
        hints: [
          "What is the rise for a flat line?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "midpoint-of-a-line-segment",
      label: "Midpoint",
      href: "/dashboard/mathematics/midpoint-of-a-line-segment",
      reason: "Compare how two points combine into different formulas — midpoint versus slope.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "line-designer",
      label: "Equation of a Straight Line",
      href: "/dashboard/mathematics/line-designer",
      reason: "See how the slope you just learned to calculate becomes the m in y = mx + b.",
    },
  ],
};
