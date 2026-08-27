import type { TopicContent } from "../types";

/**
 * Fraction Operations, brought to the same full standard as the rest
 * of Batch 1. No existing simulation covered this, so a minimal new
 * one — the Fraction Operations Lab
 * (`@/features/subjects/mathematics/fraction-operations`) — was
 * built with per-operation visuals: common-denominator bars for
 * add/subtract, a "part of a part" area-model grid for multiply, and
 * a grouped-chunk bar for divide. `practice.quizId` points at the
 * 30-question bank in
 * `@/features/quiz-engine/data/mathematics-fraction-operations-quiz.ts`.
 */

const partOfAPartDiagram = (
  <svg viewBox="0 0 200 100" className="mx-auto h-24 w-full max-w-xs" role="img" aria-labelledby="part-of-a-part-diagram-title">
    <title id="part-of-a-part-diagram-title">
      A grid showing 1/2 times 1/3: one half of the rows and one third of the columns are shaded, and their overlap of one small square out of six shows the product.
    </title>
    {Array.from({ length: 2 }, (_, r) =>
      Array.from({ length: 3 }, (_, c) => {
        const inRow = r < 1;
        const inCol = c < 1;
        return (
          <rect
            key={`${r}-${c}`}
            x={20 + c * 55}
            y={10 + r * 40}
            width="50"
            height="35"
            className={inRow && inCol ? "fill-subject-math" : inRow || inCol ? "fill-subject-math/25" : "fill-transparent stroke-ink/20 dark:stroke-bone/20"}
            strokeWidth="1"
          />
        );
      }),
    )}
    <text x="100" y="95" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">
      1/2 × 1/3 = 1/6 (the darker overlap)
    </text>
  </svg>
);

export const mathematicsFractionOperationsContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "fraction-operations",
  title: "Fraction Operations",
  subjectLabel: "Mathematics",
  topicLabel: "Fractions",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/fraction-operations",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Add and subtract fractions by first converting to a common denominator.",
      "Multiply fractions as taking 'a part of a part' of the whole.",
      "Divide fractions by multiplying by the reciprocal, and explain what that means visually.",
      "Predict whether an operation's result will be bigger or smaller than the starting fraction.",
    ],
    concepts: [
      {
        term: "Common denominator (add/subtract)",
        explanation: "Fractions must describe the same-size pieces before their numerators can be combined — that's what converting to a common denominator does.",
        formula: "1/2 + 1/3 = 3/6 + 2/6 = 5/6",
        formulaCaption: "Convert to sixths, then add numerators",
      },
      {
        term: "Part of a part (multiply)",
        explanation: "Multiplying two fractions means taking a fraction of an already-fractional amount — visualized as the overlap of two shaded bands on a grid.",
        formula: "1/2 × 1/3 = 1/6",
        formulaCaption: "One-third of one-half",
      },
      {
        term: "Multiply by the reciprocal (divide)",
        explanation: "Dividing by a fraction asks how many of that size fit into the starting amount — answered by flipping the second fraction and multiplying.",
        formula: "3/4 ÷ 1/4 = 3/4 × 4/1 = 3",
        formulaCaption: "How many quarters fit into three-quarters",
      },
      {
        term: "Bigger or smaller?",
        explanation:
          "Multiplying by a fraction less than 1 shrinks a quantity, while dividing by a fraction less than 1 grows it — the opposite of what whole-number multiplication and division usually do.",
      },
    ],
    whyItMatters:
      "Scaling a recipe up or down, splitting a length of material into equal pieces, or figuring out how many smaller containers a larger amount fills all come down to fraction operations. They're also a common source of surprising results — dividing 5 by 1/2 giving 10, not something smaller — that only make sense once the visual model behind each operation clicks.",
    keyTerms: [
      { term: "Common denominator", definition: "A shared denominator two fractions are both converted to before adding or subtracting." },
      { term: "Reciprocal", definition: "A fraction flipped upside down — numerator and denominator swapped." },
      { term: "Area model", definition: "A grid-based visual for fraction multiplication, where overlap represents the product." },
    ],
    visualAids: [
      {
        id: "part-of-a-part-diagram",
        caption: "Multiplying fractions overlaps two shaded bands on a grid — the darker overlap region is the product.",
        visual: partOfAPartDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-add-numerators-and-denominators",
        misconception: "To add fractions, just add the numerators together and the denominators together, like 1/2 + 1/3 = 2/5.",
        correction:
          "That treats differently-sized pieces as if they were the same size. Halves and thirds aren't the same size piece, so their numerators can't be combined directly — both fractions need to be converted to a shared denominator (like sixths) first.",
      },
      {
        id: "misconception-multiplication-always-makes-bigger",
        misconception: "Multiplying always makes a number bigger, the way it does with whole numbers.",
        correction:
          "Multiplying by a fraction less than 1 takes a fractional part of an already-fractional amount, which shrinks it. 1/2 × 1/3 is smaller than either 1/2 or 1/3 alone — the opposite of what whole-number multiplication does.",
      },
      {
        id: "misconception-division-always-makes-smaller",
        misconception: "Dividing always makes a number smaller.",
        correction:
          "Dividing by a fraction smaller than 1 asks how many small pieces fit into the amount, and small pieces fit in many times over. 5 ÷ 1/2 = 10 — bigger than 5, because there are ten halves in five wholes.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you build the equation, commit to a prediction for each scenario below — then check it in the Fraction Operations Lab.",
    scenarios: [
      {
        id: "mathematics-fraction-operations-predict-001",
        scenario: "You're about to add 1/2 and 1/3, two fractions with different denominators.",
        question: "What must happen before you can add their numerators?",
        options: [
          { id: "common-denom", label: "Both fractions must be converted to a common denominator" },
          { id: "nothing", label: "Nothing — you can add the numerators directly" },
          { id: "simplify-first", label: "Both fractions must already be in lowest terms" },
          { id: "multiply-first", label: "You must multiply the two fractions first" },
        ],
        actualResultOptionId: "common-denom",
        explanation: "The pieces have to be the same size before their counts can be meaningfully combined — that's what a common denominator provides.",
        hint: "Would 1/2 + 1/3 = 2/5 make sense if you tried it with real pizza slices?",
      },
      {
        id: "mathematics-fraction-operations-predict-002",
        scenario: "You're about to multiply 1/2 by 1/3.",
        question: "Will the result be bigger than, smaller than, or equal to 1/3?",
        options: [
          { id: "smaller", label: "Smaller than 1/3" },
          { id: "bigger", label: "Bigger than 1/3" },
          { id: "equal", label: "Equal to 1/3" },
          { id: "unknown", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "smaller",
        explanation: "1/2 × 1/3 = 1/6, which is smaller than 1/3 — multiplying by a fraction less than 1 shrinks the amount.",
        hint: "You're taking only half of 1/3 — does that make it bigger or smaller?",
      },
      {
        id: "mathematics-fraction-operations-predict-003",
        scenario: "You're about to divide 5 by 1/2.",
        question: "Will the result be bigger than, smaller than, or equal to 5?",
        options: [
          { id: "bigger", label: "Bigger than 5" },
          { id: "smaller", label: "Smaller than 5" },
          { id: "equal", label: "Equal to 5" },
          { id: "unknown", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "bigger",
        explanation: "5 ÷ 1/2 = 10 — dividing by a fraction smaller than 1 always grows the result, since small pieces fit into the amount many times over.",
        hint: "How many half-cups fit into 5 whole cups?",
      },
      {
        id: "mathematics-fraction-operations-predict-004",
        scenario: "You're about to subtract 1/4 from 3/4.",
        question: "What denominator will the result have, before any simplifying?",
        options: [
          { id: "4", label: "4" },
          { id: "8", label: "8" },
          { id: "1", label: "1" },
          { id: "12", label: "12" },
        ],
        actualResultOptionId: "4",
        explanation: "Both fractions already share a denominator of 4, so subtracting the numerators (3 - 1 = 2) keeps that denominator: 2/4.",
        hint: "Do these two fractions already have the same denominator?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Choose an operation from the tabs: Add, Subtract, Multiply, or Divide.",
      "Adjust the two fraction pickers and watch the visualization change to match that operation's model.",
      "Read the live equation and simplified result below the visualization.",
      "Switch operations without changing the fractions to compare how differently each one behaves on the same starting values.",
    ],
    tryThis: [
      "Set up 1/2 and 1/3, then try Add — does the common-denominator bar match what you predicted above?",
      "Keeping the same two fractions, switch to Multiply — is the result bigger or smaller than either original fraction?",
      "Switch to Divide with the same two fractions — how many of the second fraction's size fit into the first?",
      "Try Subtract with the first fraction smaller than the second — what does the visualization show when the result goes negative?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-fraction-operations-explain-001",
        question: "Why does adding fractions require a common denominator, but multiplying them doesn't?",
        answer:
          "Addition combines counts of same-size pieces, so the pieces must be the same size first — that's the common denominator's job. Multiplication instead asks for 'a fraction of a fraction,' which works directly on the original pieces without needing them resized first.",
      },
      {
        id: "mathematics-fraction-operations-explain-002",
        question: "Why does multiplying by a fraction less than 1 shrink the result, unlike whole-number multiplication?",
        answer:
          "Multiplying by a fraction takes a fractional part of an already-fractional amount — you're not combining copies of something, you're carving out a smaller piece of a piece. That's a fundamentally different operation from whole-number multiplication, which repeats and grows.",
      },
      {
        id: "mathematics-fraction-operations-explain-003",
        question: "Why does dividing by a fraction turn into multiplying by its reciprocal?",
        answer:
          "Dividing by a fraction asks 'how many of that size fit in?' — and flipping the fraction (finding its reciprocal) converts that question into a straightforward multiplication that counts exactly that. It's a shortcut that always gives the same answer as reasoning through the 'how many fit' question directly.",
      },
      {
        id: "mathematics-fraction-operations-explain-004",
        question: "Why can subtracting two fractions with different denominators go wrong if you subtract before converting to a common denominator?",
        answer:
          "Subtracting numerators only makes sense when both are counting the same-size piece. Skipping the conversion compares counts of different-size pieces as if they matched, producing a number that doesn't represent the actual difference between the two amounts.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-fraction-operations",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — use the Fraction Operations Lab above to check your reasoning where it helps. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-fraction-operations-challenge-001",
        title: "Recipe Scale-Up",
        scenario: "A recipe needs 3/4 cup of flour per batch, and you're making 4 batches.",
        objective: "Find the total cups of flour needed.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "cups", target: 3, tolerance: 0.1 },
        explanation: "3/4 × 4 = 12/4 = 3 — four batches need exactly 3 full cups of flour.",
        hints: [
          "Multiplying a fraction by a whole number scales it up that many times.",
          "3/4 × 4 = 12/4 — what does that simplify to?",
        ],
      },
      {
        id: "mathematics-fraction-operations-challenge-002",
        title: "Ribbon Cutting",
        scenario: "A ribbon is 5/6 of a meter long, and needs to be cut into pieces that are each 1/6 of a meter.",
        objective: "Find how many pieces the ribbon will make.",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        explanation: "5/6 ÷ 1/6 asks how many 1/6-meter pieces fit into 5/6 of a meter — the answer is 5.",
        hints: [
          "This is a division problem: total length ÷ piece length.",
          "Since both fractions already share a denominator, you can compare the numerators directly: 5 pieces of size 1 fit into 5.",
        ],
      },
      {
        id: "mathematics-fraction-operations-challenge-003",
        title: "Pouring Out",
        scenario: "A pitcher holds 5/6 of a liter. You pour out 1/3 of a liter.",
        objective: "Find how much liquid remains in the pitcher.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "liters (as a fraction, e.g. 0.5)", target: 0.5, tolerance: 0.02 },
        explanation: "Convert 1/3 to sixths: 2/6. Then 5/6 - 2/6 = 3/6, which simplifies to 1/2 (0.5) of a liter.",
        hints: [
          "Convert both fractions to a common denominator before subtracting.",
          "5/6 and 1/3 — what's the smallest denominator both convert to evenly?",
        ],
      },
      {
        id: "mathematics-fraction-operations-challenge-004",
        title: "Use the Lab: Match an Equation",
        scenario: "You need to set up the Fraction Operations Lab above to compute 2/3 × 3/4.",
        objective: "Use the fraction pickers and Multiply tab to build this exact equation and read off the result.",
        constraints: [{ id: "c1", label: "The first fraction must be 2/3 and the second must be 3/4." }],
        tools: [{ id: "pickers", label: "Two fraction pickers with numerator/denominator steppers" }, { id: "tabs", label: "Operation tabs" }],
        answer: { mode: "numeric", target: 0.5, tolerance: 0.02 },
        explanation: "2/3 × 3/4 = 6/12, which simplifies to 1/2 (0.5) — the area model's overlap region covers exactly half the grid.",
        hints: [
          "Set the first picker to numerator 2, denominator 3, and the second to numerator 3, denominator 4.",
          "Switch to the Multiply tab and read the simplified result at the bottom.",
        ],
      },
      {
        id: "mathematics-fraction-operations-challenge-005",
        title: "Per-Person Share",
        scenario: "A pot holds 3/4 cup of sauce, split evenly among 3 people.",
        objective: "Find how much sauce each person gets.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "cup", target: 0.25, tolerance: 0.02 },
        explanation: "3/4 ÷ 3 = 3/4 × 1/3 = 3/12, which simplifies to 1/4 (0.25) cup per person.",
        hints: [
          "Dividing by a whole number is the same as dividing by that number written as a fraction over 1.",
          "3/4 ÷ 3/1 = 3/4 × 1/3 — what does that multiply out to?",
        ],
      },
    ],
  },

  relatedTopics: [],
};
