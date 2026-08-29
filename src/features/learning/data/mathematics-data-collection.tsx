import type { TopicContent } from "../types";

/**
 * Data Collection & Representation, Mathematics Batch 4 topic 2 of 6
 * (Statistics & Data). New simulation
 * (`@/features/subjects/mathematics/data-collection`, "Data
 * Collection Lab") built for this topic: three switchable survey
 * datasets (favorite fruit / favorite pet / weather log) where
 * tapping a category records one observation, and the exact same
 * data is simultaneously viewable as a raw list, a frequency table
 * with tally marks, and a bar graph — making RAW DATA -> TABLE ->
 * GRAPH visible rather than assumed, per the batch's "Interactive
 * Data Lab" design principle.
 *
 * Sits between Statistics Foundations and Central Tendency in the
 * Learning Path: Statistics Foundations teaches what data *is*, this
 * topic teaches how raw observations get organized into something
 * calculable, and Central Tendency then calculates from it.
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-data-collection-quiz.ts`),
 * matching the "one dedicated bank per topic" convention every
 * Batch 1/2/3 topic follows — Statistics Foundations/Central
 * Tendency/Measures of Dispersion predate that convention and share
 * one older combined `mathematics-statistics` bank instead.
 */
export const mathematicsDataCollectionContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "data-collection",
  title: "Data Collection & Representation",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/data-collection",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the difference between raw data and organized data.",
      "Build a frequency table from a list of observations.",
      "Read a frequency table to answer questions about the data.",
      "Choose an appropriate way to represent a small dataset.",
    ],
    concepts: [
      {
        term: "Raw data",
        explanation:
          "The observations exactly as they were collected, in whatever order they happened — for example, a list of every student's favorite fruit as they were asked, one after another. Raw data is accurate, but hard to make sense of at a glance.",
      },
      {
        term: "Organizing data",
        explanation:
          "Sorting raw observations into categories and counting how many fall into each one. The same information is still there — it's just arranged so patterns become visible instead of hidden in a long list.",
      },
      {
        term: "Frequency",
        explanation:
          "How many times a particular value or category appears in a dataset. \"Apple has a frequency of 4\" means apple was recorded 4 separate times.",
        formula: "\\text{frequency} = \\text{number of times a value occurs}",
        formulaCaption: "Frequency",
      },
      {
        term: "Frequency table",
        explanation:
          "A table listing every category alongside its frequency (and often a tally mark count as a running total while collecting). It's the standard first step between raw data and a graph.",
      },
    ],
    whyItMatters:
      "Every survey, poll, or experiment starts as a messy list of raw observations — nobody can spot a trend by reading through hundreds of individual answers. Organizing that raw data into a frequency table is what turns \"a pile of answers\" into \"3 out of 10 students prefer apples,\" which is the version of the information people can actually use to make a decision.",
    keyTerms: [
      { term: "Observation", definition: "One single recorded data point, e.g. one student's answer to a survey question." },
      { term: "Category", definition: "One of the possible values an observation can fall into, e.g. \"Apple\" in a fruit survey." },
      { term: "Tally mark", definition: "A quick stroke used to count observations as they're collected, grouped in fives for easy counting." },
    ],
    misconceptions: [
      {
        id: "misconception-frequency-vs-category-value",
        misconception: "The frequency of a category is the same thing as the category itself.",
        correction:
          "The category is what was observed (e.g. \"Apple\"); the frequency is how many times it was observed (e.g. 4). Mixing these up leads to answers like \"the frequency is apple\" instead of a number.",
      },
      {
        id: "misconception-more-observations-always-obvious",
        misconception: "You can just look at a long list of raw data and tell which category is most common.",
        correction:
          "Once a dataset has more than a handful of observations, scanning raw data by eye becomes unreliable. That's exactly why frequency tables exist — counting systematically, category by category, gives a trustworthy answer that eyeballing a list doesn't.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you count — then check yourself in the Data Collection Lab below.",
    scenarios: [
      {
        id: "mathematics-data-collection-predict-001",
        scenario: "A class was asked their favorite fruit. The raw answers, in order, were: Apple, Apple, Banana, Orange, Apple, Banana.",
        question: "Once organized into a frequency table, which fruit has the highest frequency?",
        options: [
          { id: "apple", label: "Apple" },
          { id: "banana", label: "Banana" },
          { id: "orange", label: "Orange" },
          { id: "tie", label: "All are tied" },
        ],
        actualResultOptionId: "apple",
        explanation: "Apple appears 3 times, Banana appears 2 times, and Orange appears 1 time — Apple has the highest frequency.",
        hint: "Count how many times each fruit name appears in the list.",
      },
      {
        id: "mathematics-data-collection-predict-002",
        scenario: "A frequency table shows: Dog = 4, Cat = 3, Fish = 1, Bird = 2.",
        question: "How many total observations were collected?",
        options: [
          { id: "10", label: "10" },
          { id: "4", label: "4" },
          { id: "9", label: "9" },
          { id: "12", label: "12" },
        ],
        actualResultOptionId: "10",
        explanation: "Add every category's frequency together: 4 + 3 + 1 + 2 = 10 total observations.",
        hint: "Add up all four frequencies.",
      },
      {
        id: "mathematics-data-collection-predict-003",
        scenario: "One more \"Fish\" observation is added to a dataset where Fish previously had a frequency of 1.",
        question: "What happens to Fish's frequency and the dataset's total?",
        options: [
          { id: "both-up", label: "Both go up by 1" },
          { id: "only-total", label: "Only the total goes up" },
          { id: "only-fish", label: "Only Fish's frequency goes up" },
          { id: "neither", label: "Neither changes" },
        ],
        actualResultOptionId: "both-up",
        explanation: "Adding one observation always increases both that category's own frequency and the dataset's overall total by exactly 1.",
        hint: "Adding an observation affects both its own category and the grand total.",
      },
      {
        id: "mathematics-data-collection-predict-004",
        scenario: "A weather log records 5 Sunny days, 3 Cloudy days, and 0 Rainy days so far this month.",
        question: "What is the correct way to show Rainy in the frequency table?",
        options: [
          { id: "zero-row", label: "Include it with a frequency of 0" },
          { id: "leave-out", label: "Leave it out of the table entirely" },
          { id: "blank", label: "Leave its frequency blank" },
          { id: "merge", label: "Merge it into Cloudy" },
        ],
        actualResultOptionId: "zero-row",
        explanation: "A frequency table should list every possible category, even ones with zero observations so far — a frequency of 0 is still meaningful information.",
        hint: "Does a category that hasn't happened yet still belong in the table?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a survey dataset — Favorite Fruit, Favorite Pet, or Weather Log.",
      "Tap a category to record one new observation for it.",
      "Switch between Raw Data, Frequency Table, and Bar Graph to see the same data three different ways.",
      "Use \"Add random observation\" to quickly grow the dataset, or \"Undo last\" to remove the most recent one.",
    ],
    tryThis: [
      "Add five more observations, then predict which category will be most frequent before switching to the Frequency Table view.",
      "Compare the Raw Data view to the Frequency Table view — which one makes it easier to answer \"what's most common?\"",
      "Watch the Bar Graph update as you add observations — notice it's built directly from the same frequencies in the table.",
      "Try to make two categories tied for the highest frequency.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-data-collection-explain-001",
        question: "Why organize raw data into a frequency table instead of just reading the raw list?",
        answer:
          "A frequency table groups every observation by category and counts each group, so patterns like \"which is most common\" become a single number to compare rather than something you'd have to count by eye across a long, unordered list.",
      },
      {
        id: "mathematics-data-collection-explain-002",
        question: "Why should a frequency table include categories with zero observations?",
        answer:
          "A frequency of 0 is still real information — it tells you that category hasn't occurred yet, which is different from not knowing about it at all. Leaving it out would make the table look incomplete rather than showing an honest zero.",
      },
      {
        id: "mathematics-data-collection-explain-003",
        question: "Why do the Frequency Table and the Bar Graph always show the same information?",
        answer:
          "Both are just different representations built from the same underlying frequencies — the table shows the counts as numbers, the graph shows them as bar heights. Changing the data changes both at once because they're reading from the same source, not two separate datasets.",
      },
      {
        id: "mathematics-data-collection-explain-004",
        question: "Why does the total across all categories always equal the number of observations collected?",
        answer:
          "Every single observation belongs to exactly one category, so adding up every category's frequency counts each observation exactly once — the sum can never be more or less than the total number collected.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-data-collection",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Build the Data Table
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission gives you raw observations to organize — use the Data Collection Lab above to help you count, then work out the answer. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-data-collection-challenge-001",
        title: "Build the Data Table: Lunch Line Survey",
        scenario:
          "A cafeteria recorded raw answers to \"what did you choose for lunch?\": Pizza, Salad, Pizza, Pasta, Pizza, Salad, Pasta, Pizza.",
        objective: "Organize the raw data and find Pizza's frequency.",
        answer: { mode: "numeric", target: 4, tolerance: 0 },
        explanation: "Counting each \"Pizza\" in the list: Pizza appears 4 times out of 8 total observations.",
        hints: [
          "Go through the list one item at a time and make a tally mark for each choice.",
          "Count only the tally marks next to Pizza.",
        ],
      },
      {
        id: "mathematics-data-collection-challenge-002",
        title: "Build the Data Table: Missing Total",
        scenario: "A frequency table for a book-genre survey shows: Mystery = 6, Fantasy = 9, Comedy = 5, and one more genre, History, with an unknown frequency. The total number of students surveyed was 25.",
        objective: "Find History's frequency.",
        constraints: [{ id: "c1", label: "Every category's frequency must add up to the total of 25." }],
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        explanation: "6 + 9 + 5 = 20 known observations. Since the total is 25, History's frequency is 25 − 20 = 5.",
        hints: [
          "Add up the three known frequencies first.",
          "Subtract that sum from the overall total of 25.",
        ],
      },
      {
        id: "mathematics-data-collection-challenge-003",
        title: "Build the Data Table: Most and Least",
        scenario: "A frequency table for a transport survey shows: Bus = 12, Walk = 7, Bike = 4, Car = 9.",
        objective: "Find the difference between the most frequent and least frequent category.",
        answer: { mode: "numeric", target: 8, tolerance: 0 },
        explanation: "The most frequent category is Bus (12) and the least frequent is Bike (4). 12 − 4 = 8.",
        hints: [
          "Identify the highest frequency and the lowest frequency in the table.",
          "Subtract the lowest from the highest.",
        ],
      },
      {
        id: "mathematics-data-collection-challenge-004",
        title: "Build the Data Table: Choosing a Representation",
        scenario:
          "A teacher has collected each student's exact test score (a wide range of individual numbers, no repeats) and separately, each student's favorite subject (one of 4 fixed categories).",
        objective: "Decide which dataset a simple category frequency table suits best.",
        answer: {
          mode: "choice",
          options: [
            { id: "favorite-subject", label: "Favorite subject (4 fixed categories)" },
            { id: "test-scores", label: "Individual test scores (many unique numbers)" },
          ],
          correctOptionId: "favorite-subject",
        },
        explanation:
          "A frequency table works best when observations fall into a small number of repeating categories, like the 4 favorite-subject options. A long list of mostly unique individual scores doesn't group naturally into a short table the same way.",
        hints: [
          "A frequency table needs observations that repeat into a small set of categories.",
          "Which dataset has values that are more likely to repeat: fixed categories, or individual scores?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "statistics-foundations",
      label: "Statistics Foundations",
      href: "/dashboard/mathematics/statistics-foundations",
      reason: "Builds on the vocabulary of data, variables, and observations introduced there.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "central-tendency",
      label: "Central Tendency",
      href: "/dashboard/mathematics/central-tendency",
      reason: "Once data is organized into a frequency table, mean/median/mode can be calculated from it.",
    },
  ],
};
