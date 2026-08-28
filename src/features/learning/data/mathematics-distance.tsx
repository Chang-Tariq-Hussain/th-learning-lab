import type { TopicContent } from "../types";

/**
 * Distance Between Two Points, Mathematics Batch 3 topic 3 of 6
 * (Coordinate Geometry). Reuses the existing Distance Between Two
 * Points simulation
 * (`@/features/subjects/mathematics/distance-between-two-points`) as
 * is — it already has two draggable points, a live Δx/Δy/right-triangle
 * step calculation, a Special Cases panel (same-y / same-x shortcuts),
 * and its own "Calculate" mode that already functions as this topic's
 * "Distance Target"-style challenge (given two points, compute the
 * distance). No simulation changes were needed.
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-distance-quiz.ts`). The
 * GLE Challenge section below embeds the live simulation so the
 * student drags a point until it hits a target distance from a fixed
 * point, then reports the resulting coordinate — the "place point B
 * exactly N units from point A" scenario from the spec.
 */
export const mathematicsDistanceContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "distance-between-two-points",
  title: "Distance Between Two Points",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/distance-between-two-points",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Find the horizontal (Δx) and vertical (Δy) distance between two points.",
      "Explain how Δx and Δy form a right triangle whose hypotenuse is the distance.",
      "Apply the distance formula to find the straight-line distance between any two points.",
      "Use the horizontal/vertical shortcut when two points share a coordinate.",
    ],
    concepts: [
      {
        term: "Δx and Δy",
        explanation:
          "Δx is how far apart two points are horizontally; Δy is how far apart they are vertically. Together they're the two legs of a right triangle connecting the points.",
        formula: "\\Delta x = x_2 - x_1, \\quad \\Delta y = y_2 - y_1",
        formulaCaption: "Horizontal and vertical differences",
      },
      {
        term: "The right triangle",
        explanation:
          "Draw a horizontal segment of length Δx and a vertical segment of length Δy between two points, and they always meet at a right angle — forming a right triangle with the straight-line distance as its hypotenuse.",
      },
      {
        term: "The distance formula",
        explanation:
          "Because that triangle is a right triangle, the Pythagorean theorem (a² + b² = c²) gives the distance directly from Δx and Δy.",
        formula: "d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}",
        formulaCaption: "Distance between two points",
      },
      {
        term: "Horizontal/vertical shortcut",
        explanation:
          "When two points share the same y-coordinate, Δy = 0 and the formula collapses to just |Δx|. When they share the same x-coordinate, it collapses to just |Δy| — no square roots needed.",
      },
    ],
    whyItMatters:
      "The distance formula is the Pythagorean theorem measuring the gap between two locations on a grid instead of the sides of a triangle on paper. It's the exact calculation behind how GPS and mapping apps report straight-line distance, and it's the foundation for more advanced geometry and physics problems ahead.",
    keyTerms: [
      { term: "Δx (delta x)", definition: "The horizontal distance between two points: x₂ − x₁." },
      { term: "Δy (delta y)", definition: "The vertical distance between two points: y₂ − y₁." },
      { term: "Hypotenuse", definition: "The longest side of a right triangle, opposite the right angle — here, the straight-line distance." },
      { term: "Distance formula", definition: "d = √[(x₂−x₁)² + (y₂−y₁)²], the Pythagorean theorem applied to two coordinate points." },
    ],
    misconceptions: [
      {
        id: "misconception-distance-add-instead-of-pythagorean",
        misconception: "The distance between two points is just Δx plus Δy.",
        correction:
          "Adding Δx and Δy measures a blocky, right-angled path (like walking city blocks), not the straight-line \"as the crow flies\" distance. The straight-line distance needs the Pythagorean relationship — squaring both legs, adding, then taking the square root.",
      },
      {
        id: "misconception-distance-labeling-matters",
        misconception: "You have to be careful which point is (x₁, y₁) and which is (x₂, y₂), or you'll get the wrong distance.",
        correction:
          "Both differences get squared in the formula, and squaring removes the sign — so (x₂−x₁)² always equals (x₁−x₂)². It genuinely doesn't matter which point you label first.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each result, then check it by dragging the points in Distance Between Two Points below.",
    scenarios: [
      {
        id: "mathematics-distance-predict-001",
        scenario: "Points A(2, 5) and B(9, 5) share the same y-coordinate.",
        question: "What's the fastest way to find the distance between them?",
        options: [
          { id: "subtract-x", label: "Just subtract the x-coordinates: |9 − 2| = 7" },
          { id: "full-formula", label: "You must use the full distance formula with a square root" },
          { id: "subtract-y", label: "Just subtract the y-coordinates" },
          { id: "cant-tell", label: "Cannot be determined without more information" },
        ],
        actualResultOptionId: "subtract-x",
        explanation: "With Δy = 0, the distance formula simplifies to |Δx| — no square root needed.",
        hint: "What does Δy equal when both y-coordinates match?",
      },
      {
        id: "mathematics-distance-predict-002",
        scenario: "You drag point B farther to the right, directly away from point A, with its height unchanged.",
        question: "What happens to the distance between A and B?",
        options: [
          { id: "increases", label: "It increases" },
          { id: "decreases", label: "It decreases" },
          { id: "same", label: "It stays the same" },
          { id: "zero", label: "It becomes zero" },
        ],
        actualResultOptionId: "increases",
        explanation: "Moving B farther right increases Δx while Δy stays fixed, so the distance (and the hypotenuse of the triangle) grows.",
        hint: "Which of Δx or Δy is changing here?",
      },
      {
        id: "mathematics-distance-predict-003",
        scenario: "Point A is at the origin, and point B is at (6, 8).",
        question: "What is the distance between them?",
        options: [
          { id: "ten", label: "10" },
          { id: "fourteen", label: "14" },
          { id: "seven", label: "7" },
          { id: "twelve", label: "12" },
        ],
        actualResultOptionId: "ten",
        explanation: "d = √(6² + 8²) = √(36+64) = √100 = 10.",
        hint: "Square both coordinates, add them, then take the square root.",
      },
      {
        id: "mathematics-distance-predict-004",
        scenario: "You drag point B so that both Δx and Δy double compared to before.",
        question: "What happens to the distance?",
        options: [
          { id: "doubles", label: "It also doubles" },
          { id: "quadruples", label: "It quadruples" },
          { id: "same", label: "It stays the same" },
          { id: "halves", label: "It halves" },
        ],
        actualResultOptionId: "doubles",
        explanation: "d = √((2Δx)² + (2Δy)²) = 2√(Δx²+Δy²) — exactly double the original distance.",
        hint: "Factor the 2 out of both squared terms inside the square root.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag point A or point B to new positions on the grid.",
      "Watch the right triangle form between them, showing Δx and Δy.",
      "Select a step in the calculation to see how Δx, Δy, and the distance connect.",
      "Try the Special Cases buttons to see the same-y and same-x shortcuts in action.",
      "Switch to Calculate mode to practice finding the distance between fixed point pairs.",
    ],
    tryThis: [
      "Place point A at the origin and point B at (3, 4). Calculate the distance by hand, then check it against the simulation.",
      "Move point B so Δx and Δy are equal. What does that tell you about the triangle?",
      "Predict what happens to the distance if you double both Δx and Δy, then test it.",
      "Load a Special Case and confirm the shortcut answer matches the full formula's result.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-distance-explain-001",
        question: "Why does the straight-line distance require squaring Δx and Δy instead of just adding them?",
        answer:
          "Δx and Δy are the two legs of a right triangle, and the straight-line distance is the hypotenuse. The Pythagorean theorem — the rule connecting a right triangle's legs to its hypotenuse — requires squaring both legs, adding, then taking the square root; simply adding the legs would measure a different, longer, blocky path instead.",
      },
      {
        id: "mathematics-distance-explain-002",
        question: "Why does it not matter which point you call (x₁, y₁) and which you call (x₂, y₂)?",
        answer:
          "Swapping the two points flips the sign of both Δx and Δy, but squaring a negative number gives the same result as squaring its positive counterpart. Since the formula only ever uses the squares of Δx and Δy, the sign — and therefore the point order — never affects the final distance.",
      },
      {
        id: "mathematics-distance-explain-003",
        question: "Why does the formula simplify to a plain subtraction when two points share a coordinate?",
        answer:
          "If the y-coordinates match, Δy = 0, and √(Δx² + 0²) is just √(Δx²), which equals |Δx|. The square root and the zero term cancel each other out, leaving a simple absolute-value subtraction — the full formula still applies, it just simplifies dramatically.",
      },
      {
        id: "mathematics-distance-explain-004",
        question: "Why does doubling both Δx and Δy double the distance rather than quadrupling it?",
        answer:
          "Doubling both legs scales the entire right triangle up by a factor of 2, and scaling a shape uniformly scales every one of its lengths — including the hypotenuse — by that same factor. Algebraically, the 2² from each squared term factors back out as a single 2 once you take the square root.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-distance",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Distance Target
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Distance Between Two Points simulation above — drag a point until it hits the target distance, then answer below.",
    scenarios: [
      {
        id: "mathematics-distance-challenge-001",
        title: "Distance Target: Along an Axis",
        scenario: "Point A is fixed at (0, 0). Drag point B along the x-axis (keep its y-coordinate at 0) until it's exactly 7 units from A.",
        objective: "What is the x-coordinate of point B once it's placed correctly (assume B is to the right of A)?",
        tools: [{ id: "points", label: "Draggable points A and B with live Δx/Δy/distance readout" }],
        answer: { mode: "numeric", target: 7, tolerance: 0 },
        explanation: "With both points on the x-axis, distance is just |Δx|, so B must be at x = 7 to be exactly 7 units from A(0,0).",
        hints: [
          "When both points share y = 0, distance is just the horizontal gap.",
          "Set x so that |x − 0| = 7.",
        ],
      },
      {
        id: "mathematics-distance-challenge-002",
        title: "Distance Target: A 3-4-5 Triangle",
        scenario: "Point A is fixed at (0, 0). Drag point B to (3, 4) and check the distance shown by the simulation.",
        objective: "What is the distance between A and B?",
        tools: [{ id: "points", label: "Draggable points A and B with live Δx/Δy/distance readout" }],
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        explanation: "d = √(3² + 4²) = √(9+16) = √25 = 5 — the classic 3-4-5 right triangle.",
        hints: [
          "Square the Δx and Δy legs, add them, then take the square root.",
          "3² + 4² = 25, and √25 = 5.",
        ],
      },
      {
        id: "mathematics-distance-challenge-003",
        title: "Which Pair Is Farther Apart?",
        scenario: "Compare (0,0)–(6,8) with (0,0)–(5,5) using the simulation.",
        objective: "Which pair of points is farther apart?",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "(0,0) and (6,8)" },
            { id: "b", label: "(0,0) and (5,5)" },
            { id: "same", label: "They're the same distance apart" },
          ],
          correctOptionId: "a",
        },
        explanation: "√(36+64) = 10, while √(25+25) = √50 ≈ 7.07 — the (6,8) pair is farther apart.",
        hints: [
          "Compute each distance with the formula and compare.",
          "√100 = 10 is larger than √50 ≈ 7.07.",
        ],
      },
      {
        id: "mathematics-distance-challenge-004",
        title: "Reach Zero",
        scenario: "Drag point B until it lands exactly on top of point A.",
        objective: "What is the distance between A and B once they coincide?",
        tools: [{ id: "points", label: "Draggable points A and B with live Δx/Δy/distance readout" }],
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "When A and B are the same point, Δx = Δy = 0, so d = √(0+0) = 0.",
        hints: [
          "What are Δx and Δy when the two points coincide?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "plot-a-point",
      label: "Plotting Points",
      href: "/dashboard/mathematics/plot-a-point",
      reason: "Solid plotting skills make it easy to check the points you're finding distances between.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "midpoint-of-a-line-segment",
      label: "Midpoint",
      href: "/dashboard/mathematics/midpoint-of-a-line-segment",
      reason: "Now find the point exactly halfway between two points, using the same two coordinates.",
    },
  ],
};
