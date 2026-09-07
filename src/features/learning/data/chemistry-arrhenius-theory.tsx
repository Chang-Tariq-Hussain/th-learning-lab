import type { TopicContent } from "../types";

/**
 * Arrhenius Theory — Chemistry's first acid-base *theory* topic
 * (Batch 5, following Batch 4's Acids & Bases — The Basics). Brought
 * up from the earlier `SimulationLearnMore` pattern to the full
 * standard.
 *
 * The existing simulation (`@/features/subjects/chemistry/arrhenius-theory`)
 * already covered the whole spec — two side-by-side dissociation
 * containers (HCl / NaOH), Add Acid / Add Base controls that grow the
 * ion cloud, an example picker (HCl / NaOH / H₂O) that classifies
 * each substance, and a comparison summary — so nothing there needed
 * rebuilding. Predict and Explain both refer directly to those
 * controls (dose buttons, the example picker, the 1:1 featured/
 * spectator ion ratio) rather than inventing new scenarios the sim
 * doesn't support.
 */
export const chemistryArrheniusTheoryContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "arrhenius-theory",
  title: "Arrhenius Theory",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/arrhenius-theory",

  learn: {
    objectives: [
      "Define an Arrhenius acid as a substance that produces H⁺ ions in water.",
      "Define an Arrhenius base as a substance that produces OH⁻ ions in water.",
      "Classify a substance as an Arrhenius acid or base from what it releases when dissolved.",
      "Explain why the Arrhenius definition only applies to reactions happening in water.",
    ],
    concepts: [
      {
        term: "Arrhenius acid",
        explanation:
          "A substance that increases the concentration of hydrogen ions (H⁺) when it dissolves in water. Hydrochloric acid is a classic example — every HCl molecule that dissociates releases one H⁺.",
        formula: "HCl \\xrightarrow{H_2O} H^+ + Cl^-",
        formulaCaption: "HCl dissolving in water",
      },
      {
        term: "Arrhenius base",
        explanation:
          "A substance that increases the concentration of hydroxide ions (OH⁻) when it dissolves in water. Sodium hydroxide is a classic example — every NaOH that dissociates releases one OH⁻.",
        formula: "NaOH \\xrightarrow{H_2O} Na^+ + OH^-",
        formulaCaption: "NaOH dissolving in water",
      },
      {
        term: "H⁺ and OH⁻ in water",
        explanation:
          "Arrhenius theory looks at exactly one thing: what ion a substance adds to water when it dissociates. More H⁺ than a plain water baseline makes it an acid; more OH⁻ makes it a base. Water itself, with no acid or base added, is the neutral reference point.",
      },
      {
        term: "Limitations of the Arrhenius definition",
        explanation:
          "This definition is specifically about what happens in water — it can't classify a reaction that happens in a different solvent, or even in no solvent at all, and it can't explain how a substance like ammonia (NH₃, no OH⁻ in its formula) still behaves as a base. It's the earliest and narrowest of the major acid-base theories, later broadened by the Brønsted–Lowry definition.",
      },
    ],
    whyItMatters:
      "Arrhenius theory was the first clear, testable way to separate acids from bases, and it's still the mental model most people reach for first: acids make things more H⁺-rich, bases make things more OH⁻-rich. Seeing exactly where it stops working — reactions without water, bases without OH⁻ — is what motivates the broader Brønsted–Lowry definition next.",
    keyTerms: [
      { term: "H⁺ (hydrogen ion)", definition: "The ion an Arrhenius acid increases the concentration of when it dissolves in water." },
      { term: "OH⁻ (hydroxide ion)", definition: "The ion an Arrhenius base increases the concentration of when it dissolves in water." },
      { term: "Aqueous solution", definition: "A solution in which water is the solvent — the only setting the Arrhenius definition describes." },
      { term: "Dissociation", definition: "A substance splitting apart into its ions as it dissolves, e.g. HCl → H⁺ + Cl⁻." },
    ],
    misconceptions: [
      {
        id: "misconception-arrhenius-only-theory",
        misconception: "The Arrhenius definition explains every acid or base a chemist will ever encounter.",
        correction:
          "Arrhenius theory only covers substances dissolved in water. Ammonia acts as a base without ever containing OH⁻, and acid-base reactions can happen with no water present at all — cases the Arrhenius definition simply can't classify. That gap is exactly what Brønsted–Lowry theory was built to close.",
      },
      {
        id: "misconception-must-contain-oh",
        misconception: "A substance can only be an Arrhenius base if OH⁻ already appears in its chemical formula.",
        correction:
          "What matters is what a substance produces once it's in water, not what's written in its formula beforehand. NaOH already contains OH⁻ and releases it directly, but the requirement is the resulting H⁺ or OH⁻ concentration in solution — not the starting formula.",
      },
      {
        id: "misconception-neutral-means-nothing-happens",
        misconception: "Water, as the \"neutral reference,\" contains no H⁺ or OH⁻ at all.",
        correction:
          "Water is neutral because it doesn't add extra H⁺ or OH⁻ beyond the baseline — not because it has none. That baseline is exactly what makes it possible to say a substance \"increases\" H⁺ or OH⁻ in the first place.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before trying it in the simulation below — then test it and check your answer.",
    scenarios: [
      {
        id: "chemistry-arrhenius-predict-001",
        scenario: "Ammonia gas (NH₃) reacts with hydrogen chloride gas (HCl) directly, with no water present at all, and clearly behaves as a base in that reaction.",
        question: "Can Arrhenius theory classify NH₃ as a base in this particular reaction?",
        options: [
          { id: "no-no-water", label: "No — Arrhenius theory only classifies behavior that happens in water" },
          { id: "yes-always-base", label: "Yes — a base is always a base, regardless of solvent" },
          { id: "yes-because-nitrogen", label: "Yes — any nitrogen-containing compound counts automatically" },
        ],
        actualResultOptionId: "no-no-water",
        explanation:
          "Arrhenius theory is defined entirely in terms of what a substance produces in water. With no water in this reaction, there's nothing for the definition to measure — it simply doesn't apply here, even though NH₃ is clearly acting as a base.",
        hint: "What does the Arrhenius definition actually measure — the substance itself, or what it produces in a specific solvent?",
      },
      {
        id: "chemistry-arrhenius-predict-002",
        scenario: "You press \"Add Base\" on the NaOH container in the simulation several times in a row.",
        question: "What happens to the number of OH⁻ chips shown compared to the Na⁺ spectator chips?",
        options: [
          { id: "grow-together", label: "Both grow together, one-for-one" },
          { id: "only-oh-grows", label: "Only the OH⁻ chips increase; Na⁺ stays fixed" },
          { id: "oh-shrinks", label: "OH⁻ actually decreases as more NaOH is added" },
        ],
        actualResultOptionId: "grow-together",
        explanation:
          "Each dose of NaOH that dissociates releases exactly one Na⁺ and one OH⁻, so both chip counts climb together at the same rate — the 1:1 ratio is the whole point of dissociation.",
        hint: "Look at the equation NaOH → Na⁺ + OH⁻ — how many of each ion does one NaOH produce?",
      },
      {
        id: "chemistry-arrhenius-predict-003",
        scenario: "In the example picker, you select H₂O (water) rather than HCl or NaOH.",
        question: "How will the simulation classify plain water under Arrhenius theory?",
        options: [
          { id: "neutral-reference", label: "Neutral reference — it doesn't add extra H⁺ or OH⁻" },
          { id: "weak-acid", label: "A weak Arrhenius acid" },
          { id: "weak-base", label: "A weak Arrhenius base" },
        ],
        actualResultOptionId: "neutral-reference",
        explanation:
          "Arrhenius classification asks what a substance adds to water. Water added to water changes nothing, so it's the neutral reference point the acid and base classifications are measured against — not itself an acid or a base.",
        hint: "Arrhenius theory classifies substances by what they add relative to plain water.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Press \"Add Acid\" and watch H⁺ chips (plus Cl⁻ spectators) build up in the HCl container.",
      "Press \"Add Base\" and watch OH⁻ chips (plus Na⁺ spectators) build up in the NaOH container.",
      "Use the example picker to select HCl, NaOH, or H₂O and read its Arrhenius classification and blurb.",
      "Compare the two containers side by side — same starting point (H₂O), opposite ion released.",
      "Reset and try again, this time predicting which ion a substance will release before selecting it.",
    ],
    tryThis: [
      "Add several doses of acid, then several of base — does the simulation ever let one container run out of room?",
      "Try to state the Arrhenius definition of \"base\" without using the word OH⁻ in your explanation. Is that possible?",
      "Think of a substance you already know is a base (like ammonia) that this simulation couldn't classify — why not?",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-arrhenius-explain-001",
        question: "Why does adding acid grow both the H⁺ chips and the Cl⁻ chips together, not just H⁺?",
        answer:
          "HCl doesn't release H⁺ on its own — the whole molecule splits apart, or dissociates, into H⁺ and Cl⁻ at the same time. Cl⁻ is a spectator: it doesn't affect the acid/base classification, but it's still produced one-for-one alongside the H⁺ that does.",
      },
      {
        id: "chemistry-arrhenius-explain-002",
        question: "Why is water classified as neither an Arrhenius acid nor an Arrhenius base?",
        answer:
          "Arrhenius classification is about what a substance adds to water beyond the baseline. Water added to water doesn't increase H⁺ or OH⁻ relative to that baseline at all, so it sits at the neutral reference point instead of leaning toward either classification.",
      },
      {
        id: "chemistry-arrhenius-explain-003",
        question: "Why can't Arrhenius theory explain why ammonia (NH₃) acts as a base?",
        answer:
          "Ammonia doesn't contain OH⁻ and doesn't directly release it when it dissolves — instead it reacts with water to pull an H⁺ away, which only indirectly raises OH⁻. Arrhenius theory has no room for a substance that acts as a base without producing OH⁻ on its own, which is exactly the gap Brønsted–Lowry theory closes.",
      },
      {
        id: "chemistry-arrhenius-explain-004",
        question: "Why does the Arrhenius definition specifically require water, rather than describing acids and bases in general?",
        answer:
          "Arrhenius built the definition directly around aqueous behavior — H⁺ and OH⁻ concentration only mean something once a substance is dissolved in water. A reaction in a different solvent, or no solvent at all, has no H⁺/OH⁻ concentration for the definition to measure, so it falls outside what Arrhenius theory can classify.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-arrhenius-theory",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — the dose buttons and example picker — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-arrhenius-challenge-001",
        title: "Classify the Unknown",
        scenario:
          "A chemist tells you that Substance X, when dissolved in water, increases the concentration of hydroxide ions.",
        objective: "Determine how Arrhenius theory would classify Substance X.",
        constraints: [
          { id: "c1", label: "Base your answer only on what Substance X produces in water, per the Arrhenius definition." },
        ],
        tools: [
          { id: "example-picker", label: "Example picker — compare Substance X's behavior to HCl, NaOH, and H₂O" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "base", label: "Arrhenius base — it increases OH⁻ in water" },
            { id: "acid", label: "Arrhenius acid — anything dissolved in water is an acid" },
            { id: "cannot-tell", label: "Impossible to classify without knowing its formula" },
          ],
          correctOptionId: "base",
        },
        explanation:
          "The Arrhenius definition classifies purely by what a substance produces in water. Increasing OH⁻ concentration is the defining behavior of an Arrhenius base — the formula isn't needed once you know the ion it releases.",
        hints: [
          "Which ion does an Arrhenius base increase — H⁺ or OH⁻?",
          "Compare Substance X's described behavior to NaOH's blurb in the example picker.",
        ],
        maxAttempts: 3,
      },
      {
        id: "chemistry-arrhenius-challenge-002",
        title: "Where Arrhenius Theory Breaks Down",
        scenario:
          "Ammonia gas (NH₃) is bubbled directly into hydrogen chloride gas (HCl) in a sealed container with no water anywhere in the setup. A white smoke of ammonium chloride forms — a textbook acid-base reaction.",
        objective: "Explain what happens when you try to apply Arrhenius theory to this exact reaction.",
        constraints: [
          { id: "c1", label: "Your answer must address the absence of water specifically, not just \"it's complicated.\"" },
        ],
        tools: [
          { id: "arrhenius-concepts", label: "Learn section — \"Limitations of the Arrhenius definition\"" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "doesnt-apply", label: "Arrhenius theory doesn't apply — there's no water for H⁺/OH⁻ concentration to be measured in" },
            { id: "ammonia-is-base", label: "Arrhenius theory classifies NH₃ as the base, same as always" },
            { id: "hcl-is-neutral", label: "Without water, HCl becomes an Arrhenius neutral substance" },
          ],
          correctOptionId: "doesnt-apply",
        },
        explanation:
          "Arrhenius theory is defined entirely around aqueous solution — H⁺ and OH⁻ concentration in water. With no water present, there's nothing for the definition to measure, even though this is a completely valid acid-base reaction by other definitions.",
        hints: [
          "What does the Arrhenius definition require to even be applicable, regardless of what substances are reacting?",
          "Re-read the \"Limitations\" concept in the Learn section before answering.",
        ],
        maxAttempts: 3,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "bronsted-lowry",
      label: "Brønsted–Lowry Theory",
      href: "/dashboard/chemistry/bronsted-lowry",
      reason: "See the broader theory built specifically to cover what Arrhenius theory can't — reactions without water, and bases without OH⁻.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "acids-bases-basics",
      label: "Acids & Bases — The Basics",
      href: "/dashboard/chemistry/acids-bases-basics",
      reason: "Revisit the pH scale and neutralization, both built on the same H⁺/OH⁻ vocabulary introduced here.",
    },
  ],
};
