import type { TopicContent } from "../types";

/**
 * Ratio, the first topic of Mathematics Batch 2 (Ratio, Proportion &
 * Measurement). Reuses the existing Ratio Explorer simulation
 * (`@/features/subjects/mathematics/ratio-explorer`) as-is — it
 * already supports free exploration (add blue/red circles, watch the
 * ratio simplify live) and a built-in "match a target ratio" mode
 * (`challenges.ts`), which the Challenge section below points
 * students back to rather than duplicating. `learn`/`explore` content
 * is adapted from the simulation page's existing `SimulationLearnMore`
 * block. `practice.quizId` points at the 30+ question bank in
 * `@/features/quiz-engine/data/mathematics-ratio-quiz.ts`.
 */
const ratioBarDiagram = (
  <svg viewBox="0 0 220 90" className="mx-auto h-24 w-full max-w-xs" role="img" aria-labelledby="ratio-bar-diagram-title">
    <title id="ratio-bar-diagram-title">
      A row of 2 red circles followed by 3 blue circles, labeled ratio 2 to 3.
    </title>
    {Array.from({ length: 2 }, (_, i) => (
      <circle key={`r-${i}`} cx={20 + i * 34} cy={30} r="14" className="fill-subject-math" />
    ))}
    {Array.from({ length: 3 }, (_, i) => (
      <circle key={`b-${i}`} cx={110 + i * 34} cy={30} r="14" className="fill-subject-math/35" />
    ))}
    <text x="110" y="75" textAnchor="middle" className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">
      2 : 3
    </text>
  </svg>
);

export const mathematicsRatioContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "ratio-explorer",
  title: "Ratio",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/ratio-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a ratio compares and how to write one.",
      "Simplify a ratio to its simplest form.",
      "Recognize that different-looking ratios can represent the same comparison.",
      "Distinguish a part-to-part ratio from a part-to-whole ratio.",
    ],
    concepts: [
      {
        term: "What a ratio is",
        explanation:
          "A ratio compares two quantities, showing how much of one thing there is relative to another. A ratio of 3 to 2 means for every 3 of the first thing, there are 2 of the second.",
        formula: "a : b",
        formulaCaption: "Ratio of a to b",
      },
      {
        term: "Simplifying a ratio",
        explanation:
          "Dividing both numbers in a ratio by their greatest common factor gives the simplest form. A ratio of 6:4 simplifies to 3:2 — the comparison stays exactly the same, just with smaller numbers.",
      },
      {
        term: "Equivalent ratios",
        explanation:
          "Ratios that simplify to the same simplest form represent the same comparison, even if the actual numbers are different. 6:4, 9:6, and 3:2 are all equivalent ratios.",
      },
      {
        term: "Part-to-part vs. part-to-whole",
        explanation:
          "A part-to-part ratio compares two parts of a group to each other (3 red : 2 blue). A part-to-whole ratio compares one part to the entire group (3 red : 5 total). Both are valid ratios describing the same group, just answering different questions.",
      },
    ],
    whyItMatters:
      "Ratios are everywhere once you start looking: a recipe that serves 4 people uses ratios to scale up to 8, paint colors are mixed using ratios, and maps use a ratio to relate distance on paper to distance in real life. Once you're comfortable simplifying and comparing ratios, scaling any recipe, mixture, or map becomes a matter of simple multiplication.",
    keyTerms: [
      { term: "Ratio", definition: "A comparison of two quantities, written a : b." },
      { term: "Simplest form", definition: "A ratio written with the smallest whole numbers possible, found by dividing out the greatest common factor." },
      { term: "Equivalent ratios", definition: "Two ratios that simplify to the same simplest form." },
    ],
    visualAids: [
      {
        id: "ratio-bar-diagram",
        caption: "2 red circles and 3 blue circles show a ratio of 2 : 3 — order matters, and it's written to match how the question asks for it.",
        visual: ratioBarDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-ratio-is-a-difference",
        misconception: "A ratio of 3 : 2 means there are 3 more of the first thing than the second.",
        correction:
          "A ratio describes a repeating proportion, not a fixed gap. 3 : 2 could be 3 and 2, or 30 and 20 — the difference changes, but the ratio (and the underlying relationship) stays the same.",
      },
      {
        id: "misconception-partial-simplification",
        misconception: "To simplify a ratio, it's enough to divide just one of the two numbers.",
        correction:
          "Both numbers in a ratio must be divided by the same factor to keep the comparison the same. Dividing only one number changes what the ratio actually means.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before you open the Ratio Explorer below, commit to a prediction for each scenario — then test it.",
    scenarios: [
      {
        id: "mathematics-ratio-predict-001",
        scenario: "You have 2 red circles and 4 blue circles.",
        question: "What is the simplified ratio of red to blue?",
        options: [
          { id: "1-2", label: "1 : 2" },
          { id: "2-4", label: "2 : 4" },
          { id: "1-4", label: "1 : 4" },
          { id: "4-1", label: "4 : 1" },
        ],
        actualResultOptionId: "1-2",
        explanation: "2 : 4 shares a common factor of 2 with both numbers, simplifying to 1 : 2.",
        hint: "What's the greatest common factor of 2 and 4?",
      },
      {
        id: "mathematics-ratio-predict-002",
        scenario: "You build a ratio of 2 red to 3 blue circles, then double both counts to 4 red and 6 blue.",
        question: "Does the ratio change?",
        options: [
          { id: "no", label: "No — 4 : 6 still represents the same relationship as 2 : 3" },
          { id: "yes-bigger", label: "Yes — the ratio becomes bigger" },
          { id: "yes-smaller", label: "Yes — the ratio becomes smaller" },
          { id: "cant-tell", label: "Can't tell without more information" },
        ],
        actualResultOptionId: "no",
        explanation: "Doubling both parts of a ratio produces an equivalent ratio — 4 : 6 simplifies back down to 2 : 3.",
        hint: "Does multiplying both numbers by the same factor ever change what a ratio simplifies to?",
      },
      {
        id: "mathematics-ratio-predict-003",
        scenario: "Two students each build a group of circles. One has 3 red and 5 blue. The other has 9 red and 15 blue.",
        question: "Which ratio represents the same relationship as the other?",
        options: [
          { id: "both-same", label: "Both — 9 : 15 simplifies to 3 : 5" },
          { id: "different", label: "They're different relationships entirely" },
          { id: "first-bigger", label: "The first group's ratio is bigger" },
          { id: "second-bigger", label: "The second group's ratio is bigger" },
        ],
        actualResultOptionId: "both-same",
        explanation: "9 and 15 share a common factor of 3. Dividing both by 3 gives 3 : 5 — the exact same ratio as the first group.",
        hint: "Try dividing both numbers in 9 : 15 by their greatest common factor.",
      },
      {
        id: "mathematics-ratio-predict-004",
        scenario: "A group has 6 red circles and 4 blue circles.",
        question: "What is the part-to-whole ratio of red circles to the total group?",
        options: [
          { id: "6-10", label: "6 : 10 (simplifies to 3 : 5)" },
          { id: "6-4", label: "6 : 4" },
          { id: "4-10", label: "4 : 10" },
          { id: "10-6", label: "10 : 6" },
        ],
        actualResultOptionId: "6-10",
        explanation: "The whole group is 6 + 4 = 10 circles, so red-to-whole is 6 : 10, which simplifies to 3 : 5.",
        hint: "Part-to-whole compares one part to the total, not to the other part.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Add blue circles and red circles and watch the ratio update as you go.",
      "Notice how the ratio simplifies automatically as you add more of each color.",
      "Try to match a target ratio by adding the right number of blue and red circles.",
      "Compare two different circle counts that end up simplifying to the same ratio.",
    ],
    tryThis: [
      "Build a ratio of 4 blue to 2 red circles. What's its simplest form?",
      "Find two different circle counts that both simplify to a 2:1 ratio.",
      "Predict how many red circles you'd need to keep a 3:1 ratio if you have 9 blue circles.",
      "Build a part-to-part ratio, then work out its part-to-whole equivalent for one color.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-ratio-explain-001",
        question: "Why do 6:4 and 3:2 represent exactly the same relationship?",
        answer:
          "Both numbers in 6:4 share a common factor of 2. Dividing both by that factor gives 3:2 — the underlying comparison between the two quantities hasn't changed, only the numbers used to express it.",
      },
      {
        id: "mathematics-ratio-explain-002",
        question: "Why does order matter in a ratio?",
        answer:
          "A ratio's order tells you which quantity is being compared first. 3:2 (red to blue) and 2:3 (blue to red) describe the same group but answer different questions — mixing up the order changes what the ratio is claiming.",
      },
      {
        id: "mathematics-ratio-explain-003",
        question: "Why does simplifying a ratio require dividing both numbers by the same factor?",
        answer:
          "A ratio compares two quantities relative to each other. Dividing only one number would change that relative comparison — dividing both by the same factor shrinks the numbers while preserving exactly how they relate.",
      },
      {
        id: "mathematics-ratio-explain-004",
        question: "How is a part-to-whole ratio different from a part-to-part ratio, even for the same group?",
        answer:
          "Part-to-part compares two categories directly to each other (red to blue), while part-to-whole compares one category to the entire group (red to everything). Both are valid, correct ratios — they're just answering different questions about the same group.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-ratio",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Ratio Builder
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Ratio Explorer above to build the exact ratios these scenarios ask for — manipulate the circles rather than just picking an answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-ratio-challenge-001",
        title: "Ratio Builder: 3 : 5",
        scenario: "The Ratio Explorer above is asking you to build a specific ratio using its blue and red circles.",
        objective: "Add circles so the ratio of red to blue reads exactly 3 : 5, using the fewest circles possible.",
        constraints: [{ id: "c1", label: "Use the smallest possible counts that give this ratio." }],
        tools: [{ id: "controls", label: "Add/remove buttons for red and blue circles" }],
        answer: { mode: "numeric", unit: "red circles", target: 3, tolerance: 0 },
        explanation: "3 red and 5 blue circles is already the simplest form of 3 : 5, so it's the smallest count that works.",
        hints: [
          "A ratio's simplest form always uses the fewest circles possible.",
          "How many red circles does 3 : 5 call for directly?",
        ],
      },
      {
        id: "mathematics-ratio-challenge-002",
        title: "Ratio Builder: Equivalent to 4 : 7",
        scenario: "You need to build a ratio that's equivalent to 4 : 7, but not using the exact numbers 4 and 7.",
        objective: "Find a different pair of counts that still simplifies to 4 : 7.",
        constraints: [{ id: "c1", label: "The counts must not be 4 and 7 themselves." }],
        answer: { mode: "numeric", unit: "red circles (for 8 : 14)", target: 8, tolerance: 0 },
        explanation: "Doubling both parts of 4 : 7 gives 8 : 14 — a different-looking ratio that simplifies back to exactly 4 : 7.",
        hints: [
          "Multiply both numbers in 4 : 7 by the same factor.",
          "Try doubling: what does 4 × 2 and 7 × 2 give you?",
        ],
      },
      {
        id: "mathematics-ratio-challenge-003",
        title: "Simplify a Built Ratio",
        scenario: "You build a group of 12 red circles and 18 blue circles in the explorer.",
        objective: "Work out the simplified ratio of red to blue.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "the '2' in 2 : 3", target: 2, tolerance: 0 },
        explanation: "The greatest common factor of 12 and 18 is 6. Dividing both by 6 gives 2 : 3.",
        hints: [
          "Find the greatest common factor of 12 and 18.",
          "Divide both numbers by that factor.",
        ],
      },
      {
        id: "mathematics-ratio-challenge-004",
        title: "Part-to-Whole from Part-to-Part",
        scenario: "A group has a part-to-part ratio of 3 red to 7 blue circles.",
        objective: "Find what fraction of the whole group is red, expressed as a number out of 10.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "out of 10", target: 3, tolerance: 0 },
        explanation: "The whole group is 3 + 7 = 10 parts, so red makes up 3 out of every 10 — a part-to-whole ratio of 3 : 10.",
        hints: [
          "Add the two parts of the ratio together to find the whole.",
          "Part-to-whole compares one part to that total.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
