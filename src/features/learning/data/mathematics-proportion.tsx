import type { TopicContent } from "../types";

/**
 * Proportion, Mathematics Batch 2 topic 3 of 7. Reuses the existing
 * Proportion Builder simulation
 * (`@/features/subjects/mathematics/proportion-builder`) — a fixed
 * ratio and a slider-driven second ratio the student matches.
 * `learn`/`explore` content is adapted from the simulation page's
 * `SimulationLearnMore` block, with proportional tables and graphs
 * folded into Learn/Explain per the brief (the graph line always
 * passing through the origin is the key idea that distinguishes a
 * proportion from an ordinary linear relationship). `practice.quizId`
 * points at the 30-question bank in
 * `@/features/quiz-engine/data/mathematics-proportion-quiz.ts`.
 */
const proportionTableDiagram = (
  <svg viewBox="0 0 220 100" className="mx-auto h-28 w-full max-w-xs" role="img" aria-labelledby="proportion-table-diagram-title">
    <title id="proportion-table-diagram-title">
      A small table with Notebooks 1, 2, 3 in the top row and Cost $3, $6, $9 in the bottom row, showing a constant rate of $3 per notebook.
    </title>
    <line x1="10" y1="45" x2="210" y2="45" className="stroke-ink/20 dark:stroke-bone/20" strokeWidth="1" />
    {["1", "2", "3"].map((n, i) => (
      <text key={`n-${i}`} x={60 + i * 55} y="30" textAnchor="middle" className="fill-ink font-mono text-[11px] dark:fill-bone">
        {n}
      </text>
    ))}
    {["$3", "$6", "$9"].map((c, i) => (
      <text key={`c-${i}`} x={60 + i * 55} y="68" textAnchor="middle" className="fill-subject-math font-mono text-[11px] font-medium">
        {c}
      </text>
    ))}
    <text x="15" y="30" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">Books</text>
    <text x="15" y="68" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">Cost</text>
    <text x="110" y="92" textAnchor="middle" className="fill-ink font-mono text-[10px] dark:fill-bone">
      Rate stays constant: $3 per notebook
    </text>
  </svg>
);

export const mathematicsProportionContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "proportion-builder",
  title: "Proportion",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/proportion-builder",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Define a proportion as two equal ratios.",
      "Solve for a missing value in a proportion using the scale factor between ratios.",
      "Read and complete a proportional table.",
      "Recognize a proportional relationship on a graph — a straight line through the origin.",
    ],
    concepts: [
      {
        term: "Proportion",
        explanation:
          "A statement that two ratios are equal to each other. Writing a:b = c:d says the comparison between a and b is the same as the comparison between c and d.",
        formula: "a : b = c : d",
        formulaCaption: "A proportion — two equal ratios",
      },
      {
        term: "Scale factor",
        explanation:
          "The number you multiply one ratio by to get the other. If 2:3 scales up to 6:9, the scale factor is 3 — every number in the first ratio got multiplied by 3.",
      },
      {
        term: "Proportional tables",
        explanation:
          "A table where every pair of values shares the same constant rate is a proportional table — dividing any \"output\" by its matching \"input\" always gives the same number.",
      },
      {
        term: "Graphing a proportion",
        explanation:
          "A proportional relationship always graphs as a straight line through the origin (0, 0) — because when one quantity is zero, the other must be zero too. A straight line that doesn't pass through the origin is linear, but not proportional.",
      },
    ],
    whyItMatters:
      "Proportions are the tool behind scaling anything up or down while keeping it in the same relative shape — resizing a photo, converting a recipe from 4 servings to 10, or figuring out how much paint you need for a wall twice as big as a test patch. Once you can set up and solve a proportion, you can scale almost any two related quantities.",
    keyTerms: [
      { term: "Proportion", definition: "An equation stating that two ratios are equal." },
      { term: "Scale factor", definition: "The multiplier that turns one ratio into an equivalent one." },
      { term: "Proportional table", definition: "A table of paired values that all share the same constant rate." },
    ],
    visualAids: [
      {
        id: "proportion-table-diagram",
        caption: "In a proportional table, dividing cost by notebooks always gives the same rate — $3 per notebook, every time.",
        visual: proportionTableDiagram,
      },
    ],
    misconceptions: [
      {
        id: "misconception-subtracting-instead-of-scaling",
        misconception: "To find a missing value in a proportion, subtract the known numbers from each other.",
        correction:
          "Proportions are solved by finding the scale factor (what one ratio was multiplied by to get the other) and applying it — subtraction breaks the equal-ratio relationship the proportion depends on.",
      },
      {
        id: "misconception-linear-vs-proportional",
        misconception: "Any straight-line graph shows a proportional relationship.",
        correction:
          "Every proportional relationship is a straight line, but not every straight line is proportional — only lines that pass through the origin (0, 0) represent a true proportion. A line like y = x + 2 is straight but not proportional.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict each answer first, then check it against the Proportion Builder below.",
    scenarios: [
      {
        id: "mathematics-proportion-predict-001",
        scenario: "You have the proportion 2 notebooks : $4, and you want to find the cost of 4 notebooks at the same rate.",
        question: "What is the missing value?",
        options: [
          { id: "8", label: "$8" },
          { id: "6", label: "$6" },
          { id: "4", label: "$4" },
          { id: "16", label: "$16" },
        ],
        actualResultOptionId: "8",
        explanation: "4 notebooks is double 2 notebooks, so the cost doubles too: $4 × 2 = $8.",
        hint: "What's the scale factor from 2 notebooks to 4 notebooks?",
      },
      {
        id: "mathematics-proportion-predict-002",
        scenario: "3 cups of rice serve 6 people. You want to serve 12 people at the same rate.",
        question: "How many cups of rice are needed?",
        options: [
          { id: "6", label: "6 cups" },
          { id: "9", label: "9 cups" },
          { id: "4", label: "4 cups" },
          { id: "12", label: "12 cups" },
        ],
        actualResultOptionId: "6",
        explanation: "12 people is double 6 people, so the rice needed doubles too: 3 × 2 = 6 cups.",
        hint: "Find the scale factor from 6 people to 12 people first.",
      },
      {
        id: "mathematics-proportion-predict-003",
        scenario: "You set the first ratio in the Proportion Builder to 3:4, and adjust the slider on the second ratio.",
        question: "At what value will the second ratio's bar split identically to the first?",
        options: [
          { id: "9-12", label: "When it reads 9:12" },
          { id: "9-13", label: "When it reads 9:13" },
          { id: "8-12", label: "When it reads 8:12" },
          { id: "10-12", label: "When it reads 10:12" },
        ],
        actualResultOptionId: "9-12",
        explanation: "9:12 simplifies to 3:4, the same ratio, so it's the value where both bars split identically.",
        hint: "9 is 3 times 3 — what would 4 need to be scaled by the same factor?",
      },
      {
        id: "mathematics-proportion-predict-004",
        scenario: "A proportional table shows Time: 2, 4 hours matched to Distance: 100, 200 km.",
        question: "What distance would 6 hours correspond to, keeping the same rate?",
        options: [
          { id: "300", label: "300 km" },
          { id: "250", label: "250 km" },
          { id: "150", label: "150 km" },
          { id: "600", label: "600 km" },
        ],
        actualResultOptionId: "300",
        explanation: "The rate is 100 ÷ 2 = 50 km per hour. For 6 hours: 50 × 6 = 300 km.",
        hint: "Find the constant rate first by dividing distance by time in one of the known pairs.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Look at the first ratio, which is fully filled in.",
      "Drag the slider on the second ratio, which is missing one value.",
      "Watch the bars for both ratios and find the slider position where they split identically.",
      "Check your answer using the scale factor or cross multiplication.",
    ],
    tryThis: [
      "Set the first ratio to 3:4, then find the missing value that keeps 3:4 = 9:? true.",
      "Solve the same problem two ways — using the scale factor, and using cross multiplication — and compare.",
      "Predict the missing value before dragging the slider, then check yourself.",
      "Build a small proportional table by hand from the ratio you set, and check that every pair shares the same rate.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-proportion-explain-001",
        question: "Why do both bars split at the exact same point when two ratios are in proportion?",
        answer:
          "Equal ratios represent the exact same relative comparison, so dividing a bar according to either ratio produces the same proportional split, however many total units each bar happens to have.",
      },
      {
        id: "mathematics-proportion-explain-002",
        question: "Why can you solve a proportion by finding a scale factor instead of doing anything more complicated?",
        answer:
          "A proportion states that one ratio is equal to another, which means one is always some fixed multiple of the other. Once you find that multiple (the scale factor) from the numbers you do know, applying it to the missing spot is guaranteed to keep both ratios equal.",
      },
      {
        id: "mathematics-proportion-explain-003",
        question: "Why does a proportional relationship always pass through the origin on a graph?",
        answer:
          "In a proportional relationship, one quantity is always a constant multiple of the other. When the input is 0, the output must also be 0 — for example, 0 notebooks always costs $0 — which forces the graph through the point (0, 0).",
      },
      {
        id: "mathematics-proportion-explain-004",
        question: "Why isn't every straight-line graph a proportional relationship?",
        answer:
          "A straight line just means the rate of change is constant, but a proportion additionally requires that rate to apply starting exactly from zero. A line like y = x + 2 has a constant slope but starts at 2 when x is 0, so it's linear without being proportional.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-proportion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Proportion Builder
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Proportion Builder above to build and check these proportional relationships. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-proportion-challenge-001",
        title: "Proportion Builder: Maintain the Relationship",
        scenario: "The first ratio is 4 items : 6 units. You need to increase the number of items to 8 while maintaining the same relationship.",
        objective: "Find the number of units that keeps the proportion true when items increase to 8.",
        constraints: [{ id: "c1", label: "The ratio 4:6 must stay equivalent to the new pair." }],
        tools: [{ id: "slider", label: "Slider on the second ratio" }],
        answer: { mode: "numeric", unit: "units", target: 12, tolerance: 0 },
        explanation: "8 items is double the original 4, so units must also double: 6 × 2 = 12.",
        hints: [
          "Find the scale factor from 4 items to 8 items.",
          "Apply that same scale factor to the 6 units.",
        ],
      },
      {
        id: "mathematics-proportion-challenge-002",
        title: "Solve: 3/5 = x/20",
        scenario: "You set the first ratio to 3:5 in the builder and need the second ratio's missing value where the denominator is 20.",
        objective: "Solve for the missing numerator.",
        answer: { mode: "numeric", target: 12, tolerance: 0 },
        explanation: "20 is 4 times 5, so scale the numerator by the same factor: 3 × 4 = 12.",
        hints: [
          "Find the scale factor between the two denominators, 5 and 20.",
          "Apply that scale factor to 3.",
        ],
      },
      {
        id: "mathematics-proportion-challenge-003",
        title: "Recipe Scale-Up",
        scenario: "A recipe uses 2 eggs for every 3 cups of flour. You want to use 9 cups of flour.",
        objective: "Find how many eggs are needed, keeping the same proportion.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "eggs", target: 6, tolerance: 0 },
        explanation: "9 cups is 3 times the original 3 cups, so eggs scale by the same factor: 2 × 3 = 6.",
        hints: [
          "Find the scale factor from 3 cups to 9 cups.",
          "Apply that same factor to the 2 eggs.",
        ],
      },
      {
        id: "mathematics-proportion-challenge-004",
        title: "Reading a Proportional Table",
        scenario: "A table shows Hours: 3, 6, 9 matched to Pay: $24, $48, $72.",
        objective: "Find the hourly pay rate, then use it to predict the pay for 15 hours.",
        requiresExperiment: false,
        answer: { mode: "numeric", unit: "dollars", target: 120, tolerance: 0 },
        explanation: "The rate is $24 ÷ 3 = $8 per hour. For 15 hours: $8 × 15 = $120.",
        hints: [
          "Divide any pay value by its matching hours to find the constant rate.",
          "Multiply that rate by 15 hours.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
