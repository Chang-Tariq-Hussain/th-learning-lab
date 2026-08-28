import type { TopicContent } from "../types";

/**
 * Plotting Points, Mathematics Batch 3 topic 2 of 6 (Coordinate
 * Geometry). Reuses the existing Plot a Point simulation
 * (`@/features/subjects/mathematics/plot-a-point`) as-is — it already
 * is a three-level, click-to-plot game (given a coordinate, tap the
 * grid) with live feedback, a streak counter, and a final mixed
 * challenge, so it already covers this topic's own "Point Plotter"
 * challenge spec. No new coordinate grid was built, per the brief.
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-plotting-points-quiz.ts`).
 * The GLE Challenge section below is a second, reasoning-focused
 * layer on top of the simulation's own click-to-plot game — these
 * scenarios ask the student to work out *where* a point should go
 * (including from partial information, like "6 units from the
 * y-axis, in Quadrant IV") rather than just clicking a given pair,
 * then verify by plotting it in the simulation above.
 */
export const mathematicsPlottingPointsContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "plot-a-point",
  title: "Plotting Points",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/plot-a-point",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Plot any ordered pair (x, y) on the coordinate plane accurately.",
      "Read the coordinates of an already-plotted point.",
      "Plot several points at once and compare their positions.",
      "Recognize simple patterns formed by a set of plotted points.",
    ],
    concepts: [
      {
        term: "Plotting an ordered pair",
        explanation:
          "Start at the origin. Move horizontally by the x-value (right if positive, left if negative), then move vertically by the y-value (up if positive, down if negative). Mark the point where you land.",
      },
      {
        term: "Reading back a plotted point",
        explanation:
          "To find the coordinates of a point already on the grid, count how far it is horizontally from the origin (that's x), then how far it is vertically (that's y).",
      },
      {
        term: "Comparing multiple points",
        explanation:
          "When several points are plotted together, comparing their x-values tells you which is farther left/right, and comparing their y-values tells you which is higher/lower.",
      },
      {
        term: "Patterns in plotted points",
        explanation:
          "Points that share the same x-coordinate line up vertically; points that share the same y-coordinate line up horizontally; points where x always equals y line up along a diagonal.",
      },
    ],
    whyItMatters:
      "Accurately plotting coordinates is the entry skill behind graphing lines and curves, reading grid references on a map, and placing objects in a video game or design tool — anywhere a precise (x, y) position needs to become an actual mark on a grid.",
    keyTerms: [
      { term: "Plot", definition: "To mark a point at its correct location on the coordinate plane, given its coordinates." },
      { term: "Horizontal line (in points)", definition: "A set of points that all share the same y-coordinate." },
      { term: "Vertical line (in points)", definition: "A set of points that all share the same x-coordinate." },
    ],
    misconceptions: [
      {
        id: "misconception-plotting-points-order",
        misconception: "It's fine to move up/down before left/right when plotting a point — the ordered pair's order is just a naming convention.",
        correction:
          "The *naming* order (x then y) is fixed and always means \"horizontal value, then vertical value\" — but the physical order you make the two moves in while plotting doesn't change where you land. Confusing these two is what leads students to plot (3, 5) as (5, 3): the ordered pair itself must be read x-then-y, even though the moves can happen in either order.",
      },
      {
        id: "misconception-plotting-points-negative",
        misconception: "A negative coordinate means the point can't be plotted, or is somehow \"less real\" than a positive one.",
        correction:
          "Negative coordinates simply mean \"move left\" (for x) or \"move down\" (for y) instead of right/up. They plot exactly the same way as positive coordinates, just in the opposite direction.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict where each point will land, then check yourself by plotting it in Plot a Point below.",
    scenarios: [
      {
        id: "mathematics-plotting-points-predict-001",
        scenario: "You're about to plot the point (4, -2).",
        question: "Where will it appear relative to the origin?",
        options: [
          { id: "right-down", label: "4 right, 2 down" },
          { id: "right-up", label: "4 right, 2 up" },
          { id: "left-down", label: "4 left, 2 down" },
          { id: "left-up", label: "4 left, 2 up" },
        ],
        actualResultOptionId: "right-down",
        explanation: "x = 4 is positive (right), and y = -2 is negative (down).",
        hint: "Check the sign of each coordinate separately.",
      },
      {
        id: "mathematics-plotting-points-predict-002",
        scenario: "You plot (7, 3) and (3, 7) on the same grid.",
        question: "Which point ends up farther right?",
        options: [
          { id: "seven-three", label: "(7, 3)" },
          { id: "three-seven", label: "(3, 7)" },
          { id: "same", label: "They're the same distance right" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "seven-three",
        explanation: "Rightward distance depends only on the x-coordinate: 7 is greater than 3, so (7, 3) is farther right.",
        hint: "Compare the first number in each pair.",
      },
      {
        id: "mathematics-plotting-points-predict-003",
        scenario: "You plot four points: (2, 6), (2, 1), (2, -3), (2, 9).",
        question: "What shape or pattern will they form?",
        options: [
          { id: "vertical-line", label: "A vertical line" },
          { id: "horizontal-line", label: "A horizontal line" },
          { id: "diagonal-line", label: "A diagonal line" },
          { id: "no-pattern", label: "No particular pattern" },
        ],
        actualResultOptionId: "vertical-line",
        explanation: "All four points share x = 2, so they line up directly above and below each other — a vertical line.",
        hint: "What do all four x-values have in common?",
      },
      {
        id: "mathematics-plotting-points-predict-004",
        scenario: "You plot (0, 5).",
        question: "Where does this point land?",
        options: [
          { id: "on-y-axis", label: "On the y-axis, 5 units above the origin" },
          { id: "on-x-axis", label: "On the x-axis, 5 units right of the origin" },
          { id: "quadrant-i", label: "Inside Quadrant I" },
          { id: "origin", label: "Exactly at the origin" },
        ],
        actualResultOptionId: "on-y-axis",
        explanation: "An x-coordinate of 0 keeps the point on the y-axis, at height y = 5.",
        hint: "What's true of any point where x = 0?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Read the coordinate you're given at each level, like (4, 3).",
      "Click or tap the grid at that exact location to plot it.",
      "Get instant feedback — correct plots advance you; incorrect ones let you try again.",
      "Progress through all three levels, ending with a mixed final challenge.",
    ],
    tryThis: [
      "Plot (4, 3) and (3, 4) side by side and see exactly how far apart they land.",
      "Before clicking, predict which quadrant a coordinate like (-2, 5) belongs in.",
      "Try a point where the x-value is negative and the y-value is zero — where does it land?",
      "Notice how many points in a row you can plot correctly to build a streak.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-plotting-points-explain-001",
        question: "Why does plotting always start from the origin, no matter what the coordinates are?",
        answer:
          "Every coordinate pair describes a displacement relative to a fixed reference point. The origin is that reference for the whole plane, so starting anywhere else would make the same pair land in a different, inconsistent spot each time.",
      },
      {
        id: "mathematics-plotting-points-explain-002",
        question: "Why do points that share an x-coordinate always line up vertically?",
        answer:
          "Sharing x means every one of those points is the exact same horizontal distance from the y-axis. The only thing left free to vary is height (y), so as you connect them they stack straight up and down — a vertical line.",
      },
      {
        id: "mathematics-plotting-points-explain-003",
        question: "Why does swapping the order of a coordinate pair usually move the point?",
        answer:
          "The pair (a, b) means \"a units horizontal, b units vertical.\" Swapping to (b, a) reuses the same two numbers but assigns them to the opposite directions, so unless a and b happen to be equal, the point ends up somewhere else entirely.",
      },
      {
        id: "mathematics-plotting-points-explain-004",
        question: "Why can you sometimes figure out a point's coordinates from a description like \"6 units from the y-axis, in Quadrant IV\" without being told (x, y) directly?",
        answer:
          "Distance from the y-axis fixes the size of x, and the quadrant fixes both signs — so together they pin down the coordinate exactly, even though neither piece of information alone would.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-plotting-points",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Point Plotter
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Work these out with reasoning, then verify by plotting the point in Plot a Point above.",
    scenarios: [
      {
        id: "mathematics-plotting-points-challenge-001",
        title: "Point Plotter: From a Description",
        scenario: "A point is 6 units from the y-axis and 3 units from the x-axis, and it's in Quadrant IV.",
        objective: "What is the x-coordinate of this point?",
        tools: [{ id: "grid", label: "Plot a Point's click-to-plot grid" }],
        answer: { mode: "numeric", target: 6, tolerance: 0 },
        explanation: "Quadrant IV means x is positive, so 6 units from the y-axis gives x = 6 (and y = -3).",
        hints: [
          "Quadrant IV has a positive x-coordinate and a negative y-coordinate.",
          "\"6 units from the y-axis\" sets the size of x.",
        ],
      },
      {
        id: "mathematics-plotting-points-challenge-002",
        title: "Point Plotter: Missing y",
        scenario: "A point is 6 units from the y-axis and 3 units from the x-axis, and it's in Quadrant IV.",
        objective: "What is the y-coordinate of this point?",
        tools: [{ id: "grid", label: "Plot a Point's click-to-plot grid" }],
        answer: { mode: "numeric", target: -3, tolerance: 0 },
        explanation: "Quadrant IV means y is negative, so 3 units from the x-axis gives y = -3.",
        hints: [
          "Quadrant IV has a negative y-coordinate.",
          "\"3 units from the x-axis\" sets the size of y, then apply the sign.",
        ],
      },
      {
        id: "mathematics-plotting-points-challenge-003",
        title: "Point Plotter: Spot the Pattern",
        scenario: "Four points are plotted: (-3, 5), (0, 5), (2, 5), (6, 5).",
        objective: "What do all four points have in common — and what shape do they form together?",
        answer: {
          mode: "choice",
          options: [
            { id: "horizontal", label: "Same y-coordinate — they form a horizontal line" },
            { id: "vertical", label: "Same x-coordinate — they form a vertical line" },
            { id: "diagonal", label: "They lie on a diagonal line" },
            { id: "none", label: "No shared pattern" },
          ],
          correctOptionId: "horizontal",
        },
        explanation: "Every point has y = 5. Since height is fixed and only x varies, plotting them all produces a horizontal line.",
        hints: [
          "Compare the y-coordinate of each of the four points.",
          "If height (y) never changes, what shape do the points trace out?",
        ],
      },
      {
        id: "mathematics-plotting-points-challenge-004",
        title: "Point Plotter: Reflection",
        scenario: "Point A is at (5, -3). Point B is A's mirror image across the x-axis.",
        objective: "What is the y-coordinate of point B?",
        tools: [{ id: "grid", label: "Plot a Point's click-to-plot grid" }],
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        explanation: "Reflecting across the x-axis keeps x the same and flips the sign of y, so B is (5, 3).",
        hints: [
          "A reflection across the x-axis flips only the y-coordinate's sign.",
          "A(5, -3) reflected becomes (5, +3).",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "coordinate-plane-explorer",
      label: "Coordinate Plane",
      href: "/dashboard/mathematics/coordinate-plane-explorer",
      reason: "Revisit axes and quadrants if a plotted point's position feels unclear.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "distance-between-two-points",
      label: "Distance Between Two Points",
      href: "/dashboard/mathematics/distance-between-two-points",
      reason: "Now that you can plot points confidently, measure how far apart two of them are.",
    },
  ],
};
