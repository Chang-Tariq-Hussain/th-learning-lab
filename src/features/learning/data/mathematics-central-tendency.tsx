import type { TopicContent } from "../types";

/**
 * Central Tendency — Mean, Median, Mode & Range. The last of the
 * three original Statistics simulations still on the pre-GLE "Level
 * Nav" + `SimulationLearnMore` pattern (after Statistics Foundations
 * and Measures of Dispersion were converted). This file brings it
 * into the same Golden Learning Experience pattern every other
 * Mathematics topic uses — Learn, Predict, Explore, Explain,
 * Practice, Challenge, Mastery — WITHOUT touching the simulation
 * itself: `<CentralTendency />` (the interactive dataset editor,
 * balancing-point mean visualization, median/mode/range panels, and
 * outlier comparison) is reused unmodified as the Explore section's
 * embedded simulation.
 *
 * The Learn section below is adapted directly from the page's
 * previous `SimulationLearnMore` content rather than rewritten from
 * scratch, so nothing about how these four measures were explained
 * changes for returning students.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-central-tendency-quiz.ts`).
 * The older shared `mathematics-statistics` bank (and its
 * `/dashboard/mathematics/statistics-quiz` page) is left exactly as
 * it was — this was the last of the three topics depending on it,
 * so nothing else references it going forward, but nothing was
 * deleted.
 */
export const mathematicsCentralTendencyContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "central-tendency",
  title: "Measures of Central Tendency — Mean, Median, Mode & Range",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/central-tendency",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Calculate the mean, median, and mode of a dataset.",
      "Calculate the range of a dataset.",
      "Explain why an outlier affects the mean more than the median.",
      "Choose the most appropriate measure of central tendency for a given dataset.",
    ],
    concepts: [
      {
        term: "Mean",
        explanation:
          "The sum of every value in a dataset, divided by how many values there are — the balancing point of the data.",
        formula: "\\text{mean} = \\dfrac{\\text{sum of values}}{\\text{number of values}}",
        formulaCaption: "Mean",
      },
      {
        term: "Median",
        explanation:
          "The middle value when a dataset is sorted from smallest to largest. If there are two middle values, the median is their average.",
      },
      {
        term: "Mode",
        explanation:
          "The value that appears most often in a dataset. A dataset can have one mode, more than one, or none at all if every value appears equally often.",
      },
      {
        term: "Range",
        explanation:
          "The difference between the largest and smallest value in a dataset — a quick, simple measure of how spread out the data is.",
        formula: "\\text{range} = \\text{max} - \\text{min}",
        formulaCaption: "Range",
      },
      {
        term: "Outliers and the mean",
        explanation:
          "Because the mean factors in every value equally, one unusually large or small number can pull it noticeably away from where most of the data actually sits. The median, which only cares about the middle position, barely moves.",
      },
    ],
    whyItMatters:
      "These four measures are the starting point for almost every statistic you'll see reported in the news, from average income (mean) to a typical home price (often median, specifically because it resists outliers) to the most common shoe size sold (mode). Knowing which measure resists outliers and which doesn't helps you spot when a reported average might be misleading.",
    keyTerms: [
      { term: "Outlier", definition: "A value that sits unusually far from the rest of the dataset." },
      { term: "Bimodal", definition: "A dataset with exactly two values tied for the highest frequency." },
      { term: "Skew", definition: "A noticeable gap between the mean and median, often caused by outliers or an uneven data shape." },
    ],
    misconceptions: [
      {
        id: "misconception-mean-is-always-best-average",
        misconception: "The mean is always the best or most accurate \"average\" to use.",
        correction:
          "Which measure is most useful depends on the data — the mean is pulled around by outliers, which is exactly why reported \"typical\" values like home prices often use the median instead, since it resists extreme values that the mean doesn't.",
      },
      {
        id: "misconception-every-dataset-has-exactly-one-mode",
        misconception: "Every dataset has exactly one mode.",
        correction:
          "A dataset can have no mode at all (every value appears equally often, e.g. 1, 2, 3, 4, 5) or more than one mode tied for the highest frequency (bimodal or multimodal) — \"exactly one\" is only one of several possibilities.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you calculate — then check yourself in Central Tendency below.",
    scenarios: [
      {
        id: "mathematics-central-tendency-predict-001",
        scenario: "A dataset is 4, 6, 8, 10, and its mean is 7.",
        question: "One more value, 40, is added to the dataset. What happens to the mean?",
        options: [
          { id: "increases-a-lot", label: "It increases significantly" },
          { id: "decreases", label: "It decreases" },
          { id: "same", label: "It stays exactly the same" },
          { id: "small-change", label: "It barely changes at all" },
        ],
        actualResultOptionId: "increases-a-lot",
        explanation: "Adding a large outlier (40) pulls the mean noticeably upward, since the mean factors in every value including extreme ones.",
        hint: "The mean factors in every value equally — what happens when one value is much larger than the rest?",
      },
      {
        id: "mathematics-central-tendency-predict-002",
        scenario: "The same dataset, 4, 6, 8, 10, 40, has a median calculated from its sorted order.",
        question: "Compared to the mean, how much does the median move because of the outlier (40)?",
        options: [
          { id: "barely", label: "Barely at all — the median only depends on the middle position" },
          { id: "same-amount", label: "The exact same amount as the mean" },
          { id: "more", label: "Even more than the mean" },
          { id: "cant-calculate", label: "The median cannot be calculated with an outlier present" },
        ],
        actualResultOptionId: "barely",
        explanation: "The median only depends on which value sits in the middle position after sorting — an extreme value at one end barely shifts that middle position.",
        hint: "Does the median care how large or small the extreme values are, or just their position after sorting?",
      },
      {
        id: "mathematics-central-tendency-predict-003",
        scenario: "A dataset is 2, 3, 3, 4, 5, 3, 6.",
        question: "What is the mode of this dataset?",
        options: [
          { id: "3", label: "3" },
          { id: "6", label: "6" },
          { id: "no-mode", label: "There is no mode" },
          { id: "avg", label: "The average of all values" },
        ],
        actualResultOptionId: "3",
        explanation: "3 appears three times, more than any other value in the dataset, making it the mode.",
        hint: "Which single value appears more often than any other in the list?",
      },
      {
        id: "mathematics-central-tendency-predict-004",
        scenario: "Dataset A: 1, 2, 3, 4, 5. Dataset B: 1, 1, 1, 1, 100.",
        question: "Both datasets have 5 values. Which is more likely to have a mean far from most of its actual data points?",
        options: [
          { id: "b", label: "Dataset B" },
          { id: "a", label: "Dataset A" },
          { id: "equal", label: "Both equally" },
          { id: "neither", label: "Neither — the mean is always representative" },
        ],
        actualResultOptionId: "b",
        explanation: "Dataset B's outlier (100) pulls its mean well above where most of the data (1, 1, 1, 1) actually sits, while Dataset A's evenly spread values keep its mean representative.",
        hint: "Look at where most of each dataset's values actually cluster, then compare that to what the mean would be.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Edit the dataset and watch the mean, median, mode, and range update live.",
      "Sort the values and locate the median by eye before checking the calculated value.",
      "Add an extreme outlier and watch how much the mean shifts compared to the median.",
      "Compare the frequency chart to visually confirm which value is the mode.",
    ],
    tryThis: [
      "Add one extreme value to a dataset and compare how much the mean and median each move.",
      "Build a dataset where the mean and median are far apart. What does that tell you about the data's shape?",
      "Find a dataset with no mode at all — is that possible with any values you choose?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-central-tendency-explain-001",
        question: "Why does an outlier affect the mean more than the median?",
        answer:
          "The mean is calculated from the sum of every value, so one unusually large or small number directly shifts that sum and pulls the mean with it. The median only depends on which value sits in the middle position after sorting — an extreme value at one end usually doesn't even change which value that is.",
      },
      {
        id: "mathematics-central-tendency-explain-002",
        question: "Why might a news report use the median home price instead of the mean?",
        answer:
          "Home prices often include a small number of very expensive properties that would pull a mean far above what a \"typical\" home actually costs. The median resists that pull, better representing the price a typical buyer would actually encounter.",
      },
      {
        id: "mathematics-central-tendency-explain-003",
        question: "Why can a dataset have no mode at all?",
        answer:
          "The mode requires at least one value to repeat more often than the others. If every value in the dataset appears exactly the same number of times (often just once each), there's no single value that stands out as \"most frequent,\" so there is no mode.",
      },
      {
        id: "mathematics-central-tendency-explain-004",
        question: "Why is range considered a limited measure of spread, even though it's easy to calculate?",
        answer:
          "Range only looks at the two most extreme values (max and min) and ignores everything in between — two datasets can share the same range while being very differently distributed in the middle. It's a useful quick check, but not a full picture of spread.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-central-tendency",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Target the Average
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission asks you to work backward from a target statistic, or reason about how a dataset behaves — use Central Tendency above to help you check your work. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-central-tendency-challenge-001",
        title: "Target the Average: Build a Mean of 10",
        scenario: "You have four values: 8, 9, 11, and one unknown value.",
        objective: "Find the value that makes the dataset's mean exactly 10.",
        answer: { mode: "numeric", target: 12, tolerance: 0 },
        explanation: "For a mean of 10 across 4 values, the total must be 40. 8 + 9 + 11 = 28, so the missing value is 40 − 28 = 12.",
        hints: [
          "For a mean of 10 with 4 values, what must the four values add up to?",
          "Subtract the sum of the three known values from that total.",
        ],
      },
      {
        id: "mathematics-central-tendency-challenge-002",
        title: "Target the Average: Median from an Even Count",
        scenario: "A sorted dataset is 3, 5, 7, 9.",
        objective: "Find the median of this dataset.",
        answer: { mode: "numeric", target: 6, tolerance: 0 },
        explanation: "With an even number of values, the median is the average of the two middle values: (5 + 7) ÷ 2 = 6.",
        hints: [
          "With an even number of values, there are two middle values, not one.",
          "Average the two middle values (5 and 7) together.",
        ],
      },
      {
        id: "mathematics-central-tendency-challenge-003",
        title: "Target the Average: Mean vs Median Gap",
        scenario: "A dataset is 2, 3, 3, 4, 3, 5, 60.",
        objective: "Which measure — mean or median — better represents where most of this data actually sits?",
        answer: {
          mode: "choice",
          options: [
            { id: "median", label: "Median" },
            { id: "mean", label: "Mean" },
          ],
          correctOptionId: "median",
        },
        explanation: "The outlier (60) pulls the mean well above where most values (2–5) actually cluster, while the median stays anchored near the middle of the tightly grouped values.",
        hints: [
          "Notice that most values are small (2–5) except for one large outlier (60).",
          "Which measure resists being pulled around by that one outlier?",
        ],
      },
      {
        id: "mathematics-central-tendency-challenge-004",
        title: "Target the Average: Impossible Mode",
        scenario: "A dataset has exactly 5 values, and no two values are the same.",
        objective: "Decide whether this dataset can have a mode.",
        answer: {
          mode: "choice",
          options: [
            { id: "no", label: "No — it has no mode" },
            { id: "yes", label: "Yes — the largest value is automatically the mode" },
          ],
          correctOptionId: "no",
        },
        explanation: "If every value in the dataset is different, no value repeats more often than any other, so the dataset has no mode at all.",
        hints: [
          "The mode requires a value to appear more often than the others.",
          "If nothing repeats, can any single value be \"most frequent\"?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "data-collection",
      label: "Data Collection & Representation",
      href: "/dashboard/mathematics/data-collection",
      reason: "Builds the frequency tables that mean, median, and mode are often calculated from.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "measures-of-dispersion",
      label: "Measures of Dispersion",
      href: "/dashboard/mathematics/measures-of-dispersion",
      reason: "Builds on range to introduce variance and standard deviation as fuller measures of spread.",
    },
  ],
};
