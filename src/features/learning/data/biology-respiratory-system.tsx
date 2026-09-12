import type { TopicContent } from "../types";

/**
 * Respiratory System — Biology GLE Batch 3 ("Human Physiology"),
 * topic 2 of 2. Reuses the existing `RespiratorySystem` simulation
 * (`@/features/subjects/biology/respiratory-system`) with one
 * additive change: an animated diaphragm (synced to the same `phase`
 * value already driving lung size) plus a new `BreathingMechanics`
 * panel, since the simulation previously had no diaphragm, chest
 * volume, or pressure mechanics at all — a gap against this topic's
 * "major learning objective." Everything else (airway pathway,
 * alveoli zoom, oxygen/carbon dioxide particle journeys, inhale/
 * exhale controls) was reused as-is.
 */
export const biologyRespiratorySystemContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "respiratory-system",
  title: "Respiratory System: Breathing & Gas Exchange",
  subjectLabel: "Biology",
  topicLabel: "Human Physiology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/respiratory-system",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the respiratory system's purpose: bringing oxygen into the body and removing carbon dioxide.",
      "Trace the air pathway: nose/mouth → trachea → bronchi → bronchioles → alveoli.",
      "Explain breathing mechanics: how diaphragm movement changes chest volume, pressure, and airflow.",
      "Explain that breathing and gas exchange are two distinct, connected processes — not the same thing.",
      "Describe why the alveoli's large surface area and thin walls make gas exchange possible.",
      "State the direction oxygen and carbon dioxide each move during gas exchange.",
    ],
    concepts: [
      {
        term: "Breathing vs. gas exchange — two different processes",
        explanation:
          "Breathing is the mechanical process of moving air in and out of the lungs. Gas exchange is the separate process of oxygen and carbon dioxide actually crossing between the air in the alveoli and the blood in surrounding capillaries. Breathing supplies and clears the air that makes gas exchange possible, but the two are not the same event.",
      },
      {
        term: "The air pathway",
        explanation:
          "Air travels: nose or mouth → pharynx and larynx → trachea → bronchi (the trachea's two main branches) → bronchioles (progressively smaller branches) → alveoli, the tiny air sacs deep in the lungs where gas exchange happens.",
      },
      {
        term: "Breathing mechanics: the diaphragm drives it all",
        explanation:
          "The lungs have no muscles of their own — they can't actively pump air. Instead, the diaphragm (a dome-shaped muscle below the lungs) contracts and moves downward during inhalation, increasing the volume of the chest cavity. That larger volume drops the pressure inside the lungs below outside air pressure, so air flows in to equalize it. During exhalation, the diaphragm relaxes and moves back up, decreasing chest volume, raising pressure, and pushing air back out.",
      },
      {
        term: "Alveoli and gas exchange",
        explanation:
          "The lungs contain millions of tiny alveoli, giving them an enormous combined surface area. Each alveolus is surrounded by capillaries and has extremely thin walls, so oxygen can diffuse from the air inside it into the blood, while carbon dioxide diffuses from the blood into the air to be exhaled — no active pumping required, just diffusion across a thin surface.",
      },
      {
        term: "Where the gases go next",
        explanation:
          "Oxygen that crosses into the blood is carried by circulation to cells throughout the body. Carbon dioxide, produced as waste by those same cells, is carried back through the blood to the lungs, crosses into the alveoli, and is exhaled.",
      },
    ],
    whyItMatters:
      "Every breath is this entire chain happening automatically, about 12-20 times a minute, for an entire lifetime: a muscle contracting, a pressure difference forming, air rushing in, and gas quietly crossing a membrane thinner than a sheet of paper. Understanding it explains why conditions that stiffen the lungs or damage alveoli make breathing feel like real work, and why the diaphragm — not the lungs themselves — is what fails first in certain injuries.",
    keyTerms: [
      { term: "Trachea", definition: "The main airway tube connecting the throat to the bronchi." },
      { term: "Bronchi", definition: "The trachea's two main branches, one leading into each lung." },
      { term: "Bronchioles", definition: "The smallest branches of the airway, leading air to the alveoli." },
      { term: "Alveoli", definition: "Tiny, thin-walled air sacs in the lungs, surrounded by capillaries, where gas exchange occurs." },
      { term: "Diaphragm", definition: "A dome-shaped muscle beneath the lungs whose contraction and relaxation drives breathing." },
      { term: "Gas exchange", definition: "The diffusion of oxygen into the blood and carbon dioxide out of it, across the alveolar wall." },
    ],
    misconceptions: [
      {
        id: "misconception-lungs-actively-pump",
        misconception: "The lungs actively pump or suck air in, the way a vacuum cleaner or a muscle would.",
        correction:
          "The lungs have no muscles of their own and cannot actively pump air. They passively expand and contract in response to the pressure changes the diaphragm and chest muscles create — the diaphragm does the actual work.",
      },
      {
        id: "misconception-breathing-equals-gas-exchange",
        misconception: "Breathing and gas exchange are the same process.",
        correction:
          "Breathing is air physically moving in and out through the airway. Gas exchange is the separate process of oxygen and carbon dioxide crossing between alveolar air and the blood. Breathing makes gas exchange possible by supplying fresh air, but they're distinct steps.",
      },
      {
        id: "misconception-reversed-breathing-cause",
        misconception: "Air entering the lungs is what causes the diaphragm to contract.",
        correction:
          "The causal order is the reverse: the diaphragm contracts first, which increases chest volume and drops pressure — and that pressure drop is what causes air to flow in. The diaphragm's movement is the cause; airflow is the effect.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before pressing Inhale or Exhale in the simulation — then check what actually happens.",
    scenarios: [
      {
        id: "biology-respiratory-system-predict-001",
        scenario: "You're about to start an inhale in the simulation.",
        question: "What happens to the diaphragm during inhalation?",
        options: [
          { id: "contracts-down", label: "It contracts and moves downward" },
          { id: "relaxes-up", label: "It relaxes and moves upward" },
          { id: "stays-still", label: "It stays completely still" },
          { id: "disappears", label: "It temporarily stops functioning" },
        ],
        actualResultOptionId: "contracts-down",
        explanation: "During inhalation, the diaphragm contracts and moves downward, increasing the chest cavity's volume.",
        hint: "Watch the diaphragm line in the simulation as the lungs expand.",
      },
      {
        id: "biology-respiratory-system-predict-002",
        scenario: "The diaphragm has just moved downward.",
        question: "What happens to chest volume as a result?",
        options: [
          { id: "increases", label: "It increases" },
          { id: "decreases", label: "It decreases" },
          { id: "stays-same", label: "It stays exactly the same" },
          { id: "unrelated", label: "Chest volume has nothing to do with the diaphragm" },
        ],
        actualResultOptionId: "increases",
        explanation: "A downward-moving diaphragm makes more room in the chest cavity, increasing thoracic volume.",
        hint: "More room below the lungs means more space overall.",
      },
      {
        id: "biology-respiratory-system-predict-003",
        scenario: "Chest volume has just increased.",
        question: "Which direction does air move as a result?",
        options: [
          { id: "moves-in", label: "Into the lungs" },
          { id: "moves-out", label: "Out of the lungs" },
          { id: "stops-moving", label: "It stops moving entirely" },
          { id: "moves-sideways", label: "It moves sideways within the chest only" },
        ],
        actualResultOptionId: "moves-in",
        explanation: "Increased chest volume drops the pressure inside the lungs below outside air pressure, so air flows in — this is inhalation.",
        hint: "Think about which direction air always flows: from higher pressure to lower pressure.",
      },
      {
        id: "biology-respiratory-system-predict-004",
        scenario: "You zoom into a single alveolus in the simulation.",
        question: "Where does gas exchange actually occur?",
        options: [
          { id: "alveoli", label: "In the alveoli, across their thin walls" },
          { id: "trachea", label: "In the trachea" },
          { id: "bronchi", label: "In the bronchi" },
          { id: "diaphragm", label: "In the diaphragm" },
        ],
        actualResultOptionId: "alveoli",
        explanation: "Gas exchange happens specifically in the alveoli, where their thin walls and surrounding capillaries make diffusion possible.",
        hint: "Which structure is specifically built for exchange, rather than just moving air along?",
      },
      {
        id: "biology-respiratory-system-predict-005",
        scenario: "You're watching a particle move during gas exchange at the alveoli.",
        question: "Which direction does carbon dioxide move?",
        options: [
          { id: "blood-to-air", label: "From the blood into the alveolar air" },
          { id: "air-to-blood", label: "From the alveolar air into the blood" },
          { id: "stays-in-blood", label: "It stays in the blood permanently" },
          { id: "no-movement", label: "Carbon dioxide doesn't move during gas exchange" },
        ],
        actualResultOptionId: "blood-to-air",
        explanation: "Carbon dioxide moves from the blood into the alveolar air, opposite to oxygen's direction, ready to be exhaled.",
        hint: "Carbon dioxide is a waste product being dropped off, not picked up.",
      },
      {
        id: "biology-respiratory-system-predict-006",
        scenario: "The simulation moves into exhalation.",
        question: "What happens to airflow when lung volume decreases?",
        options: [
          { id: "flows-out", label: "Air flows out of the lungs" },
          { id: "flows-in", label: "Air continues flowing in" },
          { id: "stops", label: "Airflow stops completely until the next inhale" },
          { id: "reverses-alveoli", label: "Only the alveoli reverse; the rest of the airway doesn't" },
        ],
        actualResultOptionId: "flows-out",
        explanation: "As lung volume decreases during exhalation, pressure inside rises above outside pressure, pushing air back out.",
        hint: "This is the mirror image of what happens during inhalation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Inhale and watch the airway, lungs, and diaphragm together — notice the diaphragm moving down as the lungs expand.",
      "Read the Breathing Mechanics panel while inhaling: watch which column (Inhale or Exhale) lights up, and follow the diaphragm → volume → pressure → air chain.",
      "Press Exhale and watch the same chain run in reverse — the diaphragm relaxes and moves up as the lungs contract.",
      "Use Zoom to look closely at a single alveolus and watch oxygen and carbon dioxide particles cross in opposite directions.",
      "Use Pause and Reset to stop at any point and study the current state before continuing.",
    ],
    tryThis: [
      "Pause right after pressing Inhale, and narrate the full chain out loud: diaphragm moves down → chest volume increases → pressure drops → air moves in.",
      "Do the same narration for exhalation, in reverse.",
      "Zoom into the alveolus and point out, out loud, which particle is oxygen and which direction it's moving, and the same for carbon dioxide.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-respiratory-system-explain-001",
        question: "Why can't the lungs simply pump air in and out on their own?",
        answer:
          "The lungs are made of elastic tissue with no muscle fibers capable of actively contracting to pump air — unlike the heart, which is built of muscle specifically to pump blood. Instead, the lungs rely entirely on the diaphragm and chest muscles to change the volume around them; the lungs just passively follow whatever volume and pressure change those muscles create.",
      },
      {
        id: "biology-respiratory-system-explain-002",
        question: "Why does a drop in pressure inside the lungs cause air to flow in, rather than out?",
        answer:
          "Air, like any gas, always flows from an area of higher pressure to an area of lower pressure until the pressure equalizes. When the diaphragm's downward movement increases chest volume, the air already inside the lungs spreads out and its pressure drops below the pressure of the air outside the body. That pressure difference is what pulls outside air in — not any active suction by the lungs themselves.",
      },
      {
        id: "biology-respiratory-system-explain-003",
        question: "Why are breathing and gas exchange considered two separate processes, even though they happen close together in time?",
        answer:
          "Breathing is purely mechanical — muscles moving air through tubes. Gas exchange is a chemical/physical diffusion process — oxygen and carbon dioxide molecules crossing a thin membrane based on concentration differences, with no muscles involved at all. Breathing's role is to keep fresh air arriving at the alveoli and used air leaving, which keeps the concentration differences that drive gas exchange in place — but the actual molecule-crossing event is a distinct process happening at the alveolar wall.",
      },
      {
        id: "biology-respiratory-system-explain-004",
        question: "Why does the huge number of tiny alveoli matter more than having a few large ones?",
        answer:
          "Gas exchange happens by diffusion across surface area — more surface area lets more oxygen and carbon dioxide cross per second. Splitting the lungs' internal space into millions of tiny alveoli instead of a few large sacs dramatically increases the total surface area available for exchange, without needing the lungs themselves to be any bigger.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-respiratory-system-quiz.ts.
    quizId: "biology-respiratory-system",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the simulation's Inhale/Exhale controls and alveolus zoom to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-respiratory-system-challenge-001",
        title: "Identify the Correct Airflow Pathway",
        scenario: "Consider air on its way from the outside world to the alveoli.",
        objective: "Select the correct order of structures it passes through.",
        tools: [{ id: "inhale-control", label: "Inhale / Exhale controls" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Nose/mouth → trachea → bronchi → bronchioles → alveoli" },
            { id: "b", label: "Nose/mouth → bronchioles → trachea → bronchi → alveoli" },
            { id: "c", label: "Trachea → nose/mouth → alveoli → bronchi → bronchioles" },
            { id: "d", label: "Nose/mouth → alveoli → trachea → bronchi → bronchioles" },
          ],
          correctOptionId: "a",
        },
        explanation: "Air moves from the nose or mouth down the trachea, into the bronchi, through progressively smaller bronchioles, and finally into the alveoli.",
        hints: ["The airway gets progressively narrower and more branched the deeper air travels."],
      },
      {
        id: "biology-respiratory-system-challenge-002",
        title: "Predict Diaphragm Movement",
        scenario: "The simulation shows chest volume rapidly increasing.",
        objective: "Determine what the diaphragm is doing at this moment.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Contracting and moving downward" },
            { id: "b", label: "Relaxing and moving upward" },
            { id: "c", label: "Completely still" },
            { id: "d", label: "Moving sideways" },
          ],
          correctOptionId: "a",
        },
        explanation: "Increasing chest volume is caused specifically by the diaphragm contracting and moving downward.",
        hints: ["Which diaphragm movement makes more room in the chest cavity?"],
      },
      {
        id: "biology-respiratory-system-challenge-003",
        title: "Predict Airflow Direction",
        scenario: "Pressure inside the lungs has just risen above outside air pressure.",
        objective: "Determine which direction air will flow.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Out of the lungs" },
            { id: "b", label: "Into the lungs" },
            { id: "c", label: "Airflow stops entirely" },
            { id: "d", label: "Air flows in both directions equally" },
          ],
          correctOptionId: "a",
        },
        explanation: "Air always flows from higher to lower pressure — with lung pressure now higher than outside pressure, air flows out (exhalation).",
        hints: ["Air moves toward lower pressure, always."],
      },
      {
        id: "biology-respiratory-system-challenge-004",
        title: "Explain a Volume/Pressure Change",
        scenario: "A student observes the diaphragm relaxing and moving upward.",
        objective: "Explain what happens to chest volume and pressure, in order, as a result.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Chest volume decreases first, then pressure inside the lungs increases" },
            { id: "b", label: "Pressure decreases first, then chest volume increases" },
            { id: "c", label: "Chest volume increases and pressure increases simultaneously with no cause-effect order" },
            { id: "d", label: "Neither volume nor pressure changes when the diaphragm relaxes" },
          ],
          correctOptionId: "a",
        },
        explanation: "The diaphragm relaxing and moving up shrinks chest volume first; that smaller volume is what then raises the pressure inside the lungs, pushing air out.",
        hints: ["The diaphragm's movement is always the first domino to fall."],
      },
      {
        id: "biology-respiratory-system-challenge-005",
        title: "Identify Where Gas Exchange Occurs",
        scenario: "A student wants to know exactly where oxygen crosses into the blood.",
        objective: "Identify the specific structure responsible.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The alveoli, across their thin walls into surrounding capillaries" },
            { id: "b", label: "The trachea" },
            { id: "c", label: "The bronchioles" },
            { id: "d", label: "The diaphragm" },
          ],
          correctOptionId: "a",
        },
        explanation: "Gas exchange is localized entirely to the alveoli, whose thin walls and surrounding capillary network make diffusion with the blood possible.",
        hints: ["Which structure is specifically built with a huge surface area and thin walls for exchange?"],
      },
      {
        id: "biology-respiratory-system-challenge-006",
        title: "Diagnose an Incorrect Breathing Sequence",
        scenario: "A diagram claims: 'Air enters the lungs, and that pulls the diaphragm downward.'",
        objective: "Explain what's wrong with this sequence.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The order is backward — the diaphragm moves down first, and that's what causes air to enter" },
            { id: "b", label: "Nothing is wrong; this is the correct sequence" },
            { id: "c", label: "Air never actually enters the lungs" },
            { id: "d", label: "The diaphragm isn't involved in breathing at all" },
          ],
          correctOptionId: "a",
        },
        explanation: "The diaphragm's contraction and downward movement is the cause; the resulting volume and pressure change is what pulls air in — not the reverse.",
        hints: ["Which event has to happen first for the other one to be physically possible?"],
      },
      {
        id: "biology-respiratory-system-challenge-007",
        title: "Connect Breathing Mechanics to Gas Exchange",
        scenario: "A student asks: 'If breathing just moves air around, why does it matter for gas exchange at all?'",
        objective: "Choose the best explanation of the connection.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Breathing continuously supplies fresh, oxygen-rich air to the alveoli and clears out carbon-dioxide-rich air, keeping the concentration difference that drives diffusion in place" },
            { id: "b", label: "Breathing and gas exchange have no real connection to each other" },
            { id: "c", label: "Breathing directly pushes oxygen molecules into the blood by force" },
            { id: "d", label: "Gas exchange would happen at the same rate even without any breathing at all" },
          ],
          correctOptionId: "a",
        },
        explanation: "Without breathing continuously refreshing the air at the alveoli, the concentration difference that drives oxygen and carbon dioxide diffusion would quickly disappear — breathing keeps gas exchange supplied, even though it's a separate process.",
        hints: ["Think about what would happen to the alveolar air's oxygen and carbon dioxide levels if breathing simply stopped."],
      },
      {
        id: "biology-respiratory-system-challenge-008",
        title: "Multi-Step: Count the Airway Branch Points",
        scenario: "Air travels from the trachea, through the bronchi, then the bronchioles, and finally reaches the alveoli.",
        objective: "Count how many distinct airway structures (not counting the trachea itself or the alveoli) the air passes through between the trachea and the alveoli.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: { mode: "numeric", target: 2, tolerance: 0.1 },
        explanation: "Between the trachea and the alveoli, air passes through exactly two structures: the bronchi, then the bronchioles.",
        hints: ["List the structures in pathway order between the trachea and the alveoli, excluding both endpoints."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "blood-circulation",
      label: "Blood Circulation: How the Heart Moves Blood",
      href: "/dashboard/biology/blood-circulation",
      reason: "See what happens to the oxygen gas exchange adds to the blood, and where the carbon dioxide it removes comes from.",
    },
  ],
};
