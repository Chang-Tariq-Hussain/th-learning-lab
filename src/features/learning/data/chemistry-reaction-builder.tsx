import type { TopicContent } from "../types";

/**
 * Chemical Reaction Builder — Chemistry Batch 3's first GLE topic,
 * brought up from the earlier Learn + Explore + quiz-link pattern
 * (`SimulationLearnMore`) to the same full standard (Learn, Predict,
 * Explore, Explain, Practice, Challenge) as Batch 1/2's topics. The
 * simulation itself (`@/features/subjects/chemistry/reaction-builder`)
 * needed no changes — it already visualizes reactants → bond-breaking
 * → atom-rearranging → bond-forming → products across three reactions
 * (water, hydrogen chloride, table salt), reusing Bond/Molecule
 * Builder's atom-orb visual language rather than a new engine.
 */
export const chemistryReactionBuilderContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "reaction-builder",
  title: "Chemical Reactions",
  subjectLabel: "Chemistry",
  topicLabel: "Chemical Reaction Builder",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/reaction-builder",

  learn: {
    objectives: [
      "Identify reactants and products in a chemical equation.",
      "Explain a chemical reaction as atoms rearranging — bonds breaking and new bonds forming.",
      "State the law of conservation of mass and connect it to atoms never being created or destroyed.",
      "Distinguish a coefficient (how many molecules) from a subscript (how many atoms in one molecule).",
    ],
    concepts: [
      {
        term: "Reactants and products",
        explanation:
          "Reactants are the substances you start with, written on the left of the arrow. Products are the substances you end up with, written on the right. The arrow itself represents the reaction — everything that happens to turn one side into the other.",
        formula: "2H_2 + O_2 \\rightarrow 2H_2O",
        formulaCaption: "Reactants → Products",
      },
      {
        term: "Atoms are rearranged, not created or destroyed",
        explanation:
          "A chemical reaction never makes new atoms or erases old ones. Every atom present in the reactants is still present somewhere in the products — just regrouped into different molecules. This is why chemists can track exactly where every atom ends up.",
      },
      {
        term: "Bonds break, then bonds form",
        explanation:
          "Atoms locked inside a reactant molecule's bonds can't simply relabel themselves as a new substance. The existing bonds break first, freeing the atoms to move; then new bonds form between the rearranged atoms, holding the product molecules together.",
      },
      {
        term: "Conservation of mass",
        explanation:
          "Because no atoms are created or destroyed — only rearranged — the total mass of the reactants always equals the total mass of the products. Nothing physically vanishes or appears out of nowhere during a chemical reaction.",
      },
      {
        term: "Coefficients vs. subscripts",
        explanation:
          "The subscript in a formula (the 2 in H₂O) counts atoms inside one molecule and can never change without turning the substance into something else. The coefficient in front of a formula (the 2 in 2H₂O) counts whole molecules, and that's the number you're ever allowed to adjust when balancing an equation.",
      },
    ],
    whyItMatters:
      "Every chemical process you rely on — your car's engine burning fuel, your own cells releasing energy from food, bread rising in an oven — is atoms rearranging according to this same principle. Chemists use the fact that atoms are conserved to calculate exactly how much of each ingredient a reaction needs, which matters everywhere from manufacturing medicine to mixing rocket fuel.",
    keyTerms: [
      { term: "Reactant", definition: "A starting substance in a chemical reaction, written on the left of the arrow." },
      { term: "Product", definition: "A substance produced by a chemical reaction, written on the right of the arrow." },
      { term: "Conservation of mass", definition: "The principle that mass (and atom count) is neither created nor destroyed in a chemical reaction." },
      { term: "Coefficient", definition: "The number written in front of a chemical formula, counting how many molecules of that substance are involved." },
      { term: "Subscript", definition: "The small number written after an element symbol inside a formula, counting how many atoms of that element are in one molecule." },
    ],
    misconceptions: [
      {
        id: "misconception-atoms-disappear",
        misconception: "Some atoms just disappear or get \"used up\" during a reaction.",
        correction:
          "No atom is ever destroyed in a chemical reaction. Every atom you start with in the reactants is still there at the end — just rearranged into new molecules. If an atom count doesn't seem to match, it means the equation isn't balanced yet, not that atoms went missing.",
      },
      {
        id: "misconception-new-atoms-created",
        misconception: "Bigger or more complex product molecules mean new atoms were created during the reaction.",
        correction:
          "A reaction can never create atoms that weren't already present in the reactants. Even when the product looks structurally different or more complex, it's built entirely from atoms that were already there, just bonded together differently.",
      },
      {
        id: "misconception-subscript-balancing",
        misconception: "You can balance an equation by changing the small numbers inside a formula (subscripts).",
        correction:
          "Changing a subscript changes what the substance actually is — H₂O (water) becomes H₂O₂ (hydrogen peroxide, a different compound entirely) if you edit its subscript. Balancing only ever adjusts the coefficient in front of a formula, never the subscripts inside it.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before stepping through the reaction below — then run it and check your answer.",
    scenarios: [
      {
        id: "chemistry-reaction-builder-predict-001",
        scenario:
          "2H₂ + O₂ → 2H₂O starts with 4 hydrogen atoms and 2 oxygen atoms among the reactants.",
        question: "How many hydrogen atoms and oxygen atoms will be present once the reaction finishes?",
        options: [
          { id: "same", label: "Still 4 hydrogen atoms and 2 oxygen atoms, just rearranged into water molecules" },
          { id: "fewer", label: "Fewer atoms — some are used up and destroyed by the reaction" },
          { id: "more", label: "More atoms — the reaction creates new ones to build water" },
        ],
        actualResultOptionId: "same",
        explanation:
          "Atoms are conserved. The 4 hydrogen and 2 oxygen atoms that start as reactants are exactly the same atoms that end up in the 2 water molecules — none created, none destroyed, just regrouped.",
        hint: "Nothing about a chemical reaction can create or destroy atoms — think about what \"conservation of mass\" actually means for the atom count.",
      },
      {
        id: "chemistry-reaction-builder-predict-002",
        scenario:
          "In H₂ + Cl₂ → 2HCl, the reactants start as one H–H bonded pair and one Cl–Cl bonded pair.",
        question: "Before the two HCl product molecules can form, what has to happen to the original H–H and Cl–Cl bonds?",
        options: [
          { id: "break-first", label: "Both bonds have to break before new H–Cl bonds can form" },
          { id: "stay-intact", label: "The bonds stay intact — HCl forms around them" },
          { id: "only-one-breaks", label: "Only the H–H bond breaks; Cl₂ stays a single molecule in the product" },
        ],
        actualResultOptionId: "break-first",
        explanation:
          "The atoms are locked together by their original bonds and can't regroup while those bonds are intact. Both the H–H and Cl–Cl bonds break, freeing all four atoms, which then pair up differently into two new H–Cl bonds.",
        hint: "Can two atoms form a brand new bond with a different partner while they're still held by their old bond?",
      },
      {
        id: "chemistry-reaction-builder-predict-003",
        scenario:
          "2Na + Cl₂ → 2NaCl starts with 2 loose sodium atoms (not bonded to each other) and 1 Cl₂ molecule (2 chlorine atoms, bonded).",
        question: "How many total chlorine atoms will end up in the 2 NaCl product molecules?",
        options: [
          { id: "two", label: "2 — one chlorine atom in each NaCl molecule" },
          { id: "four", label: "4 — Cl₂'s bond doubles the chlorine count" },
          { id: "one", label: "1 — only one chlorine atom survives the reaction" },
        ],
        actualResultOptionId: "two",
        explanation:
          "Cl₂ contributes exactly 2 chlorine atoms as reactants, and conservation of atoms means those same 2 atoms are what end up in the products — one in each of the 2 NaCl molecules.",
        hint: "Count how many chlorine atoms are actually present in the reactants before predicting the product total — that number can't change.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick a reaction from the tabs at the top — Water, Hydrogen Chloride, or Table Salt.",
      "Click \"Start Reaction\" to play through every step automatically, or use \"Next Step\" to advance one at a time.",
      "Watch the equation diagram and the atom counter above and below the animation as the reaction proceeds.",
      "Read the step explanation under the animation at each stage.",
      "Reset and try a different reaction, comparing how many bonds break and form in each.",
    ],
    tryThis: [
      "Count the atoms of each element in the reactants panel, then count them again in the products panel — do the totals match?",
      "Watch closely for the moment bonds break (step 3) versus the moment new bonds form (step 5) — what's happening to the atoms in between?",
      "Compare the three reactions: which one starts with any atoms that are already loose (not bonded), rather than paired?",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-reaction-builder-explain-001",
        question: "Why doesn't the number of hydrogen atoms ever change while the water-formation reaction plays out?",
        answer:
          "Atoms are never created or destroyed in a chemical reaction — only rearranged. The 4 hydrogen atoms present at the start (in 2H₂) are the same 4 hydrogen atoms present at the end (spread across 2H₂O); the reaction just changes which atoms they're bonded to, not how many of them exist.",
      },
      {
        id: "chemistry-reaction-builder-explain-002",
        question: "In the Table Salt reaction, why does the animation show sodium atoms starting out loose while chlorine starts out as a bonded pair?",
        answer:
          "This reflects the real starting materials: solid sodium metal is modeled here as individual atoms (not a molecule), while chlorine naturally exists as diatomic Cl₂ gas, with its two atoms already bonded. Only the Cl–Cl bond needs to break before new Na–Cl bonds can form.",
      },
      {
        id: "chemistry-reaction-builder-explain-003",
        question: "If you counted only 3 oxygen atoms in the products but started with 4 in the reactants, what would that tell you?",
        answer:
          "It would mean the equation as written isn't actually balanced, or the diagram has an error — atoms can never simply vanish. In a real, correctly balanced equation, the atom counts always come out equal on both sides; a mismatch is a signal to fix the equation, not evidence that a reaction destroyed an atom.",
      },
      {
        id: "chemistry-reaction-builder-explain-004",
        question: "Why is \"bonds break, then bonds form\" a more accurate description of a reaction than \"molecules just relabel themselves\"?",
        answer:
          "If molecules simply relabeled themselves, atoms would stay locked to their original partners — but reactions actually mix atoms into brand-new combinations (e.g. one H from each of two different H₂ molecules ending up in the same water molecule). That mixing can only happen because the original bonds genuinely break, freeing every atom to regroup, before new bonds lock in the products.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-reaction-builder",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-reaction-builder-challenge-001",
        title: "Count the Atoms",
        scenario:
          "The Hydrogen Chloride reaction, H₂ + Cl₂ → 2HCl, is loaded in the simulation below.",
        objective: "Determine the total number of chlorine atoms present at every step of the reaction, from reactants to products.",
        constraints: [
          { id: "c1", label: "Base your answer on conservation of atoms, not a guess." },
        ],
        tools: [
          { id: "atom-counter", label: "Before/After atom counter shown above the reaction stage" },
        ],
        answer: {
          mode: "numeric",
          target: 2,
          tolerance: 0,
        },
        explanation:
          "Cl₂ supplies exactly 2 chlorine atoms as a reactant. Since atoms are conserved, there are still exactly 2 chlorine atoms present at every single step of the reaction — whether they're bonded to each other, momentarily unbonded, or bonded to hydrogen in the final HCl molecules.",
        hints: [
          "Look at the atom counter's 'Before Reaction' and 'After Reaction' totals — do they ever change for chlorine?",
          "Cl₂ starts with exactly how many chlorine atoms bonded together?",
        ],
      },
      {
        id: "chemistry-reaction-builder-challenge-002",
        title: "Spot the Mismatch",
        scenario:
          "A student writes the reaction H₂ + O₂ → H₂O, without any coefficients, and claims it's already balanced.",
        objective: "Determine whether the student is correct, using what the simulation shows about atom conservation in the real (correctly balanced) version of this reaction.",
        constraints: [
          { id: "c1", label: "Compare atom counts on each side of the student's equation as written." },
        ],
        tools: [
          { id: "reaction-tabs", label: "Water reaction tab — shows the correctly balanced 2H₂ + O₂ → 2H₂O" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "not-balanced", label: "The student is wrong — as written, oxygen doesn't balance (2 atoms on the left, only 1 on the right)" },
            { id: "balanced", label: "The student is correct — the equation is already balanced" },
          ],
          correctOptionId: "not-balanced",
        },
        explanation:
          "As written, H₂ + O₂ → H₂O has 2 oxygen atoms on the left (from O₂) but only 1 oxygen atom on the right (from H₂O) — that's not balanced. The simulation's actual reaction uses coefficients (2H₂ + O₂ → 2H₂O) specifically to fix this mismatch, giving 2 oxygen atoms on both sides.",
        hints: [
          "Count the oxygen atoms on each side of the student's equation separately — do the totals match?",
          "Compare the student's equation to the one actually shown for the Water reaction in the simulation.",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-reaction-builder-challenge-003",
        title: "Real-World Mission: Tracking a Single Atom",
        scenario:
          "A chemist wants to verify that a specific oxygen atom present in the O₂ reactant of the Water reaction is still present somewhere in the final product, not lost during the process.",
        objective: "Use the simulation to explain how you'd confirm that oxygen atom is conserved through every step, and where it ends up.",
        constraints: [
          { id: "c1", label: "Your explanation should follow one specific oxygen atom's bonds across the steps, not just cite the final atom counts." },
        ],
        tools: [
          { id: "step-controls", label: "Next Step / Play Reaction — advance through all 6 steps individually" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "tracks-o-atom", label: "Step through each stage and watch that same oxygen atom's position — it stays present throughout, ending up bonded inside a water molecule" },
            { id: "reappears", label: "The atom disappears during bond-breaking and a new one appears during bond-forming" },
          ],
          correctOptionId: "tracks-o-atom",
        },
        explanation:
          "Stepping through the simulation one stage at a time shows the same oxygen atom continuously present — it never disappears, even mid-reaction while its old O–O bond is breaking and before its new O–H bonds form. It's simply relocating and re-bonding, which is exactly what conservation of atoms guarantees for every atom in a real reaction.",
        hints: [
          "Use 'Next Step' instead of 'Play Reaction' so you can watch one stage at a time without the animation moving on too fast.",
          "Focus on one atom's position across consecutive steps rather than the whole scene at once.",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "equation-balancer",
      label: "Equation Balancer",
      href: "/dashboard/chemistry/equation-balancer",
      reason: "Now that you've seen why atoms are conserved during a reaction, practice the coefficient-balancing skill that keeps an equation honest about it.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-kinetics",
      label: "Reaction Kinetics",
      href: "/dashboard/chemistry/reaction-kinetics",
      reason: "Once you know what a reaction is, explore what controls how fast it happens.",
    },
  ],
};
