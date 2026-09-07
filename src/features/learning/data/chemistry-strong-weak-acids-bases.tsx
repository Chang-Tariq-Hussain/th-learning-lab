import type { TopicContent } from "../types";

/**
 * Strong vs Weak Acids and Bases — Chemistry Batch 5, fifth and final
 * topic (Acids & Bases GLE Part 2). Brought up from the earlier
 * `SimulationLearnMore` pattern to the full standard.
 *
 * The existing simulation (`@/features/subjects/chemistry/strong-weak-acids-bases`)
 * already covered the whole spec — an Acid/Base toggle, two
 * side-by-side particle-view panels (strong vs weak example) sharing
 * one Ionize/Reset control, a concentration-vs-strength note, a
 * strength scale, and a small two-question comparison practice — so
 * nothing there needed rebuilding. Predict and Explore both refer to
 * the actual controls (the toggle, the Ionize button, the fixed
 * ionized-fraction particle split) rather than a concentration slider
 * the simulation doesn't have — the older `SimulationLearnMore`
 * copy's mention of "adjusting concentration" didn't match the real
 * controls and wasn't carried over.
 */
export const chemistryStrongWeakAcidsBasesContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "strong-weak-acids-bases",
  title: "Strong vs Weak Acids and Bases",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/strong-weak-acids-bases",

  learn: {
    objectives: [
      "Distinguish strength (how much an acid or base ionizes) from concentration (how much is dissolved).",
      "Define strong acids/bases as substances that ionize almost completely in water.",
      "Define weak acids/bases as substances that only partially ionize in water.",
      "Predict, at a particle level, roughly how many ions versus intact molecules a strong or weak example will show once ionized.",
    ],
    concepts: [
      {
        term: "Strong acid / strong base",
        explanation:
          "Ionizes almost completely in water — essentially every molecule splits into ions. Hydrochloric acid (HCl) and sodium hydroxide (NaOH) are the simulation's strong examples.",
        formula: "HCl \\rightarrow H^+ + Cl^-",
        formulaCaption: "Complete ionization, one-way arrow",
      },
      {
        term: "Weak acid / weak base",
        explanation:
          "Only partially ionizes in water — most of the molecules stay intact, and only a fraction splits into ions at any given moment. Acetic acid (CH₃COOH) and ammonia (NH₃) are the simulation's weak examples.",
        formula: "CH_3COOH \\rightleftharpoons H^+ + CH_3COO^-",
        formulaCaption: "Partial ionization, equilibrium arrow",
      },
      {
        term: "Degree of ionization",
        explanation:
          "The fraction of dissolved molecules that have actually split into ions. This fraction is what strong/weak actually measures — the simulation shows it directly as the ratio of ion pairs to intact molecules after pressing Ionize.",
      },
      {
        term: "Strength vs. concentration",
        explanation:
          "Strength (the ionized fraction) and concentration (how much total substance is dissolved) are independent properties. A dilute strong acid can still ionize more completely than a concentrated weak acid — strength describes a tendency, not an amount.",
      },
    ],
    whyItMatters:
      "Whether an acid is strong or weak decides how it behaves in the real world — strong acids like the ones in car batteries or drain cleaner are far more corrosive than weak acids like the citric acid in lemons, even at similar concentrations. Your own stomach relies on a strong acid (HCl) to digest food, while your blood relies on weak acids and bases to keep its pH tightly controlled. Knowing the difference is what lets chemists, doctors, and even cooks predict how a substance will actually react.",
    keyTerms: [
      { term: "Ionization", definition: "A molecule splitting apart into ions when dissolved in water." },
      { term: "Ionized fraction", definition: "The proportion of dissolved molecules that have split into ions — what distinguishes strong from weak." },
      { term: "Concentration", definition: "How much of a substance is dissolved in a given amount of solution — independent of how strong it is." },
      { term: "Equilibrium arrow (⇌)", definition: "Used for weak acids/bases to show ionization is incomplete and reversible, unlike the one-way arrow for strong ones." },
    ],
    misconceptions: [
      {
        id: "misconception-weak-means-dilute",
        misconception: "A \"weak\" acid or base just means there's less of it dissolved — i.e. weak is the same as dilute.",
        correction:
          "Strength describes how completely a substance ionizes, not how much of it is dissolved. You could have a highly concentrated weak acid, with far more total dissolved acid than a dilute strong acid, even though the weak acid still ionizes only partially.",
      },
      {
        id: "misconception-strong-means-concentrated",
        misconception: "A \"strong\" acid or base just means there's a lot of it — strong is the same as concentrated.",
        correction:
          "A small amount of a strong acid still ionizes almost completely; strength doesn't depend on quantity at all. Strong and weak are about the fraction that splits into ions, not the total amount present.",
      },
      {
        id: "misconception-weak-acids-dont-ionize",
        misconception: "A weak acid doesn't ionize at all — that's the whole difference from a strong acid.",
        correction:
          "Weak acids do ionize, just incompletely — the simulation's weak examples still show a real (smaller) fraction of the particles as ions after Ionize, not zero. \"Weak\" means partial ionization, not none.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before pressing Ionize below — then check it against the particle view.",
    scenarios: [
      {
        id: "chemistry-strong-weak-predict-001",
        scenario: "You're viewing the Acid toggle, with HCl (strong) and CH₃COOH (weak) shown side by side, both unionized.",
        question: "After pressing Ionize, which panel will show more particles converted into ion pairs?",
        options: [
          { id: "hcl-more", label: "HCl (the strong acid) — most of its molecules will split into ions" },
          { id: "ch3cooh-more", label: "CH₃COOH (the weak acid) — weak acids ionize more by definition" },
          { id: "same-amount", label: "Both the same — ionization doesn't depend on strength" },
        ],
        actualResultOptionId: "hcl-more",
        explanation:
          "HCl is the strong example, with a much higher ionized fraction (0.85) than CH₃COOH (0.25). Pressing Ionize will show far more of HCl's particles converted to H⁺/Cl⁻ pairs than CH₃COOH's H⁺/CH₃COO⁻ pairs.",
        hint: "\"Strong\" is defined by ionizing more completely — which example does that describe?",
      },
      {
        id: "chemistry-strong-weak-predict-002",
        scenario: "After ionizing the acid panels, you switch the toggle to Base without pressing Reset first.",
        question: "What will the NaOH and NH₃ panels show immediately, without you pressing Ionize again?",
        options: [
          { id: "already-ionized", label: "Both already shown ionized — the ionized state carries over from before" },
          { id: "reset-to-molecules", label: "Both reset to intact molecules, since it's a new pair of examples" },
          { id: "only-naoh-ionized", label: "Only NaOH shows ionized; NH₃ requires a separate Ionize press" },
        ],
        actualResultOptionId: "already-ionized",
        explanation:
          "Switching the Acid/Base toggle only changes which pair of examples is displayed — it doesn't reset the ionized state. Since you'd already ionized before switching, both NaOH and NH₃ appear already split according to their own ionized fractions.",
        hint: "Does the toggle control ionization, or does the separate Ionize/Reset control do that?",
      },
      {
        id: "chemistry-strong-weak-predict-003",
        scenario: "You imagine a large, concentrated batch of the weak acid CH₃COOH compared to a small, dilute batch of the strong acid HCl.",
        question: "Which one necessarily has more free H⁺ ions in solution?",
        options: [
          { id: "cannot-tell", label: "It's impossible to say without knowing the actual amounts — strength and concentration are independent" },
          { id: "hcl-always-more", label: "The HCl batch always has more H⁺, since it's the strong acid" },
          { id: "ch3cooh-always-more", label: "The CH₃COOH batch always has more H⁺, since there's more of it" },
        ],
        actualResultOptionId: "cannot-tell",
        explanation:
          "Total H⁺ depends on both the ionized fraction and how much total acid is present. A large enough concentrated weak-acid batch can release more total H⁺ than a small dilute strong-acid batch, even though the weak acid ionizes far less completely.",
        hint: "Strength and concentration are independent properties — you need both numbers to know the total ion count.",
      },
    ],
  },

  explore: {
    howToUse: [
      "Use the Acid/Base toggle to choose which pair of examples to view.",
      "Press Ionize and watch each panel's particles split into ion pairs according to its fixed ionized fraction.",
      "Compare the strong panel to the weak panel side by side — count roughly how many particles became ions in each.",
      "Press Reset to return both panels to intact, unionized molecules and try again.",
      "Read the concentration note and the strength scale below the panels.",
      "Try the two comparison-practice questions once you've ionized both acid and base pairs.",
    ],
    tryThis: [
      "Ionize the acid pair, then switch to the base pair without resetting — does the ionized state carry over?",
      "Count the leftover intact molecules in the weak panel after ionizing — are they zero, or still the majority?",
      "Explain, in your own words, why a strong acid and a weak acid can look identical before you press Ionize.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-strong-weak-explain-001",
        question: "Why does the weak acid panel still show intact molecules after pressing Ionize, while the strong acid panel barely does?",
        answer:
          "Ionized fraction is fixed per example — HCl's is 0.85 and CH₃COOH's is 0.25. Pressing Ionize converts that same fraction of each panel's particles, so the weak acid is left with far more intact molecules (75%) than the strong acid (15%), reflecting how much less completely it ionizes.",
      },
      {
        id: "chemistry-strong-weak-explain-002",
        question: "Why does switching the Acid/Base toggle not reset the ionized state?",
        answer:
          "The toggle and the Ionize/Reset control are two independent pieces of state — one decides which example pair is shown, the other decides whether that pair has been ionized. Switching pairs doesn't touch the ionized flag, so a student can compare an already-ionized acid pair to an already-ionized base pair without re-pressing Ionize.",
      },
      {
        id: "chemistry-strong-weak-explain-003",
        question: "Why can a dilute strong acid still ionize more completely than a concentrated weak acid?",
        answer:
          "Ionized fraction and concentration measure two different things — one is about the tendency to split into ions, the other is about total amount dissolved. A small amount of strong acid still has that high 0.85 tendency; a large amount of weak acid still only reaches 0.25, no matter how much of it you dissolve.",
      },
      {
        id: "chemistry-strong-weak-explain-004",
        question: "NH₃ contains no OH⁻ in its formula — why is it still shown producing OH⁻ (its keyIon) when ionized?",
        answer:
          "NH₃ reacts with water to pull away an H⁺, indirectly leaving behind OH⁻ — the same Brønsted–Lowry-style proton acceptance covered in that topic. This simulation simplifies that reaction to a fixed ionized fraction so it can be compared directly against NaOH's more straightforward OH⁻ release, without re-animating the full proton-transfer mechanism.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-strong-weak-acids-bases",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — the toggle and Ionize/Reset control — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-strong-weak-challenge-001",
        title: "Which One Conducts Better?",
        scenario:
          "Two beakers hold acid solutions at the same concentration: one is HCl, the other is CH₃COOH.",
        objective: "Determine which beaker's solution will conduct electricity better, and why.",
        constraints: [
          { id: "c1", label: "Base your answer on ionized fraction, not on which acid \"sounds\" stronger." },
        ],
        tools: [
          { id: "particle-view", label: "Particle view — compare how many ions each panel shows after Ionize" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "hcl-conducts-better", label: "The HCl beaker — more of it has split into free-moving ions, which carry electric current" },
            { id: "ch3cooh-conducts-better", label: "The CH₃COOH beaker — weak acids conduct better since fewer ions collide" },
            { id: "same-conductivity", label: "Both conduct identically at the same concentration" },
          ],
          correctOptionId: "hcl-conducts-better",
        },
        explanation:
          "Conductivity depends on the number of free ions available to carry charge. HCl's much higher ionized fraction (0.85 vs. 0.25) means far more ions are actually present at the same concentration, so it conducts electricity better — exactly what the particle view shows after pressing Ionize on each.",
        hints: [
          "What carries electric current in a solution — the intact molecules, or the free ions?",
          "Compare the ion count shown in each panel after Ionize, at the same starting particle count.",
        ],
        maxAttempts: 3,
      },
      {
        id: "chemistry-strong-weak-challenge-002",
        title: "Real-World Mission: The Dilute Strong Acid",
        scenario:
          "A lab has a very dilute solution of hydrochloric acid (a strong acid) and a much more concentrated solution of acetic acid (a weak acid, found in vinegar). A student claims the vinegar solution must be more corrosive since \"there's so much more of it.\"",
        objective: "Evaluate whether the student's claim is necessarily true, using the strong-vs-weak concept.",
        constraints: [
          { id: "c1", label: "Your answer must address both strength and concentration as separate factors, not just pick a side." },
        ],
        tools: [
          { id: "concentration-note", label: "Concentration note in the simulation — \"Strength ≠ concentration\"" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "depends-on-both", label: "Not necessarily — it depends on the actual numbers for both strength and concentration, not on amount alone" },
            { id: "vinegar-always-more", label: "Yes — more total acid always means more corrosive, regardless of strength" },
            { id: "hcl-always-more", label: "No — HCl is always more corrosive than acetic acid at any concentration" },
          ],
          correctOptionId: "depends-on-both",
        },
        explanation:
          "Strength and concentration are independent — total H⁺ released depends on both. A concentrated enough weak acid can release more total H⁺ than a very dilute strong acid, but it isn't guaranteed just from \"there's more of it\": the actual ionized fraction and amount both have to be weighed together.",
        hints: [
          "Re-read the simulation's concentration note before answering.",
          "Could a small amount of a highly ionizing acid still outdo a large amount of a barely-ionizing one? What would decide it?",
        ],
        maxAttempts: 4,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "acids-bases-basics",
      label: "Acids & Bases — The Basics",
      href: "/dashboard/chemistry/acids-bases-basics",
      reason: "Revisit the pH scale and neutralization, and the introductory strong-vs-weak coverage this topic goes deeper on.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "bronsted-lowry",
      label: "Brønsted–Lowry Theory",
      href: "/dashboard/chemistry/bronsted-lowry",
      reason: "See the proton-transfer mechanism behind why NH₃ produces OH⁻ despite containing none in its own formula.",
    },
  ],
};
