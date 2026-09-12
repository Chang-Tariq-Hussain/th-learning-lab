import type { TopicContent } from "../types";

/**
 * Blood Circulation — Biology GLE Batch 3 ("Human Physiology"), topic
 * 1 of 2. Reuses the existing `BloodCirculation` simulation
 * (`@/features/subjects/biology/blood-circulation`) exactly as-is: it
 * already models the correct four-chamber sequence, a pulmonary vs.
 * systemic circuit toggle, a Trace Blood mode, a Follow-the-Blood
 * route stage-by-stage animation naming actual vessels (vena cava,
 * pulmonary artery/vein, aorta), a valve explanation, and clickable
 * chamber info cards — so no simulation code changes were needed for
 * this topic. The Learn content below carries the general
 * artery/vein/capillary definitions and the pulmonary-vessel
 * exceptions the simulation's vessel-specific labels don't spell out
 * on their own.
 */
export const biologyBloodCirculationContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "blood-circulation",
  title: "Blood Circulation: How the Heart Moves Blood",
  subjectLabel: "Biology",
  topicLabel: "Human Physiology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/blood-circulation",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the circulatory system's purpose: transporting oxygen, nutrients, and waste throughout the body.",
      "Name the heart's four chambers and describe each one's role.",
      "Trace the full blood-flow pathway: body → right atrium → right ventricle → lungs → left atrium → left ventricle → body.",
      "Distinguish pulmonary circulation (heart ↔ lungs) from systemic circulation (heart ↔ body).",
      "Define arteries, veins, and capillaries by direction and function — not simply by oxygen content.",
      "Explain the basic purpose of heart valves.",
    ],
    concepts: [
      {
        term: "Why the body needs circulation",
        explanation:
          "Every cell in the body needs a steady supply of oxygen and nutrients, and needs waste products removed. The circulatory system's job is that transport: the heart pumps blood through a network of vessels reaching every tissue, delivering what cells need and carrying away what they don't.",
      },
      {
        term: "The heart is really two pumps in one",
        explanation:
          "The right side of the heart (right atrium and right ventricle) pumps oxygen-poor blood to the lungs. The left side (left atrium and left ventricle) pumps oxygen-rich blood to the rest of the body. Blood passes through the heart twice on one full trip: once on the right side, once on the left.",
      },
      {
        term: "The complete pathway",
        explanation:
          "Body → right atrium → right ventricle → lungs → left atrium → left ventricle → body. Oxygen-poor blood returns from the body into the right atrium, is pumped by the right ventricle to the lungs, picks up oxygen there, returns to the left atrium, and is pumped by the left ventricle back out to the body.",
      },
      {
        term: "Pulmonary vs. systemic circulation",
        explanation:
          "Pulmonary circulation is the short loop between the heart and lungs, where blood exchanges carbon dioxide for oxygen. Systemic circulation is the much longer loop between the heart and every other tissue in the body, where blood delivers that oxygen and picks up carbon dioxide again.",
      },
      {
        term: "Arteries, veins, and capillaries — defined by direction, not oxygen content",
        explanation:
          "Arteries carry blood away from the heart; veins carry blood toward the heart. That's the actual definition — not oxygen content. Most arteries do carry oxygen-rich blood and most veins carry oxygen-poor blood, but the pulmonary artery carries oxygen-poor blood (heart → lungs) and the pulmonary veins carry oxygen-rich blood (lungs → heart). Capillaries are the tiny, thin-walled vessels connecting arteries to veins, where the actual exchange of gases, nutrients, and waste with body tissue happens.",
      },
      {
        term: "Valves keep blood moving one way",
        explanation:
          "Valves inside the heart open and close to prevent blood from flowing backward, keeping circulation moving in a single consistent direction through the four chambers.",
      },
    ],
    whyItMatters:
      "Every heartbeat is this entire pathway happening in about a second, tens of thousands of times a day, for an entire lifetime. Understanding it explains why a heart attack in one part of the heart can affect blood flow to the whole body, why the lungs and heart are so closely linked in illness, and why blood pressure — the force behind this whole system — matters for health.",
    keyTerms: [
      { term: "Atrium", definition: "One of the heart's two upper chambers; receives blood returning to the heart." },
      { term: "Ventricle", definition: "One of the heart's two lower chambers; pumps blood out of the heart." },
      { term: "Artery", definition: "A blood vessel that carries blood away from the heart." },
      { term: "Vein", definition: "A blood vessel that carries blood toward the heart." },
      { term: "Capillary", definition: "A tiny, thin-walled vessel connecting arteries to veins, where gas, nutrient, and waste exchange with tissue occurs." },
      { term: "Pulmonary circulation", definition: "The loop of blood flow between the heart and the lungs." },
      { term: "Systemic circulation", definition: "The loop of blood flow between the heart and the rest of the body." },
    ],
    misconceptions: [
      {
        id: "misconception-arteries-always-oxygenated",
        misconception: "Arteries always carry oxygen-rich blood, and veins always carry oxygen-poor blood.",
        correction:
          "Arteries and veins are defined by direction — away from the heart, or toward it — not by oxygen content. The pulmonary artery carries oxygen-poor blood from the heart to the lungs, and the pulmonary veins carry oxygen-rich blood from the lungs back to the heart, which is the opposite of what most arteries and veins carry.",
      },
      {
        id: "misconception-single-heart-pass",
        misconception: "Blood only passes through the heart once during a full circulation.",
        correction:
          "Blood actually passes through the heart twice per full circulation: once through the right side on its way to the lungs, and once through the left side on its way to the body.",
      },
      {
        id: "misconception-right-ventricle-to-body",
        misconception: "The right ventricle pumps blood directly out to the body, the same as the left ventricle.",
        correction:
          "The right ventricle only pumps blood to the lungs (pulmonary circulation). Only the left ventricle pumps blood out to the rest of the body (systemic circulation).",
      },
      {
        id: "misconception-capillaries-just-connectors",
        misconception: "Capillaries are just small connecting tubes with no real function of their own.",
        correction:
          "Capillaries are where the circulatory system actually does its job: their extremely thin, one-cell-thick walls are what let oxygen, carbon dioxide, nutrients, and waste move between blood and body tissue.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before running the simulation's Trace Blood or Follow-the-Blood mode — then check what actually happens.",
    scenarios: [
      {
        id: "biology-blood-circulation-predict-001",
        scenario: "A drop of blood has just entered the right atrium, arriving from the body.",
        question: "Where does it go next?",
        options: [
          { id: "right-ventricle", label: "The right ventricle" },
          { id: "left-atrium", label: "The left atrium" },
          { id: "lungs-directly", label: "Straight to the lungs, bypassing any ventricle" },
          { id: "left-ventricle", label: "The left ventricle" },
        ],
        actualResultOptionId: "right-ventricle",
        explanation: "From the right atrium, blood moves into the right ventricle, which will then pump it to the lungs.",
        hint: "Blood moves atrium → ventricle on each side before leaving the heart.",
      },
      {
        id: "biology-blood-circulation-predict-002",
        scenario: "Blood is leaving the right ventricle.",
        question: "Where does it go after leaving the right ventricle?",
        options: [
          { id: "to-lungs", label: "To the lungs, to pick up oxygen" },
          { id: "to-body", label: "Directly out to the body" },
          { id: "to-left-atrium", label: "Directly into the left atrium, skipping the lungs" },
          { id: "back-to-right-atrium", label: "Back into the right atrium" },
        ],
        actualResultOptionId: "to-lungs",
        explanation: "The right ventricle always pumps toward the lungs — this is pulmonary circulation. Only the left ventricle pumps toward the body.",
        hint: "The right side of the heart handles the lung loop; the left side handles the body loop.",
      },
      {
        id: "biology-blood-circulation-predict-003",
        scenario: "Blood has just passed through the lungs and is entering the heart again.",
        question: "Which chamber receives this blood, and what has changed about it?",
        options: [
          { id: "left-atrium-oxygenated", label: "The left atrium — it's now oxygen-rich" },
          { id: "right-atrium-oxygenated", label: "The right atrium — it's now oxygen-rich" },
          { id: "left-atrium-still-poor", label: "The left atrium — it's still oxygen-poor" },
          { id: "right-ventricle-oxygenated", label: "The right ventricle — it's now oxygen-rich" },
        ],
        actualResultOptionId: "left-atrium-oxygenated",
        explanation: "Blood returning from the lungs — now oxygen-rich — enters the left atrium through the pulmonary veins.",
        hint: "Which side of the heart is connected to the body's systemic circulation that this blood is about to join?",
      },
      {
        id: "biology-blood-circulation-predict-004",
        scenario: "Blood is about to leave the left ventricle.",
        question: "Which side of the heart pumps blood out to the body, and through which vessel?",
        options: [
          { id: "left-aorta", label: "The left side, through the aorta" },
          { id: "right-pulmonary-artery", label: "The right side, through the pulmonary artery" },
          { id: "left-pulmonary-vein", label: "The left side, through the pulmonary vein" },
          { id: "right-aorta", label: "The right side, through the aorta" },
        ],
        actualResultOptionId: "left-aorta",
        explanation: "The left ventricle pumps oxygen-rich blood into the aorta, the large artery that distributes it to the entire body.",
        hint: "The vessel name and the side of the heart both matter here.",
      },
      {
        id: "biology-blood-circulation-predict-005",
        scenario: "Consider the general rule: 'Arteries carry blood away from the heart; veins carry blood toward it.'",
        question: "If blood-flow direction were suddenly reversed everywhere, what would happen to that rule?",
        options: [
          { id: "roles-swap", label: "Every artery would functionally become a vein, and every vein an artery" },
          { id: "nothing-changes", label: "Nothing would change — arteries and veins are fixed by their oxygen content" },
          { id: "capillaries-reverse-only", label: "Only capillaries would be affected, not arteries or veins" },
          { id: "hearts-stops-mattering", label: "The heart would no longer matter to circulation at all" },
        ],
        actualResultOptionId: "roles-swap",
        explanation: "Since 'artery' and 'vein' are defined purely by direction relative to the heart, reversing all flow would flip which vessels qualify as which — this is exactly why oxygen content can't be the real definition.",
        hint: "Go back to how arteries and veins are actually defined.",
      },
      {
        id: "biology-blood-circulation-predict-006",
        scenario: "You're about to open the pulmonary artery and pulmonary vein info cards in the simulation.",
        question: "What will you find about their oxygen content, compared to most other arteries and veins?",
        options: [
          { id: "pulmonary-reversed", label: "They're reversed: the pulmonary artery is oxygen-poor, the pulmonary veins are oxygen-rich" },
          { id: "pulmonary-same", label: "They match the usual pattern: pulmonary artery oxygen-rich, pulmonary veins oxygen-poor" },
          { id: "pulmonary-no-oxygen", label: "Neither carries any oxygen at all" },
          { id: "pulmonary-identical-content", label: "Both carry identical, mixed oxygen levels" },
        ],
        actualResultOptionId: "pulmonary-reversed",
        explanation: "The pulmonary vessels are the classic exception: the pulmonary artery carries oxygen-poor blood (heart to lungs) and the pulmonary veins carry oxygen-rich blood (lungs to heart) — opposite of most arteries and veins elsewhere in the body.",
        hint: "This is the one part of circulation where the 'usual' oxygen pattern for arteries and veins doesn't hold.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Press Start to set blood circulating continuously, or use Trace Blood to follow a single drop step by step.",
      "Toggle between the pulmonary circuit (heart ↔ lungs) and systemic circuit (heart ↔ body) to see each loop on its own.",
      "Click each of the four heart chambers to open its info card: its role, what type of blood enters, and where blood goes next.",
      "Use Follow-the-Blood to watch a blood cell travel the complete route, naming the vessels it passes through (vena cava, pulmonary artery, pulmonary vein, aorta) and noting exactly where it gains and loses oxygen.",
      "Try the mini-challenge in the simulation to test whether you can identify a chamber or predict the next stop along the route.",
    ],
    tryThis: [
      "Follow one blood cell all the way from the body, through both sides of the heart and the lungs, back out to the body — narrate each stop out loud.",
      "Open all four chamber info cards and, for each, say what type of blood enters and where it goes next, without looking at the card again.",
      "Switch between the pulmonary and systemic circuit views and explain, in your own words, what makes each one a separate 'loop.'",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-blood-circulation-explain-001",
        question: "Why does blood need to pass through the heart twice — once on the right side, once on the left — instead of just once?",
        answer:
          "The heart is really two separate pumps sharing one organ: the right side is dedicated entirely to pushing oxygen-poor blood to the lungs (pulmonary circulation), and the left side is dedicated entirely to pushing oxygen-rich blood out to the body (systemic circulation). Since blood has to visit the lungs to get oxygen before it's useful anywhere else, it has to pass through the heart on the way there and again on the way back out — one pass per loop.",
      },
      {
        id: "biology-blood-circulation-explain-002",
        question: "Why can't arteries and veins be defined simply by whether they carry oxygen-rich or oxygen-poor blood?",
        answer:
          "Because the pulmonary vessels break that pattern: the pulmonary artery carries oxygen-poor blood, and the pulmonary veins carry oxygen-rich blood — the opposite of what a same-named vessel does everywhere else in the body. The only definition that holds everywhere is direction relative to the heart: arteries carry blood away from the heart, veins carry blood toward it, regardless of what's inside them.",
      },
      {
        id: "biology-blood-circulation-explain-003",
        question: "Why are capillaries — not arteries or veins — the site where oxygen and nutrients actually reach body tissue?",
        answer:
          "Arteries and veins have thicker walls built for carrying blood at higher volume and pressure over distance, which makes them poor sites for exchange. Capillaries are the opposite: extremely thin, one-cell-thick walls that let gases, nutrients, and waste diffuse across easily — but only at the cost of being too fragile to handle high-pressure, high-volume flow, which is why blood is routed through them only at the very end of each branch, close to the tissue that needs the exchange.",
      },
      {
        id: "biology-blood-circulation-explain-004",
        question: "Why does the left ventricle have noticeably thicker, more muscular walls than the right ventricle?",
        answer:
          "The right ventricle only has to push blood a short distance to the nearby lungs. The left ventricle has to generate enough pressure to push blood all the way through systemic circulation — to the farthest tissues in the body and back. That much greater workload is why its walls are built with far more muscle.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-blood-circulation-quiz.ts.
    quizId: "biology-blood-circulation",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Harder, realistic problems than ordinary Practice. Use the simulation's Trace Blood and Follow-the-Blood modes to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-blood-circulation-challenge-001",
        title: "Identify the Chamber",
        scenario: "In the simulation, select the chamber that receives oxygen-rich blood returning from the lungs.",
        objective: "Name this chamber.",
        tools: [{ id: "heart-chambers", label: "Clickable heart chamber info cards" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Left atrium" },
            { id: "b", label: "Right atrium" },
            { id: "c", label: "Left ventricle" },
            { id: "d", label: "Right ventricle" },
          ],
          correctOptionId: "a",
        },
        explanation: "The left atrium is where oxygen-rich blood from the lungs first re-enters the heart, via the pulmonary veins.",
        hints: ["Which side of the heart connects to the body's systemic circulation that this blood is about to join?"],
      },
      {
        id: "biology-blood-circulation-challenge-002",
        title: "Predict the Next Destination",
        scenario: "A blood cell has just been pumped out of the left ventricle.",
        objective: "Determine where it's headed next.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Out to the body, through the aorta" },
            { id: "b", label: "To the lungs, through the pulmonary artery" },
            { id: "c", label: "Back into the left atrium" },
            { id: "d", label: "Into the right atrium" },
          ],
          correctOptionId: "a",
        },
        explanation: "The left ventricle pumps oxygen-rich blood into the aorta, headed out to the body — systemic circulation.",
        hints: ["The left ventricle only ever pumps in one direction — which loop is that?"],
      },
      {
        id: "biology-blood-circulation-challenge-003",
        title: "Complete the Sequence",
        scenario: "Consider this partial sequence: Body → right atrium → right ventricle → ??? → left atrium → left ventricle → body.",
        objective: "Fill in the missing step.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Lungs" },
            { id: "b", label: "Kidneys" },
            { id: "c", label: "Liver" },
            { id: "d", label: "Back to the right atrium" },
          ],
          correctOptionId: "a",
        },
        explanation: "The right ventricle pumps blood to the lungs, where it becomes oxygen-rich before returning to the left atrium.",
        hints: ["What has to happen to blood before it's useful to send out to the body?"],
      },
      {
        id: "biology-blood-circulation-challenge-004",
        title: "Pulmonary or Systemic?",
        scenario: "A pathway carries blood from the left ventricle, out to the leg muscles, and back to the right atrium.",
        objective: "Identify which type of circulation this describes.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Systemic circulation" },
            { id: "b", label: "Pulmonary circulation" },
            { id: "c", label: "Neither — this pathway doesn't exist" },
            { id: "d", label: "Both, simultaneously" },
          ],
          correctOptionId: "a",
        },
        explanation: "Any loop between the heart and body tissue — like the leg muscles — is systemic circulation, not pulmonary.",
        hints: ["Pulmonary circulation only ever involves the lungs."],
      },
      {
        id: "biology-blood-circulation-challenge-005",
        title: "Analyze an Oxygenation Change",
        scenario: "A drop of blood has an oxygen level that just rose sharply.",
        objective: "Determine which structure it most recently passed through.",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The lungs (specifically, the capillaries around the alveoli)" },
            { id: "b", label: "The right atrium" },
            { id: "c", label: "A body tissue capillary bed" },
            { id: "d", label: "The left ventricle" },
          ],
          correctOptionId: "a",
        },
        explanation: "Oxygen is only added to blood in one place: the capillaries surrounding the lungs' alveoli, during pulmonary circulation.",
        hints: ["Where in the whole pathway does blood actually gain oxygen?"],
      },
      {
        id: "biology-blood-circulation-challenge-006",
        title: "Diagnose an Incorrect Pathway",
        scenario: "A diagram shows: right ventricle → directly to the body, skipping the lungs entirely.",
        objective: "Explain what's wrong with this diagram.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The right ventricle always pumps to the lungs, never directly to the body" },
            { id: "b", label: "Nothing is wrong — this is a valid shortcut" },
            { id: "c", label: "The right ventricle should connect to the right atrium instead" },
            { id: "d", label: "The diagram is correct only during exercise" },
          ],
          correctOptionId: "a",
        },
        explanation: "The right ventricle is dedicated to pulmonary circulation — it only ever pumps toward the lungs. Sending blood out to the body is exclusively the left ventricle's job, and only after the blood has been re-oxygenated.",
        hints: ["Which side of the heart is responsible for sending blood out to the body?"],
      },
      {
        id: "biology-blood-circulation-challenge-007",
        title: "Correct a Deliberately Wrong Claim",
        scenario: "A classmate says: 'The pulmonary vein must carry oxygen-poor blood, since veins always carry oxygen-poor blood.'",
        objective: "Explain what's wrong with this reasoning.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Veins are defined by direction (toward the heart), not oxygen content — the pulmonary veins are a specific exception carrying oxygen-rich blood" },
            { id: "b", label: "The classmate is correct — all veins carry oxygen-poor blood with no exceptions" },
            { id: "c", label: "Veins don't carry blood toward the heart at all" },
            { id: "d", label: "The pulmonary vein isn't actually a vein" },
          ],
          correctOptionId: "a",
        },
        explanation: "This is exactly the misconception the pulmonary vessels are designed to correct: veins are defined by carrying blood toward the heart, and the pulmonary veins do that while carrying oxygen-rich blood from the lungs.",
        hints: ["Go back to how veins are actually defined, rather than what most of them happen to carry."],
      },
      {
        id: "biology-blood-circulation-challenge-008",
        title: "Multi-Step: Follow a Full Circuit",
        scenario: "A blood cell starts in the vena cava, about to enter the right atrium. It will complete one full circuit back to the vena cava.",
        objective: "Count how many heart chambers this blood cell passes through in total during the complete circuit (right atrium, right ventricle, left atrium, left ventricle — count each chamber it visits once).",
        requiresExperiment: false,
        maxAttempts: 3,
        answer: { mode: "numeric", target: 4, tolerance: 0.1 },
        explanation: "A complete circuit passes through all four chambers exactly once each: right atrium → right ventricle → (lungs) → left atrium → left ventricle → (body) → back to the vena cava, for a total of 4 chambers visited.",
        hints: ["List the chambers in pathway order and count them.", "The pathway is: right atrium, right ventricle, left atrium, left ventricle."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "respiratory-system",
      label: "Respiratory System: Breathing & Gas Exchange",
      href: "/dashboard/biology/respiratory-system",
      reason: "See where the oxygen circulation depends on actually comes from, and where carbon dioxide is dropped off.",
    },
  ],
};
