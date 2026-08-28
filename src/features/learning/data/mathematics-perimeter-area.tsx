import type { TopicContent } from "../types";

/**
 * Perimeter & Area, Mathematics Batch 2 topic 7 of 7 (final topic —
 * do not start Batch 3 after this). Reuses the existing Perimeter &
 * Area Explorer simulation
 * (`@/features/subjects/mathematics/perimeter-area-explorer`) — a
 * draggable-dimension grid showing live perimeter and area readouts.
 * `learn`/`explore` content is adapted from the simulation page's
 * `SimulationLearnMore` block. `practice.quizId` points at the new
 * dedicated 30-question bank in
 * `@/features/quiz-engine/data/mathematics-perimeter-area-quiz.ts`
 * (kept separate from the shared `mathematics-measurement` bank so
 * each topic gets its own non-repetitive practice set).
 */
const gridDiagram = (
  <svg viewBox="0 0 220 130" className="mx-auto h-32 w-full max-w-xs" role="img" aria-labelledby="perimeter-area-grid-title">
    <title id="perimeter-area-grid-title">
      A 5 by 3 grid of unit squares, labeled length 5 and width 3, showing the boundary in one color and the filled interior in another.
    </title>
    <g transform="translate(35,15)">
      {Array.from({ length: 5 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => (
          <rect
            key={`${col}-${row}`}
            x={col * 24}
            y={row * 24}
            width={24}
            height={24}
            className="fill-subject-math/15 stroke-subject-math/40"
            strokeWidth="1"
          />
        )),
      )}
      <rect x={0} y={0} width={120} height={72} fill="none" className="stroke-subject-math" strokeWidth="3" />
    </g>
    <text x="95" y="105" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">
      length = 5, width = 3
    </text>
    <text x="95" y="120" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
      perimeter (bold outline) = 16 · area (filled squares) = 15
    </text>
  </svg>
);

export const mathematicsPerimeterAreaContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "perimeter-area-explorer",
  title: "Perimeter & Area",
  subjectLabel: "Mathematics",
  topicLabel: "Measurement",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/perimeter-area-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Distinguish perimeter (distance around) from area (space inside).",
      "Calculate the perimeter and area of a rectangle or square.",
      "Find a missing dimension given a shape's perimeter or area.",
      "Recognize that shapes can share a perimeter but have different areas, or share an area but have different perimeters.",
    ],
    concepts: [
      {
        term: "Perimeter",
        explanation:
          "The total distance around the outside boundary of a shape, found by adding up the length of every side.",
        formula: "P = 2(l + w)",
        formulaCaption: "Perimeter of a rectangle",
      },
      {
        term: "Area",
        explanation:
          "The amount of space enclosed inside a shape, measured in square units — literally how many unit squares fit inside it.",
        formula: "A = l \\times w",
        formulaCaption: "Area of a rectangle",
      },
      {
        term: "Linear units vs. square units",
        explanation:
          "Perimeter is a length, so it's measured in linear units like cm or m. Area covers two dimensions at once, so it's measured in square units like cm² or m² — this is why the two measurements can never be directly compared to each other.",
      },
      {
        term: "Same perimeter, different area",
        explanation:
          "Two shapes can share exactly the same perimeter while enclosing very different amounts of space — a long, thin rectangle and a square with the same perimeter almost never have the same area. Shapes closer to a square tend to enclose more area for a given perimeter.",
      },
    ],
    whyItMatters:
      "Perimeter tells you how much fencing, trim, or border material you need; area tells you how much paint, carpet, or turf to buy. Confusing the two is a classic real-world mistake — ordering fencing based on a room's area, or flooring based on its perimeter, gets the wrong amount every time.",
    keyTerms: [
      { term: "Perimeter", definition: "The total distance around a shape's boundary, in linear units." },
      { term: "Area", definition: "The amount of space a shape covers, in square units." },
      { term: "Square unit", definition: "A unit of area equal to a 1-by-1 square, like 1 cm² or 1 m²." },
    ],
    visualAids: [
      {
        id: "perimeter-area-grid",
        caption: "The bold outline traces the perimeter (16 units); every filled unit square inside adds to the area (15 square units).",
        visual: gridDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-forgetting-to-double",
        misconception: "A rectangle's perimeter is just its length plus its width.",
        correction:
          "A rectangle has two lengths and two widths, so the perimeter formula doubles that sum: P = 2(length + width), not just length + width.",
      },
      {
        id: "misconception-perimeter-determines-area",
        misconception: "If two shapes have the same perimeter, they must have the same area (or vice versa).",
        correction:
          "Perimeter and area are independent measurements. Many shapes can share a perimeter while covering very different areas, and many shapes can share an area while having very different perimeters.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Make a prediction before you drag the dimensions in the Perimeter & Area Explorer below.",
    scenarios: [
      {
        id: "mathematics-perimeter-area-predict-001",
        scenario: "A rectangle's length increases while its width stays fixed.",
        question: "What happens to the area?",
        options: [
          { id: "increases", label: "The area increases" },
          { id: "decreases", label: "The area decreases" },
          { id: "same", label: "The area stays the same" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "increases",
        explanation: "Since area = length × width, increasing length while width is fixed directly increases the product — the area grows.",
        hint: "What happens to a product when one factor gets bigger and the other stays the same?",
      },
      {
        id: "mathematics-perimeter-area-predict-002",
        scenario: "Two rectangles both have a perimeter of 20 units: one is 8 by 2, the other is 5 by 5.",
        question: "Must they have the same area?",
        options: [
          { id: "no", label: "No — 8×2 gives area 16, but 5×5 gives area 25" },
          { id: "yes", label: "Yes — equal perimeters always mean equal areas" },
          { id: "cant-tell", label: "Cannot be determined without more information" },
          { id: "always-16", label: "Both will always equal exactly 16" },
        ],
        actualResultOptionId: "no",
        explanation: "8×2=16 and 5×5=25 — both rectangles share a perimeter of 20, but their areas are quite different.",
        hint: "Calculate each rectangle's area separately and compare.",
      },
      {
        id: "mathematics-perimeter-area-predict-003",
        scenario: "You build a rectangle that's 5 units by 3 units in the explorer.",
        question: "What is its area?",
        options: [
          { id: "15", label: "15 square units" },
          { id: "16", label: "16 square units" },
          { id: "8", label: "8 square units" },
          { id: "30", label: "30 square units" },
        ],
        actualResultOptionId: "15",
        explanation: "Area = length × width = 5 × 3 = 15 square units.",
        hint: "Multiply the length by the width.",
      },
      {
        id: "mathematics-perimeter-area-predict-004",
        scenario: "You build the same 5 by 3 rectangle in the explorer.",
        question: "What is its perimeter?",
        options: [
          { id: "16", label: "16 units" },
          { id: "15", label: "15 units" },
          { id: "8", label: "8 units" },
          { id: "30", label: "30 units" },
        ],
        actualResultOptionId: "16",
        explanation: "Perimeter = 2(length + width) = 2(5 + 3) = 2 × 8 = 16 units.",
        hint: "Add the length and width, then double the result.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the length and width handles on the grid to build a rectangle.",
      "Watch the perimeter and area readouts update live as you resize the shape.",
      "Try to build two different rectangles that share the same perimeter but different areas.",
      "Try to build two different rectangles that share the same area but different perimeters.",
    ],
    tryThis: [
      "Build a rectangle with an area of exactly 24 square units — how many different length/width pairs can you find?",
      "Fix the perimeter at 20 units and drag the dimensions to find which shape gives the largest area.",
      "Predict the area before you finish dragging, then check yourself against the live readout.",
      "Build a square and compare its perimeter and area formulas to a non-square rectangle with the same perimeter.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-perimeter-area-explain-001",
        question: "Why does a rectangle's perimeter formula double the sum of length and width?",
        answer:
          "A rectangle has exactly two sides of each length — two long sides and two short sides. Adding one of each and doubling the result accounts for all four sides without having to list them individually.",
      },
      {
        id: "mathematics-perimeter-area-explain-002",
        question: "Why does multiplying length by width give the area, rather than adding them?",
        answer:
          "Area counts how many unit squares tile the inside of the shape. Multiplying length by width is exactly how many rows of how many unit squares fit — it's literally counting the grid, not just measuring a boundary.",
      },
      {
        id: "mathematics-perimeter-area-explain-003",
        question: "Why can two shapes have the same perimeter but different areas?",
        answer:
          "Perimeter only tracks the total boundary length, while area depends on how that boundary length is arranged. A long, thin rectangle uses its perimeter to cover a small area, while a shape closer to a square uses the same total boundary to enclose much more space.",
      },
      {
        id: "mathematics-perimeter-area-explain-004",
        question: "Why are perimeter and area always measured in different types of units?",
        answer:
          "Perimeter is a one-dimensional length, so it's measured in linear units like cm. Area covers two dimensions — length AND width — so its unit is a square (cm²), matching the two-dimensional space it measures.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-perimeter-area",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Area & Perimeter Designer
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Perimeter & Area Explorer above to drag dimensions until you hit each target exactly. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-perimeter-area-challenge-001",
        title: "Area & Perimeter Designer: Hit the Area Target",
        scenario: "The explorer above asks you to build a rectangle with an area of exactly 24 square units.",
        objective: "Find length and width values whose product is 24, then build that rectangle.",
        constraints: [{ id: "c1", label: "Length × width must equal exactly 24." }],
        tools: [{ id: "grid", label: "Draggable length/width grid" }],
        answer: { mode: "numeric", unit: "one valid length (e.g. 6, with width 4)", target: 6, tolerance: 0 },
        explanation: "Several rectangles work: 6×4, 8×3, 12×2, 24×1 all give an area of 24 square units.",
        hints: [
          "List pairs of whole numbers that multiply to 24.",
          "Try 6 and 4 as a starting point.",
        ],
      },
      {
        id: "mathematics-perimeter-area-challenge-002",
        title: "Area & Perimeter Designer: Two Rectangles, Same Area",
        scenario: "Build two different rectangles that both have an area of exactly 36 square units.",
        objective: "Find two different length/width pairs that each multiply to 36.",
        constraints: [{ id: "c1", label: "The two rectangles must have different shapes, not just the same one relabeled." }],
        answer: { mode: "numeric", unit: "one pair's length (e.g. 9, paired with 4)", target: 9, tolerance: 0 },
        explanation: "6×6=36 and 9×4=36 are two different rectangles with the exact same area but very different shapes (and different perimeters: 24 vs 26).",
        hints: [
          "List factor pairs of 36: (1,36), (2,18), (3,12), (4,9), (6,6).",
          "Pick two different pairs from that list.",
        ],
      },
      {
        id: "mathematics-perimeter-area-challenge-003",
        title: "Area & Perimeter Designer: Same Perimeter, Different Area",
        scenario: "Build two shapes with the same perimeter of 24 units but different areas.",
        objective: "Find two length/width pairs that both give a perimeter of 24, and compare their areas.",
        constraints: [{ id: "c1", label: "Both rectangles must have a perimeter of exactly 24 units." }],
        answer: { mode: "numeric", unit: "the larger of the two areas (e.g. 36 from a 6×6 square)", target: 36, tolerance: 0 },
        explanation: "A 6×6 square has perimeter 24 and area 36. A 9×3 rectangle also has perimeter 24 (2×(9+3)=24) but area only 27 — same perimeter, clearly different areas.",
        hints: [
          "For a perimeter of 24, length + width must equal 12.",
          "Try a square (6 and 6) versus a more stretched-out rectangle (like 9 and 3).",
        ],
      },
      {
        id: "mathematics-perimeter-area-challenge-004",
        title: "Missing Dimension",
        scenario: "A rectangle in the explorer has an area of 45 square units and a width of 5 units.",
        objective: "Find the missing length.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "units", target: 9, tolerance: 0 },
        explanation: "Length = area ÷ width = 45 ÷ 5 = 9 units.",
        hints: [
          "Divide the area by the known width.",
          "45 ÷ 5 = ?",
        ],
      },
    ],
  },

  relatedTopics: [],
};
