import type { TopicContent } from "../types";

/**
 * Even & Odd Numbers, brought to the same full standard as Number
 * Line. No existing simulation covered this topic, so a minimal new
 * one — the Even & Odd Explorer (`@/features/subjects/mathematics/even-odd-explorer`)
 * — was built: two number pickers and an operation toggle drive a
 * live equation, with each operand rendered as paired dots so the
 * "leftover dot" behind parity is visible, plus a built-in
 * target-parity challenge. `practice.quizId` points at the
 * 30-question bank in
 * `@/features/quiz-engine/data/mathematics-even-odd-quiz.ts`.
 */

const dotPairsDiagram = (
  <svg viewBox="0 0 220 90" className="mx-auto h-20 w-full max-w-xs" role="img" aria-labelledby="dot-pairs-diagram-title">
    <title id="dot-pairs-diagram-title">
      Seven dots grouped into three pairs with one dot left over, showing why 7 is odd.
    </title>
    {Array.from({ length: 3 }, (_, pairIndex) => (
      <g key={pairIndex}>
        <circle cx={20 + pairIndex * 40} cy="30" r="9" className="fill-subject-math" />
        <circle cx={20 + pairIndex * 40} cy="55" r="9" className="fill-subject-math" />
      </g>
    ))}
    <circle cx="180" cy="42" r="9" className="fill-subject-physics" />
    <text x="180" y="75" textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
      leftover
    </text>
    <text x="100" y="88" textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">
      7 = 3 pairs + 1 leftover → odd
    </text>
  </svg>
);

export const mathematicsEvenOddContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "even-odd",
  title: "Even & Odd Numbers",
  subjectLabel: "Mathematics",
  topicLabel: "Number Sense",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/even-odd-explorer",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Tell whether a whole number is even or odd from its last digit alone.",
      "State whether even + even, odd + odd, and even + odd each produce an even or odd result.",
      "Explain why only the last digit determines a number's parity.",
      "Predict the parity of a sum or difference without calculating it exactly.",
    ],
    concepts: [
      {
        term: "Even number",
        explanation: "A whole number that splits into pairs with nothing left over — divisible by 2 with no remainder.",
        formula: "n = 2k",
        formulaCaption: "n is even for some whole number k",
      },
      {
        term: "Odd number",
        explanation: "A whole number that splits into pairs with exactly one left over.",
        formula: "n = 2k + 1",
        formulaCaption: "n is odd for some whole number k",
      },
      {
        term: "The last-digit rule",
        explanation:
          "Every digit except the last represents a multiple of 10 (tens, hundreds, thousands...), and 10 is even — so those digits never affect parity. Only the ones digit decides even or odd.",
      },
      {
        term: "Leftover reasoning",
        explanation:
          "Adding or subtracting even and odd numbers is really about tracking leftovers: even numbers contribute no leftover, odd numbers each contribute exactly one, and two leftovers combine into a fresh pair.",
      },
    ],
    whyItMatters:
      "Parity shows up anywhere things need to be split into equal pairs or groups — seating arrangements, splitting teams evenly, or checking whether a set of items can be divided fairly. It's also many students' first encounter with a mathematical pattern that holds for every number of a certain type, which is the same kind of reasoning behind algebraic proofs later on.",
    keyTerms: [
      { term: "Even", definition: "Divisible by 2 with no remainder; ends in 0, 2, 4, 6, or 8." },
      { term: "Odd", definition: "Leaves a remainder of 1 when divided by 2; ends in 1, 3, 5, 7, or 9." },
      { term: "Parity", definition: "Whether a number is even or odd." },
    ],
    visualAids: [
      {
        id: "dot-pairs",
        caption: "Any whole number can be split into pairs. If nothing is left over, it's even; if exactly one dot is left, it's odd.",
        visual: dotPairsDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-size-determines-parity",
        misconception: "Big numbers are even and small numbers are odd.",
        correction:
          "Parity has nothing to do with size — it depends only on the last digit. 3 is small and odd; 1,000,000 is huge and even. A number with a thousand digits could still be odd if its last digit is odd.",
      },
      {
        id: "misconception-odd-plus-odd-is-odd",
        misconception: "Adding two odd numbers gives an odd result, the same way odd numbers 'stay odd.'",
        correction:
          "Odd + odd is always even, not odd. Each odd number has one leftover dot; combine two odd numbers and their two leftovers pair up into one more complete pair, leaving nothing over.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you build the expression, commit to a prediction for each scenario below — then check it using the explorer.",
    scenarios: [
      {
        id: "mathematics-even-odd-predict-001",
        scenario: "You are about to add two odd numbers together, for example 7 + 9.",
        question: "What will the result's parity be?",
        options: [
          { id: "even", label: "Even" },
          { id: "odd", label: "Odd" },
          { id: "depends", label: "It depends on the specific numbers" },
          { id: "unknown", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "even",
        explanation: "Odd + odd is always even — each odd number's single leftover combines with the other's to form one more complete pair.",
        hint: "Think about the 'leftover dot' each odd number carries — what happens when two leftovers meet?",
      },
      {
        id: "mathematics-even-odd-predict-002",
        scenario: "You are about to add an even number and an odd number, for example 8 + 5.",
        question: "What will the result's parity be?",
        options: [
          { id: "odd", label: "Odd" },
          { id: "even", label: "Even" },
          { id: "depends", label: "It depends on the specific numbers" },
          { id: "unknown", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "odd",
        explanation: "Even + odd is always odd — the even number pairs up completely, leaving the odd number's one leftover unmatched.",
        hint: "The even number contributes no leftover — whose leftover survives?",
      },
      {
        id: "mathematics-even-odd-predict-003",
        scenario: "A number ends in the digit 4, but has 12 digits total.",
        question: "Is this number even or odd?",
        options: [
          { id: "even", label: "Even" },
          { id: "odd", label: "Odd" },
          { id: "depends", label: "Depends on how many digits it has" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "even",
        explanation: "Only the last digit determines parity, regardless of how many digits come before it. Since 4 is even, the whole number is even.",
        hint: "Does the number of digits before the last one ever matter for parity?",
      },
      {
        id: "mathematics-even-odd-predict-004",
        scenario: "You subtract an odd number from an even number, for example 12 - 5.",
        question: "What will the result's parity be?",
        options: [
          { id: "odd", label: "Odd" },
          { id: "even", label: "Even" },
          { id: "depends", label: "It depends on the specific numbers" },
          { id: "unknown", label: "Cannot be predicted" },
        ],
        actualResultOptionId: "odd",
        explanation: "Even - odd is always odd — removing complete pairs from an even amount still requires breaking one more pair to supply the odd number's leftover, leaving one item unmatched.",
        hint: "Try a couple of small examples: 6 - 1, 10 - 3. What parity do you keep landing on?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Use the number pickers to set two operands, and the toggle to choose addition or subtraction.",
      "Watch each number's dot-pair visual — a leftover dot means that number is odd.",
      "Read the live equation and its parity badge below the pickers.",
      "Try to match the challenge banner's target parity — a new target appears each time you match one.",
    ],
    tryThis: [
      "Set both numbers odd and add them — does the result match your Predict answer above?",
      "Set one number even and one odd, then try both addition and subtraction — is the result's parity the same either way?",
      "Pick two large numbers (like 19 and 17) — can you tell their parity just from the last digit, without adding them first?",
      "Try to build an odd result using only even starting numbers. Is it possible with addition or subtraction alone?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-even-odd-explain-001",
        question: "Why does even + even always equal even?",
        answer:
          "Both numbers split into pairs with nothing left over. Combining two groups that each have no leftover still leaves no leftover — the pairs from each group just sit alongside each other.",
      },
      {
        id: "mathematics-even-odd-explain-002",
        question: "Why does odd + odd always equal even, not odd?",
        answer:
          "Each odd number carries exactly one leftover dot. Add two odd numbers together and their two leftover dots combine into one more complete pair — so the total ends up with nothing left over, which is exactly what makes a number even.",
      },
      {
        id: "mathematics-even-odd-explain-003",
        question: "Why can you tell a number's parity from just its last digit, even for a 20-digit number?",
        answer:
          "Every digit except the last one represents a multiple of 10 (10s, 100s, 1000s, and so on), and 10 itself is even. Adding any number of even contributions never changes parity — so only the ones digit, which isn't a multiple of 10, can introduce a leftover.",
      },
      {
        id: "mathematics-even-odd-explain-004",
        question: "Why does even - odd always equal odd, using the same leftover idea as addition?",
        answer:
          "Removing a fully-paired (even) amount from another number never disturbs any leftovers by itself — but taking away an odd number specifically requires breaking one extra pair to supply its one leftover unit, which leaves one item stranded in the result.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-even-odd",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — some can be worked out with reasoning alone, others ask you to build an expression using the explorer above. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-even-odd-challenge-001",
        title: "Odd One Out",
        scenario: "A teacher lines up 47 students to pair them up for a game.",
        objective: "Determine whether every student can be paired up with none left over.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "No — 47 is odd, so one student will be left without a partner" },
            { id: "b", label: "Yes, 47 students can always be paired evenly" },
            { id: "c", label: "Only if the teacher joins in" },
            { id: "d", label: "Cannot be determined" },
          ],
          correctOptionId: "a",
        },
        explanation: "47 is odd (it ends in 7), so pairing everyone up leaves exactly one student without a partner.",
        hints: ["Check the last digit of 47.", "An odd number of people can never be split into pairs with none left over."],
      },
      {
        id: "mathematics-even-odd-challenge-002",
        title: "Expression Builder",
        scenario: "You need an expression using only addition of whole numbers that is guaranteed to be odd, no matter what starting numbers are plugged in for the variable.",
        objective: "Which of these is guaranteed to always produce an odd result, for any whole number n?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "2n + 1" },
            { id: "b", label: "2n" },
            { id: "c", label: "n + 2" },
            { id: "d", label: "4n" },
          ],
          correctOptionId: "a",
        },
        explanation: "2n is always even for any whole number n (it's 2 times something), so adding 1 always produces an odd result.",
        hints: ["Think about which parts of each expression are guaranteed to be even.", "2 times anything is always even — what happens when you add 1 to an even number?"],
      },
      {
        id: "mathematics-even-odd-challenge-003",
        title: "Three-Number Sum",
        scenario: "Three odd numbers are added together: for example, 3 + 5 + 7.",
        objective: "Determine the parity of the sum of any three odd numbers.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [
          { id: "a", label: "Always odd" },
          { id: "b", label: "Always even" },
          { id: "c", label: "Depends on the specific numbers" },
          { id: "d", label: "Cannot be determined" },
        ], correctOptionId: "a" },
        explanation: "odd + odd = even (the first two combine their leftovers into a pair), then even + odd (the third number) = odd. Three odds always sum to odd.",
        hints: ["Work it out two numbers at a time: first add the first two odds, then add the third.", "You already know odd + odd = even — what's even + odd?"],
      },
      {
        id: "mathematics-even-odd-challenge-004",
        title: "Use the Explorer: Hit the Target",
        scenario: "The explorer above is currently showing a target parity to match.",
        objective: "Use the number pickers and operation toggle to build an expression matching whatever target parity is currently shown.",
        constraints: [{ id: "c1", label: "You may use either addition or subtraction." }],
        tools: [
          { id: "pickers", label: "Two number pickers (1-20 each)" },
          { id: "toggle", label: "Operation toggle: Add / Subtract" },
        ],
        answer: { mode: "choice", options: [
          { id: "a", label: "I matched the target parity shown in the explorer" },
          { id: "b", label: "I could not find any combination that worked" },
        ], correctOptionId: "a" },
        explanation: "Every target parity is always reachable — pick two same-parity numbers and add them for an even result, or one of each parity for an odd result.",
        hints: [
          "For an even target: try two numbers with the same parity (both even, or both odd) and add them.",
          "For an odd target: try one even number and one odd number together.",
        ],
      },
      {
        id: "mathematics-even-odd-challenge-005",
        title: "Fruit Basket Pairing",
        scenario: "A market has 24 apples and 31 oranges, and wants to bag each fruit type into pairs with nothing left over.",
        objective: "Determine which fruit, if either, can be fully paired up with no leftovers.",
        requiresExperiment: false,
        answer: { mode: "choice", options: [
          { id: "a", label: "Only the apples — 24 is even, but 31 is odd" },
          { id: "b", label: "Only the oranges" },
          { id: "c", label: "Both fruits can be paired evenly" },
          { id: "d", label: "Neither fruit can be paired evenly" },
        ], correctOptionId: "a" },
        explanation: "24 ends in 4, an even digit, so all 24 apples pair up. 31 ends in 1, an odd digit, so one orange is left unpaired.",
        hints: ["Check the last digit of each count separately.", "Even counts pair up completely; odd counts always leave exactly one over."],
      },
    ],
  },

  relatedTopics: [],
};
