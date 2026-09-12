import type { TopicContent } from "../types";

/**
 * Interactive Cell Explorer — Biology GLE Batch 4 ("DNA & Cell
 * Exploration"), topic 2 of 2.
 *
 * Reuses the existing `CellExplorer` simulation
 * (`@/features/subjects/biology/cell-explorer`) exactly as-is: it
 * already supports switching between Animal and Plant cell views,
 * clicking any organelle for a name/description/fact info panel,
 * a "Show labels" toggle to see every organelle name at once, and
 * zoom/pan controls that re-center on whatever's selected — so no
 * simulation code changes were needed.
 *
 * Per the batch's scope, this topic is positioned as an *interactive
 * application* of cell-biology concepts already taught in depth by
 * What Is a Cell?, Cell Structure & Organization, Cell Organelles,
 * and Plant vs Animal Cells — this GLE's Learn section stays
 * intentionally short and points to those topics for the full
 * explanations, focusing instead on using the explorer itself,
 * comparing cell types hands-on, and seeing organelles work together
 * as a system (the "DNA → nucleus → ribosome → protein → Golgi →
 * vesicle" pathway below).
 *
 * `practice.quizId` points at the existing `biology-cell-explorer`
 * quiz bank, extended from 5 to 30 questions for this GLE (see that
 * file's doc comment) — the same "extend the existing bank in place"
 * pattern `biology-cellular-respiration.tsx` used, rather than a
 * second, duplicate bank for the same simulation.
 */
export const biologyCellExplorerContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "cell-explorer",
  title: "Interactive Cell Explorer",
  subjectLabel: "Biology",
  topicLabel: "Cell Structure",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/cell-explorer",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Locate and identify the major organelles in both an animal cell and a plant cell.",
      "Connect each organelle to its main function, using the explorer's info panel.",
      "Identify which structures appear only in plant cells, and explain why animal cells don't need them.",
      "Describe, at a simple level, how organelles cooperate rather than working in isolation.",
    ],
    concepts: [
      {
        term: "This is an exploration tool, not a new lesson",
        explanation:
          "You've likely already met these organelles in earlier topics (Cell Organelles, Plant vs Animal Cells). This simulation is where you apply that knowledge hands-on: clicking around a real cell layout, comparing the two cell types side by side, and testing what you remember — rather than reading the explanations again from scratch.",
      },
      {
        term: "Shared structures",
        explanation:
          "The nucleus, mitochondria, ribosomes, endoplasmic reticulum, Golgi apparatus, cytoplasm, and cell membrane all appear in both the Animal Cell and Plant Cell views — these are core structures common to almost all cells, regardless of type.",
      },
      {
        term: "Plant-only structures",
        explanation:
          "Switching to the Plant Cell view adds a rigid cell wall (structural support), a large central vacuole (storage and internal pressure), chloroplasts (photosynthesis), and plasmodesmata (channels connecting neighboring plant cells) — features that support functions animal cells don't need, like making their own food or maintaining a fixed shape without a skeleton.",
      },
      {
        term: "Organelles working together, not in isolation",
        explanation:
          "A cell's organelles cooperate as a system to get real jobs done. A simplified example: the nucleus holds the DNA instructions for a protein, a ribosome reads those instructions and builds the protein, and the Golgi apparatus then packages that finished protein into a vesicle for delivery. No single organelle could complete that job alone.",
      },
    ],
    whyItMatters:
      "Every living thing you can see is built from cells like the ones in this explorer, and the organelles inside explain real biology you've probably heard of. Problems with mitochondria are linked to fatigue and certain diseases. Chloroplasts are the reason plants — and the oxygen we breathe — exist at all. Exploring a cell's actual layout, rather than just reading a list of parts, is how biologists build a working mental model of how life's basic unit actually operates.",
    keyTerms: [
      { term: "Organelle", definition: "A specialized structure inside a cell that carries out a specific job, such as the nucleus or mitochondria." },
      { term: "Selective permeability", definition: "The cell membrane's property of allowing some substances through while blocking others." },
      { term: "Cell wall", definition: "A rigid structure surrounding plant cells (but not animal cells) that provides structural support." },
      { term: "Vesicle", definition: "A small, membrane-bound sac used to transport materials, such as a finished protein, within or out of a cell." },
    ],
    misconceptions: [
      {
        id: "misconception-plant-only-shared-organelles",
        misconception: "Only plant cells have a nucleus and mitochondria.",
        correction:
          "The nucleus and mitochondria appear in both the Animal Cell and Plant Cell views — they are core organelles shared by both cell types. Only the cell wall, large central vacuole, chloroplast, and plasmodesmata are plant-specific.",
      },
      {
        id: "misconception-organelles-work-alone",
        misconception: "Each organelle works completely independently of the others.",
        correction:
          "Many cellular processes need several organelles cooperating in sequence — building and shipping a protein, for example, involves the nucleus, ribosomes, and the Golgi apparatus each doing a distinct part of the same job.",
      },
      {
        id: "misconception-chloroplast-decorative",
        misconception: "Chloroplasts are just a decorative, green-colored part of plant cells with no essential job.",
        correction:
          "Chloroplasts are where photosynthesis happens — they let a plant produce its own food from light, water, and carbon dioxide. Without them, a plant couldn't make the glucose it needs to survive.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Make your prediction, then click into the explorer to check yourself.",
    scenarios: [
      {
        id: "biology-cell-explorer-predict-001",
        scenario: "You want to find the organelle that produces most of a cell's usable energy (ATP).",
        question: "Which organelle should you click?",
        options: [
          { id: "mitochondria", label: "Mitochondria" },
          { id: "nucleus", label: "Nucleus" },
          { id: "golgi", label: "Golgi apparatus" },
          { id: "ribosomes", label: "Ribosomes" },
        ],
        actualResultOptionId: "mitochondria",
        explanation: "Mitochondria are the site of most ATP production, which is why they're nicknamed the powerhouse of the cell.",
        hint: "Think of the organelle's well-known nickname involving power.",
      },
      {
        id: "biology-cell-explorer-predict-002",
        scenario: "You want to find the organelle that contains the cell's genetic material (DNA).",
        question: "Which organelle should you click?",
        options: [
          { id: "nucleus", label: "Nucleus" },
          { id: "mitochondria", label: "Mitochondria" },
          { id: "cell-membrane", label: "Cell membrane" },
          { id: "ribosomes", label: "Ribosomes" },
        ],
        actualResultOptionId: "nucleus",
        explanation: "The nucleus stores the cell's DNA and directs its overall activities.",
        hint: "This organelle is often called the cell's control center.",
      },
      {
        id: "biology-cell-explorer-predict-003",
        scenario: "You want to find the organelle that modifies and packages proteins before they're shipped elsewhere in the cell.",
        question: "Which organelle should you click?",
        options: [
          { id: "golgi", label: "Golgi apparatus" },
          { id: "ribosomes", label: "Ribosomes" },
          { id: "nucleus", label: "Nucleus" },
          { id: "cell-wall", label: "Cell wall" },
        ],
        actualResultOptionId: "golgi",
        explanation: "The Golgi apparatus receives, modifies, and packages proteins for delivery — like a cell's post office.",
        hint: "Think of the organelle nicknamed the cell's shipping department.",
      },
      {
        id: "biology-cell-explorer-predict-004",
        scenario: "You want to find the structure that controls what substances enter and leave the cell.",
        question: "Which structure should you click?",
        options: [
          { id: "cell-membrane", label: "Cell membrane" },
          { id: "nucleolus", label: "Nucleolus" },
          { id: "mitochondria", label: "Mitochondria" },
          { id: "ribosomes", label: "Ribosomes" },
        ],
        actualResultOptionId: "cell-membrane",
        explanation: "The cell membrane is selectively permeable, regulating what crosses into or out of the cell.",
        hint: "This structure forms the outer boundary of the cell.",
      },
      {
        id: "biology-cell-explorer-predict-005",
        scenario: "You switch from the Animal Cell view to the Plant Cell view.",
        question: "Which of these structures should newly appear, that wasn't in the Animal Cell view?",
        options: [
          { id: "chloroplast", label: "Chloroplast" },
          { id: "nucleus", label: "Nucleus" },
          { id: "mitochondria", label: "Mitochondria" },
          { id: "ribosomes", label: "Ribosomes" },
        ],
        actualResultOptionId: "chloroplast",
        explanation: "Chloroplasts are plant-specific, appearing only in the Plant Cell view — the nucleus, mitochondria, and ribosomes are shared by both views.",
        hint: "Three of these four organelles are shared between both cell types — only one is plant-only.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Switch between the Animal Cell and Plant Cell views using the toggle above the cell.",
      "Click any organelle to open its info panel: name, what it does, and a memorable fact.",
      "Turn on 'Show labels' to see every organelle's name at once, instead of only on click.",
      "Use the zoom controls to get a closer look — zooming re-centers on whatever organelle you last selected, and you can drag to look around once zoomed in.",
      "Switch cell types and compare: which organelles stayed, and which ones changed?",
      "Use Reset at any time to return to the Animal Cell view with nothing selected.",
    ],
    tryThis: [
      "Find and click every organelle in the Animal Cell view at least once before switching to the Plant Cell view.",
      "Switch to the Plant Cell view and identify all four structures that didn't appear in the Animal Cell view.",
      "Zoom into the nucleus and describe, in your own words, what it's responsible for and why the cell needs it.",
      "Trace this simplified pathway using the explorer: click the nucleus (where DNA is stored), then ribosomes (which build proteins), then the Golgi apparatus (which packages them) — narrate each organelle's role as you go.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-cell-explorer-explain-001",
        question: "Why do plant cells have extra structures (cell wall, chloroplast, large central vacuole, plasmodesmata) that animal cells don't?",
        answer:
          "Plants have different needs than animals: they don't move around to find food, so they need chloroplasts to make their own via photosynthesis; they don't have a skeleton, so a rigid cell wall gives each cell — and the whole plant — structural support; and they benefit from a large central vacuole for water storage and internal pressure, plus plasmodesmata to share materials directly between neighboring cells. Animal cells simply don't face those same needs, so they don't carry the extra structures.",
      },
      {
        id: "biology-cell-explorer-explain-002",
        question: "Why is it useful to describe a cell's organelles as working together as a system, rather than as a list of separate parts?",
        answer:
          "Most real cellular tasks require more than one organelle. Building a working protein and delivering it where it's needed, for example, isn't something the nucleus, a ribosome, or the Golgi apparatus can do alone — each does one part of a coordinated sequence. Thinking of the cell as a system, rather than an unrelated list of parts, better matches how it actually functions.",
      },
      {
        id: "biology-cell-explorer-explain-003",
        question: "Why do the nucleus, mitochondria, and ribosomes appear in both the Animal Cell and Plant Cell views?",
        answer:
          "These are core structures needed by essentially all cells regardless of organism: every cell needs to store and access its genetic instructions (nucleus), produce usable energy (mitochondria), and build proteins (ribosomes). Since both plant and animal cells share these basic needs, both cell types carry these organelles.",
      },
      {
        id: "biology-cell-explorer-explain-004",
        question: "If a cell's mitochondria stopped functioning, what would you predict for the rest of the cell, and why?",
        answer:
          "Since mitochondria produce most of a cell's usable energy (ATP), a cell with non-functioning mitochondria would struggle to power its other activities — including the very processes (like building and transporting proteins) that depend on other organelles. This illustrates the 'working together as a system' idea: one organelle failing can limit what the rest of the cell is able to do.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live
    // in @/features/quiz-engine/data/biology-cell-explorer-quiz.ts.
    quizId: "biology-cell-explorer",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the explorer above to check visual questions, and use the hints if you get stuck.",
    scenarios: [
      {
        id: "biology-cell-explorer-challenge-001",
        title: "Identify an Organelle from Its Appearance",
        scenario: "In the Plant Cell view, you spot a green, oval-shaped structure.",
        objective: "Identify this structure.",
        tools: [{ id: "cell-switch", label: "Animal/Plant Cell switch" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Chloroplast" },
            { id: "b", label: "Mitochondria" },
            { id: "c", label: "Nucleus" },
            { id: "d", label: "Golgi apparatus" },
          ],
          correctOptionId: "a",
        },
        explanation: "The green color comes from chlorophyll inside chloroplasts, the plant-specific organelle responsible for photosynthesis.",
        hints: ["The green color is the key clue — which organelle's pigment gives it that color?"],
      },
      {
        id: "biology-cell-explorer-challenge-002",
        title: "Identify an Organelle from Its Function",
        scenario: "You're told an organelle 'packages and ships proteins to wherever they're needed in the cell.'",
        objective: "Name this organelle.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Golgi apparatus" },
            { id: "b", label: "Ribosomes" },
            { id: "c", label: "Nucleus" },
            { id: "d", label: "Cell membrane" },
          ],
          correctOptionId: "a",
        },
        explanation: "Packaging and shipping proteins is exactly the Golgi apparatus's role — think of it as the cell's post office.",
        hints: ["Which organelle is nicknamed the cell's shipping or postal department?"],
      },
      {
        id: "biology-cell-explorer-challenge-003",
        title: "Complete a Cellular Pathway",
        scenario: "Consider the pathway: DNA in the nucleus → ? → protein → Golgi apparatus → vesicle.",
        objective: "Identify the missing organelle in this pathway.",
        tools: [{ id: "info-panel", label: "Organelle info panel" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Ribosome" },
            { id: "b", label: "Mitochondria" },
            { id: "c", label: "Cell wall" },
            { id: "d", label: "Vacuole" },
          ],
          correctOptionId: "a",
        },
        explanation: "The ribosome is the organelle that reads DNA's instructions and builds the actual protein — the missing step between the nucleus and a finished protein.",
        hints: ["Which organelle is responsible for actually building proteins?"],
      },
      {
        id: "biology-cell-explorer-challenge-004",
        title: "Plant vs Animal Cell Identification",
        scenario: "You're shown a description: 'A rigid structure surrounding the cell, providing support, only present in one of the two cell types.'",
        objective: "Determine which structure this is, and which cell type has it.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Cell wall — plant cells only" },
            { id: "b", label: "Cell membrane — animal cells only" },
            { id: "c", label: "Nucleus — plant cells only" },
            { id: "d", label: "Mitochondria — animal cells only" },
          ],
          correctOptionId: "a",
        },
        explanation: "The cell wall is the rigid, structural, plant-only structure — the cell membrane, nucleus, and mitochondria are all found in both cell types.",
        hints: ["Three of these four options describe structures shared by both cell types — only one is genuinely exclusive to one type."],
      },
      {
        id: "biology-cell-explorer-challenge-005",
        title: "Predict a Disrupted Function",
        scenario: "A cell's Golgi apparatus suddenly stops functioning.",
        objective: "Predict what happens to proteins the cell has already built.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "They won't be properly modified or packaged for delivery to where they're needed" },
            { id: "b", label: "They will be converted directly into new DNA" },
            { id: "c", label: "Nothing changes, since the Golgi apparatus isn't involved in proteins" },
            { id: "d", label: "The cell will immediately stop producing energy" },
          ],
          correctOptionId: "a",
        },
        explanation: "Without a working Golgi apparatus, proteins the cell builds won't be properly modified and packaged, disrupting delivery to wherever they're needed.",
        hints: ["Think about which specific job the Golgi apparatus performs in the protein pathway."],
      },
      {
        id: "biology-cell-explorer-challenge-006",
        title: "Match Structures With Roles",
        scenario: "Consider three structures: mitochondria, ribosomes, and the cell membrane.",
        objective: "Select the option that correctly matches all three structures to their roles.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            {
              id: "a",
              label: "Mitochondria: energy production. Ribosomes: protein building. Cell membrane: controls entry/exit.",
            },
            {
              id: "b",
              label: "Mitochondria: protein building. Ribosomes: energy production. Cell membrane: controls entry/exit.",
            },
            {
              id: "c",
              label: "Mitochondria: controls entry/exit. Ribosomes: energy production. Cell membrane: protein building.",
            },
            {
              id: "d",
              label: "Mitochondria: energy production. Ribosomes: controls entry/exit. Cell membrane: protein building.",
            },
          ],
          correctOptionId: "a",
        },
        explanation: "Mitochondria produce energy, ribosomes build proteins, and the cell membrane controls what enters and leaves the cell — each structure has one distinct, correctly matched role.",
        hints: ["Work through each structure one at a time rather than comparing the answer choices as whole blocks."],
      },
      {
        id: "biology-cell-explorer-challenge-007",
        title: "Find a Structure by Elimination",
        scenario: "You're told a structure appears in the Plant Cell view, is not involved in photosynthesis, and stores water and nutrients while helping the cell hold its shape.",
        objective: "Identify this structure.",
        requiresExperiment: false,
        maxAttempts: 2,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Large central vacuole" },
            { id: "b", label: "Chloroplast" },
            { id: "c", label: "Ribosomes" },
            { id: "d", label: "Golgi apparatus" },
          ],
          correctOptionId: "a",
        },
        explanation: "The large central vacuole stores water and nutrients and helps maintain the cell's shape through internal pressure — distinct from the chloroplast's photosynthesis role.",
        hints: ["Eliminate the option responsible for photosynthesis first, since the clue rules it out directly."],
      },
    ],
  },
};
