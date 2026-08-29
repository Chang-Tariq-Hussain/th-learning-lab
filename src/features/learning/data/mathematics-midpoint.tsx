import type { TopicContent } from "../types";

/**
 * Midpoint of a Line Segment, Mathematics Batch 3 topic 4 of 6
 * (Coordinate Geometry). Reuses the existing Midpoint simulation
 * (`@/features/subjects/mathematics/midpoint-of-a-line-segment`) as
 * is — two draggable endpoints, a live midpoint marker, a step
 * calculation breakdown, a Special Cases panel, and its own Calculate
 * mode. No simulation changes were needed.
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-midpoint-quiz.ts`),
 * including the spec's "advanced version" of missing-endpoint
 * problems. The GLE Challenge section embeds the live simulation for
 * "place/identify the midpoint" and "find the missing endpoint"
 * scenarios.
 */
export const mathematicsMidpointContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "midpoint-of-a-line-segment",
  title: "Midpoint of a Line Segment",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/midpoint-of-a-line-segment",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define the midpoint of a segment as the point exactly halfway between its endpoints.",
      "Calculate a midpoint's coordinates using the midpoint formula.",
      "Explain why the midpoint formula is just an average of the x-values and an average of the y-values.",
      "Find a missing endpoint when given the midpoint and the other endpoint.",
    ],
    concepts: [
      {
        term: "Midpoint",
        explanation:
          "The single point that sits exactly halfway along a straight segment connecting two endpoints, equally distant from both.",
      },
      {
        term: "The midpoint formula",
        explanation:
          "Average the two x-coordinates to get the midpoint's x-coordinate, and average the two y-coordinates to get its y-coordinate.",
        formula: "M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)",
        formulaCaption: "Midpoint formula",
      },
      {
        term: "Why averaging works",
        explanation:
          "Averaging two numbers always lands exactly halfway between them on a number line. Applying that same idea separately to the x-values and the y-values is what places the midpoint exactly halfway along the segment in two dimensions.",
      },
      {
        term: "Finding a missing endpoint",
        explanation:
          "If you know the midpoint M and one endpoint A, you can reverse the averaging to find the other endpoint B, since M is just the average of A and B.",
        formula: "B = 2M - A",
        formulaCaption: "Solving for a missing endpoint",
      },
    ],
    whyItMatters:
      "The midpoint formula shows up anywhere you need to find a center point — locating the middle of a road on a map, finding the balance point of a design, or splitting a line segment evenly in a geometry proof. It's also a stepping stone toward more advanced coordinate geometry, since many later formulas build on this same idea of averaging coordinates.",
    keyTerms: [
      { term: "Midpoint", definition: "The point exactly halfway between two endpoints." },
      { term: "Endpoint", definition: "One of the two fixed points that define a segment." },
      { term: "Average", definition: "The sum of two numbers divided by 2 — always lands exactly between them." },
    ],
    misconceptions: [
      {
        id: "misconception-midpoint-mixing-coordinates",
        misconception: "You can average x-values and y-values together, mixing the two axes, and still get a valid midpoint.",
        correction:
          "The midpoint's x-coordinate must come only from averaging the two x-values, and its y-coordinate only from averaging the two y-values. Mixing them together doesn't correspond to any real location on the plane.",
      },
      {
        id: "misconception-midpoint-order-matters",
        misconception: "Which endpoint you list first in the formula changes the resulting midpoint.",
        correction:
          "Addition doesn't care about order — (x₁+x₂)/2 always equals (x₂+x₁)/2 — so swapping which endpoint you call \"first\" never changes the midpoint.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each result, then check it by dragging the endpoints in the Midpoint simulation below.",
    scenarios: [
      {
        id: "mathematics-midpoint-predict-001",
        scenario: "Points A(1, 1) and B(9, 1) share the same y-coordinate.",
        question: "Roughly where will the midpoint land?",
        options: [
          { id: "between", label: "Somewhere between them, still at y = 1" },
          { id: "at-b", label: "Exactly at B" },
          { id: "above", label: "Above the segment, at a higher y-value" },
          { id: "origin", label: "At the origin" },
        ],
        actualResultOptionId: "between",
        explanation: "The midpoint always lies on the segment itself — here that's along y = 1, exactly between x = 1 and x = 9.",
        hint: "The midpoint is always on the segment connecting the two endpoints.",
      },
      {
        id: "mathematics-midpoint-predict-002",
        scenario: "Endpoint A stays fixed at (2, 3). Endpoint B moves farther to the right.",
        question: "What happens to the midpoint?",
        options: [
          { id: "shifts-right", label: "It also shifts to the right" },
          { id: "shifts-left", label: "It shifts to the left" },
          { id: "stays", label: "It stays exactly the same" },
          { id: "shifts-up", label: "It shifts upward" },
        ],
        actualResultOptionId: "shifts-right",
        explanation: "Increasing B's x-coordinate raises the average of the two x-values, moving the midpoint right too.",
        hint: "Averaging a larger number with a fixed one increases the average.",
      },
      {
        id: "mathematics-midpoint-predict-003",
        scenario: "You're about to find the midpoint of (-4, 2) and (4, -2).",
        question: "Where will it land?",
        options: [
          { id: "origin", label: "Exactly at the origin (0, 0)" },
          { id: "at-a", label: "Exactly at (-4, 2)" },
          { id: "quadrant-i", label: "Somewhere in Quadrant I" },
          { id: "on-y-axis", label: "On the y-axis, but not at the origin" },
        ],
        actualResultOptionId: "origin",
        explanation: "M = ((-4+4)/2, (2+(-2))/2) = (0, 0) — the coordinates cancel out exactly.",
        hint: "Average the x-values, then the y-values, separately.",
      },
      {
        id: "mathematics-midpoint-predict-004",
        scenario: "You know the midpoint of a segment and one of its endpoints.",
        question: "Can you always work out the other endpoint?",
        options: [
          { id: "yes", label: "Yes — reverse the averaging formula" },
          { id: "no", label: "No, there isn't enough information" },
          { id: "sometimes", label: "Only if the segment is horizontal" },
          { id: "only-origin", label: "Only if the midpoint is the origin" },
        ],
        actualResultOptionId: "yes",
        explanation: "Since M is the average of A and B, B = 2M − A always recovers the missing endpoint.",
        hint: "If M = (A+B)/2, what does solving for B look like?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag point A or point B to new positions on the grid.",
      "Watch the midpoint M update and stay exactly centered between them.",
      "Select a step in the calculation to see how the averaging works.",
      "Try the Special Cases buttons to see the same-y and same-x shortcuts in action.",
      "Switch to Calculate mode to practice finding the midpoint of fixed point pairs.",
    ],
    tryThis: [
      "Place A at (0, 0) and B at (8, 4). Calculate the midpoint by hand, then check it against the simulation.",
      "Move only point B and predict which direction the midpoint will shift before checking.",
      "Find two different pairs of points that share the exact same midpoint.",
      "Drag A and B so their midpoint lands exactly on the origin.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-midpoint-explain-001",
        question: "Why does averaging two numbers land you exactly halfway between them?",
        answer:
          "The average of two numbers is their sum split evenly in two — which by definition is the point that's the same distance from each of the original numbers. That's exactly what \"halfway between\" means on a number line.",
      },
      {
        id: "mathematics-midpoint-explain-002",
        question: "Why does the midpoint formula need two separate averages instead of one?",
        answer:
          "A point on the plane is described by two independent values — its horizontal and vertical position. Averaging the x-values finds the halfway point horizontally, and averaging the y-values finds it vertically; together they locate the point that's halfway in both directions at once.",
      },
      {
        id: "mathematics-midpoint-explain-003",
        question: "Why can you always solve for a missing endpoint if you know the midpoint and the other endpoint?",
        answer:
          "The midpoint formula is just an equation, M = (A+B)/2, with one unknown once M and A are known. Rearranging that equation algebraically — multiplying both sides by 2 and subtracting A — isolates B, so the missing endpoint can always be recovered this way.",
      },
      {
        id: "mathematics-midpoint-explain-004",
        question: "Why doesn't the order you list the two endpoints in change the midpoint?",
        answer:
          "Addition is commutative — a + b always equals b + a — so (x₁+x₂)/2 and (x₂+x₁)/2 are the same calculation written two ways. There's no meaningful \"first\" or \"second\" endpoint as far as the formula is concerned.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-midpoint",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Midpoint Finder
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Midpoint simulation above to check your reasoning — drag the endpoints, then answer below.",
    scenarios: [
      {
        id: "mathematics-midpoint-challenge-001",
        title: "Midpoint Finder: Basic",
        scenario: "Drag point A to (0, 0) and point B to (8, 4).",
        objective: "What is the x-coordinate of the midpoint?",
        tools: [{ id: "points", label: "Draggable endpoints A and B with a live midpoint marker" }],
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        explanation: "Midpoint x = (0 + 8)/2 = 4.",
        hints: [
          "Average the two x-coordinates.",
          "(0 + 8)/2 = 4.",
        ],
      },
      {
        id: "mathematics-midpoint-challenge-002",
        title: "Midpoint Finder: Negative Coordinates",
        scenario: "Drag point A to (-6, -10) and point B to (-2, -4).",
        objective: "What is the y-coordinate of the midpoint?",
        tools: [{ id: "points", label: "Draggable endpoints A and B with a live midpoint marker" }],
        answer: { mode: "numeric", target: -7, tolerance: 0 },
        explanation: "Midpoint y = (-10 + -4)/2 = -14/2 = -7.",
        hints: [
          "Average the two y-coordinates, keeping the negative signs.",
          "(-10 + -4)/2 = -7.",
        ],
      },
      {
        id: "mathematics-midpoint-challenge-003",
        title: "Missing Endpoint",
        scenario: "A segment has midpoint (4, 4) and one endpoint at (0, 0).",
        objective: "What is the x-coordinate of the other endpoint?",
        tools: [{ id: "points", label: "Drag point A to (0,0), then adjust B until the midpoint reads (4,4)" }],
        answer: { mode: "numeric", target: 8, tolerance: 0 },
        explanation: "Using B = 2M − A: x = 2(4) − 0 = 8.",
        hints: [
          "Double the midpoint's coordinate, then subtract the known endpoint's coordinate.",
          "2(4) − 0 = 8.",
        ],
      },
      {
        id: "mathematics-midpoint-challenge-004",
        title: "Which Pair Shares This Midpoint?",
        scenario: "The midpoint of (2, 2) and (8, 8) is (5, 5). Check a few other point pairs in the simulation.",
        objective: "Which of these pairs shares the exact same midpoint, (5, 5)?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "(4, 4) and (6, 6)" },
            { id: "b", label: "(0, 0) and (5, 5)" },
            { id: "c", label: "(2, 8) and (8, 2)" },
          ],
          correctOptionId: "a",
        },
        explanation: "((4+6)/2, (4+6)/2) = (5, 5), a match. The other pairs average to different midpoints.",
        hints: [
          "Average each pair's coordinates and compare to (5, 5).",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "distance-between-two-points",
      label: "Distance Between Two Points",
      href: "/dashboard/mathematics/distance-between-two-points",
      reason: "Revisit how two coordinates combine into a single formula, this time for distance rather than midpoint.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "slope-of-a-line",
      label: "Slope of a Line",
      href: "/dashboard/mathematics/slope-of-a-line",
      reason: "Now explore how two points determine a line's steepness, not just its center.",
    },
  ],
};
