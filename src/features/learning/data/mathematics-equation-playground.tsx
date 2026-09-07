import type { TopicContent } from "../types";

/**
 * Equation Playground, Mathematics Algebra topic 1. Reuses the
 * existing Equation Playground simulation
 * (`@/features/subjects/mathematics/equation-playground`) as-is — a
 * randomly generated "missing number" equation (+, −, ×, ÷, whole
 * numbers 1-20 only) with a single 0-20 slider that fills the box,
 * a Check button that compares the slider to the answer, and a New
 * Question button. It never solves anything for the student and
 * never reveals the answer directly — Check only ever reports
 * true/false, so every section below is written around trial,
 * comparison, and reasoning rather than a "read off the answer"
 * interaction.
 *
 * This is a distinct topic from Equation of a Straight Line
 * (`line-designer`) — see the correction note in
 * `@/features/learning-path/data/mathematics-foundations.ts` for why
 * those two were previously conflated. Equation Playground teaches
 * what an equation and equality mean at the arithmetic level (no
 * coordinate plane, no graphing); Equation of a Straight Line teaches
 * graphing y = mx + b. They're placed in different sections of the
 * Learning Path (Algebra vs. Coordinate Geometry) for exactly that
 * reason.
 *
 * `practice.quizId` points at a new, dedicated 30-question bank
 * (`@/features/quiz-engine/data/mathematics-equation-playground-quiz.ts`).
 * The Challenge section follows the same "use the simulation, then
 * answer numerically/by choice what you found" pattern as Slope of a
 * Line's Slope Target scenarios, since the simulation itself has no
 * `onVerify`-style hook to check a built structure — Check/New
 * Question are its only two actions.
 */
export const mathematicsEquationPlaygroundContent: TopicContent = {
  subjectSlug: "mathematics",
  topicSlug: "equation-playground",
  title: "Equation Playground",
  subjectLabel: "Mathematics",
  topicLabel: "Algebra",
  colorToken: "math",
  simulationHref: "/dashboard/mathematics/equation-playground",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what an equation is and what the equals sign really means.",
      "Identify the left side, right side, unknown, and constants in a simple equation.",
      "Explain what it means to \"solve\" an equation.",
      "Check a candidate value by substituting it back into the equation.",
    ],
    concepts: [
      {
        term: "What an equation is",
        explanation:
          "An equation is a mathematical sentence that says two expressions have the same value. It always has an equals sign in the middle, with one expression on the left and one on the right.",
        formula: "\\text{left side} = \\text{right side}",
        formulaCaption: "Both sides must have the same value for the equation to be true",
      },
      {
        term: "Equality",
        explanation:
          "The equals sign isn't an instruction to \"calculate an answer\" — it's a claim that both sides balance, like a scale that's level. An equation is only true for the values that keep both sides equal; for every other value, the scale tips and the statement is false.",
      },
      {
        term: "Left side and right side",
        explanation:
          "Everything written before the equals sign is the left side; everything after it is the right side. In the equation shown by the simulation, one side is always a complete number and the other contains the missing box alongside a known number.",
      },
      {
        term: "The unknown, and constants",
        explanation:
          "The box (or, in formal algebra, a letter like x) is the unknown — the specific value that has not been given yet. The other numbers in the equation, which never change, are called constants.",
        formula: "\\square + 3 = 7",
        formulaCaption: "Here, 3 and 7 are constants; the box is the unknown",
      },
      {
        term: "Expressions",
        explanation:
          "An expression is any combination of numbers and operations that has a value, but on its own makes no claim about equality — \"4 + 3\" is an expression. Put two expressions on either side of an equals sign and you get an equation.",
      },
      {
        term: "Solving an equation",
        explanation:
          "Solving means finding the exact value of the unknown that makes both sides equal. Once you substitute that value in for the box, the left side and the right side compute to the same number.",
      },
    ],
    whyItMatters:
      "Every time you figure out how many more items you need to reach a total, how much change you should get back, or how long a trip will take at a given speed, you're solving an equation with a missing value — you just may not write a box or an x. Getting comfortable with \"which number makes both sides equal\" before ever learning formal algebra steps is exactly what makes those later steps feel like common sense instead of a new, unrelated skill.",
    keyTerms: [
      { term: "Equation", definition: "A mathematical sentence stating that two expressions are equal, joined by an equals sign." },
      { term: "Equality", definition: "The state of both sides of an equation having the same value." },
      { term: "Unknown", definition: "The missing value in an equation (shown as a box here, or a letter like x in formal algebra)." },
      { term: "Constant", definition: "A fixed number in an equation that does not change." },
      { term: "Expression", definition: "A combination of numbers and operations with a value, but no equals sign — not yet a claim about equality." },
      { term: "Solve", definition: "To find the value of the unknown that makes both sides of an equation equal." },
    ],
    misconceptions: [
      {
        id: "misconception-equals-means-calculate",
        misconception: "The equals sign just means \"now write the answer,\" the way a calculator's \"=\" button does.",
        correction:
          "In an equation, the equals sign is a claim that two expressions already have the same value — it's not an instruction to produce a new number. \"5 + 2 = 3 + 4\" is a true equation with no \"answer\" to compute at all; both sides just happen to equal 7.",
      },
      {
        id: "misconception-any-number-works",
        misconception: "Any number can go in the box, and the equation will still make sense.",
        correction:
          "Almost every value you try will make the two sides unequal — only one specific value (or, in some equations, a small specific set of values) actually balances the scale. That's exactly why finding it is called \"solving,\" not \"picking.\"",
      },
      {
        id: "misconception-box-position-changes-meaning",
        misconception: "A missing box only counts as \"the unknown\" if it's on the left side of the equation.",
        correction:
          "The unknown can appear on either side — \"\\u25a1 + 3 = 7\" and \"7 = \\u25a1 + 3\" ask exactly the same question and have exactly the same answer. Which side it's written on is just a matter of how the equation happens to be written.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Before you touch the slider, predict the missing value from the equation shown — then check yourself in Equation Playground below.",
    scenarios: [
      {
        id: "mathematics-equation-playground-predict-001",
        scenario: "The simulation shows the equation \u25a1 + 5 = 9.",
        question: "What value makes this equation true?",
        options: [
          { id: "four", label: "4" },
          { id: "five", label: "5" },
          { id: "fourteen", label: "14" },
          { id: "nine", label: "9" },
        ],
        actualResultOptionId: "four",
        explanation: "4 + 5 = 9, so the missing value is 4 — that's the only number that keeps both sides equal.",
        hint: "What number, added to 5, gives 9?",
      },
      {
        id: "mathematics-equation-playground-predict-002",
        scenario: "The simulation shows the equation 12 \u2212 \u25a1 = 7.",
        question: "What value makes this equation true?",
        options: [
          { id: "five", label: "5" },
          { id: "nineteen", label: "19" },
          { id: "seven", label: "7" },
          { id: "twelve", label: "12" },
        ],
        actualResultOptionId: "five",
        explanation: "12 \u2212 5 = 7, so the missing value is 5. Subtracting a larger box would make the left side smaller than 7, and a smaller box would make it larger.",
        hint: "12 minus what number leaves 7?",
      },
      {
        id: "mathematics-equation-playground-predict-003",
        scenario: "The simulation shows the equation \u25a1 \u00d7 4 = 16.",
        question: "What value makes this equation true?",
        options: [
          { id: "four", label: "4" },
          { id: "twelve", label: "12" },
          { id: "sixteen", label: "16" },
          { id: "two", label: "2" },
        ],
        actualResultOptionId: "four",
        explanation: "4 \u00d7 4 = 16, so the missing value is 4.",
        hint: "What number, multiplied by 4, gives 16?",
      },
      {
        id: "mathematics-equation-playground-predict-004",
        scenario: "You already found that \u25a1 = 6 makes an equation true, and you slide the value up to 8 instead without changing anything else.",
        question: "What will happen when you press Check?",
        options: [
          { id: "incorrect", label: "It will report incorrect — 8 is too high" },
          { id: "correct", label: "It will still report correct" },
          { id: "nothing", label: "Nothing will happen until you refresh" },
          { id: "new-question", label: "It will automatically load a new question" },
        ],
        actualResultOptionId: "incorrect",
        explanation: "An equation is only true for its one correct value. Moving the slider away from 6 unbalances the two sides again, so Check reports incorrect — only 6 works for that particular equation.",
        hint: "Does an equation stay balanced for every value, or only one?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Read the equation, and notice which side has the empty box.",
      "Drag the slider to fill the box with a number from 0 to 20.",
      "Watch the equation update live as you slide — both sides are shown exactly as they'd compute with your current guess.",
      "Press Check to find out whether your value makes the equation true.",
      "Press New Question for a fresh randomly generated equation using +, \u2212, \u00d7, or \u00f7.",
    ],
    tryThis: [
      "Before sliding at all, predict the missing value from the equation just by reading it.",
      "Slide to a value you know is too low, press Check, then slide to one you know is too high, and press Check again — notice both report incorrect.",
      "Try an equation with \u00d7 or \u00f7 and compare how differently you have to think about it versus one with + or \u2212.",
      "Once you find the correct value, try nearby values (one more, one less) and confirm they're both marked incorrect.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "mathematics-equation-playground-explain-001",
        question: "Why does only one value on the slider make the equation true?",
        answer:
          "An equation is a precise claim that two specific expressions are equal. For a fixed set of constants and a single unknown, there's exactly one value that produces that exact balance — every other value produces two sides that compute to different numbers, which is exactly what \"incorrect\" means.",
      },
      {
        id: "mathematics-equation-playground-explain-002",
        question: "The simulation never tells you the answer directly — so what does pressing Check actually tell you?",
        answer:
          "Check only ever reports whether your current guess balances the equation, true or false. That's intentional: solving is about reasoning your way to the missing value, and a true/false check lets you test a guess and adjust, the same way you'd verify any solved equation by substituting your answer back in.",
      },
      {
        id: "mathematics-equation-playground-explain-003",
        question: "Why must whatever operation you use to \"undo\" one side also be applied consistently, to keep the equation balanced?",
        answer:
          "Think of the equals sign as a level scale: both sides start equal. If you change the value on one side without doing the same to the other, the scale tips and the two sides are no longer equal. That's why, in formal algebra, any operation performed on one side of an equation must also be performed on the other — it's the only way to guarantee the equality stays true.",
      },
      {
        id: "mathematics-equation-playground-explain-004",
        question: "Why does \u25a1 \u00d7 4 = 16 need a different guess-and-check strategy than \u25a1 + 5 = 9?",
        answer:
          "Addition and multiplication change a number in very different ways, so \"undoing\" them looks different. For \u25a1 + 5 = 9, you're looking for a number that, added to 5, reaches 9. For \u25a1 \u00d7 4 = 16, you're looking for a number that, multiplied by 4, reaches 16 — a much larger jump per step of the slider. Recognizing the operation tells you what kind of number to expect and how sensitive the equation is to small changes in your guess.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "mathematics-equation-playground",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Balance It
  // -------------------------------------------------------------
  challenge: {
    intro: "Use Equation Playground above — press New Question until you get an equation like the one described, then reason out the missing value before checking.",
    scenarios: [
      {
        id: "mathematics-equation-playground-challenge-001",
        title: "Balance It: Addition",
        scenario: "The simulation shows \u25a1 + 8 = 15.",
        objective: "The equation is balanced. A number is hidden. Determine the missing value and explain why.",
        tools: [{ id: "slider", label: "0-20 value slider that fills the box live" }],
        answer: { mode: "numeric", target: 7, tolerance: 0 },
        explanation: "7 + 8 = 15, so the missing value is 7 — it's the only number that keeps both sides equal.",
        hints: [
          "What number, added to 8, gives 15?",
          "15 \u2212 8 = 7.",
        ],
      },
      {
        id: "mathematics-equation-playground-challenge-002",
        title: "Balance It: Subtraction, box first",
        scenario: "The simulation shows \u25a1 \u2212 6 = 9.",
        objective: "Find the missing value that keeps both sides equal.",
        tools: [{ id: "slider", label: "0-20 value slider that fills the box live" }],
        answer: { mode: "numeric", target: 15, tolerance: 0 },
        explanation: "15 \u2212 6 = 9, so the missing value is 15. Since the box is being reduced by 6 to reach 9, it must start 6 higher than 9.",
        hints: [
          "The box minus 6 equals 9 — what has to be added back to 9 to undo that subtraction?",
          "9 + 6 = 15.",
        ],
      },
      {
        id: "mathematics-equation-playground-challenge-003",
        title: "Balance It: Multiplication",
        scenario: "The simulation shows 3 \u00d7 \u25a1 = 18.",
        objective: "Find the missing value that keeps both sides equal.",
        tools: [{ id: "slider", label: "0-20 value slider that fills the box live" }],
        answer: { mode: "numeric", target: 6, tolerance: 0 },
        explanation: "3 \u00d7 6 = 18, so the missing value is 6.",
        hints: [
          "What number, multiplied by 3, gives 18?",
          "18 \u00f7 3 = 6.",
        ],
      },
      {
        id: "mathematics-equation-playground-challenge-004",
        title: "Balance It: Division",
        scenario: "The simulation shows 20 \u00f7 \u25a1 = 4.",
        objective: "Find the missing value that keeps both sides equal.",
        tools: [{ id: "slider", label: "0-20 value slider that fills the box live" }],
        answer: { mode: "numeric", target: 5, tolerance: 0 },
        explanation: "20 \u00f7 5 = 4, so the missing value is 5.",
        hints: [
          "20 divided by what number gives 4?",
          "Try multiplying 4 by small numbers until you reach 20.",
        ],
      },
      {
        id: "mathematics-equation-playground-challenge-005",
        title: "Two-Step Reasoning",
        scenario: "You find an equation where the box, plus 4, then compared to 12, turns out to need the box to equal 8 — but you only ever get to test one value at a time with Check.",
        objective: "Which strategy finds the correct value in the fewest guesses: starting at 0 and counting up by 1 each time, or estimating first and adjusting based on whether the result was too high or too low?",
        answer: {
          mode: "choice",
          options: [
            { id: "estimate", label: "Estimate first, then adjust up or down based on the result" },
            { id: "count-up", label: "Always start at 0 and count up by 1" },
            { id: "same", label: "Both strategies take exactly the same number of guesses" },
            { id: "random", label: "Guessing randomly is just as fast" },
          ],
          correctOptionId: "estimate",
        },
        explanation: "Estimating first and then adjusting toward \"too high\" or \"too low\" narrows in on the answer far faster than counting up one at a time from zero — this is the same reasoning strategy used to solve equations formally, just done with slider guesses instead of algebra steps.",
        hints: [
          "Which approach uses the feedback from a wrong guess to inform the next guess?",
        ],
      },
      {
        id: "mathematics-equation-playground-challenge-006",
        title: "Checking Your Own Work",
        scenario: "You believe the missing value in \u25a1 \u00d7 5 = 20 is 4, but you haven't pressed Check yet.",
        objective: "How could you confirm your answer is correct without pressing Check at all?",
        answer: {
          mode: "choice",
          options: [
            { id: "substitute", label: "Substitute 4 back into the equation and compute both sides by hand" },
            { id: "guess-again", label: "There's no way to check without pressing Check" },
            { id: "bigger-number", label: "Try a bigger number instead, since bigger is usually safer" },
            { id: "trust-slider", label: "Trust whichever number the slider happens to be on" },
          ],
          correctOptionId: "substitute",
        },
        explanation: "Substituting your candidate value back into the original equation and computing both sides by hand is exactly what \"checking a solution\" means — 4 \u00d7 5 = 20, which matches the right side, confirming the answer independently of the simulation's Check button.",
        hints: [
          "What does it mean to \"check\" a solved equation in general, not just in this simulation?",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "mathematics",
      topicSlug: "line-designer",
      label: "Equation of a Straight Line",
      href: "/dashboard/mathematics/line-designer",
      reason: "See a very different kind of equation — one with two unknowns, x and y — graphed as a line.",
    },
    {
      subjectSlug: "mathematics",
      topicSlug: "cross-multiplication-explorer",
      label: "Cross Multiplication",
      href: "/dashboard/mathematics/cross-multiplication-explorer",
      reason: "Practice another kind of \"find the missing value\" equation, this time built from equal ratios.",
    },
  ],
};
