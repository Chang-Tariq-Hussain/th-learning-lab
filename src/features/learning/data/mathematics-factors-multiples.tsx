import type { TopicContent } from "../types";

/**
 * Factors & Multiples, brought to the same full standard as Number
 * Line and Even & Odd Numbers. No existing simulation covered this
 * topic, so a minimal new one — Factor Finder
 * (`@/features/subjects/mathematics/factor-finder`) — was built with
 * two modes: "Find Factors" (tap every factor of a target number in
 * a 1-12 grid, revealing each pair partner) and "Find Multiples"
 * (tap every multiple of a base number in a 1-50 grid), keeping
 * factors and multiples visually and mechanically distinct as the
 * spec asked. `practice.quizId` points at the 30-question bank in
 * `@/features/quiz-engine/data/mathematics-factors-multiples-quiz.ts`.
 */

const factorPairsDiagram = (
  <svg viewBox="0 0 260 90" className="mx-auto h-20 w-full max-w-xs" role="img" aria-labelledby="factor-pairs-diagram-title">
    <title id="factor-pairs-diagram-title">
      A 3 by 4 grid of dots showing that 3 times 4 equals 12, so 3 and 4 are a factor pair of 12.
    </title>
    {Array.from({ length: 3 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => (
        <circle key={`${r}-${c}`} cx={40 + c * 30} cy={20 + r * 25} r="7" className="fill-subject-math" />
      )),
    )}
    <text x="130" y="85" textAnchor="middle" className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">
      3 rows × 4 columns = 12 → 3 and 4 are a factor pair of 12
    </text>
  </svg>
);

export const mathematicsFactorsMultiplesContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "factors-multiples",
  title: "Factors & Multiples",
  subjectLabel: "Mathematics",
  topicLabel: "Number Sense",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/factor-finder",

  // -------------------------------------------------------------
  // LEARN — what am I learning?
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Find all the factors of a whole number and pair them up.",
      "Generate multiples of a whole number and recognize whether a given number is one.",
      "Distinguish prime numbers (exactly two factors) from composite numbers (more than two).",
      "Find the common factors and common multiples shared by two numbers.",
    ],
    concepts: [
      {
        term: "Factor",
        explanation: "A whole number that divides another number evenly, with no remainder.",
        formula: "12 ÷ 3 = 4",
        formulaCaption: "3 is a factor of 12",
      },
      {
        term: "Multiple",
        explanation: "The result of multiplying a whole number by another whole number — there are always infinitely many.",
        formula: "6 × 4 = 24",
        formulaCaption: "24 is a multiple of 6",
      },
      {
        term: "Factor pair",
        explanation: "Two factors that multiply together to give the original number, like 3 and 4 for 12.",
      },
      {
        term: "Prime vs. composite",
        explanation:
          "A prime number has exactly two factors, 1 and itself. A composite number has more than two factors. (1 itself is neither, since it has only one factor.)",
      },
      {
        term: "Common factors & common multiples",
        explanation:
          "A common factor divides two numbers evenly; the greatest one is the GCF. A common multiple appears in both numbers' multiple lists; the smallest one is the LCM.",
      },
    ],
    whyItMatters:
      "Factors and multiples explain why some quantities split evenly and others don't — from dividing a class into equal teams to figuring out when two repeating events (like buses on different schedules) will next line up. The GCF and LCM ideas here are also the exact tools used later for simplifying fractions and finding common denominators.",
    keyTerms: [
      { term: "Factor", definition: "A number that divides another number with no remainder." },
      { term: "Multiple", definition: "The product of a number and any whole number." },
      { term: "Prime number", definition: "A number with exactly two factors: 1 and itself." },
      { term: "Composite number", definition: "A number with more than two factors." },
      { term: "GCF", definition: "Greatest common factor — the largest number that divides two given numbers evenly." },
      { term: "LCM", definition: "Least common multiple — the smallest number that both given numbers divide into evenly." },
    ],
    visualAids: [
      {
        id: "factor-pairs-diagram",
        caption: "A rectangular array makes a factor pair visible: rows × columns = the total, so both the row count and column count are factors.",
        visual: factorPairsDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-factor-multiple-confusion",
        misconception: "Factors and multiples are the same thing.",
        correction:
          "They run in opposite directions. Factors of 12 (like 3) divide evenly into 12. Multiples of 12 (like 24, 36...) are what you get multiplying 12 up — a much longer, endless list, unlike the limited list of factors.",
      },
      {
        id: "misconception-only-one-factor-pair",
        misconception: "Once you find one factor pair for a number, you've found them all.",
        correction:
          "Most numbers have several factor pairs — 24 has 1×24, 2×12, 3×8, and 4×6. It's worth systematically checking every candidate up to the square root of the number before concluding you've found them all.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT — what should I predict?
  // -------------------------------------------------------------
  predict: {
    intro:
      "Before you tap through the grid, commit to a prediction for each scenario below — then check it in Factor Finder.",
    scenarios: [
      {
        id: "mathematics-factors-multiples-predict-001",
        scenario: "You're about to list every factor of 24 that's 12 or smaller.",
        question: "How many factors of 24 will you find in that range?",
        options: [
          { id: "6", label: "6 (1, 2, 3, 4, 6, 12)" },
          { id: "4", label: "4" },
          { id: "8", label: "8" },
          { id: "3", label: "3" },
        ],
        actualResultOptionId: "6",
        explanation: "24's factors are 1, 2, 3, 4, 6, 8, 12, 24 — the ones at or below 12 are 1, 2, 3, 4, 6, and 12, six in total.",
        hint: "Try dividing 24 by 1, 2, 3, 4... and see which give whole-number results.",
      },
      {
        id: "mathematics-factors-multiples-predict-002",
        scenario: "You're about to build the list of multiples of 7, starting from 7 itself.",
        question: "Will this list of multiples ever end?",
        options: [
          { id: "no", label: "No, it goes on forever" },
          { id: "yes-10", label: "Yes, it stops after 10 multiples" },
          { id: "yes-7", label: "Yes, it stops at 49" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "no",
        explanation: "You can always multiply 7 by the next whole number, so the list of multiples never ends — unlike the list of factors, which is always limited.",
        hint: "Compare this to factors — do factor lists behave the same way?",
      },
      {
        id: "mathematics-factors-multiples-predict-003",
        scenario: "You compare the number of factors that 17 (a prime number) has versus 18 (a composite number).",
        question: "Which number has more factors?",
        options: [
          { id: "18", label: "18" },
          { id: "17", label: "17" },
          { id: "same", label: "They have the same number of factors" },
          { id: "unknown", label: "Cannot be determined" },
        ],
        actualResultOptionId: "18",
        explanation: "17 is prime, so it only has 2 factors (1 and 17). 18 is composite, with 6 factors (1, 2, 3, 6, 9, 18).",
        hint: "Prime numbers always have exactly 2 factors — how does that compare to a composite number?",
      },
      {
        id: "mathematics-factors-multiples-predict-004",
        scenario: "You're finding the greatest common factor (GCF) of 8 and 12.",
        question: "What do you predict the GCF will be?",
        options: [
          { id: "4", label: "4" },
          { id: "2", label: "2" },
          { id: "8", label: "8" },
          { id: "24", label: "24" },
        ],
        actualResultOptionId: "4",
        explanation: "Factors of 8: 1,2,4,8. Factors of 12: 1,2,3,4,6,12. The largest number appearing in both lists is 4.",
        hint: "List out both numbers' factors and look for the biggest one they share.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE — what should I investigate?
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Switch between 'Find Factors' and 'Find Multiples' using the mode toggle.",
      "In Factors mode, tap the numbers you think divide the target evenly — a correct tap reveals its pair partner.",
      "In Multiples mode, tap every number in the grid that's a multiple of the base number shown.",
      "Watch the progress counter — the round completes and a new target appears once every findable factor or multiple is located.",
    ],
    tryThis: [
      "In Factors mode, before tapping anything, try to predict how many factors the target will have — then check by tapping through the grid.",
      "Find a factor pair for the current target, then check: does multiplying the pair back together give you the target?",
      "In Multiples mode, tap through the grid and notice the pattern the correct cells make — what do you notice about the spacing?",
      "Pick two numbers you've explored in Factors mode and find their common factors by comparing what you found for each.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN — why did this happen?
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-factors-multiples-explain-001",
        question: "Why does every number have a limited list of factors, but an endless list of multiples?",
        answer:
          "A factor of n can never be bigger than n itself, which caps how many candidates there are to check. Multiples, on the other hand, are built by multiplying n by 1, 2, 3, and so on — a process that never has to stop, so the list of multiples keeps growing forever.",
      },
      {
        id: "mathematics-factors-multiples-explain-002",
        question: "Why is 2 the only even prime number?",
        answer:
          "Every even number besides 2 is divisible by 2 and by something else besides 1 and itself, which makes it composite by definition. 2 is the sole exception because dividing it by 2 gives exactly itself back, leaving only the two required factors: 1 and 2.",
      },
      {
        id: "mathematics-factors-multiples-explain-003",
        question: "Why can you stop checking for factor pairs once you pass the square root of the number?",
        answer:
          "Factor pairs always have one factor ≤ the square root and one ≥ it (they're mirror images around the square root). Checking past the square root just re-finds pairs you already discovered, in reverse order, so nothing new turns up.",
      },
      {
        id: "mathematics-factors-multiples-explain-004",
        question: "Why does finding the LCM of two numbers help figure out when two repeating events line up again?",
        answer:
          "If one event repeats every 6 units and another every 8, the moments each one lands on are exactly its multiples. The first time both land together again is the smallest number appearing in both multiple lists — which is precisely the definition of the LCM.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-factors-multiples",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice — some are reasoning puzzles, others ask you to use Factor Finder above to check your work. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-factors-multiples-challenge-001",
        title: "Even Teams",
        scenario: "A coach has 30 players and wants to split them into equal-size teams with none left over, using the largest team size possible that still leaves more than one team.",
        objective: "Find the largest valid team size (other than 30 players on one team).",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 15, tolerance: 0 },
        explanation: "The factors of 30 are 1, 2, 3, 5, 6, 10, 15, 30. The largest one that still leaves more than one team is 15 (making 2 teams).",
        hints: [
          "List every factor of 30 — each one is a valid team size.",
          "You need a team size that divides 30 evenly, excluding 30 itself.",
        ],
      },
      {
        id: "mathematics-factors-multiples-challenge-002",
        title: "Flashing Lights",
        scenario: "Two lights blink every 4 seconds and every 6 seconds respectively, both starting together.",
        objective: "Find how many seconds until they next flash at exactly the same moment.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "seconds", target: 12, tolerance: 0 },
        explanation: "Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... The first shared value — the LCM of 4 and 6 — is 12.",
        hints: [
          "List the multiples of each number and look for the first one they share.",
          "This is exactly what the least common multiple (LCM) measures.",
        ],
      },
      {
        id: "mathematics-factors-multiples-challenge-003",
        title: "Prime or Composite?",
        scenario: "A student needs to classify 29, 33, and 41.",
        objective: "Which of these three numbers is prime?",
        requiresExperiment: false,
        answer: { mode: "choice", options: [
          { id: "a", label: "29 and 41 are both prime; 33 is composite" },
          { id: "b", label: "All three are prime" },
          { id: "c", label: "All three are composite" },
          { id: "d", label: "Only 33 is prime" },
        ], correctOptionId: "a" },
        explanation: "33 = 3 × 11, so it's composite. Neither 29 nor 41 has any factor besides 1 and itself, so both are prime.",
        hints: [
          "Try dividing each number by small primes: 2, 3, 5, 7...",
          "33 divides evenly by 3 — what does that tell you?",
        ],
      },
      {
        id: "mathematics-factors-multiples-challenge-004",
        title: "Use Factor Finder: Complete a Round",
        scenario: "Factor Finder is currently showing a target number in Factors mode.",
        objective: "Tap every findable factor of the current target number to complete the round.",
        constraints: [{ id: "c1", label: "You must find every factor from 1 through 12 that divides the target evenly." }],
        tools: [{ id: "grid", label: "1-12 tappable factor grid" }],
        answer: { mode: "choice", options: [
          { id: "a", label: "I found every factor and completed the round" },
          { id: "b", label: "I could not find all the factors" },
        ], correctOptionId: "a" },
        explanation: "Systematically testing each candidate from 1 to 12 against the target — dividing and checking for a whole-number result — will find every findable factor.",
        hints: [
          "Test each candidate from 1 to 12 in order, dividing the target by it.",
          "Every factor comes with a pair partner — once you find one, you can often guess others nearby.",
        ],
      },
      {
        id: "mathematics-factors-multiples-challenge-005",
        title: "Shared Ground",
        scenario: "You're comparing the numbers 18 and 24.",
        objective: "Find their greatest common factor (GCF).",
        requiresExperiment: false,
        answer: { mode: "numeric", target: 6, tolerance: 0 },
        explanation: "Factors of 18: 1,2,3,6,9,18. Factors of 24: 1,2,3,4,6,8,12,24. The largest number in both lists is 6.",
        hints: [
          "List the factors of each number separately.",
          "Look for the largest number that appears in both lists.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
