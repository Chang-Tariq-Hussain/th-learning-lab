import type { TopicContent } from "../types";

/**
 * Acids & Bases — The Basics — Chemistry's acids/pH/neutralization GLE
 * topic. Brought up from the earlier `SimulationLearnMore` pattern to the
 * full standard, matching Reaction Builder/Equation Balancer/Reaction
 * Kinetics above.
 *
 * The existing simulation (`@/features/subjects/chemistry/acids-bases-basics`)
 * already covered picking a substance and reading its position on a 2D pH
 * scale, so nothing there needed rebuilding. It was extended with two new
 * modes on the same shell — "pH Scale" (drag anywhere from 0 to 14 and
 * watch classification/ion balance respond live) and "Neutralization"
 * (mix an acid and a base and watch H⁺/OH⁻ combine into water) — rather
 * than three separate simulations, so the Explore section below has one
 * "how to use" list covering all three tabs instead of a link-out to
 * other pages. Strong vs. weak is covered only at an introductory,
 * conceptual level here (the Learn panel's dedicated card, plus a Predict
 * scenario and an Explain question) since a full, particle-level treatment
 * already exists as its own topic (`strong-weak-acids-bases`, linked in
 * `relatedTopics` below) — this avoids duplicating that simulation's
 * ionized-fraction visuals.
 */
export const chemistryAcidsBasesContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "acids-bases-basics",
  title: "Acids & Bases — The Basics",
  subjectLabel: "Chemistry",
  topicLabel: "Acids & Bases",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/acids-bases-basics",

  learn: {
    objectives: [
      "Explain what makes a substance acidic or basic in terms of H⁺ and OH⁻.",
      "Read the pH scale and classify any value as acidic, neutral, or basic.",
      "Describe the difference between a strong and a weak acid or base at an introductory level.",
      "Explain what happens, in terms of H⁺ and OH⁻, when an acid and a base neutralize each other.",
    ],
    concepts: [
      {
        term: "Acids",
        explanation:
          "An acid is a substance that increases the concentration of hydrogen ions (H⁺) when it's dissolved in water. Acids have a pH below 7 — lemon juice and vinegar are everyday examples.",
      },
      {
        term: "Bases",
        explanation:
          "A base is a substance that increases the concentration of hydroxide ions (OH⁻) in water, or accepts H⁺. Bases have a pH above 7 — soap and baking soda solution are everyday examples.",
      },
      {
        term: "The pH scale",
        explanation:
          "A scale from 0 to 14 that tells you how acidic or basic a solution is. Below 7 is acidic, above 7 is basic, and exactly 7 — pure water — is neutral, where H⁺ and OH⁻ are present in equal amounts.",
        formula: "0 \\; \\text{acidic} \\;\\longleftarrow\\; 7 \\;\\longrightarrow\\; \\text{basic} \\; 14",
        formulaCaption: "pH scale",
      },
      {
        term: "Strong vs. weak",
        explanation:
          "Strong and weak describe how completely an acid or base ionizes — breaks apart into ions — in water. A strong acid or base ionizes almost entirely; a weak one only partially ionizes, leaving many molecules intact. This is a different idea from pH or concentration: a weak acid in high concentration can still have a lower pH than a strong acid in low concentration.",
      },
      {
        term: "Neutralization",
        explanation:
          "When an acid and a base are mixed, their H⁺ and OH⁻ ions combine one-for-one to form water (H⁺ + OH⁻ → H₂O), while the leftover ions form a salt. If there's exactly enough base to match the acid's H⁺, the result is neutral; if either ion is left over, the mixture stays acidic or basic in that direction.",
      },
    ],
    whyItMatters:
      "Neutralization is everywhere once you look for it: antacid tablets neutralize excess stomach acid, farmers add lime to neutralize acidic soil, and wastewater treatment plants neutralize acidic or basic runoff before it reaches rivers. Understanding H⁺ and OH⁻ is the first step to understanding all of it.",
    keyTerms: [
      { term: "H⁺ (hydrogen ion)", definition: "The ion acids increase the concentration of in water; more H⁺ means a lower pH." },
      { term: "OH⁻ (hydroxide ion)", definition: "The ion bases increase the concentration of in water; more OH⁻ means a higher pH." },
      { term: "Neutral", definition: "A solution where H⁺ and OH⁻ are present in equal concentration — pH 7, like pure water." },
      { term: "Neutralization", definition: "The reaction between an acid and a base, producing water and a salt." },
    ],
    misconceptions: [
      {
        id: "misconception-strong-means-concentrated",
        misconception: "A \"strong\" acid or base just means there's a lot of it — i.e. strong is the same as concentrated.",
        correction:
          "Strong/weak describes how completely a substance ionizes in water, not how much of it is dissolved. A small amount of a strong acid can be less acidic overall than a large amount of a weak acid — strength and concentration are independent properties.",
      },
      {
        id: "misconception-neutral-means-no-ions",
        misconception: "A neutral solution, like pure water, has no H⁺ or OH⁻ ions in it at all.",
        correction:
          "A neutral solution still contains both H⁺ and OH⁻ — just in equal amounts. \"Neutral\" means balanced, not empty; pure water actually has a small, equal concentration of both ions.",
      },
      {
        id: "misconception-all-acids-dangerous",
        misconception: "Acids are always dangerous, and bases are always safe (or vice versa).",
        correction:
          "Both acids and bases range from mild, everyday substances (lemon juice, soap) to hazardous, highly concentrated ones (battery acid, drain cleaner). Danger depends on strength and concentration, not simply on whether something is an acid or a base.",
      },
    ],
  },

  predict: {
    intro: "Commit to a prediction before trying it in the simulation below — then test it and check your answer.",
    scenarios: [
      {
        id: "chemistry-acids-bases-predict-001",
        scenario: "A student mixes vinegar (an acid, pH ≈ 3) with baking soda solution (a base, pH ≈ 9) in exactly matching amounts of H⁺ and OH⁻.",
        question: "What's the pH of the resulting mixture likely to be closest to?",
        options: [
          { id: "seven", label: "About 7 — the H⁺ and OH⁻ mostly cancel out" },
          { id: "still-acidic", label: "Still close to 3 — the vinegar was already there first" },
          { id: "extreme", label: "0 or 14 — combining an acid and base makes an extreme mixture" },
        ],
        actualResultOptionId: "seven",
        explanation:
          "When the H⁺ from the acid and the OH⁻ from the base are present in matching amounts, they combine one-for-one into water, leaving the mixture close to neutral — pH near 7.",
        hint: "Think about what H⁺ and OH⁻ do when they meet: H⁺ + OH⁻ → H₂O.",
      },
      {
        id: "chemistry-acids-bases-predict-002",
        scenario: "Two solutions are compared: a small amount of a strong acid, and a much larger amount of a weak acid.",
        question: "Which statement is most accurate?",
        options: [
          { id: "either-lower", label: "Either solution could have the lower pH — strength and amount both matter" },
          { id: "strong-always-lower", label: "The strong acid always has the lower pH, no matter the amounts" },
          { id: "weak-always-lower", label: "The weak acid always has the lower pH, since there's more of it" },
        ],
        actualResultOptionId: "either-lower",
        explanation:
          "Strength (how completely a substance ionizes) and amount/concentration are independent. A small amount of strong acid and a larger amount of weak acid can land anywhere relative to each other — you can't tell which has the lower pH from \"strong vs. weak\" alone.",
        hint: "Strong/weak is about how completely a substance breaks into ions, not how much of it is present.",
      },
      {
        id: "chemistry-acids-bases-predict-003",
        scenario: "On the pH slider, a student drags the value from 7 down to 4.",
        question: "What happens to the relative amount of H⁺ versus OH⁻ shown?",
        options: [
          { id: "h-up-oh-down", label: "H⁺ increases and OH⁻ decreases" },
          { id: "both-up", label: "Both H⁺ and OH⁻ increase" },
          { id: "no-change", label: "Neither changes — pH doesn't relate to ion amounts" },
        ],
        actualResultOptionId: "h-up-oh-down",
        explanation:
          "Moving further below pH 7 means the solution is more acidic — H⁺ becomes more concentrated relative to OH⁻, which is exactly what the ion bars and particle view show as the slider moves left.",
        hint: "Which direction on the scale is more acidic — left or right of 7?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Substances tab: pick an everyday substance and see where it lands on the pH scale, or turn on Compare to place two side by side.",
      "pH Scale tab: drag the slider anywhere from 0 to 14 and watch the classification, H⁺/OH⁻ bars, and particle view update live.",
      "Neutralization tab: choose an acid and a base, then slide \"Add base\" from 0% up past 100% and watch H⁺ and OH⁻ combine into water.",
      "Watch the result panel in the Neutralization tab closely — it tells you exactly how many ions combined and which, if any, are left over.",
    ],
    tryThis: [
      "In the Substances tab, find the most acidic and most basic substance available — how many pH units apart are they?",
      "In the pH Scale tab, drag to exactly pH 7 and check that the H⁺ and OH⁻ bars are equal.",
      "In the Neutralization tab, set \"Add base\" to exactly 100% — is the result always precisely neutral? Try it with different acid/base pairs.",
      "Push \"Add base\" past 100% in the Neutralization tab and watch the mixture flip from acidic to basic.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-acids-bases-explain-001",
        question: "Why does mixing an acid and a base in matching amounts bring the pH close to 7?",
        answer:
          "The acid's H⁺ ions and the base's OH⁻ ions combine one-for-one to form water (H⁺ + OH⁻ → H₂O). When the amounts match exactly, there's no H⁺ or OH⁻ left over, so the solution ends up close to neutral — the same balance that makes pure water pH 7.",
      },
      {
        id: "chemistry-acids-bases-explain-002",
        question: "Why can a weak acid still have a lower pH than a strong acid?",
        answer:
          "pH depends on how much H⁺ actually ends up in solution, which is affected by both strength (what fraction of the molecules ionize) and concentration (how much is dissolved). A large amount of a weak acid can release more total H⁺ than a small amount of a strong acid, giving it the lower pH — strength alone doesn't determine pH.",
      },
      {
        id: "chemistry-acids-bases-explain-003",
        question: "In the Neutralization tab, why does the mixture turn basic once you add more than 100% base?",
        answer:
          "At 100%, the OH⁻ added exactly matches the acid's H⁺, so all of it combines into water. Adding more base past that point means there's no H⁺ left to react with — the extra OH⁻ has nothing to combine with, so it stays in solution and pushes the mixture basic.",
      },
      {
        id: "chemistry-acids-bases-explain-004",
        question: "Why is pure water considered neutral if it actually contains H⁺ and OH⁻ ions?",
        answer:
          "Neutral doesn't mean \"no ions\" — it means H⁺ and OH⁻ are present in exactly equal amounts. Pure water does contain both ions, just in a small, matched concentration, which is precisely why it sits at the midpoint of the pH scale rather than at one end.",
      },
    ],
  },

  practice: {
    quizId: "chemistry-acids-bases",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the live simulation below — switch tabs as needed — to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-acids-bases-challenge-001",
        title: "Fix the Acidic Soil",
        scenario:
          "A garden's soil tests acidic, well below pH 7, and a gardener wants to bring it closer to neutral before planting.",
        objective: "Determine what the gardener should add to the soil, and roughly what should happen to the pH.",
        constraints: [
          { id: "c1", label: "The fix must involve a substance from the acid/base categories covered in this simulation, not an unrelated method." },
        ],
        tools: [
          { id: "neutralization-tab", label: "Neutralization tab — mix an acid with a base and watch the resulting pH" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "add-base", label: "Add a base — its OH⁻ will combine with the soil's excess H⁺, raising the pH toward neutral" },
            { id: "add-more-acid", label: "Add more acid — it will cancel out the existing acidity" },
            { id: "nothing-works", label: "Nothing can change soil pH once it's acidic" },
          ],
          correctOptionId: "add-base",
        },
        explanation:
          "Adding a base introduces OH⁻, which combines with the soil's excess H⁺ to form water, moving the pH up toward neutral — exactly the reaction the Neutralization tab demonstrates. Adding more acid would only make it more acidic, not less.",
        hints: [
          "What does an acid's H⁺ get canceled out by, according to the Neutralization tab?",
          "Try picking an acidic starting point and sliding 'Add base' up in the Neutralization tab — which direction does the pH move?",
        ],
        maxAttempts: 4,
      },
      {
        id: "chemistry-acids-bases-challenge-002",
        title: "Match the Acid to the Base",
        scenario:
          "A student wants to fully neutralize vinegar (pH ≈ 3) using baking soda solution (pH ≈ 9) in the Neutralization tab, ending as close to pH 7 as possible.",
        objective: "Find the percentage of base to add that gets the mixture closest to fully neutral.",
        constraints: [
          { id: "c1", label: "Answer as a percentage between 0 and 150, matching the slider's range." },
        ],
        tools: [
          { id: "base-slider", label: "\"Add base\" slider, 0–150%" },
        ],
        answer: { mode: "numeric", unit: "%", target: 100, tolerance: 10 },
        explanation:
          "100% is designed to be the exact match — the point where the OH⁻ added equals the acid's H⁺, so all of it combines into water and nothing is left over. Above or below that leaves either excess acid or excess base.",
        hints: [
          "Watch the result panel's 'leftover' count as you move the slider — you want it to hit zero for both ions.",
          "Try slider values below and above 100% and compare how far the pH sits from 7 each time.",
        ],
        maxAttempts: 5,
      },
      {
        id: "chemistry-acids-bases-challenge-003",
        title: "Real-World Mission: Antacid Tablets",
        scenario:
          "Antacid tablets are taken to relieve heartburn, which is caused by excess acid in the stomach.",
        objective: "Using what you've learned about neutralization, explain why an antacid tablet (a mild base) relieves the discomfort.",
        constraints: [
          { id: "c1", label: "Your explanation should reference H⁺ and OH⁻ specifically, not just 'it makes the acid go away.'" },
        ],
        tools: [
          { id: "neutralization-tab", label: "Neutralization tab — as a stand-in for stomach acid meeting a base" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "oh-combines-h", label: "The antacid's OH⁻ (or similar base chemistry) combines with excess stomach H⁺, forming water and lowering the acidity" },
            { id: "coats-stomach", label: "The antacid physically blocks the stomach lining from the acid, without any chemical reaction" },
            { id: "no-explanation", label: "There's no chemical explanation — it just feels better" },
          ],
          correctOptionId: "oh-combines-h",
        },
        explanation:
          "An antacid is a mild base. Once swallowed, it neutralizes some of the stomach's excess H⁺ the same way the Neutralization tab shows — the acid and base's ions combine into water, reducing the H⁺ concentration and easing the acid-related discomfort.",
        hints: [
          "What did adding a base do to the leftover H⁺ in the Neutralization tab?",
          "Heartburn is caused by excess H⁺ — what's the direct chemical way to reduce it?",
        ],
        maxAttempts: 4,
        requiresExperiment: false,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "chemistry",
      topicSlug: "strong-weak-acids-bases",
      label: "Strong vs Weak Acids and Bases",
      href: "/dashboard/chemistry/strong-weak-acids-bases",
      reason: "Go deeper into strength as ionized fraction, with a particle-level strong vs. weak comparison.",
    },
    {
      subjectSlug: "chemistry",
      topicSlug: "reaction-kinetics",
      label: "Reaction Kinetics",
      href: "/dashboard/chemistry/reaction-kinetics",
      reason: "Neutralization is a reaction too — revisit how concentration and other factors affect how fast reactions like it happen.",
    },
  ],
};
