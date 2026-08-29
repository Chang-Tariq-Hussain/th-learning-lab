import type { TopicContent } from "../types";

/**
 * Graphs & Data Visualization, Mathematics Batch 4 topic 5 of 6
 * (Statistics & Data). New simulation
 * (`@/features/subjects/mathematics/graph-builder`, "Graph Builder"):
 * three editable datasets (ice cream sales, weekly rainfall, a class
 * pet vote) viewed through Bar Graph, Pie Chart, or Line Graph —
 * Line Graph is only offered for the sequential rainfall-by-day
 * dataset, since a line implies a trend across an order that
 * unordered categories (flavors, pets) don't have.
 *
 * Sits after Data Collection & Representation and before Data
 * Interpretation & Comparison in the Learning Path: that topic
 * teaches organizing raw data into a table, this one teaches turning
 * that table into the right graph, and Data Interpretation then
 * reads/compares finished graphs. `practice.quizId` points at a new,
 * dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-graph-builder-quiz.ts`).
 */
export const mathematicsGraphBuilderContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "graph-builder",
  title: "Graphs & Data Visualization",
  subjectLabel: "Mathematics",
  topicLabel: "Statistics",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/graph-builder",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Read values, totals, highs, and lows from a bar graph, pie chart, or line graph.",
      "Explain what each of the three chart types is best suited to showing.",
      "Recognize when a line graph is appropriate and when it isn't.",
      "Trace the path from raw data to table to graph.",
    ],
    concepts: [
      {
        term: "Bar graph",
        explanation:
          "Uses bar height to compare frequencies or amounts across separate categories. Works well for almost any categorical dataset, which is why it's usually the safest default choice.",
      },
      {
        term: "Pie chart",
        explanation:
          "Shows each category as a slice of a whole circle, sized by its share of the total. Best when the message is \"what fraction or percentage of the whole does each category make up,\" and gets hard to read with too many slices.",
      },
      {
        term: "Line graph",
        explanation:
          "Connects data points with a line to show a trend across an ordered sequence, usually time (days, months, years). Only makes sense when the categories have a natural order — connecting unordered categories like fruit flavors with a line would be misleading.",
      },
      {
        term: "Choosing a representation",
        explanation:
          "The right chart depends on the question being asked: comparing amounts side by side favors a bar graph, showing proportions of a whole favors a pie chart, and showing change over an ordered sequence favors a line graph.",
      },
    ],
    whyItMatters:
      "Every news article, business report, or scientific paper that includes a chart made a deliberate choice about which chart type to use — and that choice shapes how easy (or misleading) the data is to read. Knowing why a line graph shows a trend but a pie chart shows proportions helps you both build clearer charts yourself and spot when someone else's chart choice doesn't quite fit their data.",
    keyTerms: [
      { term: "Category", definition: "One labeled group a data value belongs to, e.g. a flavor, a day, or a candidate." },
      { term: "Trend", definition: "The general direction a sequence of values moves over an ordered axis, usually time." },
      { term: "Whole", definition: "The total that a pie chart's slices all add up to — 100% of the dataset." },
    ],
    misconceptions: [
      {
        id: "misconception-any-chart-fits-any-data",
        misconception: "Any chart type can be used for any dataset, so the choice is just about looks.",
        correction:
          "A line graph specifically implies an ordered trend — using one on unordered categories (like favorite fruit flavors) suggests a connection or progression between them that doesn't actually exist. The right chart type depends on what kind of question the data is answering.",
      },
      {
        id: "misconception-bigger-slice-means-bigger-number-always",
        misconception: "In a pie chart, you can tell exact values just by comparing slice sizes by eye.",
        correction:
          "Pie charts are good for a rough sense of proportion, but comparing two similarly sized slices by eye alone is unreliable — reading the labeled value or percentage next to each slice is the accurate way to compare them.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you build the graph — then check yourself in the Graph Builder below.",
    scenarios: [
      {
        id: "mathematics-graph-builder-predict-001",
        scenario: "A dataset tracks daily temperature over one week — an ordered sequence of 7 values.",
        question: "Which chart type best shows how the temperature changed day by day?",
        options: [
          { id: "line", label: "Line graph" },
          { id: "pie", label: "Pie chart" },
          { id: "none", label: "None of these work for this data" },
          { id: "either", label: "Bar graph and pie chart work equally well" },
        ],
        actualResultOptionId: "line",
        explanation: "A line graph is designed exactly for this: showing how a value changes across an ordered sequence like days of the week.",
        hint: "Which chart type connects points to show a trend over an order?",
      },
      {
        id: "mathematics-graph-builder-predict-002",
        scenario: "A pie chart shows 4 slices: 50%, 25%, 15%, and 10%.",
        question: "What must be true about these four percentages?",
        options: [
          { id: "sum-100", label: "They add up to 100%" },
          { id: "equal-parts", label: "They must all be equal" },
          { id: "sum-anything", label: "They can add up to any total" },
          { id: "sum-50", label: "They add up to 50%" },
        ],
        actualResultOptionId: "sum-100",
        explanation: "A pie chart's slices represent parts of one whole dataset, so their percentages must always add up to 100%.",
        hint: "What does a pie chart's full circle represent?",
      },
      {
        id: "mathematics-graph-builder-predict-003",
        scenario: "A dataset lists votes for 3 unrelated snack options: chips, pretzels, popcorn.",
        question: "Would a line graph be a good choice for this data?",
        options: [
          { id: "no", label: "No — the categories have no natural order" },
          { id: "yes", label: "Yes — line graphs work for any dataset" },
          { id: "only-if-3", label: "Yes, but only because there are exactly 3 categories" },
          { id: "unsure", label: "It depends only on the vote counts" },
        ],
        actualResultOptionId: "no",
        explanation: "Chips, pretzels, and popcorn have no natural left-to-right order, so connecting them with a line would imply a trend that doesn't exist. A bar graph or pie chart fits this data better.",
        hint: "Does a line graph need the categories to have a natural order?",
      },
      {
        id: "mathematics-graph-builder-predict-004",
        scenario: "In a Graph Builder dataset, \"Chocolate\" is edited from 24 to 30, while every other value stays the same.",
        question: "What happens to Chocolate's pie chart slice?",
        options: [
          { id: "grows", label: "It grows, since its share of the total increased" },
          { id: "shrinks", label: "It shrinks" },
          { id: "no-change", label: "It stays exactly the same size" },
          { id: "disappears", label: "It disappears from the chart" },
        ],
        actualResultOptionId: "grows",
        explanation: "Increasing Chocolate's value while other values stay fixed increases both its value and its share of the new total, so its pie slice grows.",
        hint: "A pie slice's size depends on its share of the total — what happens to that share when the value goes up?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Pick a dataset — Ice Cream Sales, Weekly Rainfall, or Class Pet Votes.",
      "Use the +/- controls to edit any category's value.",
      "Switch between the available chart types to see the same data represented differently.",
      "Notice that Line Graph is only offered for Weekly Rainfall, since its days have a natural order.",
    ],
    tryThis: [
      "Set one category's value to 0 and see how each chart type shows it.",
      "Make two categories equal and see how that looks in the bar graph versus the pie chart.",
      "On the rainfall dataset, compare the Bar Graph and Line Graph views of the exact same data.",
      "Try to predict a pie chart's rough slice sizes before switching to that view.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-graph-builder-explain-001",
        question: "Why is a line graph only appropriate for sequential/ordered data?",
        answer:
          "A line graph's connecting lines visually imply a trend or path from one point to the next. That only means something meaningful when the categories have a real order, like days of the week — connecting unrelated categories would suggest a progression that doesn't exist.",
      },
      {
        id: "mathematics-graph-builder-explain-002",
        question: "Why must a pie chart's slices always add up to 100%?",
        answer:
          "A pie chart represents one whole dataset as a full circle, and every slice is that category's share of the whole. Since every observation belongs to exactly one category, the shares are guaranteed to add up to the entire circle, or 100%.",
      },
      {
        id: "mathematics-graph-builder-explain-003",
        question: "Why is a bar graph often described as the \"safest default\" chart choice?",
        answer:
          "Bar graphs compare category heights directly and work for almost any categorical dataset, ordered or not, without implying a trend (like a line graph) or requiring the values to represent a whole (like a pie chart) — which is why they fit the widest range of situations.",
      },
      {
        id: "mathematics-graph-builder-explain-004",
        question: "Why do the bar, pie, and line views in Graph Builder all change together when a value is edited?",
        answer:
          "All three chart types are rendered from the exact same underlying dataset — editing a value changes that shared data, and every chart view reads from it, so all the visible representations update together rather than needing to be edited separately.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-graph-builder",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Chart Detective
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each mission gives you a chart to read closely — use the Graph Builder above to help you check your reasoning. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-graph-builder-challenge-001",
        title: "Chart Detective: Highest Value",
        scenario: "A bar graph of weekly ticket sales shows: Mon = 12, Tue = 18, Wed = 9, Thu = 22, Fri = 15.",
        objective: "Find which day had the highest ticket sales.",
        answer: {
          mode: "choice",
          options: [
            { id: "mon", label: "Monday" },
            { id: "tue", label: "Tuesday" },
            { id: "wed", label: "Wednesday" },
            { id: "thu", label: "Thursday" },
          ],
          correctOptionId: "thu",
        },
        explanation: "Thursday's bar is tallest at 22, higher than every other day.",
        hints: [
          "Compare each day's bar height (its value).",
          "Look for the single largest number among the five days.",
        ],
      },
      {
        id: "mathematics-graph-builder-challenge-002",
        title: "Chart Detective: Reading a Pie Chart",
        scenario: "A pie chart of a survey's 200 total responses shows one slice labeled 25%.",
        objective: "Find how many of the 200 responses that slice represents.",
        answer: { mode: "numeric", target: 50, tolerance: 0 },
        explanation: "25% of 200 is 0.25 × 200 = 50 responses.",
        hints: [
          "Convert the percentage to a decimal (25% = 0.25).",
          "Multiply that decimal by the total number of responses.",
        ],
      },
      {
        id: "mathematics-graph-builder-challenge-003",
        title: "Chart Detective: Finding the Difference",
        scenario: "A bar graph of fruit sales shows: Apples = 34, Oranges = 21.",
        objective: "Find how many more apples were sold than oranges.",
        answer: { mode: "numeric", target: 13, tolerance: 0 },
        explanation: "34 − 21 = 13 more apples sold than oranges.",
        hints: [
          "Subtract the smaller bar's value from the larger bar's value.",
        ],
      },
      {
        id: "mathematics-graph-builder-challenge-004",
        title: "Chart Detective: Choosing the Right Chart",
        scenario:
          "A scientist wants to show how a plant's height changed, measured once a week for 8 weeks in a row.",
        objective: "Choose the chart type that best represents this data.",
        answer: {
          mode: "choice",
          options: [
            { id: "line", label: "Line graph" },
            { id: "pie", label: "Pie chart" },
            { id: "bar-only", label: "Bar graph only, never a line graph" },
          ],
          correctOptionId: "line",
        },
        explanation:
          "Weekly measurements over 8 ordered weeks are a clear case for a line graph, since the goal is to show the trend (growth) over an ordered sequence.",
        hints: [
          "Is this dataset ordered/sequential, or made of unrelated categories?",
          "Which chart type is specifically built to show a trend across an order?",
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
      reason: "Builds the frequency tables that this topic's graphs are drawn from.",
    },
  ],
};
