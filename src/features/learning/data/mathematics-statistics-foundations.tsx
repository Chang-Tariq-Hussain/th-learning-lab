import type { TopicContent } from "../types";

/**
 * Statistics Foundations — Data, Variables & Sampling. The first
 * Statistics simulation predates the Golden Learning Experience
 * pipeline and was built as a standalone 10-level "Level Nav" +
 * `SimulationLearnMore` page (like Central Tendency and Measures of
 * Dispersion still are). This file brings it into the same GLE
 * pattern every other Mathematics topic uses — Learn, Predict,
 * Explore, Explain, Practice, Challenge, Mastery — WITHOUT touching
 * the simulation itself: `<StatisticsFoundations />` (all 10 levels,
 * including its own internal classification/sampling-method practice
 * games) is reused unmodified as the Explore section's embedded
 * simulation, exactly like every Batch 1–4 topic reuses its
 * simulation.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-statistics-foundations-quiz.ts`)
 * rather than the older shared `mathematics-statistics` bank, which
 * stays exactly as-is since Central Tendency and Measures of
 * Dispersion still depend on it.
 */
export const mathematicsStatisticsFoundationsContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "statistics-foundations",
  title: "Statistics Foundations — Data, Variables & Sampling",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/statistics-foundations",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what a dataset and a variable are, using a real example.",
      "Distinguish categorical variables from numerical variables, and discrete from continuous.",
      "Define population and sample, and explain why sample size and sampling method both matter.",
      "Identify when a sampling method is likely to produce a biased, unrepresentative sample.",
    ],
    concepts: [
      {
        term: "Data & variables",
        explanation:
          "A dataset is a collection of information gathered about individuals or objects — for example, a class of students with their age, favorite subject, study hours, and test score recorded. A variable is one column of that dataset: something that can change from one individual to another, like \"Age\" or \"Test Score.\"",
      },
      {
        term: "Categorical vs numerical",
        explanation:
          "Categorical variables describe qualities or groups (favorite subject, favorite color) and can be counted or grouped but not meaningfully averaged. Numerical variables represent measurable quantities (age, test score, study hours) and can be added, averaged, and used in calculations.",
      },
      {
        term: "Discrete vs continuous",
        explanation:
          "Within numerical variables, discrete values are countable in whole steps (number of siblings, number of pets), while continuous values can fall anywhere within a range (height, time, temperature).",
      },
      {
        term: "Population vs sample",
        explanation:
          "The population is the entire group you're interested in studying — every student in a school district, say. A sample is a smaller subset actually measured or surveyed, used to make inferences about the whole population without measuring everyone.",
      },
      {
        term: "Sampling method & bias",
        explanation:
          "How a sample is chosen matters as much as how big it is. Common methods include simple random (everyone has an equal chance), systematic (every nth person from a list), stratified (guarantees important subgroups are represented), and convenience (whoever is easiest to reach — often biased). A biased sample can produce a confident-sounding but misleading result.",
      },
    ],
    whyItMatters:
      "Every survey, poll, and scientific study reported in the news rests on these fundamentals: what kind of variable is being measured, whether the sample actually represents the population, and whether the sampling method introduced bias before a single answer was even collected. Being able to spot a biased convenience sample or tell a categorical variable from a numerical one is the first line of defense against being misled by a confident-sounding statistic.",
    keyTerms: [
      { term: "Individual", definition: "One person, object, or unit that a dataset gathers information about — one row of a dataset." },
      { term: "Representative sample", definition: "A sample whose makeup reasonably reflects the population it was drawn from." },
      { term: "Sampling bias", definition: "A systematic tendency for a sampling method to over- or under-represent parts of the population, skewing results." },
    ],
    misconceptions: [
      {
        id: "misconception-larger-sample-always-fixes-bias",
        misconception: "A bigger sample size always makes a survey's results more trustworthy.",
        correction:
          "Sample size and sampling method are separate issues. A very large but biased sample (e.g. thousands of convenience responses from one location) can still be far less trustworthy than a smaller, properly random sample — size alone doesn't fix a flawed selection method.",
      },
      {
        id: "misconception-numbers-are-always-numerical-variables",
        misconception: "If a variable's values are written as numbers, it must be a numerical variable.",
        correction:
          "What matters is whether the values can be meaningfully added or averaged, not whether they're written as digits. A \"student ID number\" looks numeric but is really a categorical label — averaging two ID numbers together produces a meaningless result.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you check — then explore the levels in Statistics Foundations below.",
    scenarios: [
      {
        id: "mathematics-statistics-foundations-predict-001",
        scenario: "A dataset records each student's \"Favorite Subject\" (Math, Art, Science, History).",
        question: "Is \"Favorite Subject\" a categorical or numerical variable?",
        options: [
          { id: "categorical", label: "Categorical" },
          { id: "numerical", label: "Numerical" },
        ],
        actualResultOptionId: "categorical",
        explanation: "Favorite Subject describes a group or quality, not a measurable amount — it can't be meaningfully averaged, which makes it categorical.",
        hint: "Can you calculate a meaningful average of the values?",
      },
      {
        id: "mathematics-statistics-foundations-predict-002",
        scenario: "A school of 1,000 students is being studied, but only 50 students are actually surveyed.",
        question: "What is the population, and what is the sample?",
        options: [
          { id: "correct", label: "Population = all 1,000 students; Sample = the 50 surveyed" },
          { id: "swapped", label: "Population = the 50 surveyed; Sample = all 1,000 students" },
          { id: "both-1000", label: "Both the population and sample are 1,000 students" },
          { id: "both-50", label: "Both the population and sample are 50 students" },
        ],
        actualResultOptionId: "correct",
        explanation: "The population is the entire group of interest (all 1,000 students); the sample is the smaller group actually measured (the 50 surveyed).",
        hint: "The population is the whole group you're interested in; the sample is the smaller group you actually measure.",
      },
      {
        id: "mathematics-statistics-foundations-predict-003",
        scenario: "A researcher surveys only the students sitting in the school library about their reading habits.",
        question: "Is this sample likely to be representative of the whole school's reading habits?",
        options: [
          { id: "no", label: "No — students in the library are more likely to already enjoy reading" },
          { id: "yes", label: "Yes — location doesn't affect who's asked" },
          { id: "depends-size", label: "It's fine as long as enough students are asked" },
          { id: "cant-tell", label: "There's no way to predict this" },
        ],
        actualResultOptionId: "no",
        explanation: "Students already in the library are more likely to enjoy reading than the school population as a whole, so this convenience sample is likely biased toward \"yes\" answers.",
        hint: "Think about who is more likely to already be sitting in a library.",
      },
      {
        id: "mathematics-statistics-foundations-predict-004",
        scenario: "\"Number of siblings\" and \"height in centimeters\" are both numerical variables.",
        question: "Which one is discrete and which is continuous?",
        options: [
          { id: "correct", label: "Number of siblings is discrete; height is continuous" },
          { id: "swapped", label: "Number of siblings is continuous; height is discrete" },
          { id: "both-discrete", label: "Both are discrete" },
          { id: "both-continuous", label: "Both are continuous" },
        ],
        actualResultOptionId: "correct",
        explanation: "Number of siblings can only take whole-number values (0, 1, 2...), making it discrete. Height can take any value within a range (like 154.3 cm), making it continuous.",
        hint: "Can the variable take any value within a range, or only whole, countable values?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Work through the 10 levels in order, from What is Data? through Sampling Bias to Practice.",
      "In the Categorical vs Numerical and Discrete vs Continuous levels, sort each item into the correct bin.",
      "In Sampling Methods, compare Random, Systematic, Stratified, and Convenience sampling side by side.",
      "In Sampling Bias, compare the two library-vs-random survey scenarios and see how the results differ.",
    ],
    tryThis: [
      "Before opening the Population vs Sample level, predict which is bigger — the population or the sample.",
      "Try to classify all 5 columns of the classroom dataset as categorical or numerical before checking level 3.",
      "In Representative Samples, compare Sample A and Sample B — which one better matches the population's proportions?",
      "Use the built-in Level 10 practice games (Classify the Data, Choose the Best Sampling Method) as a quick self-check before the Practice section below.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-statistics-foundations-explain-001",
        question: "Why can't categorical variables be meaningfully averaged?",
        answer:
          "Averaging only makes sense for quantities that measure \"how much\" of something. A categorical variable like favorite subject holds labels, not amounts — there's no numeric value between \"Math\" and \"Art\" to average toward.",
      },
      {
        id: "mathematics-statistics-foundations-explain-002",
        question: "Why does a sample need to be representative, not just large?",
        answer:
          "A sample is only useful for making conclusions about the population if it actually reflects the population's makeup. A large sample drawn entirely from one biased source can still misrepresent the population just as badly as a small one — size doesn't fix a flawed selection method.",
      },
      {
        id: "mathematics-statistics-foundations-explain-003",
        question: "Why is convenience sampling more prone to bias than random sampling?",
        answer:
          "Convenience sampling selects whoever is easiest to reach, and \"easy to reach\" is rarely unrelated to the thing being measured — like students already in the library being more likely to enjoy reading. Random sampling gives every individual an equal chance, which avoids that built-in skew.",
      },
      {
        id: "mathematics-statistics-foundations-explain-004",
        question: "Why does stratified sampling guarantee subgroup representation when simple random sampling doesn't?",
        answer:
          "Simple random sampling treats every individual as interchangeable, so by chance it can under- or over-represent a smaller subgroup. Stratified sampling deliberately samples within each subgroup first, which guarantees every important group appears in the final sample in proportion to its share of the population.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-statistics-foundations",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Data Detective
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission gives you a small dataset or scenario to investigate — use the levels in Statistics Foundations above to help you reason it through. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-statistics-foundations-challenge-001",
        title: "Data Detective: Reading the Classroom Dataset",
        scenario:
          "The classroom dataset records each student's Name, Age, Favorite Subject, Study Hours, and Test Score.",
        objective: "Identify how many of these 5 columns are numerical variables.",
        answer: { mode: "numeric", target: 3, tolerance: 0 },
        explanation: "Age, Study Hours, and Test Score are numerical (measurable amounts). Name is an identifier, not a variable to analyze, and Favorite Subject is categorical — so 3 columns are numerical.",
        hints: [
          "Name isn't really a variable you'd analyze — every student has a unique one.",
          "Ask which remaining columns can be meaningfully averaged.",
        ],
      },
      {
        id: "mathematics-statistics-foundations-challenge-002",
        title: "Data Detective: Population or Sample?",
        scenario:
          "A city has 40,000 registered voters. A pollster calls 400 of them to ask about an upcoming election.",
        objective: "Identify the size of the sample (not the population).",
        answer: { mode: "numeric", target: 400, tolerance: 0 },
        explanation: "The population is all 40,000 registered voters; the sample is the smaller group actually contacted — the 400 voters called.",
        hints: [
          "The population is the entire group of interest.",
          "The sample is the smaller group actually measured or surveyed.",
        ],
      },
      {
        id: "mathematics-statistics-foundations-challenge-003",
        title: "Data Detective: Spot the Bias",
        scenario:
          "A gym wants to know how often people in the city exercise. They survey everyone currently inside the gym.",
        objective: "Decide whether this sampling method is likely to be biased.",
        answer: {
          mode: "choice",
          options: [
            { id: "biased", label: "Yes, likely biased toward high exercise frequency" },
            { id: "not-biased", label: "No, this is a fair representative sample" },
          ],
          correctOptionId: "biased",
        },
        explanation: "People currently inside a gym are, by definition, people who exercise — this convenience sample will overestimate how often the general city population exercises.",
        hints: [
          "Who is more likely to be inside a gym at any given moment: frequent exercisers, or the general public?",
          "This is the same kind of bias as asking only library visitors whether they enjoy reading.",
        ],
      },
      {
        id: "mathematics-statistics-foundations-challenge-004",
        title: "Data Detective: Choosing a Sampling Method",
        scenario:
          "A school with 4 grade levels (9th–12th) wants a sample that's guaranteed to include students from every grade in proportion to the school's actual grade sizes.",
        objective: "Choose the sampling method that best fits this goal.",
        answer: {
          mode: "choice",
          options: [
            { id: "stratified", label: "Stratified sampling" },
            { id: "convenience", label: "Convenience sampling" },
            { id: "random", label: "Simple random sampling" },
          ],
          correctOptionId: "stratified",
        },
        explanation: "Stratified sampling deliberately samples within each grade level (stratum), guaranteeing every grade is represented proportionally — exactly the goal described.",
        hints: [
          "Which method is designed specifically to guarantee subgroup representation?",
          "Simple random sampling could, by chance, still under-represent a smaller grade.",
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
      reason: "Takes the variables and data concepts from here and shows how raw observations become a frequency table.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "central-tendency",
      label: "Central Tendency",
      href: "/dashboard/mathematics/central-tendency",
      reason: "Calculates mean, median, mode, and range from datasets built on the same variable concepts.",
    },
  ],
};
