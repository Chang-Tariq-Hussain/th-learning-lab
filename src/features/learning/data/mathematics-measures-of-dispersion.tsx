import type { TopicContent } from "../types";

/**
 * Range & Measures of Dispersion — Variance & Standard Deviation.
 * Like Statistics Foundations before it, this simulation predates
 * the Golden Learning Experience pipeline and was built as a
 * standalone 10-level "Level Nav" + `SimulationLearnMore` page. This
 * file brings it into the same GLE pattern every other Mathematics
 * topic uses — Learn, Predict, Explore, Explain, Practice, Challenge,
 * Mastery — WITHOUT touching the simulation itself:
 * `<MeasuresOfDispersion />` (all 10 levels, including its own
 * internal 5-question practice level) is reused unmodified as the
 * Explore section's embedded simulation.
 *
 * Range itself is already taught in Central Tendency (which remains
 * on the older pattern, untouched); this topic's Learn section
 * briefly recaps range as the simplest measure of spread before
 * building up to variance and standard deviation, matching what the
 * simulation's own Level 1 ("Center vs Spread") already does.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-measures-of-dispersion-quiz.ts`)
 * rather than the older shared `mathematics-statistics` bank, which
 * stays exactly as-is since Central Tendency still depends on it.
 */
export const mathematicsMeasuresOfDispersionContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "measures-of-dispersion",
  title: "Measures of Dispersion — Variance & Standard Deviation",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/measures-of-dispersion",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain why two datasets can share the same mean but look very different.",
      "Define deviation as the distance of a value from the mean.",
      "Calculate variance and standard deviation from a set of deviations.",
      "Compare the spread of two datasets using standard deviation, and recognize the effect of an outlier.",
    ],
    concepts: [
      {
        term: "Range (a quick recap)",
        explanation:
          "The simplest measure of spread: the maximum value minus the minimum. Range is quick to calculate but only looks at the two most extreme values — it ignores everything in between, which is exactly what variance and standard deviation are built to fix.",
        formula: "\\text{range} = \\text{maximum} - \\text{minimum}",
        formulaCaption: "Range",
      },
      {
        term: "Deviation",
        explanation:
          "How far a single value sits from the dataset's mean. Some deviations are positive (above the mean), some are negative (below the mean).",
        formula: "\\text{deviation} = x_i - \\bar{x}",
        formulaCaption: "Deviation of a value from the mean",
      },
      {
        term: "Variance",
        explanation:
          "The average of the squared deviations. Squaring makes every deviation positive before averaging, so spread in either direction counts the same way instead of canceling out.",
        formula: "\\text{variance} = \\dfrac{\\sum (x_i - \\bar{x})^2}{n}",
        formulaCaption: "Variance",
      },
      {
        term: "Standard deviation",
        explanation:
          "The square root of the variance. Taking the square root brings the units back in line with the original data, making it easier to interpret as a typical distance from the mean.",
        formula: "\\text{standard deviation} = \\sqrt{\\text{variance}}",
        formulaCaption: "Standard deviation",
      },
    ],
    whyItMatters:
      "Standard deviation is what separates a reliable average from a shaky one — two classes can both average 75% on a test, but if one class's scores cluster tightly around 75 while the other ranges from 40 to 100, the mean alone hides that huge difference. Standard deviation is used everywhere from grading curves to quality control to financial risk, precisely because it captures the spread the mean and even the range leave out.",
    keyTerms: [
      { term: "Spread", definition: "How stretched out or clustered a dataset's values are, regardless of where its center sits." },
      { term: "Squared deviation", definition: "A single deviation multiplied by itself, always non-negative, used as the building block of variance." },
      { term: "Outlier", definition: "A value that sits unusually far from the rest of the dataset, capable of sharply increasing variance and standard deviation." },
    ],
    misconceptions: [
      {
        id: "misconception-range-is-enough",
        misconception: "Range alone is a good enough measure of spread for any dataset.",
        correction:
          "Range only looks at the two most extreme values and ignores everything else — two very different datasets can have the exact same range. Variance and standard deviation use every value's distance from the mean, giving a much fuller picture of spread.",
      },
      {
        id: "misconception-deviations-can-be-averaged-directly",
        misconception: "You can measure overall spread by just averaging the raw (unsquared) deviations.",
        correction:
          "Deviations above and below the mean always sum to zero by definition, so their average is always zero regardless of how spread out the data is. Squaring each deviation first removes the sign so spread in either direction actually counts.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you calculate — then check yourself in Measures of Dispersion below.",
    scenarios: [
      {
        id: "mathematics-measures-of-dispersion-predict-001",
        scenario: "Dataset A: 9, 10, 10, 10, 11. Dataset B: 2, 6, 10, 14, 18. Both datasets have a mean of 10.",
        question: "Which dataset has the greater spread?",
        options: [
          { id: "b", label: "Dataset B" },
          { id: "a", label: "Dataset A" },
          { id: "equal", label: "They are equally spread out" },
          { id: "cant-tell", label: "Can't tell from the mean alone" },
        ],
        actualResultOptionId: "b",
        explanation: "Dataset B's values sit much farther from the shared mean of 10 than Dataset A's do, even though both datasets average to the same value.",
        hint: "Look at how far each dataset's values sit from 10, not just their mean.",
      },
      {
        id: "mathematics-measures-of-dispersion-predict-002",
        scenario: "A dataset's raw (unsquared) deviations from the mean are calculated: some positive, some negative.",
        question: "What do all the raw deviations add up to?",
        options: [
          { id: "zero", label: "Zero, always" },
          { id: "positive", label: "A positive number" },
          { id: "negative", label: "A negative number" },
          { id: "depends", label: "It depends on the dataset" },
        ],
        actualResultOptionId: "zero",
        explanation: "By the definition of the mean, the positive and negative deviations always balance out exactly to zero — this is exactly why deviations get squared before being averaged into variance.",
        hint: "Think about what the mean actually balances.",
      },
      {
        id: "mathematics-measures-of-dispersion-predict-003",
        scenario: "A dataset 10, 11, 12, 13, 14 has one value (14) replaced with an outlier: 100.",
        question: "What happens to the standard deviation?",
        options: [
          { id: "increases", label: "It increases significantly" },
          { id: "decreases", label: "It decreases" },
          { id: "same", label: "It stays exactly the same" },
          { id: "zero", label: "It becomes zero" },
        ],
        actualResultOptionId: "increases",
        explanation: "The outlier's huge deviation from the mean gets squared, contributing a very large term to the variance — pulling both variance and standard deviation up sharply.",
        hint: "An outlier has a very large deviation from the mean — what happens when that gets squared?",
      },
      {
        id: "mathematics-measures-of-dispersion-predict-004",
        scenario: "A variance is calculated as 16 for a dataset measured in centimeters.",
        question: "What are the units of the standard deviation, and roughly how does it compare to the original data's scale?",
        options: [
          { id: "cm-4", label: "Centimeters, and it's back on the same scale as the original data (√16 = 4)" },
          { id: "cm-16", label: "Centimeters, equal to 16" },
          { id: "cm2-16", label: "Square centimeters, equal to 16" },
          { id: "no-units", label: "Standard deviation never has units" },
        ],
        actualResultOptionId: "cm-4",
        explanation: "Taking the square root of the variance (16) undoes the earlier squaring, both returning the units to centimeters and giving a value (4) on the same scale as the original data.",
        hint: "Squaring changed the units to \"squared\" — what does taking a square root do to units?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Work through the 10 levels in order, from Center vs Spread through Population vs Sample to Practice.",
      "In Deviation from the Mean, edit the dataset and watch each value's deviation update.",
      "In Variance and Standard Deviation, follow the guided calculation from deviations to squared deviations to the final value.",
      "In Outliers, see exactly how much one extreme value can move the standard deviation.",
    ],
    tryThis: [
      "Before opening Low vs High Spread, predict which of the two same-mean datasets has the larger standard deviation.",
      "Calculate one value's deviation and square it by hand, then compare to what the simulation shows.",
      "In the Outlier level, note the standard deviation before and after the outlier is added — how much did it change?",
      "Use the built-in Level 10 practice questions as a quick self-check before the Practice section below.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-measures-of-dispersion-explain-001",
        question: "Why isn't range enough to describe a dataset's spread?",
        answer:
          "Range only compares the maximum and minimum values, ignoring everything in between. Two datasets can have identical ranges while looking completely different in the middle — variance and standard deviation account for every value's distance from the mean, not just the two extremes.",
      },
      {
        id: "mathematics-measures-of-dispersion-explain-002",
        question: "Why are deviations squared before being averaged into variance?",
        answer:
          "Deviations above the mean are positive and deviations below are negative, and by definition they always sum to exactly zero. Squaring each deviation first makes every term positive, so spread in either direction contributes to the average instead of canceling out.",
      },
      {
        id: "mathematics-measures-of-dispersion-explain-003",
        question: "Why take the square root of variance to get standard deviation?",
        answer:
          "Squaring the deviations left variance in \"squared units\" (like square centimeters), which isn't directly comparable to the original data. Taking the square root undoes that squaring, returning the value to the original units and making it interpretable as a typical distance from the mean.",
      },
      {
        id: "mathematics-measures-of-dispersion-explain-004",
        question: "Why does a single outlier increase standard deviation so much?",
        answer:
          "An outlier sits far from the mean, so its deviation is large — and because deviations are squared before averaging, that one large deviation contributes a disproportionately large term to the variance, pulling both variance and standard deviation upward more than a typical value would.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-measures-of-dispersion",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Spread Builder
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission asks you to reason about spread, deviation, variance, or standard deviation — use the levels in Measures of Dispersion above to help you check your work. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-measures-of-dispersion-challenge-001",
        title: "Spread Builder: Comparing Two Datasets",
        scenario: "Dataset A: 9, 10, 10, 10, 11. Dataset B: 2, 6, 10, 14, 18. Both have a mean of 10.",
        objective: "Decide which dataset has the greater spread.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Dataset A" },
            { id: "b", label: "Dataset B" },
          ],
          correctOptionId: "b",
        },
        explanation: "Dataset B's values range much farther from the shared mean of 10 (as far as ±8) compared to Dataset A (at most ±1), so Dataset B has the greater spread.",
        hints: [
          "Both datasets share the same mean — the difference must be in how far the values sit from that mean.",
          "Compare the distances of the farthest values in each dataset from 10.",
        ],
      },
      {
        id: "mathematics-measures-of-dispersion-challenge-002",
        title: "Spread Builder: Finding a Single Deviation",
        scenario: "A dataset has a mean of 20. One value in the dataset is 26.",
        objective: "Find that value's deviation from the mean.",
        answer: { mode: "numeric", target: 6, tolerance: 0 },
        explanation: "Deviation = value − mean = 26 − 20 = 6.",
        hints: [
          "Deviation is the value minus the mean.",
          "26 − 20 = ?",
        ],
      },
      {
        id: "mathematics-measures-of-dispersion-challenge-003",
        title: "Spread Builder: Squared Deviation",
        scenario: "A value has a deviation of −5 from its dataset's mean.",
        objective: "Find the squared deviation used in the variance calculation.",
        answer: { mode: "numeric", target: 25, tolerance: 0 },
        explanation: "Squaring −5 gives (−5)² = 25 — squaring always produces a non-negative result, even for a negative deviation.",
        hints: [
          "Squaring a deviation means multiplying it by itself.",
          "A negative number multiplied by itself becomes positive.",
        ],
      },
      {
        id: "mathematics-measures-of-dispersion-challenge-004",
        title: "Spread Builder: Variance to Standard Deviation",
        scenario: "A dataset's variance has been calculated as 9.",
        objective: "Find the standard deviation.",
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        explanation: "Standard deviation is the square root of variance: √9 = 3.",
        hints: [
          "Standard deviation undoes the squaring step in variance.",
          "What number, multiplied by itself, gives 9?",
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
      reason: "Introduces the mean and range this topic builds variance and standard deviation on top of.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "statistics-foundations",
      label: "Statistics Foundations",
      href: "/dashboard/mathematics/statistics-foundations",
      reason: "Covers the population vs sample distinction this topic's population/sample variance levels rely on.",
    },
  ],
};
