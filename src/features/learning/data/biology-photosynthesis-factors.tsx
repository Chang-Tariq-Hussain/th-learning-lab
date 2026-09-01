import type { TopicContent } from "../types";

/**
 * Factors Affecting Photosynthesis — Biology Batch 2 ("Cellular
 * Energy & Life Processes"), topic 3 of 3 (see
 * `@/features/learning-path/data/biology-cellular-energy-life-processes`).
 *
 * Reuses the same Photosynthesis simulation as the previous topic,
 * this time rendered with `showFactorControls`. That prop (added to
 * `@/features/subjects/biology/photosynthesis` specifically to
 * support this topic — see that component's own doc comment) reveals
 * three sliders — Light Intensity, Carbon Dioxide, Temperature — that
 * scale how fast the existing scene plays out, plus a live "Rate of
 * Photosynthesis" readout. This was a deliberate, minimal extension
 * of the existing simulation rather than a new one: the scene, the
 * equation, and the six-step animation are all unchanged, only *how
 * fast* it plays now responds to three variables. Every other caller
 * of `<Photosynthesis />` (the plain simulation page, and the
 * previous topic) omits the prop and is completely unaffected.
 *
 * Light and CO2 combine as a simplified "limiting factor" (whichever
 * is scarcer caps the rate); temperature peaks at its own optimal
 * midpoint and falls off toward either extreme — see `factorRate` in
 * `photosynthesis/model.ts` for the exact formula this topic's
 * content is written against.
 *
 * `practice.quizId` points at a new, dedicated 15-question bank
 * (`@/features/quiz-engine/data/biology-photosynthesis-factors-quiz.ts`).
 */
export const biologyPhotosynthesisFactorsContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "photosynthesis-factors",
  title: "Factors Affecting Photosynthesis",
  subjectLabel: "Biology",
  topicLabel: "Plant Biology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/photosynthesis-factors",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Name the environmental factors that affect the rate of photosynthesis.",
      "Explain why 'more is always better' isn't true for these factors.",
      "Explain what a limiting factor is, using light and CO2 as an example.",
      "Design a one-variable-at-a-time experiment to test a factor's effect.",
    ],
    concepts: [
      {
        term: "Rate of photosynthesis",
        explanation:
          "How fast a plant is carrying out photosynthesis — not just whether it's happening, but how quickly it's converting carbon dioxide, water, and light into glucose and oxygen. Several environmental conditions can speed this rate up or slow it down.",
      },
      {
        term: "Light intensity",
        explanation:
          "More light generally means a faster rate of photosynthesis, since light supplies the energy the reaction runs on. But this isn't unlimited — once another factor (like CO2) becomes the scarcer resource, adding still more light stops helping.",
      },
      {
        term: "Carbon dioxide availability",
        explanation:
          "CO2 is a raw material the reaction needs — more of it available generally means a faster rate, up to a point. Just like light, if CO2 is plentiful but something else is scarce, more CO2 alone won't raise the rate further.",
      },
      {
        term: "Temperature",
        explanation:
          "Unlike light and CO2, temperature doesn't simply help more the more you add. Photosynthesis (like most biological processes) has an optimal temperature range — too cold and the reaction slows down; too hot and it also slows down (and can even damage the plant). The rate peaks somewhere in the middle, not at either extreme.",
      },
      {
        term: "Limiting factor",
        explanation:
          "The factor in shortest supply relative to what's needed — the one currently holding the rate back, even if every other factor is abundant. Increasing an already-abundant factor doesn't raise the rate; only increasing whichever one is scarcest does.",
        formula: "\\text{Environmental Factor} \\rightarrow \\text{Change in Rate} \\rightarrow \\text{Change in Food Production}",
        formulaCaption: "Factor → Effect model",
      },
    ],
    whyItMatters:
      "Farmers and greenhouse growers use exactly this reasoning to decide what to invest in — adding more light to a greenhouse where CO2 is already the limiting factor wastes money without raising yield, while adjusting whichever factor is actually scarce does. Understanding limiting factors is also basic experimental thinking: to find out what's actually causing a change, you have to test one variable at a time.",
    keyTerms: [
      { term: "Optimal conditions", definition: "The specific range of a factor (like temperature) at which a process runs fastest — not always the maximum possible amount." },
      { term: "One-variable-at-a-time", definition: "An experimental method of changing only one factor while holding all others constant, so any change in the result can be attributed to that one factor." },
    ],
    misconceptions: [
      {
        id: "misconception-more-always-better",
        misconception: "For every factor affecting photosynthesis, more is always better — there's no downside to increasing any of them as far as possible.",
        correction:
          "This is true for light and CO2 only up to the point where something else becomes limiting, and it isn't true for temperature at all — temperature has an optimal middle range, and going too far in either direction slows the rate down rather than speeding it up.",
      },
      {
        id: "misconception-any-factor-raises-rate",
        misconception: "Increasing any one environmental factor will always raise the rate of photosynthesis, regardless of the other conditions.",
        correction:
          "Only increasing the current limiting factor — whichever one is scarcest — raises the rate. Increasing a factor that's already abundant does nothing if a different factor is what's actually holding the rate back.",
      },
      {
        id: "misconception-change-everything-at-once",
        misconception: "To find out what's affecting the rate of photosynthesis, it's fine to change several conditions at the same time and see what happens.",
        correction:
          "Changing several variables at once makes it impossible to tell which one caused the result. Good experimental design changes one variable at a time, keeping everything else constant, so the effect can be attributed to that one factor.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Predict first, then confirm by adjusting the sliders and running the simulation below.",
    scenarios: [
      {
        id: "biology-photosynthesis-factors-predict-001",
        scenario: "Light and CO2 are both set to their maximum, optimal values. You then lower only the Light Intensity slider partway, leaving CO2 and Temperature unchanged.",
        question: "What will happen to the Rate of Photosynthesis?",
        options: [
          { id: "rate-drops", label: "It will drop — light is now scarcer relative to what's needed" },
          { id: "rate-unchanged", label: "It will stay exactly the same, since CO2 and temperature didn't change" },
          { id: "rate-rises", label: "It will rise" },
        ],
        actualResultOptionId: "rate-drops",
        explanation: "Light and CO2 combine as limiting factors — lowering either one on its own lowers the rate, even if the other stays at its maximum.",
        hint: "Does the rate depend on just one factor, or on whichever factor is currently scarcest?",
      },
      {
        id: "biology-photosynthesis-factors-predict-002",
        scenario: "CO2 is set very low, while Light Intensity is set to maximum. You then raise Light Intensity even further — but it's already at its maximum, so it can't go any higher.",
        question: "Will raising CO2 instead, while leaving light maxed out, raise the rate?",
        options: [
          { id: "raising-co2-helps", label: "Yes — CO2 is the scarcer factor here, so raising it should raise the rate" },
          { id: "raising-co2-no-effect", label: "No — since light is already maxed out, nothing else matters" },
        ],
        actualResultOptionId: "raising-co2-helps",
        explanation: "With light already abundant, CO2 is the limiting factor — raising the scarcer resource (CO2) is what raises the rate, not adding more of the one that's already plentiful.",
        hint: "Which factor is actually holding the rate back when one is maxed out and the other isn't?",
      },
      {
        id: "biology-photosynthesis-factors-predict-003",
        scenario: "Temperature starts at its optimal midpoint value, with light and CO2 both maxed out. You then push the Temperature slider all the way to one extreme.",
        question: "What will happen to the Rate of Photosynthesis?",
        options: [
          { id: "temp-extreme-drops-rate", label: "It will drop — moving away from the optimal temperature slows the reaction" },
          { id: "temp-extreme-raises-rate", label: "It will keep rising the further the slider moves" },
          { id: "temp-no-effect", label: "Temperature has no effect on the rate" },
        ],
        actualResultOptionId: "temp-extreme-drops-rate",
        explanation: "Temperature peaks at an optimal middle value — moving toward either extreme (too cold or too hot) lowers the rate rather than raising it.",
        hint: "Does temperature behave like light and CO2 (more is better), or differently?",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Notice the three sliders below the plant scene — Light Intensity, Carbon Dioxide, and Temperature — and the Rate of Photosynthesis readout above them.",
      "With all three at their default (optimal) positions, press Start and watch how quickly the scene completes — this is your 100% baseline.",
      "Reset, then lower only the Light Intensity slider, leaving the other two unchanged, and press Start again — watch the rate readout and how much slower the scene plays.",
      "Reset, restore Light Intensity, then try lowering only Carbon Dioxide, and separately, only moving Temperature away from its middle position — one variable at a time.",
      "Compare how much each factor changes the rate on its own.",
    ],
    tryThis: [
      "🌱 Photosynthesis Mission: Observe the plant, identify the three inputs, change ONE slider, predict what will happen before pressing Start, then run it and explain the result.",
      "🧪 Experiment: set Light Intensity low while keeping CO2 and Temperature optimal — predict, run, observe, and explain why the rate changed the way it did.",
      "🧪 Experiment: set Carbon Dioxide low while keeping Light Intensity and Temperature optimal — compare the result to the light experiment above.",
      "🧪 Experiment: move Temperature to one extreme while keeping Light Intensity and CO2 optimal — is the effect the same shape as the light/CO2 experiments, or different?",
      "🌱 Optimization Challenge: find the slider positions that produce the highest possible Rate of Photosynthesis, changing one variable at a time and recording what you observe.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-photosynthesis-factors-explain-001",
        question: "Why does lowering CO2 slow the rate down even when light is still at its maximum?",
        answer:
          "The rate is limited by whichever factor is scarcest, not by whichever one is most abundant. With CO2 lowered, it becomes the limiting factor, so the rate drops to match how much CO2 is available — extra light can't make up for a shortage of CO2.",
      },
      {
        id: "biology-photosynthesis-factors-explain-002",
        question: "Why does moving Temperature toward an extreme lower the rate, when moving Light Intensity toward its maximum raises it?",
        answer:
          "Light and CO2 are raw materials/energy the reaction directly uses more of as they increase, up to the point something else becomes limiting. Temperature instead affects how well the reaction's machinery works — too cold and it runs sluggishly, too hot and it stops working efficiently (and can damage the plant) — so its effect peaks in a middle range instead of rising continuously.",
      },
      {
        id: "biology-photosynthesis-factors-explain-003",
        question: "Why does the Explore activity ask you to change only one slider at a time instead of adjusting all three together?",
        answer:
          "Changing only one variable while holding the others constant is what lets you attribute any change in the rate specifically to that variable. If several sliders moved at once, you wouldn't be able to tell which change actually caused the rate to go up or down — this is basic experimental design, not just a rule for this simulation.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    quizId: "biology-photosynthesis-factors",
  },

  // -------------------------------------------------------------
  // CHALLENGE — Predict → Experiment → Explain + Optimization Challenge
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Use the sliders in the simulation above to run each experiment, then answer the question. Change one variable at a time and keep the others at their default, optimal positions unless the question says otherwise.",
    scenarios: [
      {
        id: "biology-photosynthesis-factors-challenge-001",
        title: "Experiment: Light Intensity",
        scenario: "Set Light Intensity low, keeping Carbon Dioxide and Temperature at their optimal positions, then press Start.",
        objective: "Determine what happens to the Rate of Photosynthesis when only light is reduced.",
        constraints: [{ id: "one-variable-light", label: "Change only the Light Intensity slider" }],
        tools: [{ id: "photosynthesis-factors-light-slider", label: "Light Intensity slider (0–100)" }],
        requiresExperiment: false, // Explore above already embeds the live simulation with sliders on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "rate-drops-light", label: "The rate drops, and the readout shows a lower percentage" },
            { id: "rate-same-light", label: "The rate stays the same" },
            { id: "rate-rises-light", label: "The rate rises" },
          ],
          correctOptionId: "rate-drops-light",
        },
        explanation: "Light is one of the two limiting inputs (alongside CO2) — reducing it lowers the rate, visible both in the slower scene and the lower Rate of Photosynthesis percentage.",
        hints: ["Light supplies the reaction's energy — what happens to a process when its energy supply is reduced?"],
      },
      {
        id: "biology-photosynthesis-factors-challenge-002",
        title: "Experiment: Limiting Factor",
        scenario: "Set Carbon Dioxide low while leaving Light Intensity at its maximum and Temperature at its optimal midpoint, then press Start.",
        objective: "Determine whether the already-maximum light compensates for the low CO2.",
        constraints: [{ id: "one-variable-co2", label: "Change only the Carbon Dioxide slider" }],
        tools: [{ id: "photosynthesis-factors-co2-slider", label: "Carbon Dioxide slider (0–100)" }],
        requiresExperiment: false, // Explore above already embeds the live simulation with sliders on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "co2-still-limits", label: "No — the rate still drops, because CO2 is now the scarcer, limiting factor" },
            { id: "light-compensates", label: "Yes — the maxed-out light makes up for the low CO2" },
          ],
          correctOptionId: "co2-still-limits",
        },
        explanation: "The rate is capped by whichever factor is scarcest. With light maxed out but CO2 low, CO2 becomes the limiting factor, and the rate drops to match it regardless of how much light is available.",
        hints: ["Does an abundant factor make up for a scarce one, or does the scarce one still hold the rate back?"],
      },
      {
        id: "biology-photosynthesis-factors-challenge-003",
        title: "Experiment: Temperature Extremes",
        scenario: "Keep Light Intensity and Carbon Dioxide at their optimal positions, then move Temperature to one extreme (all the way toward Cold, or all the way toward Hot), and press Start.",
        objective: "Determine how temperature's effect on the rate differs from light and CO2's.",
        constraints: [{ id: "one-variable-temp", label: "Change only the Temperature slider" }],
        tools: [{ id: "photosynthesis-factors-temp-slider", label: "Temperature slider (Cold–Hot)" }],
        requiresExperiment: false, // Explore above already embeds the live simulation with sliders on this page — a second copy would be redundant.
        answer: {
          mode: "choice",
          options: [
            { id: "temp-peaks-middle", label: "The rate is highest near the middle of the slider, and drops toward either extreme" },
            { id: "temp-rises-with-heat", label: "The rate keeps rising the further toward Hot the slider goes" },
            { id: "temp-no-effect-observed", label: "Moving the Temperature slider has no visible effect" },
          ],
          correctOptionId: "temp-peaks-middle",
        },
        explanation: "Unlike light and CO2, temperature has an optimal middle range — the rate peaks near the slider's midpoint and falls off toward both Cold and Hot, rather than simply rising with more of it.",
        hints: ["Does temperature behave the same way as light and CO2, or differently?"],
      },
      {
        id: "biology-photosynthesis-factors-challenge-004",
        title: "🌱 Optimization Challenge",
        scenario: "Using what you've learned from the three experiments above, find the slider positions that produce the highest possible Rate of Photosynthesis.",
        objective: "Set all three sliders to the values that maximize the Rate of Photosynthesis readout, then enter the percentage you achieve.",
        constraints: [
          { id: "one-at-a-time-optimization", label: "Change one slider at a time and record what happens before moving the next" },
        ],
        tools: [
          { id: "photosynthesis-factors-all-sliders", label: "Light Intensity, Carbon Dioxide, and Temperature sliders" },
        ],
        requiresExperiment: false, // Explore above already embeds the live simulation with sliders on this page — a second copy would be redundant.
        answer: {
          mode: "numeric",
          unit: "%",
          target: 100,
          tolerance: 0,
        },
        explanation: "The highest possible rate (100%) is reached with Light Intensity and Carbon Dioxide both at their maximum and Temperature at its optimal midpoint — every factor at its own best value, none of them left as the limiting one.",
        hints: [
          "Light and CO2 both help up to their maximum — where should they be set?",
          "Temperature is different — it peaks in the middle, not at either end.",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "photosynthesis",
      label: "Photosynthesis",
      href: "/dashboard/biology/photosynthesis",
      reason: "Covers the basic process and equation these factors speed up or slow down.",
    },
    {
      subjectSlug: "biology",
      topicSlug: "cellular-energy",
      label: "Introduction to Cellular Energy",
      href: "/dashboard/biology/cellular-energy",
      reason: "A faster or slower rate of photosynthesis changes how much food energy is available for cells to convert into ATP.",
    },
  ],
};
