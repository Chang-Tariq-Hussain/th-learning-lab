import type { TopicContent } from "../types";

/**
 * Real-Life Ratios, Mathematics Batch 2 topic 5 of 7. Reuses the
 * existing Real-Life Ratios simulation
 * (`@/features/subjects/mathematics/real-life-ratios`) — illustrated
 * word-problem scenarios (recipes, paint mixing, marbles, maps, trees)
 * with a stepper for the student's answer. `learn`/`explore` content
 * is adapted from the simulation page's `SimulationLearnMore` block.
 * `practice.quizId` points at the 30-question bank in
 * `@/features/quiz-engine/data/mathematics-real-life-ratios-quiz.ts`.
 */
export const mathematicsRealLifeRatiosContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "real-life-ratios",
  title: "Real-Life Ratios",
  subjectLabel: "Mathematics",
  topicLabel: "Ratio & Proportion",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/real-life-ratios",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Translate a real-world scenario into a ratio.",
      "Scale a ratio up or down to solve a practical problem.",
      "Recognize ratios hiding in everyday situations like recipes, mixtures, and groups.",
      "Check whether a proposed quantity keeps a given ratio the same.",
    ],
    concepts: [
      {
        term: "Spotting the ratio",
        explanation:
          "Real-world ratio problems rarely say the word \"ratio\" outright. Phrases like \"for every,\" \"per,\" or \"mixed with\" are usually signals that two quantities are being compared.",
      },
      {
        term: "Scaling a real-world ratio",
        explanation:
          "Once you know the ratio, scaling it up or down means multiplying both quantities by the same factor — if a paint mix uses 1 part blue to 3 parts white, doubling the batch means 2 parts blue to 6 parts white.",
      },
      {
        term: "Keeping the ratio the same",
        explanation:
          "A mixture, recipe, or group only keeps its intended proportions if every quantity scales by the identical factor. Changing just one quantity without adjusting the others breaks the ratio.",
      },
    ],
    whyItMatters:
      "This is exactly the kind of ratio reasoning you use scaling a recipe for a dinner party, mixing cleaning solution to the right strength, or figuring out how much fertilizer a garden needs based on its size. Ratios in the real world are almost always dressed up in a story first — learning to spot them quickly is what actually makes the math useful.",
    keyTerms: [
      { term: "Scale factor", definition: "The multiplier applied to every quantity in a ratio to keep it the same at a new size." },
      { term: "Word problem", definition: "A ratio question phrased as a real-world story rather than bare numbers." },
    ],
    misconceptions: [
      {
        id: "misconception-part-to-part-vs-part-to-whole-real-life",
        misconception: "Any two numbers mentioned in a word problem form a part-to-part ratio.",
        correction:
          "If one of the numbers is a total (like \"5 total marbles\"), the ratio being described is part-to-whole, not part-to-part. Reading carefully for whether a number is a category or the overall total changes which kind of ratio is being asked for.",
      },
      {
        id: "misconception-partial-scaling-real-life",
        misconception: "You can scale up a recipe or mixture by changing just the main ingredient.",
        correction:
          "Every quantity in the ratio has to scale by the same factor, or the mixture's proportions — and often its taste, strength, or safety — change. Changing only one ingredient breaks the relationship the recipe depends on.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict before you calculate — then check yourself in the Real-Life Ratios simulation below.",
    scenarios: [
      {
        id: "mathematics-real-life-ratios-predict-001",
        scenario: "A recipe uses 2 cups flour for every 1 cup sugar. You want to use 8 cups flour.",
        question: "How much sugar do you need to keep the same ratio?",
        options: [
          { id: "4", label: "4 cups" },
          { id: "2", label: "2 cups" },
          { id: "8", label: "8 cups" },
          { id: "6", label: "6 cups" },
        ],
        actualResultOptionId: "4",
        explanation: "8 cups flour is 4 times the original 2, so scale sugar by the same factor: 1 × 4 = 4 cups.",
        hint: "How many times bigger is 8 than 2?",
      },
      {
        id: "mathematics-real-life-ratios-predict-002",
        scenario: "A group keeps a ratio of 1 adult to 6 children. There are 5 adults supervising.",
        question: "How many children can they supervise, keeping the ratio?",
        options: [
          { id: "30", label: "30" },
          { id: "11", label: "11" },
          { id: "6", label: "6" },
          { id: "25", label: "25" },
        ],
        actualResultOptionId: "30",
        explanation: "5 adults is 5 times the original 1, so scale children by the same factor: 6 × 5 = 30.",
        hint: "Multiply 6 by the number of adults.",
      },
      {
        id: "mathematics-real-life-ratios-predict-003",
        scenario: "A map scale says 1 inch represents 20 real miles. A road measures 3.5 inches on the map.",
        question: "How many real miles is the road?",
        options: [
          { id: "70", label: "70 miles" },
          { id: "60", label: "60 miles" },
          { id: "23.5", label: "23.5 miles" },
          { id: "35", label: "35 miles" },
        ],
        actualResultOptionId: "70",
        explanation: "3.5 inches is 3.5 times the base scale of 1 inch, so scale miles by the same factor: 20 × 3.5 = 70 miles.",
        hint: "Multiply the scale (20 miles per inch) by the number of inches.",
      },
      {
        id: "mathematics-real-life-ratios-predict-004",
        scenario: "A jar has red and blue marbles in a ratio of 2 : 3. There are 30 marbles total.",
        question: "How many red marbles are there?",
        options: [
          { id: "12", label: "12" },
          { id: "18", label: "18" },
          { id: "15", label: "15" },
          { id: "10", label: "10" },
        ],
        actualResultOptionId: "12",
        explanation: "2:3 splits the total into 5 equal parts (2+3). Each part is 30 ÷ 5 = 6, so red = 2 parts = 12.",
        hint: "Add the parts of the ratio together to find how many equal groups the total splits into.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Read the scenario carefully and identify the two quantities being compared.",
      "Figure out the ratio those quantities represent.",
      "Solve for how many of each item are needed to keep that same ratio at a new scale.",
      "Submit your answer and move on to the next illustrated scenario.",
    ],
    tryThis: [
      "Before solving, write down in your own words what ratio the scenario is describing.",
      "After solving, double-check that your answer keeps the exact same ratio as the original scenario.",
      "Try to think of one more real-life situation, outside this simulation, that hides a ratio.",
      "Notice whether a scenario is asking for a part-to-part answer or a part-to-whole answer before you solve it.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-real-life-ratios-explain-001",
        question: "Why do word problems rarely use the word \"ratio\" directly, and how do you find one anyway?",
        answer:
          "Real situations describe relationships in natural language — \"for every,\" \"per,\" \"mixed with\" — rather than formal ratio notation. Learning to translate those phrases into a:b form is the actual skill being practiced, not just doing arithmetic once the ratio is already given.",
      },
      {
        id: "mathematics-real-life-ratios-explain-002",
        question: "Why does scaling a recipe or mixture require multiplying every ingredient by the same number?",
        answer:
          "A recipe's ratio is what makes it taste, mix, or work correctly. Multiplying every quantity by the identical scale factor keeps that underlying relationship intact — changing only one ingredient would throw off the balance the recipe depends on.",
      },
      {
        id: "mathematics-real-life-ratios-explain-003",
        question: "Why does it matter whether a real-life ratio is part-to-part or part-to-whole?",
        answer:
          "The two describe different relationships and lead to different calculations — part-to-part compares two categories directly, while part-to-whole compares one category to an already-known total. Misreading which one a problem is asking for leads to setting up the wrong equation.",
      },
      {
        id: "mathematics-real-life-ratios-explain-004",
        question: "Why is checking your final answer against the original ratio a useful habit?",
        answer:
          "Simplifying your final quantities and comparing them to the original ratio's simplest form is a quick way to catch a scaling mistake — if they don't match, something went wrong in the calculation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-real-life-ratios",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Real-Life Ratio Mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Each of these missions drops you into a practical scenario — use the Real-Life Ratios simulation above where it helps you check your reasoning. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "mathematics-real-life-ratios-challenge-001",
        title: "Real-Life Ratio Mission: Recipe Rescue",
        scenario: "A recipe for 6 people uses 3 cups of rice and 2 cups of beans. A friend needs to cook for 15 people, keeping the same ratio.",
        objective: "Find how many cups of rice are needed for 15 people.",
        constraints: [{ id: "c1", label: "The ratio of rice to servings must stay the same." }],
        answer: { mode: "numeric", unit: "cups", target: 7.5, tolerance: 0.1 },
        explanation: "15 people is 2.5 times the original 6, so scale rice by the same factor: 3 × 2.5 = 7.5 cups.",
        hints: [
          "Find the scale factor from 6 people to 15 people.",
          "Apply that same scale factor to the 3 cups of rice.",
        ],
      },
      {
        id: "mathematics-real-life-ratios-challenge-002",
        title: "Real-Life Ratio Mission: Map Reading",
        scenario: "A map has a scale of 1.5 cm representing 30 real km. A hiking trail measures 6 cm on the map.",
        objective: "Find the real-world length of the trail.",
        answer: { mode: "numeric", unit: "km", target: 120, tolerance: 1 },
        explanation: "6 cm is 4 times the base scale's 1.5 cm, so scale km by the same factor: 30 × 4 = 120 km.",
        hints: [
          "Find the scale factor from 1.5 cm to 6 cm.",
          "Apply that scale factor to 30 km.",
        ],
      },
      {
        id: "mathematics-real-life-ratios-challenge-003",
        title: "Real-Life Ratio Mission: Paint Mixing",
        scenario: "A custom paint color mixes red and yellow in a ratio of 5 : 3. A painter needs 40 liters of the final color total.",
        objective: "Find how many liters of red paint are needed.",
        constraints: [{ id: "c1", label: "Red and yellow together must total exactly 40 liters." }],
        answer: { mode: "numeric", unit: "liters", target: 25, tolerance: 0.5 },
        explanation: "5:3 splits the 40 liters into 8 equal parts (5+3). Each part is 40 ÷ 8 = 5 liters, so red = 5 parts = 25 liters.",
        hints: [
          "Add the two parts of the ratio to find how many equal parts the total splits into.",
          "Multiply the size of one part by the red portion of the ratio.",
        ],
      },
      {
        id: "mathematics-real-life-ratios-challenge-004",
        title: "Real-Life Ratio Mission: Classroom Groups",
        scenario: "A school wants to maintain a 1 teacher to 18 student ratio across all classrooms. They currently have 7 teachers.",
        objective: "Find the maximum number of students the school can enroll while keeping the ratio.",
        answer: { mode: "numeric", unit: "students", target: 126, tolerance: 0 },
        explanation: "7 teachers is 7 times the base ratio's 1, so scale students by the same factor: 18 × 7 = 126.",
        hints: [
          "Multiply the ratio's student count by the number of teachers.",
          "18 students per teacher, times 7 teachers.",
        ],
      },
    ],
  },

  relatedTopics: [],
};
