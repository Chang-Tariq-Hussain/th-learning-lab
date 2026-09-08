import type { TopicContent } from "../types";

/**
 * Applications of Derivatives — Mathematics Calculus unit, final
 * topic (5 of 5). Brings the existing nine-level simulation
 * (`@/features/subjects/mathematics/applications-of-derivatives`) up
 * from the older `SimulationLearnMore` pattern to the same full
 * Learn/Predict/Explore/Explain/Practice/Challenge standard as the
 * rest of the Calculus unit. The simulation reused exactly as-is —
 * Increasing & Decreasing, Derivative Sign, Critical Points, two
 * Turning Point levels (Local Min/Max), Maximum vs Minimum (with its
 * togglable Profit note), Critical Point Finder, Sign Chart, and its
 * own mini Practice panel — no changes were needed.
 *
 * Every Learn, Predict, Explain, and Challenge item below is grounded
 * directly in the simulation's own three fixed functions from
 * `applications-model.ts` — f(x) = x² (local minimum at x = 0),
 * f(x) = -x² (local maximum at x = 0), and f(x) = x³ - 3x (local
 * maximum at x = -1, local minimum at x = 1) — never an invented
 * expression. `practice.quizId` points at a new, dedicated
 * 30-question bank
 * (`@/features/quiz-engine/data/mathematics-applications-of-derivatives-quiz.ts`),
 * since no bank previously covered this topic.
 */
export const mathematicsApplicationsOfDerivativesContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "applications-of-derivatives",
  title: "Applications of Derivatives",
  subjectLabel: "Mathematics",
  topicLabel: "Calculus",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/applications-of-derivatives",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Connect the sign of a derivative to whether a function is increasing or decreasing.",
      "Define a critical point and explain why the derivative is zero there.",
      "Identify a local maximum from a derivative sign change of positive to negative.",
      "Identify a local minimum from a derivative sign change of negative to positive.",
      "Build and read a sign chart to describe a function's whole shape at once.",
    ],
    concepts: [
      {
        term: "Increasing and decreasing",
        explanation:
          "Where a function's derivative is positive, the function is increasing — rising as x increases. Where the derivative is negative, the function is decreasing, falling as x increases.",
        formula: "f'(x) > 0 \\Rightarrow \\text{increasing}, \\quad f'(x) < 0 \\Rightarrow \\text{decreasing}",
        formulaCaption: "Derivative sign and direction",
      },
      {
        term: "Critical points",
        explanation:
          "A point where the derivative equals zero. These are the only candidates for where a function might switch from increasing to decreasing, or vice versa — for f(x) = x² - 3x, setting f'(x) = 3x² - 3 = 0 gives the critical points x = -1 and x = 1.",
        formula: "f'(x) = 0",
        formulaCaption: "Where a critical point can occur",
      },
      {
        term: "Local maximum",
        explanation:
          "Occurs where the derivative changes from positive to negative — the function stops rising and starts falling. f(x) = -x² has a local maximum at x = 0: increasing for x < 0, decreasing for x > 0.",
      },
      {
        term: "Local minimum",
        explanation:
          "Occurs where the derivative changes from negative to positive — the function stops falling and starts rising. f(x) = x² has a local minimum at x = 0: decreasing for x < 0, increasing for x > 0.",
      },
      {
        term: "Sign chart",
        explanation:
          "A diagram marking every critical point along a number line and labeling the derivative's sign in each interval between them — a fast way to see a function's entire increasing/decreasing pattern, and every local extremum, at a glance.",
      },
    ],
    whyItMatters:
      "This is exactly how derivatives get used outside the classroom — a business finds the price that maximizes profit, an engineer finds the dimensions that minimize material cost, and a physicist finds when a projectile reaches its highest point, all by locating where a derivative changes sign. The sign chart is the same tool professionals use to solve real optimization problems.",
    keyTerms: [
      { term: "Increasing", definition: "f'(x) > 0 — the function's value rises as x increases." },
      { term: "Decreasing", definition: "f'(x) < 0 — the function's value falls as x increases." },
      { term: "Critical point", definition: "A point where f'(x) = 0 — a candidate for a local maximum or minimum." },
      { term: "Local maximum", definition: "A critical point where f'(x) changes from positive to negative." },
      { term: "Local minimum", definition: "A critical point where f'(x) changes from negative to positive." },
    ],
    misconceptions: [
      {
        id: "misconception-critical-point-always-extremum",
        misconception: "Every critical point is automatically a local maximum or minimum.",
        correction:
          "A critical point is only a candidate. The derivative has to actually change sign across it for it to be a maximum or minimum — if the sign stays the same on both sides, the point is neither, just a momentary flattening of the slope.",
      },
      {
        id: "misconception-positive-derivative-means-positive-graph",
        misconception: "A positive derivative means the function's value itself is positive.",
        correction:
          "The derivative's sign describes direction, not height. f(x) = -x² is increasing (f'(x) > 0) for x < 0 even though every one of its values is negative or zero — increasing just means it's rising toward zero from below.",
      },
      {
        id: "misconception-max-min-swap",
        misconception: "A sign change from negative to positive marks a local maximum, since the function is coming out of a dip.",
        correction:
          "Negative-to-positive is a local minimum — the function was falling, bottoms out, then starts rising. It's positive-to-negative (rising, peaking, then falling) that marks a local maximum.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict what the derivative's sign or a critical point tells you, then check yourself using the simulation below.",
    scenarios: [
      {
        id: "mathematics-applications-of-derivatives-predict-001",
        scenario: "You're told that for some function, f'(x) > 0 for every x between 2 and 5.",
        question: "What is the function doing on that interval?",
        options: [
          { id: "increasing", label: "Increasing" },
          { id: "decreasing", label: "Decreasing" },
          { id: "flat", label: "Staying perfectly flat" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "increasing",
        explanation: "A positive derivative across an entire interval means the function is rising throughout that interval — it's increasing.",
        hint: "Recall what the sign of f'(x) tells you about direction.",
      },
      {
        id: "mathematics-applications-of-derivatives-predict-002",
        scenario: "In Level 1 (Increasing & Decreasing), you'll see f(x) = x² graphed alongside its derivative.",
        question: "Where do you think the function is increasing?",
        options: [
          { id: "x-positive", label: "For x > 0" },
          { id: "x-negative", label: "For x < 0" },
          { id: "everywhere", label: "Everywhere" },
          { id: "nowhere", label: "Nowhere" },
        ],
        actualResultOptionId: "x-positive",
        explanation: "f(x) = x² falls for x < 0 and rises for x > 0 — it's increasing exactly where f'(x) = 2x is positive, which is x > 0.",
        hint: "f'(x) = 2x. Where is that expression positive?",
      },
      {
        id: "mathematics-applications-of-derivatives-predict-003",
        scenario: "In Level 4/5 (Turning Points), you'll compare f(x) = x² and f(x) = -x², both with a critical point at x = 0.",
        question: "Where do you think the maximum occurs?",
        options: [
          { id: "negx2-zero", label: "At x = 0, on f(x) = -x²" },
          { id: "x2-zero", label: "At x = 0, on f(x) = x²" },
          { id: "both", label: "At x = 0, on both functions" },
          { id: "neither", label: "Neither function has a maximum" },
        ],
        actualResultOptionId: "negx2-zero",
        explanation: "f(x) = -x² increases then decreases through x = 0, giving a local maximum there. f(x) = x² does the opposite — decreasing then increasing — giving a local minimum instead.",
        hint: "A maximum needs the derivative to go from positive to negative.",
      },
      {
        id: "mathematics-applications-of-derivatives-predict-004",
        scenario: "In Level 7 (Critical Point Finder), you'll work with f(x) = x³ - 3x, whose derivative is f'(x) = 3x² - 3.",
        question: "How many critical points does this function have?",
        options: [
          { id: "two", label: "Two — at x = -1 and x = 1" },
          { id: "one", label: "One — at x = 0" },
          { id: "three", label: "Three" },
          { id: "zero", label: "None" },
        ],
        actualResultOptionId: "two",
        explanation: "Setting 3x² - 3 = 0 gives x² = 1, so x = -1 and x = 1 — two critical points, one a local maximum and one a local minimum.",
        hint: "Set f'(x) = 3x² - 3 equal to zero and solve for x.",
      },
      {
        id: "mathematics-applications-of-derivatives-predict-005",
        scenario: "For f(x) = x³ - 3x, the derivative is negative between x = -1 and x = 1, and positive outside that interval.",
        question: "What kind of critical point is at x = -1?",
        options: [
          { id: "max", label: "Local maximum" },
          { id: "min", label: "Local minimum" },
          { id: "neither", label: "Neither" },
          { id: "cant-tell", label: "Cannot be determined" },
        ],
        actualResultOptionId: "max",
        explanation: "Just before x = -1 the derivative is positive (increasing), and just after it's negative (decreasing) — positive to negative marks a local maximum.",
        hint: "Check the derivative's sign just to the left and just to the right of x = -1.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Work through the eight levels in order: Increasing & Decreasing, Derivative Sign, Critical Points, Local Minimum, Local Maximum, Maximum vs Minimum, Critical Point Finder, and Sign Chart.",
      "At each level, watch how the graph's shape and the derivative's sign move together as x changes.",
      "In Critical Point Finder, step through solving f(x) = x³ - 3x for its critical points one step at a time.",
      "In the Sign Chart level, read each interval's sign and match it to the corresponding rise or fall on the graph.",
      "Use the Practice level at the end to check your understanding before moving to Predict, Explain, and Challenge below.",
    ],
    tryThis: [
      "Before revealing a critical point's classification, predict from the graph's shape whether it's a maximum or minimum.",
      "In Maximum vs Minimum, open the Profit example and describe in your own words what a local maximum represents there.",
      "In Sign Chart, cover the graph and try to sketch the function's shape using only the +/- intervals.",
      "Compare the sign charts of f(x) = x² and f(x) = -x² — what's the same, and what's flipped?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-applications-of-derivatives-explain-001",
        question: "Why does a positive derivative mean a function is increasing?",
        answer:
          "The derivative measures the instantaneous slope of the graph. A positive slope means the graph is tilted upward at that point, so as x moves forward, the function's value rises — that's exactly what \"increasing\" means.",
      },
      {
        id: "mathematics-applications-of-derivatives-explain-002",
        question: "Why is a critical point only a candidate for a maximum or minimum, not a guarantee?",
        answer:
          "Setting the derivative to zero only finds where the slope momentarily flattens. Whether that flattening is a peak, a valley, or neither depends on what the derivative does on either side — the sign has to actually change for it to be a true local extremum.",
      },
      {
        id: "mathematics-applications-of-derivatives-explain-003",
        question: "Why does a local maximum correspond to the derivative changing from positive to negative?",
        answer:
          "Positive to negative means the function was rising, momentarily flattens, then starts falling — that flattening point is the highest value in its immediate neighborhood, which is exactly what \"local maximum\" describes.",
      },
      {
        id: "mathematics-applications-of-derivatives-explain-004",
        question: "Why is a sign chart useful even before you've drawn the graph?",
        answer:
          "A sign chart only needs the critical points and the derivative's sign in each interval between them — both of which come from algebra alone. From that chart you can already predict the whole shape of the graph, including every local maximum and minimum, before plotting a single point.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-applications-of-derivatives",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Use the Applications of Derivatives simulation above — jump to the level named in each challenge — then answer below.",
    scenarios: [
      {
        id: "mathematics-applications-of-derivatives-challenge-001",
        title: "Reading the Sign Chart: f(x) = x² ",
        scenario: "In Level 1 (Increasing & Decreasing), look at f(x) = x² and its derivative f'(x) = 2x.",
        objective: "For which values of x is the function decreasing?",
        tools: [{ id: "graph", label: "Colored graph and derivative sign panel" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "x < 0" },
            { id: "wrong-positive", label: "x > 0" },
            { id: "wrong-all", label: "All real x" },
            { id: "wrong-none", label: "Nowhere — it's always increasing" },
          ],
          correctOptionId: "correct",
        },
        explanation: "f'(x) = 2x is negative for x < 0, so the function is decreasing there, then increasing for x > 0.",
        hints: ["Find where f'(x) = 2x is negative."],
      },
      {
        id: "mathematics-applications-of-derivatives-challenge-002",
        title: "Classify the Turning Point: f(x) = -x²",
        scenario: "In Level 5 (Local Maximum), look at f(x) = -x² and its critical point at x = 0.",
        objective: "What kind of critical point is x = 0?",
        tools: [{ id: "turning-point", label: "Turning Point panel with derivative sign either side of x = 0" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Local maximum" },
            { id: "wrong-min", label: "Local minimum" },
            { id: "wrong-neither", label: "Neither — the derivative never changes sign" },
            { id: "wrong-both", label: "Both a maximum and a minimum" },
          ],
          correctOptionId: "correct",
        },
        explanation: "f'(x) = -2x is positive for x < 0 and negative for x > 0 — positive to negative marks a local maximum.",
        hints: ["Check the sign of f'(x) = -2x just before and just after x = 0."],
      },
      {
        id: "mathematics-applications-of-derivatives-challenge-003",
        title: "Critical Point Finder: f(x) = x³ - 3x",
        scenario: "In Level 7 (Critical Point Finder), step through solving f'(x) = 3x² - 3 = 0.",
        objective: "What are both critical points, and which is the maximum?",
        tools: [{ id: "step-workspace", label: "Step-by-step critical point solver" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "x = -1 (maximum) and x = 1 (minimum)" },
            { id: "wrong-swapped", label: "x = -1 (minimum) and x = 1 (maximum)" },
            { id: "wrong-one", label: "Only x = 0" },
            { id: "wrong-both-same", label: "x = -1 and x = 1, both maxima" },
          ],
          correctOptionId: "correct",
        },
        explanation: "Solving 3x² - 3 = 0 gives x = -1 and x = 1. The derivative goes from positive to negative at x = -1 (maximum) and from negative to positive at x = 1 (minimum).",
        hints: [
          "Solve 3x² - 3 = 0 for x.",
          "Check the derivative's sign in each of the three intervals the two critical points create.",
        ],
      },
      {
        id: "mathematics-applications-of-derivatives-challenge-004",
        title: "Sign Chart to Shape",
        scenario: "In Level 8 (Sign Chart), read the three-interval sign chart for f(x) = x³ - 3x.",
        objective: "Describe the function's shape from left to right using only the sign chart.",
        requiresExperiment: true,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Increasing, then decreasing, then increasing again" },
            { id: "wrong-1", label: "Decreasing, then increasing, then decreasing again" },
            { id: "wrong-2", label: "Increasing the whole time" },
            { id: "wrong-3", label: "Decreasing the whole time" },
          ],
          correctOptionId: "correct",
        },
        explanation: "The sign chart reads +, -, + from left to right (x < -1 positive, -1 < x < 1 negative, x > 1 positive) — increasing, then decreasing through the dip between the critical points, then increasing again.",
        hints: ["Read the sign of each of the three intervals in order, left to right."],
      },
      {
        id: "mathematics-applications-of-derivatives-challenge-005",
        title: "Neither Maximum Nor Minimum",
        scenario: "For f(x) = x³ - 3x, consider the point x = 0.3, which sits inside the interval -1 < x < 1 where the derivative stays negative throughout.",
        objective: "Is x = 0.3 a local maximum, a local minimum, or neither?",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "Neither — the derivative doesn't change sign there" },
            { id: "wrong-max", label: "Local maximum" },
            { id: "wrong-min", label: "Local minimum" },
          ],
          correctOptionId: "correct",
        },
        explanation: "f'(0.3) isn't zero — it's just negative, like the rest of the interval between the two critical points. The curve is simply decreasing through this point, not turning, so x = 0.3 is neither a maximum nor a minimum.",
        hints: ["A maximum or minimum requires the derivative to actually equal zero and change sign there — check whether that's true at x = 0.3."],
      },
      {
        id: "mathematics-applications-of-derivatives-challenge-006",
        title: "The Profit Connection",
        scenario: "In Level 6 (Maximum vs Minimum), open the Profit example, which relabels f(x) = -x² as a profit curve where x is the number of products sold.",
        objective: "At the local maximum, what does the derivative's value tell you about profit at that exact point?",
        tools: [{ id: "profit-toggle", label: "Real-World Example toggle" }],
        answer: {
          mode: "choice",
          options: [
            { id: "correct", label: "The derivative is zero — profit is momentarily neither rising nor falling" },
            { id: "wrong-max-value", label: "The derivative equals the maximum profit value itself" },
            { id: "wrong-still-rising", label: "The derivative is still positive — profit keeps rising" },
            { id: "wrong-undefined", label: "The derivative is undefined at that point" },
          ],
          correctOptionId: "correct",
        },
        explanation: "At any local maximum the derivative is exactly zero — profit has finished rising and is about to start falling, so at that instant its rate of change is momentarily flat.",
        hints: ["This is the same critical-point idea as every other level — what is f'(x) always equal to at a turning point?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "chain-rule-explorer",
      label: "Chain Rule Explorer",
      href: "/dashboard/mathematics/chain-rule-explorer",
      reason: "Revisit differentiating composite functions, one tool this topic's functions build on.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "derivative-rules",
      label: "Derivative Rules",
      href: "/dashboard/mathematics/derivative-rules",
      reason: "Review the Power Rule used to differentiate every function in this topic.",
    },
  ],
};
