import type { TopicContent } from "../types";

/**
 * Coordinate Plane, Mathematics Batch 3 topic 1 of 6 (Coordinate
 * Geometry). Reuses the existing Coordinate Plane Explorer simulation
 * (`@/features/subjects/mathematics/coordinate-plane-explorer`)
 * as-is — it already has a draggable point with live coordinate
 * readouts, quadrant highlighting/click-to-select, and two built-in
 * mini-challenges (a "drag to this target point" Placement Challenge
 * and a "which quadrant is this point in?" Quadrant Challenge), so no
 * new simulation work was needed. `practice.quizId` points at a new,
 * dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-coordinate-plane-quiz.ts`)
 * rather than the older shared `mathematics-coordinate-geometry` bank,
 * matching the "one dedicated bank per topic" convention every other
 * Batch 1/2 topic follows. The Challenge section below is a second,
 * GLE-level layer on top of the simulation's own built-in challenges —
 * it embeds the live simulation (`requiresExperiment`, default true)
 * so the student drags the point to work out each answer, then types
 * the resulting coordinate value or picks the resulting quadrant,
 * mirroring the numeric/choice-answer pattern already used by e.g.
 * Cross Multiplication's Challenge section.
 */
export const mathematicsCoordinatePlaneContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "coordinate-plane-explorer",
  title: "Coordinate Plane",
  subjectLabel: "Mathematics",
  topicLabel: "Coordinate Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/coordinate-plane-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Identify the x-axis, y-axis, and origin on a coordinate plane.",
      "Read and write a point's location as an ordered pair (x, y).",
      "Determine which of the four quadrants a point lies in from its coordinates.",
      "Explain how the sign of each coordinate determines a point's position.",
    ],
    concepts: [
      {
        term: "The coordinate plane",
        explanation:
          "A flat grid formed by two number lines that cross at a right angle: a horizontal x-axis and a vertical y-axis. Together they let every point on the plane be located with just two numbers.",
      },
      {
        term: "The origin",
        explanation:
          "The point where the x-axis and y-axis cross. It's the reference point every other location is measured from.",
        formula: "(0, 0)",
        formulaCaption: "The origin",
      },
      {
        term: "Ordered pairs",
        explanation:
          "A point's location, written (x, y). The x-coordinate always comes first and gives the horizontal position; the y-coordinate comes second and gives the vertical position. The order matters — (3, 5) and (5, 3) are different points.",
        formula: "(x, y)",
        formulaCaption: "x first, then y",
      },
      {
        term: "The four quadrants",
        explanation:
          "The two axes divide the plane into four regions, numbered I through IV counterclockwise starting from the upper right. Each quadrant has its own combination of positive/negative x and y.",
      },
    ],
    whyItMatters:
      "The coordinate plane is how any system that needs to pin down an exact location with two numbers actually works — GPS coordinates, spreadsheet cell references, pixel positions on a screen, and every graph you'll draw from here through calculus all build on this same x-then-y idea.",
    keyTerms: [
      { term: "x-axis", definition: "The horizontal number line on the coordinate plane." },
      { term: "y-axis", definition: "The vertical number line on the coordinate plane." },
      { term: "Origin", definition: "The point (0, 0), where the x-axis and y-axis cross." },
      { term: "Quadrant", definition: "One of the four regions the axes divide the plane into." },
      { term: "Ordered pair", definition: "A point's coordinates written as (x, y), in that fixed order." },
    ],
    misconceptions: [
      {
        id: "misconception-coordinate-plane-order",
        misconception: "It doesn't matter which number comes first in an ordered pair.",
        correction:
          "Order is exactly what \"ordered pair\" means: x always comes first (horizontal), y always comes second (vertical). Swapping them moves the point to a different location unless x and y happen to be equal.",
      },
      {
        id: "misconception-coordinate-plane-origin-quadrant",
        misconception: "The origin belongs to one of the four quadrants (usually assumed to be Quadrant I).",
        correction:
          "The quadrants are the four open regions strictly between the axes. Any point with a zero coordinate — including the origin — sits on an axis, not inside a quadrant.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Make your prediction first, then check it by dragging the point in the Coordinate Plane Explorer below.",
    scenarios: [
      {
        id: "mathematics-coordinate-plane-predict-001",
        scenario: "You're about to plot the point (-3, 4) on the grid.",
        question: "Which quadrant will it land in?",
        options: [
          { id: "ii", label: "Quadrant II" },
          { id: "i", label: "Quadrant I" },
          { id: "iii", label: "Quadrant III" },
          { id: "iv", label: "Quadrant IV" },
        ],
        actualResultOptionId: "ii",
        explanation: "Negative x with positive y is exactly the sign pattern of Quadrant II — the upper-left region.",
        hint: "Look at the signs: x is negative, y is positive. Which quadrant has that pattern?",
      },
      {
        id: "mathematics-coordinate-plane-predict-002",
        scenario: "A point starts at (2, 5). Only its x-coordinate is going to increase.",
        question: "Which way will the point move?",
        options: [
          { id: "right", label: "To the right" },
          { id: "left", label: "To the left" },
          { id: "up", label: "Upward" },
          { id: "down", label: "Downward" },
        ],
        actualResultOptionId: "right",
        explanation: "The x-coordinate controls horizontal position — increasing it always moves a point right.",
        hint: "x controls left-right movement, not up-down.",
      },
      {
        id: "mathematics-coordinate-plane-predict-003",
        scenario: "A point starts at (4, 1). Its y-coordinate is about to become negative.",
        question: "What will happen to the point?",
        options: [
          { id: "below-x-axis", label: "It will move below the x-axis" },
          { id: "left-of-y-axis", label: "It will move left of the y-axis" },
          { id: "stay-put", label: "Nothing will change" },
          { id: "to-origin", label: "It will jump to the origin" },
        ],
        actualResultOptionId: "below-x-axis",
        explanation: "A negative y-coordinate always places a point below the x-axis, regardless of the x-value.",
        hint: "Which coordinate decides whether a point is above or below the x-axis?",
      },
      {
        id: "mathematics-coordinate-plane-predict-004",
        scenario: "You compare the points (7, 2) and (7, -6).",
        question: "What do these two points have in common?",
        options: [
          { id: "same-x", label: "They're both the same horizontal distance from the y-axis" },
          { id: "same-quadrant", label: "They're in the same quadrant" },
          { id: "same-point", label: "They're actually the same point" },
          { id: "nothing", label: "Nothing — they're unrelated" },
        ],
        actualResultOptionId: "same-x",
        explanation: "Both share x = 7, so they sit directly above and below each other, the same horizontal distance from the y-axis — even though their y-values put them in different quadrants.",
        hint: "Compare the x-coordinates of the two points.",
      },
      {
        id: "mathematics-coordinate-plane-predict-005",
        scenario: "You drag the point so that its x-coordinate becomes exactly 0, while y stays at 6.",
        question: "Where will the point end up?",
        options: [
          { id: "on-y-axis", label: "Exactly on the y-axis" },
          { id: "on-x-axis", label: "Exactly on the x-axis" },
          { id: "at-origin", label: "Exactly at the origin" },
          { id: "in-quadrant-i", label: "Inside Quadrant I" },
        ],
        actualResultOptionId: "on-y-axis",
        explanation: "Every point with x = 0 sits on the y-axis — it isn't inside any quadrant, since the axes are the quadrant boundaries.",
        hint: "What's true of every point where x = 0?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the point around the grid and watch its (x, y) readout update live.",
      "Hover over different regions of the grid to preview coordinates before committing to a drag.",
      "Click a quadrant to highlight it, or click the origin to jump the point back there.",
      "Try the built-in Placement Challenge (drag to a target point) and Quadrant Challenge (identify a point's quadrant) below the grid.",
    ],
    tryThis: [
      "Predict a point's quadrant from its coordinates before dragging it there to check.",
      "Find a point that sits exactly on the x-axis, then one exactly on the y-axis — what's special about each one's coordinates?",
      "Drag the point through all four quadrants in turn and say the sign pattern out loud each time.",
      "Pick two points with the same x-coordinate but different y-coordinates, and describe how they're positioned relative to each other.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-coordinate-plane-explain-001",
        question: "Why does a point need two numbers, not just one, to describe its location?",
        answer:
          "A flat plane has two independent directions — horizontal and vertical. One number alone can only describe a position along a single line, so it takes one number per direction (x for horizontal, y for vertical) to pin down a spot anywhere on the plane.",
      },
      {
        id: "mathematics-coordinate-plane-explain-002",
        question: "Why is the order in \"ordered pair\" so important?",
        answer:
          "x and y measure completely different directions. Because the convention is always x first, then y, reading (3, 5) tells you unambiguously to go 3 across and 5 up — reversing the order would send you somewhere else entirely.",
      },
      {
        id: "mathematics-coordinate-plane-explain-003",
        question: "Why do the signs of x and y alone tell you the quadrant, without needing to look at a graph?",
        answer:
          "Each quadrant is defined by one fixed combination of signs — for example Quadrant II is always \"x negative, y positive.\" Since that combination never changes, checking the two signs is enough to know the quadrant, no matter how large or small the actual numbers are.",
      },
      {
        id: "mathematics-coordinate-plane-explain-004",
        question: "Why doesn't the origin — or any point on an axis — belong to a quadrant?",
        answer:
          "The quadrants are the four regions strictly between the axes. A point on an axis has at least one coordinate equal to zero, which places it exactly on the boundary between quadrants rather than inside one of them.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-coordinate-plane",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Coordinate Target
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Coordinate Plane Explorer above to work out each answer — drag the point to test your thinking before you answer.",
    scenarios: [
      {
        id: "mathematics-coordinate-plane-challenge-001",
        title: "Coordinate Target: Quadrant II",
        scenario: "Drag the point until it sits in Quadrant II, at exactly 4 units left of the y-axis and 3 units above the x-axis.",
        objective: "What is the x-coordinate of the point once it's placed correctly?",
        tools: [{ id: "point", label: "Draggable point with live (x, y) readout" }],
        answer: { mode: "numeric", target: -4, tolerance: 0 },
        explanation: "4 units left of the y-axis means x = -4; the point is (-4, 3), which sits in Quadrant II since x is negative and y is positive.",
        hints: [
          "\"Left of the y-axis\" means the x-coordinate is negative.",
          "4 units left means x = -4.",
        ],
      },
      {
        id: "mathematics-coordinate-plane-challenge-002",
        title: "Coordinate Target: Quadrant IV",
        scenario: "Drag the point so it's 6 units right of the y-axis and 2 units below the x-axis.",
        objective: "What is the y-coordinate of the point once it's placed correctly?",
        tools: [{ id: "point", label: "Draggable point with live (x, y) readout" }],
        answer: { mode: "numeric", target: -2, tolerance: 0 },
        explanation: "2 units below the x-axis means y = -2; the point is (6, -2), which sits in Quadrant IV.",
        hints: [
          "\"Below the x-axis\" means the y-coordinate is negative.",
          "2 units below means y = -2.",
        ],
      },
      {
        id: "mathematics-coordinate-plane-challenge-003",
        title: "Which Quadrant?",
        scenario: "Drag the point to (-8, -1) and check which quadrant it lands in.",
        objective: "Identify the quadrant.",
        tools: [{ id: "point", label: "Draggable point with quadrant highlighting" }],
        answer: {
          mode: "choice",
          options: [
            { id: "i", label: "Quadrant I" },
            { id: "ii", label: "Quadrant II" },
            { id: "iii", label: "Quadrant III" },
            { id: "iv", label: "Quadrant IV" },
          ],
          correctOptionId: "iii",
        },
        explanation: "Both coordinates are negative, which is the sign pattern of Quadrant III.",
        hints: [
          "Check the sign of each coordinate: is it positive or negative?",
          "Negative x and negative y together mean Quadrant III.",
        ],
      },
      {
        id: "mathematics-coordinate-plane-challenge-004",
        title: "On an Axis",
        scenario: "Drag the point until it sits exactly on the x-axis, 5 units to the left of the origin.",
        objective: "What is the y-coordinate of the point once it's placed correctly?",
        tools: [{ id: "point", label: "Draggable point with live (x, y) readout" }],
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "Every point on the x-axis has y = 0 — the point here is (-5, 0).",
        hints: [
          "What must be true of the y-coordinate for any point on the x-axis?",
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
      reason: "Apply what you just learned about axes and quadrants to plotting given coordinates.",
    },
  ],
};
