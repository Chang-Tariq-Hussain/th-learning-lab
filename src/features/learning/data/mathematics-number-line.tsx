import type { TopicContent } from "../types";

/**
 * The first Mathematics topic brought up to the full Golden Learning
 * Experience standard — Learn, Predict, Explore, Explain, Practice,
 * Challenge — reusing the existing `NumberLine` simulation as-is for
 * Explore. Framed the way the Mathematics design principle calls
 * for: visualize the relationship (position on the line), manipulate
 * it (drag the marker), discover the pattern (left = smaller, right
 * = larger, distance from zero), reason about why, then solve.
 * `practice.quizId` points at the 30-question bank in
 * `@/features/quiz-engine/data/mathematics-number-line-quiz.ts`.
 */

const numberLineDiagram = (
  <svg viewBox="0 0 320 80" className="mx-auto h-20 w-full max-w-xs" role="img" aria-labelledby="number-line-diagram-title">
    <title id="number-line-diagram-title">
      A number line from -8 to 8, with zero marked in the middle, negative numbers to the left and positive numbers to the right.
    </title>
    <line x1="10" y1="40" x2="310" y2="40" strokeWidth="2" className="stroke-ink/25 dark:stroke-bone/25" />
    {Array.from({ length: 17 }, (_, i) => {
      const x = 10 + i * 18.75;
      const value = i - 8;
      const isZero = value === 0;
      return (
        <g key={i}>
          <line x1={x} y1="34" x2={x} y2="46" strokeWidth={isZero ? 2 : 1} className="stroke-ink/40 dark:stroke-bone/40" />
          {value % 4 === 0 ? (
            <text x={x} y="64" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
              {value}
            </text>
          ) : null}
        </g>
      );
    })}
    <circle cx="196.25" cy="40" r="6" className="fill-subject-math" />
  </svg>
);

export const mathematicsNumberLineContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "number-line",
  title: "Number Line",
  subjectLabel: "Mathematics",
  topicLabel: "Number Sense",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/number-line",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Locate positive numbers, negative numbers, and zero on a number line.",
      "Compare two numbers by their position, including two negative numbers.",
      "Define absolute value as distance from zero, always non-negative.",
      "Find the distance between any two points on a number line.",
    ],
    concepts: [
      {
        term: "Position determines size",
        explanation:
          "Every number's value is exactly its position on the line — further right always means larger, further left always means smaller, no matter whether the numbers involved are positive or negative.",
      },
      {
        term: "Zero",
        explanation: "The fixed point that separates positive numbers from negative numbers. Zero itself is neither.",
      },
      {
        term: "Absolute value",
        explanation: "The distance a number sits from zero, always given as a non-negative value.",
        formula: "|{-5}| = 5",
        formulaCaption: "Absolute value of -5",
      },
      {
        term: "Distance between two points",
        explanation: "The positive difference between two positions — always found by subtracting the smaller from the larger, or equivalently, an absolute value of their difference.",
        formula: "|a - b|",
        formulaCaption: "Distance between a and b",
      },
    ],
    whyItMatters:
      "The number line is the mental model behind bank balances that can go negative, temperatures below zero, elevations below sea level, and countless everyday comparisons. Once position-equals-value clicks, confusing results like '-10 is less than -3' stop feeling like exceptions and start feeling obvious — and the same reasoning carries forward into every later topic that involves ordering or comparing quantities.",
    keyTerms: [
      { term: "Positive number", definition: "A number greater than zero, sitting to the right of it on the number line." },
      { term: "Negative number", definition: "A number less than zero, sitting to the left of it on the number line." },
      { term: "Absolute value", definition: "A number's distance from zero, written |n| and always zero or positive." },
      { term: "Opposite", definition: "Two numbers the same distance from zero but on different sides, like 7 and -7." },
    ],
    visualAids: [
      {
        id: "number-line-diagram",
        caption: "Position is value: numbers to the right are always larger, numbers to the left are always smaller — including among negatives.",
        visual: numberLineDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-bigger-digit-bigger-negative",
        misconception: "-20 is bigger than -5 because 20 is bigger than 5.",
        correction:
          "Comparing negative numbers by ignoring the sign gives the wrong answer. -20 sits farther left on the number line than -5, which makes it the smaller value — a colder temperature, a lower bank balance, a deeper point below sea level.",
      },
      {
        id: "misconception-absolute-value-negative",
        misconception: "Absolute value can come out negative if the original number was negative.",
        correction:
          "Absolute value measures a distance, and distances are never negative. |-9| = 9, the same positive result you'd get from |9| — the sign of the original number doesn't carry through.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you drag the marker, commit to an answer for each scenario below — then check it against the number line.",
    scenarios: [
      {
        id: "mathematics-number-line-predict-001",
        scenario: "Two numbers, -12 and -4, are about to be placed on the number line.",
        question: "Which one will end up farther to the right?",
        options: [
          { id: "-4", label: "-4" },
          { id: "-12", label: "-12" },
          { id: "same", label: "They'll be at the same position" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "-4",
        explanation: "-4 is greater than -12, so it sits farther right on the number line, even though 4 is the smaller plain digit.",
        hint: "Ignore the minus signs for a second — which is closer to zero?",
      },
      {
        id: "mathematics-number-line-predict-002",
        scenario: "The marker starts at 6 and moves 10 units to the left.",
        question: "Where does the marker end up?",
        options: [
          { id: "-4", label: "-4" },
          { id: "4", label: "4" },
          { id: "16", label: "16" },
          { id: "-16", label: "-16" },
        ],
        actualResultOptionId: "-4",
        explanation: "Starting at 6 and moving 10 units left: 6 - 10 = -4.",
        hint: "Moving left always subtracts from the current value.",
      },
      {
        id: "mathematics-number-line-predict-003",
        scenario: "A point sits at -3 and another sits at 5.",
        question: "What is the distance between these two points?",
        options: [
          { id: "8", label: "8" },
          { id: "2", label: "2" },
          { id: "-8", label: "-8" },
          { id: "15", label: "15" },
        ],
        actualResultOptionId: "8",
        explanation: "Distance is the positive difference: |5 - (-3)| = |8| = 8.",
        hint: "Distance is always positive — think about how far apart they sit, not their individual values.",
      },
      {
        id: "mathematics-number-line-predict-004",
        scenario: "You're comparing the absolute values of -15 and 8.",
        question: "Which number has the greater absolute value?",
        options: [
          { id: "-15", label: "-15" },
          { id: "8", label: "8" },
          { id: "same", label: "They have the same absolute value" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "-15",
        explanation: "|-15| = 15 and |8| = 8. 15 is greater, so -15 has the greater absolute value even though it's the smaller number overall.",
        hint: "Absolute value only cares about distance from zero, not sign.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Drag the marker along the number line and watch its value update live.",
      "Move the marker into negative territory and notice how the value's sign changes.",
      "Try to land the marker exactly on the target shown above the line — a new target appears each time you land on one.",
      "Compare the marker's distance from zero on the positive and negative sides.",
    ],
    tryThis: [
      "Place the marker at -8, then find its opposite. What do you notice about their positions and distances from zero? Compare to your Predict answers above.",
      "Place the marker at -12, then at -4 — which position is farther right, and does that match which number is greater?",
      "Find two different numbers with an absolute value of 12.",
      "Place the marker at 6, then predict where it'll land after moving 10 units left before checking.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-number-line-explain-001",
        question: "Why does -4 count as greater than -12, when 12 is the bigger plain number?",
        answer:
          "Value on a number line is entirely about position, not digit size. -4 sits closer to zero (and farther right) than -12, and farther right always means a greater value — the same rule that makes 4 greater than -1 also makes -4 greater than -12.",
      },
      {
        id: "mathematics-number-line-explain-002",
        question: "Why is absolute value always zero or positive, never negative?",
        answer:
          "Absolute value measures distance — how far a number sits from zero — and distance is a physical kind of quantity that can't be negative. Whether you walk 5 steps left or 5 steps right, you've still walked a distance of 5.",
      },
      {
        id: "mathematics-number-line-explain-003",
        question: "Why does finding the distance between two points always give the same answer regardless of which point you subtract from which?",
        answer:
          "Distance is defined as the absolute value of the difference, |a - b|, and absolute value strips away the sign — so |5 - (-3)| and |-3 - 5| both work out to 8. Order doesn't matter once you take the absolute value.",
      },
      {
        id: "mathematics-number-line-explain-004",
        question: "Why do two opposite numbers, like 7 and -7, have the same absolute value?",
        answer:
          "Opposites are defined as sitting the same distance from zero, just on different sides. Since absolute value only measures distance and ignores direction, both land on exactly the same number: 7.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-number-line",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — use the number line above to check your reasoning where it helps. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-number-line-challenge-001",
        title: "Coldest City",
        scenario: "Three cities report overnight lows: City A at -9°C, City B at -2°C, and City C at -15°C.",
        objective: "Determine which city had the coldest night.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "City A (-9°C)" },
            { id: "b", label: "City B (-2°C)" },
            { id: "c", label: "City C (-15°C)" },
          ],
          correctOptionId: "c",
        },
        explanation: "-15 sits farthest left on the number line among the three, making it the smallest (coldest) value.",
        hints: [
          "Coldest means the smallest number, not the one with the biggest digits.",
          "Picture all three on a number line — whichever is farthest left is coldest.",
        ],
      },
      {
        id: "mathematics-number-line-challenge-002",
        title: "Elevation Gap",
        scenario: "A drone is flying at +40 m (above ground level) while a diver is at -12 m (below sea level, used here as the same reference scale).",
        objective: "Find the total distance between the drone and the diver.",
        requiresExperiment: false,
        tools: [{ id: "t1", label: "Drone position: +40" }, { id: "t2", label: "Diver position: -12" }],
        answer: { mode: "numeric", unit: "units", target: 52, tolerance: 0.5 },
        explanation: "Distance = |40 - (-12)| = |52| = 52 units apart.",
        hints: [
          "Distance is the absolute value of the difference between the two positions.",
          "Subtract the diver's position from the drone's position, then drop any negative sign.",
        ],
      },
      {
        id: "mathematics-number-line-challenge-003",
        title: "Bank Balance Ladder",
        scenario: "A bank account starts at -$40 (overdrawn). A deposit of $25 is made, then a withdrawal of $10.",
        objective: "Find the final account balance.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "$", target: -25, tolerance: 0.5 },
        explanation: "-40 + 25 = -15, then -15 - 10 = -25. The account ends at -$25, still overdrawn.",
        hints: [
          "Track the balance one step at a time on a mental number line: start, deposit, withdrawal.",
          "A deposit moves right (adds); a withdrawal moves left (subtracts).",
        ],
      },
      {
        id: "mathematics-number-line-challenge-004",
        title: "Use the Simulation: Find the Midpoint",
        scenario: "You need to find the number exactly halfway between -18 and 6 on the number line.",
        objective: "Use the simulation above to locate and confirm the midpoint value.",
        constraints: [{ id: "c1", label: "The midpoint must be equidistant from both -18 and 6." }],
        tools: [{ id: "marker", label: "Draggable marker — try landing it where the distances to both ends look equal." }],
        answer: { mode: "numeric", target: -6, tolerance: 0.5 },
        explanation: "Midpoint = (-18 + 6) / 2 = -12 / 2 = -6. Dragging the marker to -6 should look equidistant from both -18 and 6.",
        hints: [
          "The midpoint of two numbers is their average: add them and divide by 2.",
          "Try the marker at -6 and check that its distance to -18 (12 units) matches its distance to 6 (12 units).",
        ],
      },
      {
        id: "mathematics-number-line-challenge-005",
        title: "Two Numbers, One Distance",
        scenario: "Two numbers are exactly 14 units apart on the number line. One of them is -5.",
        objective: "Find both possible values for the other number.",
        constraints: [{ id: "c1", label: "There are two valid answers — one on each side of -5." }],
        answer: { mode: "choice", options: [
          { id: "a", label: "9 or -19" },
          { id: "b", label: "19 or -9" },
          { id: "c", label: "14 or -14" },
          { id: "d", label: "9 only" },
        ], correctOptionId: "a" },
        explanation: "Moving 14 units right from -5 lands on 9; moving 14 units left lands on -19. Both are exactly 14 units from -5.",
        hints: [
          "There are two directions to move from -5: right and left.",
          "Add 14 for one answer, subtract 14 for the other.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
