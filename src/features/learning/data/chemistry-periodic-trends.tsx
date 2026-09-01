import type { TopicContent } from "../types";

/**
 * Periodic Trends — Chemistry Batch 1's second topic, built to the
 * same full standard as Atomic Structure. Its Explore experience is
 * the existing `Periodic Trends` lab
 * (`@/features/subjects/chemistry/periodic-trends`) — inspection
 * found a complete, working simulation covering the main-group
 * elements (groups 1, 2, 13–18) across four trends (atomic radius,
 * ionization energy, electronegativity, metallic character), with a
 * trend selector, a color-graded table, an element info panel, a
 * two-element compare mode, and a built-in trend challenge. No new
 * simulation was built and no 3D upgrade was made: a periodic table
 * is fundamentally a 2D grid, and the trends themselves (radius,
 * energy, electronegativity) are best read from the existing color
 * gradient and compare bars rather than a 3D scene — 3D would add
 * rendering cost without making any trend easier to see. All content
 * below is grounded in that lab's real trend selector, table, and
 * compare panel.
 */
export const chemistryPeriodicTrendsContent: TopicContent = {
  subjectSlug: "chemistry",
  topicSlug: "periodic-trends",
  title: "Periodic Trends",
  subjectLabel: "Chemistry",
  topicLabel: "Periodic Trends",
  colorToken: "chemistry",
  simulationHref: "/dashboard/chemistry/periodic-trends",

  learn: {
    objectives: [
      "Describe how atomic radius, ionization energy, electronegativity, and metallic character each change across a period and down a group.",
      "Explain why these trends exist, in terms of nuclear charge and electron shielding.",
      "Predict, for any two main-group elements, which one has the larger value for a given trend.",
      "Recognize that all four trends trace back to the same underlying tug-of-war.",
    ],
    concepts: [
      {
        term: "Periods and groups",
        explanation:
          "A period is a row of the periodic table — moving across one adds protons and electrons to the same outer shell. A group is a column — moving down one adds a whole new electron shell while keeping the same number of outer (valence) electrons.",
      },
      {
        term: "Atomic radius",
        explanation:
          "How large an atom is. It decreases across a period (more protons pull the same outer shell in tighter) and increases down a group (each new period adds a whole new, farther-out electron shell).",
      },
      {
        term: "Ionization energy",
        explanation:
          "The energy needed to remove an electron from an atom. It increases across a period (electrons are held more tightly by the growing nuclear pull) and increases up a group (outer electrons sit closer to the nucleus, so they're harder to pull away).",
      },
      {
        term: "Electronegativity",
        explanation:
          "How strongly an atom pulls on shared electrons within a chemical bond. It follows the same direction as ionization energy — increasing up and to the right, peaking near fluorine.",
      },
      {
        term: "Metallic character",
        explanation:
          "How readily an atom loses electrons rather than gains or shares them. It runs opposite to electronegativity — strongest toward the lower-left of the table, weakest toward the upper-right.",
      },
      {
        term: "The common cause",
        explanation:
          "All four trends trace back to two effects pulling against each other: increasing effective nuclear charge (more protons pulling harder) across a period, and increasing distance and shielding (more electron shells between the nucleus and the outer electrons) down a group.",
      },
    ],
    whyItMatters:
      "These four trends aren't facts to memorize in isolation — they explain real chemical behavior. Metallic character predicts why sodium reacts violently with water while chlorine doesn't. Electronegativity predicts which atom in a bond pulls electrons toward itself, the basis for polarity in molecules like water. Once all four trends are seen as the result of the same tug-of-war between nuclear charge and shielding, the periodic table stops being a chart to memorize and becomes something you can reason through.",
    keyTerms: [
      { term: "Nuclear charge", definition: "The total positive charge in an atom's nucleus, equal to its proton count — the \"pull\" on surrounding electrons." },
      { term: "Electron shielding", definition: "The effect of inner-shell electrons partially blocking the nucleus's pull on outer electrons." },
      { term: "Period", definition: "A horizontal row of the periodic table, sharing the same outermost electron shell." },
      { term: "Group", definition: "A vertical column of the periodic table, sharing the same number of valence electrons." },
      { term: "Ionization energy", definition: "The energy required to remove an electron from a neutral atom." },
      { term: "Electronegativity", definition: "An atom's tendency to attract shared electrons in a chemical bond." },
    ],
    misconceptions: [
      {
        id: "misconception-radius-always-increases",
        misconception: "Atomic radius always increases as atomic number increases.",
        correction:
          "Atomic radius increases down a group but decreases across a period — atomic number increases in both directions, so atomic number alone doesn't predict radius. Direction across the table (period vs. group) matters more than the raw atomic number.",
      },
      {
        id: "misconception-more-electrons-bigger-atom",
        misconception: "An atom with more electrons is always physically larger.",
        correction:
          "Within the same period, atoms gain both protons and electrons moving left to right, yet get smaller, not bigger — the added protons pull the same outer shell in tighter than the added electrons expand it. More electrons only means a bigger atom when they occupy an entirely new outer shell, i.e. moving down a group.",
      },
      {
        id: "misconception-metals-and-electronegativity-together",
        misconception: "The most metallic elements are also the most electronegative.",
        correction:
          "Metallic character and electronegativity move in opposite directions across the table. Highly metallic elements (like sodium or potassium, lower-left) readily give up electrons; highly electronegative elements (like fluorine or oxygen, upper-right) strongly attract them — they're near-opposite behaviors, not correlated ones.",
      },
    ],
  },

  predict: {
    intro:
      "Commit to a prediction before selecting elements below — then pick the matching trend and elements in the lab and check your answer.",
    scenarios: [
      {
        id: "chemistry-periodic-predict-001",
        scenario: "You compare sodium (Na, period 3) and chlorine (Cl, period 3) using the Atomic Radius trend.",
        question: "Which element has the larger atomic radius?",
        options: [
          { id: "sodium", label: "Sodium — it's farther to the left in the same period" },
          { id: "chlorine", label: "Chlorine — it has more protons" },
          { id: "equal", label: "They're equal, since they're in the same period" },
        ],
        actualResultOptionId: "sodium",
        explanation:
          "Atomic radius decreases across a period as nuclear charge grows. Sodium sits to the left of chlorine in period 3, with fewer protons pulling on the same outer shell, so it has the larger radius.",
        hint: "Which direction does atomic radius trend across a period — toward the left, or toward the right?",
      },
      {
        id: "chemistry-periodic-predict-002",
        scenario: "You compare lithium (Li, period 2) and potassium (K, period 4), both in group 1, using the Ionization Energy trend.",
        question: "Which element has the higher ionization energy?",
        options: [
          { id: "lithium", label: "Lithium — its outer electron sits closer to the nucleus" },
          { id: "potassium", label: "Potassium — it has more protons overall" },
          { id: "equal", label: "They're equal, since both are group 1" },
        ],
        actualResultOptionId: "lithium",
        explanation:
          "Ionization energy increases up a group. Lithium's single outer electron sits in a shell much closer to the nucleus than potassium's, which is shielded by many more inner electrons, so lithium's outer electron is harder to remove.",
        hint: "Ionization energy trends upward within a group — toward the top, or toward the bottom?",
      },
      {
        id: "chemistry-periodic-predict-003",
        scenario: "You compare oxygen (O) and fluorine (F), both in period 2, using the Electronegativity trend.",
        question: "Which element is more electronegative?",
        options: [
          { id: "fluorine", label: "Fluorine — it's farther right in the period" },
          { id: "oxygen", label: "Oxygen — it has fewer protons" },
          { id: "equal", label: "They're equal" },
        ],
        actualResultOptionId: "fluorine",
        explanation:
          "Electronegativity increases across a period, and fluorine is the most electronegative element on the entire table. It sits one step further right than oxygen, with slightly more nuclear pull on its (nearly full) outer shell.",
        hint: "Electronegativity peaks near the upper-right of the table. Which of these two sits closer to that corner?",
      },
      {
        id: "chemistry-periodic-predict-004",
        scenario: "You compare potassium (K, group 1) and bromine (Br, group 17) using the Metallic Character trend.",
        question: "Which element has the greater metallic character?",
        options: [
          { id: "potassium", label: "Potassium — it readily loses its single outer electron" },
          { id: "bromine", label: "Bromine — it has more electrons total" },
          { id: "equal", label: "They're equal" },
        ],
        actualResultOptionId: "potassium",
        explanation:
          "Metallic character is strongest toward the lower-left of the table and weakest toward the upper-right — the exact opposite direction from electronegativity. Potassium, in group 1, gives up its single outer electron easily; bromine, close to the upper-right, tends to gain electrons instead.",
        hint: "Metallic character is strongest in one corner of the table and weakest in the opposite corner. Which corner is each of these elements closer to?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Pick a trend from the selector above the table: Atomic Radius, Ionization Energy, Electronegativity, or Metallic Character.",
      "Watch the color gradient sweep across the table as you switch trends — brighter cells mean a higher value for that trend.",
      "Select any element to see its exact position and value in the current trend on the Element Info Panel.",
      "Turn on Compare mode and select two elements to see them placed side by side, with the trend's direction explained for that specific pair.",
      "Try the built-in Trend Challenge to test yourself: pick which of two highlighted elements has the larger value.",
    ],
    tryThis: [
      "Compare sodium (Na) and chlorine (Cl) on all four trends — predict which one loses electrons more easily before checking Metallic Character.",
      "Find the element with the smallest atomic radius on the table. Why does it end up there?",
      "Pick any two elements in the same group and explain, using Compare mode, why the lower one has the larger radius.",
      "Switch between Electronegativity and Metallic Character on the same two elements and notice how the gradient direction flips.",
    ],
  },

  explain: {
    questions: [
      {
        id: "chemistry-periodic-explain-001",
        question: "Why does atomic radius decrease across a period even though more electrons are being added?",
        answer:
          "Across a period, electrons are added to the same outer shell while protons are also added to the nucleus. The growing nuclear charge pulls that shell in more tightly than the added electrons expand it, so the net effect is a smaller atom, not a larger one.",
      },
      {
        id: "chemistry-periodic-explain-002",
        question: "Why does atomic radius increase down a group?",
        answer:
          "Each new period adds an entirely new, outer electron shell farther from the nucleus. Even though nuclear charge also increases down a group, the jump to a new shell dominates, so atoms get larger overall.",
      },
      {
        id: "chemistry-periodic-explain-003",
        question: "Why does ionization energy increase across a period?",
        answer:
          "As nuclear charge grows across a period, the nucleus holds its outer electrons more tightly, so more energy is required to pull one away. This is the same underlying cause — growing nuclear pull — as the radius trend, just observed as an energy rather than a size.",
      },
      {
        id: "chemistry-periodic-explain-004",
        question: "Why do electronegativity and metallic character trend in opposite directions?",
        answer:
          "Electronegativity measures how strongly an atom attracts electrons; metallic character measures how readily it gives electrons up. These are near-opposite behaviors, so it makes sense they're strongest in opposite corners of the table — electronegativity toward the upper-right (small atoms with a strong nuclear pull), metallic character toward the lower-left (large atoms that hold their outer electrons loosely).",
      },
    ],
  },

  practice: {
    quizId: "chemistry-periodic-trends",
  },

  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use Compare mode on the live table to check your reasoning before answering.",
    scenarios: [
      {
        id: "chemistry-periodic-challenge-001",
        title: "Radius Face-Off",
        scenario: "Two elements: magnesium (Mg, period 3, group 2) and calcium (Ca, period 4, group 2).",
        objective: "Determine which element has the larger atomic radius.",
        constraints: [{ id: "c1", label: "Both are in group 2, so compare their positions down the group." }],
        tools: [
          { id: "trend-selector", label: "Trend selector — set to Atomic Radius" },
          { id: "compare-mode", label: "Compare mode with Mg and Ca selected" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "mg", label: "Magnesium" },
            { id: "ca", label: "Calcium" },
          ],
          correctOptionId: "ca",
        },
        explanation:
          "Atomic radius increases down a group. Calcium sits one period below magnesium in the same group, with an extra electron shell, making it the larger atom. Confirming this in Compare mode should show calcium's cell brighter on the Atomic Radius gradient.",
        hints: [
          "Both elements are in group 2 — this is purely a down-a-group comparison.",
          "Does atomic radius increase or decrease moving down a group?",
          "Calcium is one period below magnesium.",
        ],
      },
      {
        id: "chemistry-periodic-challenge-002",
        title: "Electronegativity Ranking",
        scenario: "Three elements: nitrogen (N), oxygen (O), and fluorine (F) — all period 2, groups 15, 16, and 17.",
        objective: "Determine which of the three has the highest electronegativity.",
        constraints: [{ id: "c1", label: "All three are in the same period — compare their positions across it." }],
        tools: [
          { id: "trend-selector", label: "Trend selector — set to Electronegativity" },
          { id: "table", label: "Periodic table color gradient" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "n", label: "Nitrogen" },
            { id: "o", label: "Oxygen" },
            { id: "f", label: "Fluorine" },
          ],
          correctOptionId: "f",
        },
        explanation:
          "Electronegativity increases across a period. Of the three, fluorine sits farthest to the right, and it's in fact the single most electronegative element on the entire periodic table.",
        hints: [
          "All three elements are in period 2 — this is purely an across-a-period comparison.",
          "Electronegativity increases moving left to right across a period.",
          "Which of the three sits farthest to the right?",
        ],
      },
      {
        id: "chemistry-periodic-challenge-003",
        title: "Real-World Mission: Explain the Reactivity Gap",
        scenario:
          "Sodium (Na) reacts violently when dropped in water, fizzing and sometimes igniting. Chlorine (Cl), just seven places to the right in the same period, does not react with water anywhere near as dramatically, and behaves very differently overall.",
        objective:
          "Use the Metallic Character trend to determine which of the two elements has the greater metallic character, and confirm that matches sodium's much higher reactivity as a metal.",
        constraints: [{ id: "c1", label: "Use the live table's Metallic Character gradient, not just intuition." }],
        tools: [
          { id: "trend-selector", label: "Trend selector — set to Metallic Character" },
          { id: "compare-mode", label: "Compare mode with Na and Cl selected" },
        ],
        answer: {
          mode: "choice",
          options: [
            { id: "na", label: "Sodium has the greater metallic character" },
            { id: "cl", label: "Chlorine has the greater metallic character" },
          ],
          correctOptionId: "na",
        },
        explanation:
          "Metallic character is strongest toward the lower-left of the table. Sodium, in group 1, readily loses its single outer electron — the behavior behind its dramatic reactivity with water. Chlorine, close to the upper-right, tends to gain an electron rather than lose one, which is why it behaves so differently as a nonmetal.",
        hints: [
          "Metallic character is about how easily an atom gives up electrons.",
          "Sodium is in group 1 (far left); chlorine is in group 17 (far right) — same period.",
          "Which corner of the table has the strongest metallic character: lower-left, or upper-right?",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [],
};
