import type { TopicContent } from "../types";

/**
 * Plant vs Animal Cells — Biology Batch 1 ("Cell Biology
 * Foundations"), topic 4 of 7 (see
 * `@/features/learning-path/data/biology-cell-foundations`).
 *
 * Reuses the same Interactive Cell Explorer
 * (`@/features/subjects/biology/cell-explorer`) as Topics 2 and 3,
 * this time using its Animal Cell / Plant Cell switch as the whole
 * point of the lesson rather than picking one view. The Challenge
 * scenarios below ask the student to check the SAME structure in both
 * views (e.g. "does the Animal Cell view have a clickable cell wall?")
 * — every comparison is scoped to what's actually different between
 * the two views in the simulation (Plant Cell adds: cell wall, cell
 * membrane, cytoplasm, and plasmodesmata as separately clickable
 * regions the Animal Cell view doesn't have, plus chloroplasts and a
 * large central vacuole as organelles the Animal Cell view doesn't
 * have at all) rather than an invented list.
 *
 * `practice.quizId` points at a new, dedicated 13-question bank
 * (`@/features/quiz-engine/data/biology-plant-vs-animal-cells-quiz.ts`).
 */
export const biologyPlantVsAnimalCellsContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "plant-vs-animal-cells",
  title: "Plant vs Animal Cells",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/plant-vs-animal-cells",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "List the structures plant and animal cells share.",
      "Name the structures found only in plant cells, and explain what each one does.",
      "Explain why plant cells have a cell wall, chloroplasts, and a large central vacuole while animal cells don't.",
      "Connect each plant-only structure to the specific job it does for the cell.",
    ],
    concepts: [
      {
        term: "Shared structures",
        explanation:
          "Both plant and animal cells have a cell membrane, cytoplasm, a nucleus, mitochondria, and ribosomes — every structure covered in the last topic that isn't tied to photosynthesis or rigid support belongs to both.",
      },
      {
        term: "Cell wall (plant only)",
        explanation:
          "A rigid outer layer, built mainly from cellulose, sitting just outside the cell membrane. It gives the plant cell a fixed shape and protects it — something a plant needs since, unlike an animal, it can't move to avoid damage.",
      },
      {
        term: "Chloroplast (plant only)",
        explanation:
          "Captures sunlight and turns it into food through photosynthesis. Plants make their own food this way; animals get energy by eating instead, so animal cells don't need this organelle.",
      },
      {
        term: "Large central vacuole (plant only)",
        explanation:
          "A large internal sac that stores water and helps keep the plant cell firm and upright, pushing outward against the cell wall. It can take up to 90% of a mature plant cell's volume — far larger than anything in an animal cell.",
      },
      {
        term: "Structure-function relationship",
        explanation:
          "Every plant-only structure exists because of something a plant specifically needs to do: stay upright without a skeleton (cell wall + vacuole) and make its own food (chloroplast). A structure's shape and job are almost always connected.",
      },
    ],
    whyItMatters:
      "Knowing exactly what makes a plant cell different from an animal cell — not just \"plants are green\" — is what lets you actually explain things like why a wilted plant perks back up after watering (the vacuole refilling), or why you can eat a leaf's cell walls but your gut can't break them down the way it does starch (cellulose fiber). It's also the single most commonly tested comparison in introductory cell biology.",
    keyTerms: [
      { term: "Cellulose", definition: "The tough, fibrous carbohydrate that plant cell walls are mainly built from." },
      { term: "Turgor", definition: "The firmness of a plant cell caused by water pressure pushing the cell membrane against the cell wall — mostly from the large central vacuole." },
      { term: "Photosynthesis", definition: "The process, carried out by chloroplasts, of turning sunlight into food (glucose)." },
    ],
    misconceptions: [
      {
        id: "misconception-animal-cells-no-membrane",
        misconception: "Only plant cells have a cell membrane, since animal cells don't have a cell wall.",
        correction:
          "Every cell — plant or animal — has a cell membrane; it's one of the structures both share. Only the rigid cell wall is plant-specific; the membrane underneath it is common to both.",
      },
      {
        id: "misconception-animal-cells-no-vacuoles",
        misconception: "Animal cells have no vacuoles at all.",
        correction:
          "Animal cells can have small vacuoles for temporary storage, but nothing like the plant cell's single large central vacuole, which is far bigger and central to keeping the cell firm.",
      },
      {
        id: "misconception-chloroplast-and-mitochondria-same",
        misconception: "Chloroplasts and mitochondria do the same job.",
        correction:
          "They're opposite steps of energy flow: chloroplasts (plant-only) capture sunlight to build food (photosynthesis), while mitochondria (in both plant and animal cells) break that food down to release usable energy (cellular respiration).",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm using the Cell Comparison Mission below.",
    scenarios: [
      {
        id: "biology-plant-vs-animal-cells-predict-001",
        scenario: "You compare a plant cell and an animal cell side by side.",
        question: "Which structure would you expect to find in BOTH cells?",
        options: [
          { id: "mitochondria", label: "Mitochondria" },
          { id: "chloroplast", label: "Chloroplast" },
          { id: "cell-wall", label: "Cell wall" },
        ],
        actualResultOptionId: "mitochondria",
        explanation: "Mitochondria appear in both plant and animal cells — nearly every eukaryotic cell needs them for energy. The cell wall and chloroplast are plant-only.",
        hint: "Which of these three organelles isn't tied to photosynthesis or rigid support?",
      },
      {
        id: "biology-plant-vs-animal-cells-predict-002",
        scenario: "A plant cell is placed in very dry conditions and loses much of the water in its large central vacuole.",
        question: "What is the most likely visible effect on the plant?",
        options: [
          { id: "wilting", label: "The plant wilts, losing its firm, upright shape" },
          { id: "grows-cell-wall", label: "The plant quickly grows a thicker cell wall" },
          { id: "no-effect", label: "No visible effect — the vacuole doesn't affect shape" },
        ],
        actualResultOptionId: "wilting",
        explanation: "The large central vacuole's water pressure is what keeps a plant cell firm; losing that water causes the classic wilting you can watch happen to an underwatered plant.",
        hint: "What does the vacuole normally do for the cell's shape?",
      },
      {
        id: "biology-plant-vs-animal-cells-predict-003",
        scenario: "You're told a cell has chloroplasts.",
        question: "What can you conclude about this cell?",
        options: [
          { id: "plant-cell", label: "It's a plant cell" },
          { id: "animal-cell", label: "It's an animal cell" },
          { id: "cant-tell", label: "You can't tell — both cell types can have chloroplasts" },
        ],
        actualResultOptionId: "plant-cell",
        explanation: "Chloroplasts are exclusive to plant cells (they capture sunlight for photosynthesis) — finding one is enough on its own to identify the cell as a plant cell.",
        hint: "Which organelle from this topic is plant-only?",
      },
      {
        id: "biology-plant-vs-animal-cells-predict-004",
        scenario: "An animal cell and a plant cell are both placed under stress that would normally damage a fragile cell.",
        question: "Which cell has extra structural protection the other lacks?",
        options: [
          { id: "plant-cell-wall", label: "The plant cell, due to its rigid cell wall" },
          { id: "animal-cell-membrane", label: "The animal cell, due to its cell membrane" },
          { id: "equal", label: "Both are equally protected" },
        ],
        actualResultOptionId: "plant-cell-wall",
        explanation: "The rigid cell wall gives the plant cell extra structural protection the animal cell doesn't have — the animal cell only has the more flexible cell membrane, which both cell types share.",
        hint: "Which structure is unique to the plant cell and provides rigid support?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start on the Animal Cell view in the Cell Explorer and click through its organelles: nucleus, mitochondria, ribosomes, rough ER, and Golgi apparatus.",
      "Switch to the Plant Cell view using the toggle and notice what's new: the cell wall, cell membrane, and cytoplasm are now separately clickable, and there are chloroplasts and a large central vacuole.",
      "Click the cell wall in the Plant Cell view, then try to find an equivalent in the Animal Cell view — there isn't one.",
      "Click a chloroplast, then the large central vacuole, and read what each does.",
    ],
    tryThis: [
      "Switch back and forth between the two views a few times and count exactly how many structures are unique to the Plant Cell view.",
      "See if you can name the job of every structure the Plant Cell view has that the Animal Cell view doesn't, without looking it up first.",
      "Turn on \"Show labels\" on both views to check your answers all at once.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-plant-vs-animal-cells-explain-001",
        question: "Why does it make sense that plant cells have three structures (cell wall, chloroplast, large central vacuole) that animal cells lack, rather than just one?",
        answer:
          "Each solves a different problem a stationary, food-producing organism has that a mobile, food-eating one doesn't: the cell wall provides fixed structural support, the chloroplast produces the plant's own food, and the vacuole provides firmness through water pressure — three separate jobs, so three separate structures.",
      },
      {
        id: "biology-plant-vs-animal-cells-explain-002",
        question: "An animal cell placed in a similar situation to a wilting plant cell doesn't \"wilt\" the same way — why not?",
        answer:
          "Animal cells don't rely on a large central vacuole's water pressure against a rigid cell wall for their shape the way plant cells do, so they don't collapse into a limp, wilted shape when they lose water the same way — though they can still be damaged by extreme water loss in other ways.",
      },
      {
        id: "biology-plant-vs-animal-cells-explain-003",
        question: "Why is finding even one chloroplast enough to identify a cell as a plant cell, when finding one mitochondrion isn't enough to identify a cell as either type?",
        answer:
          "Chloroplasts are exclusive to plant cells, so their presence rules out an animal cell entirely. Mitochondria appear in both plant and animal cells, so finding one only tells you the cell is eukaryotic — it doesn't distinguish between the two.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-plant-vs-animal-cells",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Cell Comparison Mission
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the Cell Explorer above, switching between the Animal Cell and Plant Cell views, to answer each question. Use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-plant-vs-animal-cells-challenge-001",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Comparison Mission: Find the Nucleus in Both",
        scenario: "Click the nucleus in the Animal Cell view, then switch to the Plant Cell view and click it there too.",
        objective: "Confirm whether the nucleus appears in both cell types.",
        tools: [{ id: "cell-explorer-both-views", label: "Animal Cell and Plant Cell views — nucleus hotspot" }],
        answer: {
          mode: "choice",
          options: [
            { id: "both", label: "Yes — it's in both" },
            { id: "animal-only", label: "Only the Animal Cell" },
            { id: "plant-only", label: "Only the Plant Cell" },
          ],
          correctOptionId: "both",
        },
        explanation: "The nucleus is one of the shared structures — you can click it in both the Animal Cell and Plant Cell views.",
        hints: ["Is the nucleus tied to photosynthesis or rigid support, or is it something every cell needs?"],
      },
      {
        id: "biology-plant-vs-animal-cells-challenge-002",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Comparison Mission: Find the Cell Wall",
        scenario: "Try to click a cell wall in the Animal Cell view, then check the Plant Cell view.",
        objective: "Determine which view actually has a clickable cell wall.",
        tools: [{ id: "cell-explorer-plant-view", label: "Plant Cell view — cell wall hotspot" }],
        answer: {
          mode: "choice",
          options: [
            { id: "plant-only", label: "Only the Plant Cell" },
            { id: "animal-only", label: "Only the Animal Cell" },
            { id: "both", label: "Both cell types" },
          ],
          correctOptionId: "plant-only",
        },
        explanation: "Only the Plant Cell view has a cell wall — it's a structure unique to plant cells, giving them rigid support the animal cell doesn't have.",
        hints: ["Which cell type needs rigid outer support since it can't move?"],
      },
      {
        id: "biology-plant-vs-animal-cells-challenge-003",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Comparison Mission: Find the Mitochondria",
        scenario: "Click a mitochondrion in the Animal Cell view, then find one in the Plant Cell view too.",
        objective: "Confirm whether mitochondria appear in both cell types.",
        tools: [{ id: "cell-explorer-both-views-mito", label: "Animal Cell and Plant Cell views — mitochondria hotspots" }],
        answer: {
          mode: "choice",
          options: [
            { id: "both", label: "Yes — it's in both" },
            { id: "plant-only", label: "Only the Plant Cell" },
            { id: "animal-only", label: "Only the Animal Cell" },
          ],
          correctOptionId: "both",
        },
        explanation: "Mitochondria appear in both cell types — plant cells still need to release usable energy from food, just like animal cells do.",
        hints: ["Does energy production only matter for animals?"],
      },
      {
        id: "biology-plant-vs-animal-cells-challenge-004",
        requiresExperiment: false, // Explore above already embeds the live simulation on this page — a second copy would be redundant.
        title: "Cell Comparison Mission: Find the Chloroplast",
        scenario: "Try to find a chloroplast in the Animal Cell view, then check the Plant Cell view.",
        objective: "Determine which view has chloroplasts, and identify one major difference between the two cell types.",
        tools: [{ id: "cell-explorer-plant-view-chloroplast", label: "Plant Cell view — chloroplast hotspot" }],
        answer: {
          mode: "choice",
          options: [
            { id: "plant-only", label: "Only the Plant Cell — chloroplasts are exclusive to plant cells" },
            { id: "animal-only", label: "Only the Animal Cell" },
            { id: "both", label: "Both cell types" },
          ],
          correctOptionId: "plant-only",
        },
        explanation: "Chloroplasts appear only in the Plant Cell view — they capture sunlight for photosynthesis, which only plants need to do to make their own food.",
        hints: ["Which organelle is tied to a plant making its own food from sunlight?"],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "cell-organelles",
      label: "Cell Organelles",
      href: "/dashboard/biology/cell-organelles",
      reason: "Covers what each shared organelle does in detail before comparing plant and animal cells.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cell-membrane",
      label: "Cell Membrane",
      href: "/dashboard/biology/cell-membrane",
      reason: "Looks closely at the one boundary structure every cell — plant or animal — has in common.",
    },
  ],
};
