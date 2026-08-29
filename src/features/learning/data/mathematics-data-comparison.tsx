import type { TopicContent } from "../types";

/**
 * Data Interpretation & Comparison, Mathematics Batch 4 topic 6 of 6
 * (Statistics & Data) — the application-focused capstone of the
 * batch. New simulation
 * (`@/features/subjects/mathematics/data-comparison`, "Data
 * Comparison Lab"): three editable dataset pairs (two classes' test
 * scores, two cities' rainfall, two players' points per game) shown
 * side by side with every statistic — mean, median, range, min, max
 * — computed for both at once, plus a shared-scale bar chart, so
 * differences in center *and* spread are visible together rather
 * than calculated in isolation.
 *
 * Reuses `mean`/`median`/`range` from Central Tendency directly
 * (`data-comparison-model.ts`), matching the precedent Measures of
 * Dispersion already set, rather than reimplementing them.
 *
 * The point of this topic is answering "what does the data tell us"
 * rather than "what calculation can we perform" — every section is
 * built around comparing two datasets and drawing a conclusion, not
 * computing a single statistic in isolation.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-data-comparison-quiz.ts`).
 */
export const mathematicsDataComparisonContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "data-comparison",
  title: "Data Interpretation & Comparison",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/data-comparison",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Compare two datasets using mean, median, and range together, not just one statistic at a time.",
      "Explain what it means for one dataset to be more \"consistent\" than another.",
      "Read a bar chart or table to draw a conclusion, not just to state a number.",
      "Recognize when two datasets can share a mean while telling very different stories.",
    ],
    concepts: [
      {
        term: "Comparing datasets",
        explanation:
          "Comparing two datasets means looking at more than one statistic side by side — center (mean, median) and spread (range) together — rather than picking a single number and stopping there.",
      },
      {
        term: "Consistency",
        explanation:
          "A dataset is more \"consistent\" when its values stay close together, shown by a smaller range. Two players can average the same points per game, but the one with a smaller range is the more reliable, predictable scorer.",
      },
      {
        term: "From calculation to conclusion",
        explanation:
          "Calculating a mean or a range is only the first step. Interpretation means turning that number into a sentence about what it actually tells you — \"Class B's scores are far more spread out than Class A's, even though they average the same.\"",
      },
      {
        term: "Same mean, different story",
        explanation:
          "Two datasets can share an identical mean while looking nothing alike — one tightly clustered, one wildly spread with a high and a low. Comparing means alone can hide that difference completely; range or standard deviation reveals it.",
      },
    ],
    whyItMatters:
      "This is the skill behind almost every real comparison you'll ever read: which product has better reviews, which city has more reliable weather, which investment is less risky. The number on its own rarely settles the question — it's comparing multiple statistics together and asking \"so what does that actually mean\" that turns raw data into a decision.",
    keyTerms: [
      { term: "Spread", definition: "How stretched out or tightly clustered a dataset's values are." },
      { term: "Consistent", definition: "Having a small range or spread — values that stay close to each other game to game, day to day, or student to student." },
      { term: "Conclusion", definition: "A stated takeaway from comparing statistics, not just the statistics themselves." },
    ],
    misconceptions: [
      {
        id: "misconception-same-mean-means-same-data",
        misconception: "If two datasets have the same mean, they're basically the same.",
        correction:
          "The mean only describes the center — two datasets can share an identical mean while one is tightly clustered and the other wildly spread out. Comparing range (or standard deviation) alongside the mean is what reveals that difference.",
      },
      {
        id: "misconception-one-statistic-is-enough-to-compare",
        misconception: "Comparing just one statistic (like the mean) is enough to fully compare two datasets.",
        correction:
          "A complete comparison looks at center and spread together. Relying on a single statistic can lead to a misleading conclusion, like calling two very differently-spread datasets \"the same\" just because their means match.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you compare — then check yourself in the Data Comparison Lab below.",
    scenarios: [
      {
        id: "mathematics-data-comparison-predict-001",
        scenario: "Class A's test scores: 68, 71, 70, 72, 69. Class B's test scores: 40, 60, 75, 90, 85.",
        question: "Both classes average close to 70. Which class's scores are more consistent?",
        options: [
          { id: "a", label: "Class A" },
          { id: "b", label: "Class B" },
          { id: "equal", label: "Both are equally consistent" },
          { id: "cant-tell", label: "Can't tell from the means alone" },
        ],
        actualResultOptionId: "a",
        explanation: "Class A's scores all sit within a few points of each other (68-72), while Class B's range from 40 to 90 — Class A is far more consistent despite the similar average.",
        hint: "Look at how spread out each class's individual scores are, not just their average.",
      },
      {
        id: "mathematics-data-comparison-predict-002",
        scenario: "Two basketball players average the same points per game, but Player A's range is 4 and Player B's range is 30.",
        question: "Which player is the more reliable, predictable scorer?",
        options: [
          { id: "a", label: "Player A" },
          { id: "b", label: "Player B" },
          { id: "equal", label: "They're equally reliable" },
          { id: "b-more", label: "Player B, because a bigger range means more scoring ability" },
        ],
        actualResultOptionId: "a",
        explanation: "A smaller range (4) means Player A's point totals stay close together game to game, making them far more predictable than Player B, whose range of 30 shows wildly swinging performances.",
        hint: "A smaller range means the values stay closer together — what does that mean for predictability?",
      },
      {
        id: "mathematics-data-comparison-predict-003",
        scenario: "Two cities' weekly rainfall totals are being compared using only their means.",
        question: "Is comparing only the means enough to fully understand the two cities' rainfall patterns?",
        options: [
          { id: "no", label: "No — spread (range) matters too, especially if one city has one huge rainy day and the rest dry" },
          { id: "yes", label: "Yes — the mean tells you everything you need to know" },
          { id: "only-if-equal", label: "Only if the two means happen to be equal" },
          { id: "never-useful", label: "The mean is never useful for this kind of comparison" },
        ],
        actualResultOptionId: "no",
        explanation: "A city with one huge rainy day and mostly dry days can have the same mean as a city with steady moderate rain every day — the mean alone hides that very different pattern, which range or a chart would reveal.",
        hint: "Could two very different rainfall patterns produce the exact same average?",
      },
      {
        id: "mathematics-data-comparison-predict-004",
        scenario: "A comparison chart shows Dataset X's mean is higher than Dataset Y's, but Dataset Y's median is higher than Dataset X's.",
        question: "Is this combination possible?",
        options: [
          { id: "yes", label: "Yes — mean and median can disagree about which dataset is \"higher\" if one has an outlier" },
          { id: "no", label: "No — mean and median must always agree about which dataset is higher" },
          { id: "only-equal-size", label: "Only if the two datasets have different numbers of values" },
          { id: "impossible", label: "This would always indicate a calculation error" },
        ],
        actualResultOptionId: "yes",
        explanation: "An outlier in Dataset X could pull its mean up above Dataset Y's, while Dataset Y's more typical middle values still give it the higher median — mean and median measure different things and can disagree.",
        hint: "Remember that an outlier affects the mean much more than the median.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a dataset pair — Test Scores, Rainfall, or Points Per Game.",
      "Use the +/- controls under each dataset to edit individual values.",
      "Compare the two stat cards side by side — notice which dataset is flagged \"More consistent.\"",
      "Watch the shared-scale bar chart to see spread visually, not just as numbers.",
    ],
    tryThis: [
      "Edit both datasets until their means are exactly equal, then check whether their ranges are also equal.",
      "Make one dataset's values as spread out as possible while keeping the same mean — watch the \"More consistent\" flag move to the other dataset.",
      "Compare the Test Scores pair before and after editing — write one sentence describing what changed, not just which numbers changed.",
      "On the Rainfall pair, try making one city have one very rainy day and the rest dry, then compare its range to a city with steady moderate rain.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-data-comparison-explain-001",
        question: "Why isn't comparing just the means enough to fully compare two datasets?",
        answer:
          "The mean only describes where a dataset is centered, not how spread out its values are. Two datasets can share an identical mean while one is tightly clustered and the other is wildly spread — only looking at spread (like range) alongside the mean reveals that difference.",
      },
      {
        id: "mathematics-data-comparison-explain-002",
        question: "Why does a smaller range indicate a more \"consistent\" dataset?",
        answer:
          "Range measures the distance between the largest and smallest values. A small range means every value stays close to the others, so the data doesn't swing wildly — which is exactly what \"consistent\" means in a dataset like a player's game-to-game scoring.",
      },
      {
        id: "mathematics-data-comparison-explain-003",
        question: "Why can a dataset's mean and median disagree about which of two datasets is \"higher\"?",
        answer:
          "The mean factors in every value, including outliers, while the median only depends on the middle position after sorting. An outlier can pull one dataset's mean up without affecting its median much, letting the two measures point in different directions.",
      },
      {
        id: "mathematics-data-comparison-explain-004",
        question: "Why is turning a calculation into a written conclusion an important last step in data interpretation?",
        answer:
          "A number by itself doesn't answer the real question someone's asking — \"which is better,\" \"which is more reliable,\" \"what happened.\" Stating the comparison as a conclusion (\"Class A is far more consistent, even though both classes average about the same\") is what actually makes the data useful.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-data-comparison",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Data Analyst Mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission gives you two datasets to compare — use the Data Comparison Lab above to help you calculate and reason through it. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-data-comparison-challenge-001",
        title: "Data Analyst Mission: Comparing Two Classes",
        scenario: "Class A: 68, 71, 70, 72, 69. Class B: 40, 60, 75, 90, 85.",
        objective: "Find the difference between Class B's range and Class A's range.",
        answer: { mode: "numeric", target: 46, tolerance: 0 },
        explanation: "Class A's range = 72 − 68 = 4. Class B's range = 90 − 40 = 50. The difference is 50 − 4 = 46.",
        hints: [
          "Calculate each class's range separately first (max − min).",
          "Subtract the smaller range from the larger range.",
        ],
      },
      {
        id: "mathematics-data-comparison-challenge-002",
        title: "Data Analyst Mission: Choosing the More Reliable Player",
        scenario: "Player A: 18, 20, 19, 21, 18, 20 points per game. Player B: 5, 32, 8, 30, 4, 33 points per game.",
        objective: "Decide which player is the more reliable, consistent scorer.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Player A" },
            { id: "b", label: "Player B" },
          ],
          correctOptionId: "a",
        },
        explanation: "Player A's scores stay tightly within 18-21 points every game, while Player B swings wildly between 4 and 33 — Player A is the far more reliable, consistent scorer.",
        hints: [
          "Compare how close together each player's individual game scores are.",
          "A smaller range means more consistent, predictable performance.",
        ],
      },
      {
        id: "mathematics-data-comparison-challenge-003",
        title: "Data Analyst Mission: Same Mean, Different Story",
        scenario: "Rivertown's rainfall this week: 2, 3, 40, 1, 2, 3, 1 mm. Hillview's rainfall: 6, 7, 8, 6, 7, 8, 6 mm.",
        objective: "Decide which explanation best describes why the two cities can have a similar weekly total despite very different daily patterns.",
        answer: {
          mode: "choice",
          options: [
            { id: "outlier", label: "Rivertown had one extreme rainy day; Hillview had steady moderate rain all week" },
            { id: "no-diff", label: "There is no real difference between the two rainfall patterns" },
            { id: "hillview-more-total", label: "Hillview definitely had more total rainfall overall" },
          ],
          correctOptionId: "outlier",
        },
        explanation: "Rivertown's total is dominated by one 40mm day with mostly dry days around it, while Hillview had steady moderate rain (6-8mm) every day — two very different patterns that can still add up to similar totals.",
        hints: [
          "Look at how spread out each city's daily values are, not just the weekly total.",
          "One city has one extreme value; the other has values that are all close together.",
        ],
      },
      {
        id: "mathematics-data-comparison-challenge-004",
        title: "Data Analyst Mission: Full Comparison Report",
        scenario: "Two datasets are given: Dataset X has a mean of 50 and a range of 60. Dataset Y has a mean of 50 and a range of 6.",
        objective: "Write the single best one-sentence conclusion comparing the two datasets.",
        answer: {
          mode: "choice",
          options: [
            { id: "consistent", label: "Both datasets average 50, but Dataset Y is far more consistent than Dataset X" },
            { id: "identical", label: "The two datasets are essentially identical since their means match" },
            { id: "x-higher", label: "Dataset X is higher overall than Dataset Y" },
          ],
          correctOptionId: "consistent",
        },
        explanation: "Sharing a mean of 50 only means the two datasets are centered the same way — Dataset Y's much smaller range (6 vs 60) shows its values are far more tightly clustered and consistent than Dataset X's.",
        hints: [
          "The two datasets share a mean — what does that tell you, and what does it not tell you?",
          "Compare the two ranges to decide which dataset is more consistent.",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "central-tendency",
      label: "Central Tendency",
      href: "/dashboard/mathematics/central-tendency",
      reason: "Supplies the mean, median, and range calculations this topic compares side by side.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "graph-builder",
      label: "Graphs & Data Visualization",
      href: "/dashboard/mathematics/graph-builder",
      reason: "Builds the chart-reading skills used here to compare two datasets visually.",
    },
  ],
};
