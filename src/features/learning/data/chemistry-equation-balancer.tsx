import type { TopicContent } from "../types";

/**
 * Equation Balancer — Chemistry Batch 3's second GLE topic. This is
 * the practical, primarily-2D counterpart to Reaction Builder: where
 * that topic shows *why* atoms stay conserved (bonds visibly breaking
 * and re-forming), this topic drills the everyday skill of actually
 * balancing an equation by adjusting coefficients, with a live atom
 * count table that keeps the "conservation of atoms" idea directly
 * in view. New simulation for this batch
 * (`@/features/subjects/chemistry/equation-balancer`) — see that
 * feature's own doc comments for why it was needed (no existing
 * equation-balancing UI in the app) and how it reuses only elements
 * already introduced in Batches 1–3 (H, O, Na, Cl, Mg, N).
 */
export const chemistryEquationBalancerContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "equation-balancer",
  title: "Equation Balancing",
  subjectLabel: "Chemistry",
  topicLabel: "Equation Balancer",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/equation-balancer",

  learn: {
    objectives: [
      "Balance a chemical equation by adjusting coefficients, never subscripts.",
      "Count total atoms of an element across every term on one side of an equation.",
      "Recognize when an equation is balanced by comparing atom totals, element by element.",
      "Use hints and a systematic strategy to balance an unfamiliar equation.",
    ],
    concepts: [
      {
        term: "What balancing actually means",
        explanation:
          "An equation is balanced when the total number of atoms of every element is the same on the reactant side and the product side. Balancing isn't about making the equation look neat — it's making the equation honestly reflect that no atoms were created or destroyed.",
      },
      {
        term: "Coefficients, not subscripts",
        explanation:
          "The only number you're ever allowed to change while balancing is the coefficient in front of a formula — how many whole molecules of that substance you have. The subscripts inside a formula define what the substance is and are fixed; changing one turns the substance into something chemically different.",
      },
      {
        term: "Counting atoms across a coefficient",
        explanation:
          "A coefficient multiplies every atom in that formula. 3H₂O means 3 water molecules, each with 2 hydrogen atoms and 1 oxygen atom — so it contributes 3 × 2 = 6 hydrogen atoms and 3 × 1 = 3 oxygen atoms to that side's total.",
      },
      {
        term: "A balancing strategy",
        explanation:
          "A reliable approach: pick the element that appears in the fewest formulas first, find a coefficient pair that matches its totals, then move to the next-most-constrained element. Elements that appear in many formulas (like hydrogen, often) are usually easiest to leave for last, since earlier choices narrow them down automatically.",
      },
    ],
    whyItMatters:
      "Balanced equations are how chemists calculate real quantities — exactly how many grams of one reactant you need to fully react with another, with nothing wasted and nothing left over. That calculation, called stoichiometry, only works because the balanced equation correctly tracks every atom. Get the balancing wrong, and every quantity calculated from it downstream is wrong too — whether it's dosing a medicine or fueling a rocket.",
    keyTerms: [
      { term: "Balanced equation", definition: "A chemical equation where the total atom count for every element matches on both sides." },
      { term: "Coefficient", definition: "The number in front of a formula, showing how many molecules of that substance are present. The only number balancing ever changes." },
      { term: "Subscript", definition: "The small number inside a formula, showing how many atoms of an element are in one molecule. Fixed — never changed while balancing." },
      { term: "Decomposition reaction", definition: "A reaction where one reactant breaks apart into two or more products — still governed by the same balancing rule." },
    ],
    misconceptions: [
      {
        id: "misconception-edit-subscript",
        misconception: "If an equation won't balance, you can adjust a subscript to make the numbers work out.",
        correction:
          "Subscripts are off-limits, always. Changing H₂O's subscript to \"fix\" a balance turns it into a different substance (like H₂O₂), which isn't what the reaction actually produces. If an equation won't balance with coefficients alone, the fix is to keep adjusting coefficients more carefully — not to touch the formulas.",
      },
      {
        id: "misconception-any-match-works",
        misconception: "As long as one element balances, the whole equation is balanced.",
        correction:
          "Every element used in the equation has to balance independently — matching hydrogen doesn't guarantee oxygen matches too. The Equation Balancer's atom-count table checks each element separately for exactly this reason: a real balanced equation needs every row to show a match, not just one.",
      },
      {
        id: "misconception-only-one-answer",
        misconception: "There's only one possible set of correct coefficients for any equation.",
        correction:
          "Any whole-number multiple of a balanced set of coefficients is also technically balanced — 4H₂ + 2O₂ → 4H₂O has the same atom-matching property as 2H₂ + O₂ → 2H₂O. Chemists conventionally use the smallest whole-number coefficients, but the underlying atom-conservation check (which this feature verifies) is satisfied by any consistent multiple.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before adjusting the coefficients below — then try it and check your answer.",
    scenarios: [
      {
        id: "chemistry-equation-balancer-predict-001",
        scenario:
          "H₂ + Cl₂ → HCl is shown with every coefficient starting at 1. H₂ and Cl₂ each contribute 2 atoms; HCl contributes 1 hydrogen and 1 chlorine per molecule.",
        question: "With every coefficient at 1, is this equation already balanced?",
        options: [
          { id: "not-balanced", label: "No — there are 2 H and 2 Cl on the left, but only 1 H and 1 Cl on the right" },
          { id: "balanced", label: "Yes — one molecule of each substance means it's already balanced" },
        ],
        actualResultOptionId: "not-balanced",
        explanation:
          "At coefficient 1 for everything, the left side has 2 hydrogen atoms (from H₂) and 2 chlorine atoms (from Cl₂), but the right side has only 1 of each (from a single HCl). The totals don't match, so it isn't balanced yet — HCl's coefficient needs to become 2.",
        hint: "Count the atoms contributed by each formula separately, using its subscript, before comparing totals.",
      },
      {
        id: "chemistry-equation-balancer-predict-002",
        scenario:
          "For N₂ + H₂ → NH₃, nitrogen's coefficient is set to 1 (matching N₂'s 2 nitrogen atoms with NH₃'s coefficient of 2).",
        question: "Once NH₃'s coefficient is set to 2 to balance nitrogen, how many hydrogen atoms does that put on the product side?",
        options: [
          { id: "six", label: "6 — 2 molecules of NH₃, each with 3 hydrogen atoms" },
          { id: "three", label: "3 — matching NH₃'s subscript directly" },
          { id: "two", label: "2 — matching the coefficient itself" },
        ],
        actualResultOptionId: "six",
        explanation:
          "2NH₃ means 2 molecules, each contributing 3 hydrogen atoms (from the subscript): 2 × 3 = 6 total hydrogen atoms on the product side. That 6 is exactly what H₂'s coefficient then has to supply — 3H₂, since each H₂ molecule brings 2 hydrogen atoms (3 × 2 = 6).",
        hint: "Multiply the coefficient by the subscript for that element to get the total atoms it contributes.",
      },
      {
        id: "chemistry-equation-balancer-predict-003",
        scenario:
          "The decomposition equation H₂O₂ → H₂O + O₂ is shown with every coefficient at 1.",
        question: "Is oxygen balanced with every coefficient at 1?",
        options: [
          { id: "not-balanced", label: "No — H₂O₂ has 2 oxygen atoms, but H₂O + O₂ together have 3" },
          { id: "balanced", label: "Yes — both sides have oxygen, so it balances" },
        ],
        actualResultOptionId: "not-balanced",
        explanation:
          "H₂O₂ contributes 2 oxygen atoms on the left. On the right, H₂O contributes 1 and O₂ contributes 2, for a total of 3 — more than the left side has. The coefficients need adjusting (doubling H₂O₂ and H₂O) before oxygen actually balances.",
        hint: "Add up the oxygen contributions from every term on the product side separately before comparing to the reactant side.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick an equation from the tabs at the top.",
      "Use the − / + steppers under each formula to change its coefficient.",
      "Watch the atom-count table below update live — it shows every element's total on both sides.",
      "Keep adjusting until every row in the table shows a checkmark and the status banner says \"Balanced!\"",
      "Use \"Next Equation\" to move on, or \"Reset\" to start the current one over.",
    ],
    tryThis: [
      "Try balancing Water (H₂ + O₂ → H₂O) without looking at a hint first — start with the element in fewer formulas.",
      "For Ammonia (N₂ + H₂ → NH₃), notice which element needs the largest coefficient, and why.",
      "Try the Peroxide Breakdown equation — it only has one reactant, unlike the others. Does the same balancing approach still work?",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-equation-balancer-explain-001",
        question: "Why does the atom-count table check every element separately instead of one combined total?",
        answer:
          "Atoms of different elements aren't interchangeable — 2 extra hydrogen atoms can't make up for 1 missing oxygen atom. Conservation of atoms has to hold for each element on its own, so the table checks hydrogen's totals, oxygen's totals, and so on, each independently, and the equation is only balanced when every single row matches.",
      },
      {
        id: "chemistry-equation-balancer-explain-002",
        question: "Why does the balancer only let you change the number in front of a formula, never the formula itself?",
        answer:
          "The formula (including its subscripts) defines what substance you're talking about. Water is H₂O; changing that subscript makes it a different compound. The coefficient, on the other hand, just counts how many molecules of that same, unchanged substance you have — which is the only thing balancing is actually allowed to adjust.",
      },
      {
        id: "chemistry-equation-balancer-explain-003",
        question: "For the Ammonia equation, why does hydrogen end up needing a coefficient of 3 while nitrogen only needs 1?",
        answer:
          "It comes down to how many atoms each formula already carries. N₂ has 2 nitrogen atoms per molecule, matching NH₃'s coefficient of 2 (2 × 1 = 2) without needing to scale up. But NH₃'s 3 hydrogen atoms per molecule, times a coefficient of 2, means 6 hydrogen atoms are needed — and since H₂ only supplies 2 hydrogen atoms per molecule, it takes 3 molecules of H₂ (3 × 2 = 6) to reach that total.",
      },
      {
        id: "chemistry-equation-balancer-explain-004",
        question: "The Peroxide Breakdown equation has only one reactant term but two product terms. Does that change how you balance it?",
        answer:
          "No — the number of terms on each side doesn't matter to the balancing rule. You still add up each element's total atoms on the reactant side (just from one formula this time) and compare it to that element's total across every product term. Conservation of atoms applies to the whole side's total, regardless of how many separate formulas make it up.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-equation-balancer",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live balancer below to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-equation-balancer-challenge-001",
        title: "Balance It From Scratch",
        scenario: "The Magnesium Oxide equation, Mg + O₂ → MgO, is loaded with every coefficient at 1.",
        objective: "Find the smallest set of whole-number coefficients that balances this equation.",
        constraints: [
          { id: "c1", label: "Every element's total must match on both sides." },
          { id: "c2", label: "Use the smallest possible whole numbers — don't just double a working larger set." },
        ],
        tools: [
          { id: "coefficient-steppers", label: "− / + steppers under Mg, O₂, and MgO" },
          { id: "atom-count-table", label: "Live atom-count table" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "2-1-2", label: "2Mg + O₂ → 2MgO" },
            { id: "1-1-1", label: "Mg + O₂ → MgO" },
            { id: "1-2-2", label: "Mg + 2O₂ → 2MgO" },
          ],
          correctOptionId: "2-1-2",
        },
        explanation:
          "2Mg + O₂ → 2MgO is the smallest balanced form. O₂ supplies 2 oxygen atoms, so 2 molecules of MgO are needed to match on the product side (2 × 1 = 2 oxygen atoms); with MgO's coefficient set to 2, magnesium then also needs a coefficient of 2 to supply the matching 2 magnesium atoms. Try each option in the balancer below and check the atom-count table.",
        hints: [
          "Balance oxygen first — O₂ always contributes an even number of oxygen atoms.",
          "Once oxygen is set, magnesium has to match MgO's coefficient exactly, since MgO has only 1 magnesium atom per molecule.",
        ],
        maxAttempts: 5,
      },
      {
        id: "chemistry-equation-balancer-challenge-002",
        title: "Which Element to Balance First?",
        scenario:
          "For N₂ + H₂ → NH₃, a student wants to know which element to lock in first, before touching the other.",
        objective: "Determine which element's coefficient should be set first for the most efficient balancing path.",
        constraints: [
          { id: "c1", label: "Base your answer on how many formulas each element appears in, not a guess." },
        ],
        tools: [
          { id: "atom-count-table", label: "Live atom-count table for the Ammonia equation" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "nitrogen-first", label: "Nitrogen — it's simpler to match first since N₂ and NH₃ have straightforward whole-number ratios" },
            { id: "random-order", label: "It doesn't matter — any order works equally well" },
          ],
          correctOptionId: "nitrogen-first",
        },
        explanation:
          "Nitrogen is the more constrained element here: N₂ contributes 2 nitrogen atoms per molecule, and NH₃ contributes 1, so matching them is a simple 1:2 ratio. Fixing nitrogen's coefficients first (N₂ = 1, NH₃ = 2) then tells you exactly how much hydrogen NH₃ needs, which in turn sets H₂'s coefficient — working nitrogen out first avoids juggling two unknowns simultaneously.",
        hints: [
          "Try setting NH₃'s coefficient first, based on matching nitrogen, and see how that constrains hydrogen afterward.",
          "Count how many product formulas each element (N vs. H) appears in — fewer formulas usually means an easier starting point.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-equation-balancer-challenge-003",
        title: "Real-World Mission: Scaling a Recipe",
        scenario:
          "A chemist needs twice as much table salt (NaCl) as the standard balanced equation 2Na + Cl₂ → 2NaCl produces, but wants to keep the equation correctly balanced, not just multiply one term.",
        objective: "Determine the correct coefficients for every term so the equation produces double the NaCl while staying balanced.",
        constraints: [
          { id: "c1", label: "Every element must still balance — you can't just double NaCl's coefficient alone." },
        ],
        tools: [
          { id: "coefficient-steppers", label: "− / + steppers under Na, Cl₂, and NaCl" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "4-2-4", label: "4Na + 2Cl₂ → 4NaCl" },
            { id: "2-1-4", label: "2Na + Cl₂ → 4NaCl" },
            { id: "4-1-4", label: "4Na + Cl₂ → 4NaCl" },
          ],
          correctOptionId: "4-2-4",
        },
        explanation:
          "Doubling every coefficient in a balanced equation keeps it balanced: 4Na + 2Cl₂ → 4NaCl. Doubling only NaCl's coefficient while leaving Na and Cl₂ unchanged (2Na + Cl₂ → 4NaCl) breaks the balance — the whole equation has to scale together, not just the term you care about. Try each option in the balancer and check the atom-count table.",
        hints: [
          "A balanced equation stays balanced if every coefficient is scaled by the same whole number.",
          "If NaCl needs to double, what has to happen to Na and Cl₂'s coefficients too?",
        ],
        maxAttempts: 5,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-builder",
      label: "Chemical Reaction Builder",
      href: "/dashboard/chemistry/reaction-builder",
      reason: "See the visual, atom-by-atom reason equations balance the way they do.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-kinetics",
      label: "Reaction Kinetics",
      href: "/dashboard/chemistry/reaction-kinetics",
      reason: "A balanced equation tells you what happens in a reaction — kinetics tells you how fast.",
    },
  ],
};
