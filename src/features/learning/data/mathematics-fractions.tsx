import type { TopicContent } from "../types";

/**
 * Fractions, brought to the same full standard as the earlier
 * Batch 1 topics, reusing the existing `FractionPizza` simulation
 * as-is for Explore. `practice.quizId` points at the 30-question
 * bank in `@/features/quiz-engine/data/mathematics-fractions-quiz.ts`.
 */

const equivalentFractionsDiagram = (
  <svg viewBox="0 0 260 90" className="mx-auto h-20 w-full max-w-xs" role="img" aria-labelledby="equivalent-fractions-diagram-title">
    <title id="equivalent-fractions-diagram-title">
      Two identical-size bars, one split into 2 halves with 1 shaded and one split into 4 quarters with 2 shaded, showing 1/2 equals 2/4.
    </title>
    <g>
      <rect x="10" y="14" width="110" height="26" className="fill-subject-math" />
      <rect x="65" y="14" width="55" height="26" className="fill-transparent stroke-ink/30 dark:stroke-bone/30" strokeWidth="1.5" />
      <line x1="65" y1="14" x2="65" y2="40" className="stroke-white dark:stroke-chalkboard" strokeWidth="2" />
      <text x="65" y="52" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">1/2</text>
    </g>
    <g>
      <rect x="10" y="56" width="55" height="26" className="fill-subject-math" />
      <rect x="65" y="56" width="55" height="26" className="fill-subject-math" />
      <rect x="120" y="56" width="55" height="26" className="fill-transparent stroke-ink/30 dark:stroke-bone/30" strokeWidth="1.5" />
      <rect x="10" y="56" width="220" height="26" className="fill-transparent" />
      {[65, 120, 175].map((x) => (
        <line key={x} x1={x} y1="56" x2={x} y2="82" className="stroke-white dark:stroke-chalkboard" strokeWidth="2" />
      ))}
      <rect x="120" y="56" width="55" height="26" className="fill-subject-math" />
      <rect x="175" y="56" width="55" height="26" className="fill-transparent stroke-ink/30 dark:stroke-bone/30" strokeWidth="1.5" />
      <text x="120" y="88" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">2/4 — same amount</text>
    </g>
  </svg>
);

export const mathematicsFractionsContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "fractions",
  title: "Fractions",
  subjectLabel: "Mathematics",
  topicLabel: "Fractions",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/fraction-pizza",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a fraction's numerator and denominator each represent.",
      "Identify equivalent fractions and simplify a fraction to lowest terms.",
      "Compare two fractions to determine which is larger.",
      "Convert between improper fractions and mixed numbers.",
    ],
    concepts: [
      {
        term: "Numerator & denominator",
        explanation: "The denominator (bottom) sets how many equal parts make up the whole; the numerator (top) counts how many of those parts are selected.",
        formula: "3/8",
        formulaCaption: "3 parts selected out of 8 equal parts",
      },
      {
        term: "Equivalent fractions",
        explanation: "Different fractions that represent the exact same amount, created by multiplying or dividing both the numerator and denominator by the same number.",
        formula: "1/2 = 2/4 = 3/6",
        formulaCaption: "All represent the same amount",
      },
      {
        term: "Simplifying",
        explanation: "Dividing the numerator and denominator by their greatest common factor to reach the equivalent fraction with the smallest possible numbers.",
      },
      {
        term: "Improper fractions & mixed numbers",
        explanation: "An improper fraction (numerator ≥ denominator) represents one whole or more; a mixed number writes that same amount as a whole-number part plus a smaller fraction.",
        formula: "9/4 = 2 1/4",
        formulaCaption: "Improper fraction as a mixed number",
      },
    ],
    whyItMatters:
      "Fractions describe any amount that isn't a whole number — a portion of a pizza, a fraction of a task completed, a probability, a measurement between two marked lines on a ruler. Comparing and simplifying fractions confidently is also the foundation the next topic, Fraction Operations, builds directly on.",
    keyTerms: [
      { term: "Numerator", definition: "The top number in a fraction — how many parts are selected." },
      { term: "Denominator", definition: "The bottom number in a fraction — how many equal parts make up the whole." },
      { term: "Equivalent fractions", definition: "Fractions that look different but represent the same amount." },
      { term: "Improper fraction", definition: "A fraction where the numerator is greater than or equal to the denominator." },
      { term: "Mixed number", definition: "A whole number combined with a proper fraction, like 2 1/4." },
    ],
    visualAids: [
      {
        id: "equivalent-fractions-diagram",
        caption: "Same-size wholes, cut differently: shading half of one bar covers the exact same area as shading two quarters of an identical bar.",
        visual: equivalentFractionsDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-bigger-denominator-means-bigger-fraction",
        misconception: "1/8 is bigger than 1/3 because 8 is bigger than 3.",
        correction:
          "A larger denominator means the whole is cut into more, smaller pieces. 1/8 of a pizza is a smaller slice than 1/3 of the same pizza, even though 8 is the bigger digit.",
      },
      {
        id: "misconception-more-pieces-means-simpler",
        misconception: "2/4 is 'simpler' than 1/2 because it has more, smaller-looking pieces.",
        correction:
          "Simplified means the numerator and denominator share no common factor besides 1. 2/4 still shares a factor of 2 and isn't in lowest terms — 1/2 is the actual simplified form.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you build the pizza, commit to a prediction for each scenario below — then check it against the visual model.",
    scenarios: [
      {
        id: "mathematics-fractions-predict-001",
        scenario: "You're comparing 3/4 of a pizza to 1/2 of the same size pizza.",
        question: "Which portion is larger?",
        options: [
          { id: "3/4", label: "3/4" },
          { id: "1/2", label: "1/2" },
          { id: "same", label: "They are the same amount" },
          { id: "unknown", label: "Cannot be compared" },
        ],
        actualResultOptionId: "3/4",
        explanation: "3/4 = 0.75 and 1/2 = 0.5, so 3/4 is the larger portion.",
        hint: "Convert both to a common denominator, or think in terms of quarters: how many quarters is 1/2?",
      },
      {
        id: "mathematics-fractions-predict-002",
        scenario: "A pizza is cut into 4 slices with 1 selected, and an identical pizza is cut into 8 slices with 2 selected.",
        question: "How do the two selected amounts compare?",
        options: [
          { id: "same", label: "They are exactly the same amount" },
          { id: "first-more", label: "The first (1/4) is more" },
          { id: "second-more", label: "The second (2/8) is more" },
          { id: "unknown", label: "Cannot be compared" },
        ],
        actualResultOptionId: "same",
        explanation: "1/4 and 2/8 are equivalent fractions — they represent the same portion of an identical whole, just cut differently.",
        hint: "Try simplifying 2/8 — what do you get?",
      },
      {
        id: "mathematics-fractions-predict-003",
        scenario: "You select 9 slices from a pizza cut into 4 equal slices (meaning more than one pizza was needed).",
        question: "As a mixed number, how many whole pizzas and leftover slices does 9/4 represent?",
        options: [
          { id: "2-1-4", label: "2 whole pizzas and 1/4 of another" },
          { id: "2-1-2", label: "2 whole pizzas and 1/2 of another" },
          { id: "1-1-4", label: "1 whole pizza and 1/4 of another" },
          { id: "9-4", label: "9 whole pizzas and 4 slices" },
        ],
        actualResultOptionId: "2-1-4",
        explanation: "9 ÷ 4 = 2 remainder 1, so 9/4 = 2 whole pizzas (8/4) plus 1/4 more — written 2 1/4.",
        hint: "Divide the numerator by the denominator — the whole number part is the quotient, and the remainder becomes the new numerator.",
      },
      {
        id: "mathematics-fractions-predict-004",
        scenario: "You simplify the fraction 6/9.",
        question: "What is 6/9 in lowest terms?",
        options: [
          { id: "2-3", label: "2/3" },
          { id: "3-4", label: "3/4" },
          { id: "already", label: "6/9 is already simplified" },
          { id: "1-3", label: "1/3" },
        ],
        actualResultOptionId: "2-3",
        explanation: "6 and 9 share a common factor of 3: 6÷3=2 and 9÷3=3, giving 2/3.",
        hint: "What's the greatest common factor of 6 and 9?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Adjust the number of slices the pizza is cut into and how many are selected.",
      "Watch the fraction notation update live to match the visual.",
      "Try building the fraction shown in the built-in challenge — a new target appears each time you match one.",
      "Compare two different cuts of the pizza that end up representing the same amount.",
    ],
    tryThis: [
      "Build 1/2, then build 2/4 on a separately-cut pizza — do the shaded areas look the same size? Compare to your Predict answer above.",
      "Build 3/4, then try to simplify it — is there a smaller equivalent fraction, or is 3/4 already in lowest terms?",
      "Select more slices than the pizza has cuts and see how the display represents more than one whole.",
      "Build 6/9 and then try to find its simplest form using the visual — does it match your Predict answer?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-fractions-explain-001",
        question: "Why do 1/2 and 2/4 represent the exact same amount even though they look like different fractions?",
        answer:
          "Multiplying both the numerator and denominator of 1/2 by 2 gives 2/4 — since both the count of pieces and the size of each piece scaled together, the total shaded area, and therefore the value, stays identical.",
      },
      {
        id: "mathematics-fractions-explain-002",
        question: "Why is 1/8 smaller than 1/3, even though 8 is a bigger number than 3?",
        answer:
          "The denominator sets how many pieces the whole is cut into — more pieces means each individual piece is smaller. Cutting a pizza into 8 slices makes each slice smaller than cutting the same pizza into only 3 slices.",
      },
      {
        id: "mathematics-fractions-explain-003",
        question: "Why does simplifying a fraction not change its value?",
        answer:
          "Simplifying divides both the numerator and denominator by the same common factor — the same move as building an equivalent fraction, just in reverse. Since both numbers scale down together, the represented amount is preserved exactly.",
      },
      {
        id: "mathematics-fractions-explain-004",
        question: "Why does an improper fraction like 9/4 represent more than one whole?",
        answer:
          "The denominator, 4, is how many pieces make one whole pizza. A numerator of 9 means 9 pieces have been selected — more than the 4 needed for a single whole — so the amount spills over into a second pizza.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-fractions",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — use the pizza simulation above to check your reasoning where it helps. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-fractions-challenge-001",
        title: "Pizza Party Comparison",
        scenario: "At a party, one guest eats 5/8 of a pizza and another eats 2/3 of an identically-sized pizza.",
        objective: "Determine which guest ate more.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [
          { id: "a", label: "The guest who ate 2/3" },
          { id: "b", label: "The guest who ate 5/8" },
          { id: "c", label: "They ate the same amount" },
          { id: "d", label: "Cannot be compared" },
        ], correctOptionId: "a" },
        explanation: "Converting to twenty-fourths: 5/8 = 15/24 and 2/3 = 16/24. 16/24 is slightly more, so the 2/3 guest ate more.",
        hints: [
          "Find a common denominator for 8 and 3 — try 24.",
          "Once both fractions have the same denominator, compare the numerators directly.",
        ],
      },
      {
        id: "mathematics-fractions-challenge-002",
        title: "Equivalent Chain",
        scenario: "You need to find a fraction equivalent to 3/4 that has a denominator of 20.",
        objective: "Find the numerator that makes this fraction equivalent to 3/4.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 15, tolerance: 0 },
        explanation: "Going from a denominator of 4 to 20 means multiplying by 5. Doing the same to the numerator: 3 × 5 = 15, giving 15/20.",
        hints: [
          "What do you multiply 4 by to get 20?",
          "Apply that same multiplier to the numerator, 3.",
        ],
      },
      {
        id: "mathematics-fractions-challenge-003",
        title: "Simplify to the Bone",
        scenario: "You're given the fraction 18/24.",
        objective: "Simplify 18/24 to its lowest terms and identify the resulting numerator.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        explanation: "18 and 24 share a greatest common factor of 6: 18÷6=3 and 24÷6=4, giving 3/4 — so the simplified numerator is 3.",
        hints: [
          "Find the greatest common factor of 18 and 24.",
          "Divide both the numerator and denominator by that common factor.",
        ],
      },
      {
        id: "mathematics-fractions-challenge-004",
        title: "Use the Pizza: Build a Match",
        scenario: "You need to build exactly 5/6 using the pizza simulation above.",
        objective: "Use the simulation to construct a pizza showing exactly 5/6 selected.",
        constraints: [{ id: "c1", label: "The pizza must be cut into exactly 6 equal slices." }],
        tools: [{ id: "pizza", label: "Adjustable pizza — slice count and selection controls" }],
        answer: { mode: "choice", options: [
          { id: "a", label: "I built a pizza with 6 slices and 5 selected" },
          { id: "b", label: "I could not match the target" },
        ], correctOptionId: "a" },
        explanation: "5/6 means 6 equal slices total, with 5 of them selected — one slice short of the whole pizza.",
        hints: [
          "Set the slice count to 6 first.",
          "Then select 5 of the 6 slices, leaving exactly one unselected.",
        ],
      },
      {
        id: "mathematics-fractions-challenge-005",
        title: "Recipe Fraction",
        scenario: "A recipe fills 7/3 cups of batter — more than the container the cook has, which holds whole cups plus a marked fraction.",
        objective: "Convert 7/3 into a mixed number to tell the cook how many whole cups plus a fraction of a cup they need.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [
          { id: "a", label: "2 1/3 cups" },
          { id: "b", label: "2 2/3 cups" },
          { id: "c", label: "1 1/3 cups" },
          { id: "d", label: "3 1/3 cups" },
        ], correctOptionId: "a" },
        explanation: "7 ÷ 3 = 2 remainder 1, so 7/3 = 2 whole cups (6/3) plus 1/3 more — written 2 1/3.",
        hints: [
          "Divide the numerator (7) by the denominator (3).",
          "The whole-number part is how many times 3 fits into 7; the remainder becomes the new numerator.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
