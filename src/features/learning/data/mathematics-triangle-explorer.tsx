import type { TopicContent } from "../types";

/**
 * Triangle Explorer, Mathematics Geometry topic. A new simulation
 * (`@/features/subjects/mathematics/triangle-explorer`) — freeform
 * drag on all three vertices of a triangle, with live side lengths,
 * interior angles, perimeter, area, side/angle classification, a
 * right-angle marker, an "Angle Sum" proof animation, and a
 * "Pythagorean Theorem" animated-squares panel for right triangles.
 * Complements Angle Spinner (single angle, isolated) by putting three
 * angles together in a real shape and showing what constrains them.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-triangle-explorer-quiz.ts`).
 * The Challenge section follows the Angle Spinner "manipulate the
 * live simulation, then answer" pattern, since the simulation has no
 * `onVerify` hook of its own.
 */
export const mathematicsTriangleExplorerContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "triangle-explorer",
  title: "Triangle Explorer",
  subjectLabel: "Mathematics",
  topicLabel: "Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/triangle-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Identify a triangle's three sides and three interior angles, and name them using the standard side-opposite-vertex convention.",
      "Classify a triangle by its sides (equilateral, isosceles, scalene) and separately by its angles (acute, right, obtuse).",
      "State and apply the Triangle Angle Sum Theorem: a triangle's three interior angles always add up to 180°.",
      "State and apply the Pythagorean Theorem (a² + b² = c²) to relate a right triangle's two legs to its hypotenuse.",
    ],
    concepts: [
      {
        term: "What a triangle is",
        explanation:
          "A triangle is a closed shape formed by three straight sides connecting three vertices (corner points). It's the simplest possible polygon — no shape with fewer than three sides can enclose an area.",
      },
      {
        term: "Sides and the opposite-vertex naming convention",
        explanation:
          "Each side of a triangle is named for the single vertex it doesn't touch: side a is opposite vertex A, side b is opposite vertex B, and side c is opposite vertex C. This convention makes formulas like the Law of Cosines and the Pythagorean Theorem easy to state without ambiguity about which side is which.",
      },
      {
        term: "Classifying by sides",
        explanation:
          "An equilateral triangle has all three sides equal (and, as a result, all three angles equal too, at 60° each). An isosceles triangle has exactly two sides equal. A scalene triangle has all three sides different lengths.",
      },
      {
        term: "Classifying by angles",
        explanation:
          "An acute triangle has all three interior angles under 90°. A right triangle has exactly one 90° angle. An obtuse triangle has exactly one angle over 90°. A triangle can never have two right angles or two obtuse angles — the Angle Sum Theorem below explains why.",
      },
      {
        term: "Triangle Angle Sum Theorem",
        explanation:
          "The three interior angles of any triangle — no matter its size or shape — always add up to exactly 180°. This is why a triangle can have at most one angle that's 90° or greater: two such angles would already total 180° or more, leaving nothing for the third.",
        formula: "\\angle A + \\angle B + \\angle C = 180^\\circ",
        formulaCaption: "True for every triangle, regardless of its shape or size",
      },
      {
        term: "Pythagorean Theorem",
        explanation:
          "In a right triangle specifically, the square of the hypotenuse (the side opposite the right angle, and the longest side) equals the sum of the squares of the two legs (the two sides that form the right angle). This relationship only holds for right triangles — it isn't true for acute or obtuse ones.",
        formula: "a^2 + b^2 = c^2",
        formulaCaption: "Where c is the hypotenuse and a, b are the two legs of a right triangle",
      },
      {
        term: "Triangle Inequality",
        explanation:
          "Any two sides of a triangle must add up to more than the third side. If they didn't, the two shorter sides couldn't reach far enough to close the shape — this is exactly why the simulation's canvas refuses to let a drag collapse the triangle flat.",
      },
    ],
    whyItMatters:
      "Triangles are the load-bearing skeleton of geometry — literally, in the case of trusses, bridges, and roof framing, where triangular bracing is used precisely because a triangle's side lengths lock its angles in place (unlike a rectangle, which can rack into a parallelogram). The Pythagorean Theorem alone underlies distance calculations in navigation, construction, computer graphics, and physics; the Angle Sum Theorem is the starting point for reasoning about every other polygon's interior angles.",
    keyTerms: [
      { term: "Vertex", definition: "A corner point of a triangle where two sides meet." },
      { term: "Side", definition: "A straight segment connecting two vertices; named for the vertex it's opposite." },
      { term: "Interior angle", definition: "The angle formed inside the triangle at each vertex." },
      { term: "Equilateral", definition: "A triangle with all three sides (and all three angles) equal." },
      { term: "Isosceles", definition: "A triangle with exactly two sides equal." },
      { term: "Scalene", definition: "A triangle with all three sides different lengths." },
      { term: "Right triangle", definition: "A triangle with exactly one 90° angle." },
      { term: "Hypotenuse", definition: "The side opposite a right triangle's 90° angle — always its longest side." },
      { term: "Leg", definition: "Either of the two sides forming a right triangle's 90° angle." },
      { term: "Perimeter", definition: "The total distance around a triangle — the sum of its three side lengths." },
    ],
    misconceptions: [
      {
        id: "misconception-bigger-drawing-bigger-angle-sum",
        misconception: "A larger triangle, drawn with longer sides, has interior angles that add up to more than 180°.",
        correction:
          "The Angle Sum Theorem doesn't depend on size at all — a tiny triangle and an enormous one both have interior angles summing to exactly 180°. Only the shape (the proportions between the angles) can vary; the total never does.",
      },
      {
        id: "misconception-pythagorean-any-triangle",
        misconception: "a² + b² = c² works for any triangle, not just right triangles.",
        correction:
          "The Pythagorean Theorem specifically requires a right angle. For an acute triangle, a² + b² is actually greater than c²; for an obtuse triangle, a² + b² is less than c². The equality only holds exactly when the triangle has a genuine 90° angle.",
      },
      {
        id: "misconception-isosceles-needs-exactly-two",
        misconception: "A triangle with all three sides equal doesn't count as isosceles, only as equilateral.",
        correction:
          "By the common mathematical definition, equilateral triangles are a special case of isosceles (they have \"at least two\" equal sides, which is trivially true when all three are equal). This simulation reports \"equilateral\" as its own more specific category once all three sides match, rather than double-labeling it, but it's worth knowing both terms can apply.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each outcome before checking it in Triangle Explorer below.",
    scenarios: [
      {
        id: "mathematics-triangle-explorer-predict-001",
        scenario: "You measure two of a triangle's interior angles: 50° and 70°.",
        question: "What must the third angle measure?",
        options: [
          { id: "60", label: "60°" },
          { id: "70", label: "70°" },
          { id: "120", label: "120°" },
          { id: "180", label: "180°" },
        ],
        actualResultOptionId: "60",
        explanation: "All three angles must sum to 180°. Since 50° + 70° = 120°, the third angle is 180° − 120° = 60°.",
        hint: "The three interior angles always add up to 180°.",
      },
      {
        id: "mathematics-triangle-explorer-predict-002",
        scenario: "You drag the triangle's vertices until all three sides read exactly the same length.",
        question: "What will each interior angle measure?",
        options: [
          { id: "60", label: "60°" },
          { id: "90", label: "90°" },
          { id: "45", label: "45°" },
          { id: "varies", label: "It depends on the triangle's size" },
        ],
        actualResultOptionId: "60",
        explanation: "An equilateral triangle's three equal sides force three equal angles, and since they must sum to 180°, each one is 180° ÷ 3 = 60° — no matter how large or small the triangle is.",
        hint: "Equal sides force equal angles. What do three equal angles that sum to 180° each have to be?",
      },
      {
        id: "mathematics-triangle-explorer-predict-003",
        scenario: "You build a right triangle with legs of length 3 and 4 (a common \"3-4-5\" setup).",
        question: "What will the hypotenuse measure?",
        options: [
          { id: "5", label: "5" },
          { id: "7", label: "7" },
          { id: "3.5", label: "3.5" },
          { id: "12", label: "12" },
        ],
        actualResultOptionId: "5",
        explanation: "By the Pythagorean Theorem, c² = 3² + 4² = 9 + 16 = 25, so c = √25 = 5.",
        hint: "Use a² + b² = c² with a = 3 and b = 4.",
      },
      {
        id: "mathematics-triangle-explorer-predict-004",
        scenario: "You drag a vertex until one interior angle reads 110°.",
        question: "Could either of the other two angles also be 90° or greater?",
        options: [
          { id: "no", label: "No — the remaining two angles must total 70°, so neither can reach 90°" },
          { id: "yes-one", label: "Yes, one of them could also be 90° or more" },
          { id: "yes-both", label: "Yes, both of them could be 90° or more" },
          { id: "not-enough-info", label: "There isn't enough information to say" },
        ],
        actualResultOptionId: "no",
        explanation: "Since all three angles sum to 180° and one is already 110°, the other two together must total 70° — so neither one alone can reach 90°. This is exactly why a triangle can have at most one angle of 90° or more.",
        hint: "If one angle is 110°, how much is left for the other two combined?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag any of the three colored vertex handles (or focus one and use the arrow keys) and watch the side lengths, angles, perimeter, and area update live.",
      "Watch the classification badges at the bottom of the info card change as you reshape the triangle — try to spot the exact moment a badge flips from one category to another.",
      "Use the preset chips to instantly load an Equilateral, Isosceles, Scalene, Right, or Obtuse triangle, or press Random for a fresh shuffled shape.",
      "Press \"Show Angle Sum\" to watch the triangle's three corners animate into a single straight line, proving they always total 180°.",
      "Press \"Show Pythagorean Theorem\" (on a right triangle) to watch squares grow on all three sides and see a² + b² = c² confirmed with real numbers.",
    ],
    tryThis: [
      "Drag a vertex slowly until the right-angle marker (a small square) appears at a corner — what does the side-length relationship look like at that exact moment?",
      "Try to build the most \"extreme\" obtuse triangle you can, with one angle as close to 180° as the canvas allows. What happens to the other two angles?",
      "Load the Equilateral preset, then drag just one vertex slightly. Which classification badge changes first — the side badge or the angle badge?",
      "Load the Right preset and run the Pythagorean panel. Then drag a vertex slightly off the right angle and see what happens to the confirmation message.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-triangle-explorer-explain-001",
        question: "Why do a triangle's interior angles always add up to exactly 180°, no matter its shape?",
        answer:
          "One classic way to see it: slide a copy of each corner over so all three share a single point on a straight line (exactly what the \"Show Angle Sum\" animation does). Because the three angles fit together with no gap and no overlap to exactly fill a straight line — a 180° angle — their sum has to be 180°. This holds for every triangle because the proof never assumes anything about the triangle's particular side lengths or shape.",
      },
      {
        id: "mathematics-triangle-explorer-explain-002",
        question: "Why can a triangle never have two right angles?",
        answer:
          "Two 90° angles would already add up to 180° by themselves, leaving 0° for the third angle — which isn't a real angle at all (a triangle can't have a 0° corner, since that would mean two sides lying exactly on top of each other). Since the total must be exactly 180°, at most one angle can be 90°, and the rest of the total has to be split between the remaining two.",
      },
      {
        id: "mathematics-triangle-explorer-explain-003",
        question: "Why does the Pythagorean Theorem only work for right triangles, and not for acute or obtuse ones?",
        answer:
          "The relationship a² + b² = c² comes directly from the geometry of a 90° angle specifically — it can be proven by comparing the areas of squares built on each side, which only line up exactly when the angle between the two legs is a perfect right angle. In an acute triangle, the angle between the two shorter sides is less than 90°, which pulls the third side shorter than the Pythagorean formula would predict (so a² + b² > c²). In an obtuse triangle, the angle is more than 90°, which stretches the third side longer (so a² + b² < c²).",
      },
      {
        id: "mathematics-triangle-explorer-explain-004",
        question: "Why can't the simulation let you drag a vertex to make the triangle perfectly flat?",
        answer:
          "A \"flat\" triangle — where all three vertices sit on one straight line — has zero enclosed area and isn't really a triangle at all; its three points can't form two independent sides that meet to enclose a region. It's also exactly where the Triangle Inequality breaks down: the two shorter sides would only just barely (or fail to) reach across the longest one. The simulation refuses drags that would push the shape's area below a small safety threshold so the triangle never flickers, flips inside-out, or vanishes mid-drag.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-triangle-explorer",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Build It, Then Answer
  // -------------------------------------------------------------
  challenge: {
    intro: "Use Triangle Explorer above — reshape (or load a preset for) the triangle described, then answer below.",
    scenarios: [
      {
        id: "mathematics-triangle-explorer-challenge-001",
        title: "Build an Isosceles Triangle",
        scenario: "Drag the vertices until exactly two of the three sides read the same length (within about 3 units) and the third is clearly different.",
        objective: "What does the info card's side-classification badge say once you've done this?",
        tools: [{ id: "vertices", label: "Three draggable vertices with live side/angle readouts" }],
        answer: {
          mode: "choice",
          options: [
            { id: "isosceles", label: "Isosceles" },
            { id: "equilateral", label: "Equilateral" },
            { id: "scalene", label: "Scalene" },
          ],
          correctOptionId: "isosceles",
        },
        explanation: "A triangle with exactly two equal sides (and the third different) is classified as isosceles.",
        hints: ["Try dragging just one vertex of the Equilateral preset, rather than all three."],
      },
      {
        id: "mathematics-triangle-explorer-challenge-002",
        title: "Find the Missing Angle",
        scenario: "Reshape the triangle until two of its angles read approximately 55° and 65°.",
        objective: "Without looking at the third angle's readout first, what should it measure?",
        constraints: [{ id: "sum", label: "All three angles must total 180°" }],
        answer: { mode: "numeric", target: 60, tolerance: 5 },
        explanation: "180° − 55° − 65° = 60°.",
        hints: ["Subtract both known angles from 180°."],
      },
      {
        id: "mathematics-triangle-explorer-challenge-003",
        title: "Right Triangle, Real Numbers",
        scenario: "Load the Right preset (or drag until the right-angle marker appears), then read off the two leg lengths from the info card.",
        objective: "Using the Pythagorean Theorem, roughly what should the hypotenuse measure? Then open the Pythagorean panel to check.",
        tools: [{ id: "pythagorean-panel", label: "\"Show Pythagorean Theorem\" panel with real side numbers" }],
        answer: { mode: "interactive", instructions: "Open the Pythagorean panel and confirm the equation balances for your current triangle.", verifyLabel: "I checked the equation" },
        explanation: "For any right triangle, the hypotenuse's square equals the sum of the two legs' squares — the panel's equation line shows this holding true (up to small rounding from freehand dragging) for whatever right triangle is currently loaded.",
        hints: ["Square each leg length, add them together, then compare to the hypotenuse squared."],
        requiresExperiment: true,
      },
      {
        id: "mathematics-triangle-explorer-challenge-004",
        title: "Push It to Obtuse",
        scenario: "Starting from the Scalene preset, drag a single vertex until one angle exceeds 90°.",
        objective: "What does the angle-classification badge read once you've done this, and what happened to the other two angles as that one grew?",
        answer: {
          mode: "choice",
          options: [
            { id: "obtuse", label: "Obtuse — and the other two angles shrank to keep the total at 180°" },
            { id: "acute", label: "Acute — the other angles grow along with it" },
            { id: "right", label: "Right — obtuse triangles always contain a 90° angle" },
          ],
          correctOptionId: "obtuse",
        },
        explanation: "Once any single angle passes 90°, the triangle is classified obtuse. Since all three angles must always sum to 180°, growing one angle forces the combined total of the other two to shrink.",
        hints: ["What must happen to the other two angles if one grows, given the fixed 180° total?"],
      },
      {
        id: "mathematics-triangle-explorer-challenge-005",
        title: "Estimate, Then Verify",
        scenario: "Without checking the info card first, try to drag the triangle into a shape you believe is equilateral, purely by eye.",
        objective: "How close did you get? Check the side lengths afterward — how many units apart were your three sides?",
        answer: { mode: "numeric", target: 0, tolerance: 12 },
        explanation: "This challenge is about the estimating skill itself — getting all three sides within about 12 units of each other by eye shows a solid intuitive sense of equal-length sides.",
        hints: ["An equilateral triangle looks symmetric from every direction — no side should look obviously longer."],
        requiresExperiment: true,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "angle-spinner",
      label: "Angle Spinner",
      href: "/dashboard/mathematics/angle-spinner",
      reason: "Revisit a single angle in isolation before combining three of them into a triangle.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "distance-between-two-points",
      label: "Distance Between Two Points",
      href: "/dashboard/mathematics/distance-between-two-points",
      reason: "The distance formula used there is the Pythagorean Theorem applied to a coordinate plane.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "perimeter-area-explorer",
      label: "Perimeter & Area",
      href: "/dashboard/mathematics/perimeter-area-explorer",
      reason: "Perimeter and area generalize to every 2D shape, not just triangles.",
    },
  ],
};
