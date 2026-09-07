import type { TopicContent } from "../types";

/**
 * Symmetry Mirror, Mathematics Geometry Basics topic. Reuses the
 * existing Symmetry Mirror simulation
 * (`@/features/subjects/mathematics/symmetry-mirror`) as-is \u2014 a 6x8
 * grid whose left 4 columns are clickable; the right half is never
 * separately stored, only ever derived at render time as the mirror
 * image of the left half across the fixed vertical center line (see
 * `grid-model.ts`'s `isFilled`/`mirrorColumn`). That "always
 * mirrored" design is the shaping constraint for every section below:
 * because the right half is generated automatically, the simulation
 * can't be used to build an *asymmetric* pattern or to test whether a
 * student-entered pattern is symmetric \u2014 the built-in lesson is
 * instead about what reflection does to an individual point (equal
 * distance from the mirror line, opposite side), which the simulation
 * demonstrates perfectly for every click. Predict/Explore/Challenge
 * are all written around single-square and small-pattern reflection,
 * never around "is this symmetric" judgment calls the tool can't
 * pose.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-symmetry-mirror-quiz.ts`),
 * which does cover recognizing symmetry vs. asymmetry in general
 * (real-world shapes, letters, etc.) since that's a Learn-level
 * concept even though the simulation itself only ever produces
 * symmetric results.
 */
export const mathematicsSymmetryMirrorContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "symmetry-mirror",
  title: "Symmetry Mirror",
  subjectLabel: "Mathematics",
  topicLabel: "Geometry",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/symmetry-mirror",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define symmetry and identify a line of symmetry in a shape or pattern.",
      "Predict where a point's mirror image will appear across a line of symmetry.",
      "Explain reflection in terms of equal distance from the mirror line on opposite sides.",
      "Distinguish symmetric patterns from patterns that have no line of symmetry.",
    ],
    concepts: [
      {
        term: "Symmetry",
        explanation:
          "A shape or pattern has symmetry when one part matches another part exactly, according to some rule \u2014 for line symmetry, that rule is reflection across a straight line.",
      },
      {
        term: "Line of symmetry",
        explanation:
          "A line of symmetry divides a shape or pattern into two halves that are exact mirror images of each other. Folding the shape along that line would make both halves land on top of each other perfectly.",
      },
      {
        term: "Reflection",
        explanation:
          "Reflecting a point across a line means placing a matching point on the opposite side of the line, the same distance away, along a path that crosses the line at a right angle.",
        formula: "\\text{distance}_\\text{left} = \\text{distance}_\\text{right}",
        formulaCaption: "A point and its reflection are always equally far from the mirror line",
      },
      {
        term: "Matching positions",
        explanation:
          "Every point on one side of a line of symmetry has exactly one matching point on the other side \u2014 same row (or height), same distance from the line, opposite side.",
      },
      {
        term: "Mirror image",
        explanation:
          "The complete reflected copy of a shape or pattern is its mirror image \u2014 every point in the original has a corresponding point in the mirror image, each pair equally spaced from the line of symmetry.",
      },
      {
        term: "Symmetric vs. non-symmetric shapes",
        explanation:
          "Some shapes have one line of symmetry (like the letter A), some have several (like a square, which has four), and some \u2014 like a scalene triangle or a footprint \u2014 have none at all. Having any line of symmetry is a special property a shape either has or doesn't, not something every shape is guaranteed.",
      },
    ],
    whyItMatters:
      "Line symmetry is everywhere once you start noticing it \u2014 in architecture, logo design, snowflakes, butterfly wings, and the human face. Recognizing symmetry (or its absence) is also a genuinely practical skill in design and engineering, where symmetric structures are often stronger, easier to balance, or simply more visually pleasing than asymmetric ones.",
    keyTerms: [
      { term: "Symmetry", definition: "A property of a shape or pattern where one part exactly matches another, according to a rule such as reflection." },
      { term: "Line of symmetry", definition: "A line that divides a shape into two halves that are exact mirror images of each other." },
      { term: "Reflection", definition: "Creating a mirror image of a point or shape across a line, preserving distance from that line." },
      { term: "Mirror image", definition: "The reflected copy of a shape or pattern across a line of symmetry." },
      { term: "Asymmetric", definition: "Having no line of symmetry at all." },
    ],
    misconceptions: [
      {
        id: "misconception-symmetry-means-identical-halves-anywhere",
        misconception: "Any shape cut into two equal-area halves is symmetric.",
        correction:
          "Equal area isn't enough \u2014 line symmetry specifically requires the two halves to be exact mirror images of each other across that line. A shape can easily be split into two pieces of the same area that look nothing alike, which is not symmetry at all.",
      },
      {
        id: "misconception-only-vertical-lines-count",
        misconception: "A line of symmetry always has to be vertical, like the one in this simulation.",
        correction:
          "A line of symmetry can run in any direction \u2014 vertical, horizontal, or diagonal \u2014 as long as reflecting the shape across it produces a perfect match. This simulation only ever shows a fixed vertical mirror line for simplicity, but plenty of real shapes (like a square) have horizontal and diagonal lines of symmetry too.",
      },
      {
        id: "misconception-mirrored-point-is-anywhere-on-other-side",
        misconception: "A point's reflection can be placed anywhere on the opposite side of the mirror line, as long as it's on that side.",
        correction:
          "A valid reflection has to sit at exactly the same distance from the mirror line as the original point, directly across from it. Placing it closer, farther, or off to an angle would not be a true reflection, even though it's technically on the correct side.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict where the matching square will appear before you click \u2014 then check it in Symmetry Mirror below.",
    scenarios: [
      {
        id: "mathematics-symmetry-mirror-predict-001",
        scenario: "You click the square in the top row, right next to the mirror line, on the left side.",
        question: "Where should the matching square appear?",
        options: [
          { id: "adjacent-right", label: "Top row, right next to the mirror line, on the right side" },
          { id: "far-right", label: "Top row, at the far right edge of the grid" },
          { id: "bottom-row", label: "Bottom row, next to the mirror line" },
          { id: "same-square", label: "No matching square appears" },
        ],
        actualResultOptionId: "adjacent-right",
        explanation: "A square right next to the mirror line reflects to a square the same tiny distance away, on the opposite side \u2014 so its mirror image is also right next to the line, just on the right.",
        hint: "The mirror image sits the same distance from the line, on the other side.",
      },
      {
        id: "mathematics-symmetry-mirror-predict-002",
        scenario: "You click the square in the top row, at the far-left edge of the grid \u2014 the column farthest from the mirror line.",
        question: "Where should the matching square appear?",
        options: [
          { id: "far-right", label: "Top row, at the far-right edge of the grid" },
          { id: "adjacent-right", label: "Top row, right next to the mirror line" },
          { id: "middle", label: "Directly in the middle column" },
          { id: "bottom-left", label: "Bottom row, far-left edge" },
        ],
        actualResultOptionId: "far-right",
        explanation: "The far-left column is the farthest possible distance from the mirror line on the left side, so its reflection is the farthest possible distance on the right side too \u2014 the far-right edge.",
        hint: "The farther a square is from the mirror line, the farther its reflection is on the other side.",
      },
      {
        id: "mathematics-symmetry-mirror-predict-003",
        scenario: "You click two squares that are next to each other in the same row, both on the left half.",
        question: "What will the two matching squares on the right side look like relative to each other?",
        options: [
          { id: "also-adjacent", label: "They will also be right next to each other, in the same row" },
          { id: "far-apart", label: "They will end up far apart from each other" },
          { id: "different-rows", label: "They will land in two different rows" },
          { id: "only-one-shows", label: "Only one of the two will have a visible reflection" },
        ],
        actualResultOptionId: "also-adjacent",
        explanation: "Reflection preserves relative position within a row \u2014 two squares that are adjacent on the left stay adjacent (in mirrored order) on the right, in the very same row.",
        hint: "Does reflection change how squares in the same row relate to each other, or only their distance from the line?",
      },
      {
        id: "mathematics-symmetry-mirror-predict-004",
        scenario: "You click a square in row 3, then click it again to remove it.",
        question: "What happens to its mirrored square on the right side?",
        options: [
          { id: "disappears-too", label: "It disappears too, at the same instant" },
          { id: "stays-filled", label: "It stays filled" },
          { id: "moves-elsewhere", label: "It moves to a different row" },
          { id: "grid-resets", label: "The whole grid resets" },
        ],
        actualResultOptionId: "disappears-too",
        explanation: "The right half is never stored on its own \u2014 it's always freshly derived from whatever's currently filled on the left. Un-filling a square on the left instantly removes its mirror image too.",
        hint: "Is the right half of the grid its own separate thing, or always computed fresh from the left?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Click any square on the left half of the grid to fill it.",
      "Watch its mirror image appear instantly on the right half, at the same row and the same distance from the center line.",
      "Click a filled square again to clear it \u2014 and notice its mirror image disappears at the same instant.",
      "Use Undo to step back through your clicks one at a time, or Reset to clear the whole grid.",
    ],
    tryThis: [
      "Click a square right next to the mirror line, then one at the far edge, and compare how far each mirror image lands.",
      "Build a simple picture (like a small triangle or the letter L) on the left side and predict what the fully mirrored result will look like before it appears.",
      "Fill an entire row on the left half and see what the entire mirrored row looks like on the right.",
      "Click and unclick the same square rapidly and watch the mirror image track it exactly, with no delay.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-symmetry-mirror-explain-001",
        question: "Why does a square's mirror image always land the same distance from the center line as the original?",
        answer:
          "That equal-distance rule is the actual definition of reflection across a line \u2014 a point and its mirror image are always the same distance from the line, on opposite sides. The simulation's grid is built directly from that rule: the mirror column is calculated as the same number of columns from the center as the original, just counted in the opposite direction.",
      },
      {
        id: "mathematics-symmetry-mirror-explain-002",
        question: "Why does the mirrored square disappear the instant you un-click the original, with no separate \"undo the reflection\" step?",
        answer:
          "The right half of the grid is never stored as its own separate data \u2014 it's recalculated fresh, every time, purely from whatever is currently filled on the left. There's nothing on the right to \"undo\" independently, because it was never an independent copy in the first place; it's a live, automatic consequence of the left half.",
      },
      {
        id: "mathematics-symmetry-mirror-explain-003",
        question: "Why does every pattern you build in this simulation end up symmetric, even if you weren't trying to make it symmetric?",
        answer:
          "Because the right half is always generated as the mirror image of whatever you clicked on the left, the finished grid is guaranteed to have a vertical line of symmetry down the center, no matter which squares you choose. This simulation is built to demonstrate what reflection does, rather than to let you freely test whether an arbitrary pattern happens to be symmetric.",
      },
      {
        id: "mathematics-symmetry-mirror-explain-004",
        question: "Why can a real-world shape have a line of symmetry that isn't vertical, even though this simulation's mirror line never moves?",
        answer:
          "A line of symmetry is defined by the shape itself \u2014 it's wherever a straight line happens to produce two matching mirror-image halves, and that line can run in any direction a shape allows: vertical, horizontal, or diagonal. This simulation fixes its mirror line as vertical purely to keep the interaction simple; that choice doesn't limit what counts as a line of symmetry in general, only what this particular tool can demonstrate.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-symmetry-mirror",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Build the Reflection
  // -------------------------------------------------------------
  challenge: {
    intro: "Use Symmetry Mirror above to build each pattern, then answer below.",
    scenarios: [
      {
        id: "mathematics-symmetry-mirror-challenge-001",
        title: "Build the Reflection: Single Square",
        scenario: "Click the square in row 1, the column immediately to the left of the mirror line (the rightmost of the four interactive columns).",
        objective: "In which column (counting from the left edge as column 1) does its mirror image appear?",
        tools: [{ id: "grid", label: "6x8 clickable grid with a live mirrored right half" }],
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        explanation: "The grid has 8 columns; the interactive left half is columns 1-4. Column 4 (immediately left of the mirror line) reflects to column 5 (immediately right of the mirror line) \u2014 the closest possible pair on opposite sides.",
        hints: [
          "The mirror line sits exactly between column 4 and column 5.",
          "The square closest to the line on the left reflects to the square closest to the line on the right.",
        ],
      },
      {
        id: "mathematics-symmetry-mirror-challenge-002",
        title: "Build the Reflection: Far Edge",
        scenario: "Click the square in row 1, column 1 (the far-left edge of the grid).",
        objective: "In which column does its mirror image appear?",
        tools: [{ id: "grid", label: "6x8 clickable grid with a live mirrored right half" }],
        answer: { mode: "numeric", target: 8, tolerance: 0 },
        explanation: "Column 1 is the farthest column from the mirror line on the left, so it reflects to column 8 \u2014 the farthest column on the right, the opposite edge of the grid.",
        hints: [
          "The grid has 8 columns total.",
          "Column 1 and column 8 are equally far from the center line, on opposite sides.",
        ],
      },
      {
        id: "mathematics-symmetry-mirror-challenge-003",
        title: "Build a Diagonal Line",
        scenario: "Click one square in each row (rows 1 through 6), moving one column to the right each time you go down a row, starting from column 1 in row 1.",
        objective: "What shape does the combined left-and-right pattern form once fully mirrored?",
        answer: {
          mode: "choice",
          options: [
            { id: "v-shape", label: "A V or checkmark shape, wider at the top" },
            { id: "single-diagonal", label: "One unbroken diagonal line all the way across" },
            { id: "square", label: "A solid filled square" },
            { id: "nothing", label: "No visible pattern at all" },
          ],
          correctOptionId: "v-shape",
        },
        explanation: "A diagonal line drawn only on the left half reflects into a second diagonal line on the right half, running the opposite direction \u2014 together the two diagonals meet and form a V (or checkmark) shape, wider at the top than at the mirror line.",
        hints: ["Each row's mirrored square appears on the opposite side, at the same distance from the center."],
      },
      {
        id: "mathematics-symmetry-mirror-challenge-004",
        title: "Predict the Total Count",
        scenario: "You click 5 different squares on the left half of the grid (no repeats).",
        objective: "Once fully mirrored, how many total squares are filled across the whole grid?",
        tools: [{ id: "grid", label: "6x8 clickable grid with a live mirrored right half" }],
        answer: { mode: "numeric", target: 10, tolerance: 0 },
        explanation: "Every filled square on the left produces exactly one mirrored square on the right, so 5 clicks on the left always produce 10 filled squares total \u2014 double the number you clicked.",
        hints: ["Each click on the left adds exactly one square on the right too."],
      },
      {
        id: "mathematics-symmetry-mirror-challenge-005",
        title: "Same Row, Two Clicks",
        scenario: "In row 4, click column 2 and then column 3 (both on the left half).",
        objective: "Which two columns light up on the right half, in row 4?",
        answer: {
          mode: "choice",
          options: [
            { id: "cols-6-7", label: "Columns 6 and 7" },
            { id: "cols-5-6", label: "Columns 5 and 6" },
            { id: "cols-7-8", label: "Columns 7 and 8" },
            { id: "col-4-only", label: "Only column 4" },
          ],
          correctOptionId: "cols-6-7",
        },
        explanation: "Column 2 mirrors to column 7 (8 \u2212 2 + 1 = 7), and column 3 mirrors to column 6 (8 \u2212 3 + 1 = 6), so columns 6 and 7 light up on the right \u2014 still adjacent to each other, just in mirrored order.",
        hints: [
          "A column's mirror is found by counting the same number of columns in from the opposite edge.",
          "Column c mirrors to column (9 \u2212 c) in an 8-column grid.",
        ],
      },
      {
        id: "mathematics-symmetry-mirror-challenge-006",
        title: "Clear and Recheck",
        scenario: "You fill 3 squares, observe the mirrored result, then click Undo three times in a row.",
        objective: "How many filled squares remain on the entire grid afterward?",
        tools: [{ id: "controls", label: "Undo (steps back one click at a time) and Reset" }],
        answer: { mode: "numeric", target: 0, tolerance: 0 },
        explanation: "Undoing exactly as many times as you clicked reverses every one of those clicks (toggling is its own inverse), leaving the grid completely empty \u2014 0 filled squares on either side.",
        hints: ["Each Undo reverses exactly one click."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "angle-spinner",
      label: "Angles",
      href: "/dashboard/mathematics/angle-spinner",
      reason: "Another core geometry idea about position and orientation, alongside reflection.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "coordinate-plane-explorer",
      label: "Coordinate Plane",
      href: "/dashboard/mathematics/coordinate-plane-explorer",
      reason: "See how reflection can be described precisely using coordinates once points have x and y values.",
    },
  ],
};
