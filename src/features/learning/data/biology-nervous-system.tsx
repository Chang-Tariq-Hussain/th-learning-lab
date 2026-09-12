import type { TopicContent } from "../types";

/**
 * Nervous System — From Neuron to Signal Transmission. Biology GLE
 * Batch 4, topic 2 of 2 ("Human Physiology"). Reuses the existing
 * `NervousSystem` simulation (`@/features/subjects/biology/nervous-system`)
 * exactly as-is — it already models neuron anatomy (dendrites, cell
 * body, axon, myelin, nodes of Ranvier, axon terminals), an
 * accurate ion-driven action-potential cycle (depolarization,
 * repolarization, hyperpolarization with Na⁺/K⁺ flow), a five-step
 * synaptic transmission sequence, and a CNS/PNS organization tree
 * (including somatic/autonomic/sympathetic/parasympathetic) — so no
 * simulation code changes were needed for this topic.
 */
export const biologyNervousSystemContent: TopicContent = {
  subjectSlug: "biology",
  topicSlug: "nervous-system",
  title: "Nervous System: From Neuron to Signal Transmission",
  subjectLabel: "Biology",
  topicLabel: "Human Physiology",
  colorToken: "biology",
  simulationHref: "/dashboard/biology/nervous-system",

  // -------------------------------------------------------------
  // LEARN
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain the nervous system's purpose: receiving, processing, and transmitting signals throughout the body.",
      "Identify the main parts of a neuron and their functions: dendrites, cell body, axon, myelin sheath, axon terminals.",
      "Describe the general direction of signal travel through a neuron.",
      "Explain, at a basic level, how an electrical signal travels along a neuron.",
      "Explain how neurons communicate across a synapse using neurotransmitters.",
      "Distinguish the central nervous system from the peripheral nervous system.",
    ],
    concepts: [
      {
        term: "The neuron's job",
        explanation:
          "A neuron is a cell specialized for one job: receiving a signal, passing it along, and handing it off to the next cell. Billions of neurons connected together let the body sense the world, think, and respond.",
      },
      {
        term: "Signal direction: dendrites → cell body → axon → axon terminals",
        explanation:
          "Dendrites receive incoming signals from other neurons and carry them toward the cell body. The cell body integrates that input. The axon then carries the signal away from the cell body, toward the axon terminals, where it's handed off to the next cell.",
      },
      {
        term: "The myelin sheath speeds things up",
        explanation:
          "Many axons are wrapped in a fatty myelin sheath, with small gaps called nodes of Ranvier between segments. Myelin insulates the axon and lets the signal jump from node to node, transmitting much faster than it could along a bare axon.",
      },
      {
        term: "An electrical signal, at a basic level",
        explanation:
          "A resting neuron holds a small electrical charge difference across its membrane. When triggered, that charge briefly flips and then resets as the signal — an action potential — travels down the axon toward the terminals.",
      },
      {
        term: "The synapse: communication between neurons",
        explanation:
          "Neurons don't physically touch — a tiny gap called the synapse separates them. When a signal reaches the axon terminal, the neuron releases neurotransmitters that cross the gap and bind to receptors on the next neuron, allowing the signal to continue as a new signal in that cell.",
      },
      {
        term: "Central vs. peripheral nervous system",
        explanation:
          "The central nervous system (CNS) — the brain and spinal cord — is where signals are processed and decisions are made. The peripheral nervous system (PNS) is the network of nerves connecting the CNS to the rest of the body, carrying signals in toward the CNS and back out to muscles and organs.",
      },
      {
        term: "Sensory input, integration, and motor response",
        explanation:
          "A typical information flow starts with sensory input (a stimulus detected by the body), moves to integration (the CNS processing that information), and ends with a motor response (a signal sent back out to produce an action).",
      },
    ],
    whyItMatters:
      "Every sensation, thought, and movement — noticing something hot, deciding to pull your hand back, and actually moving the muscle — depends on this same basic signal: travel through a neuron, cross a synapse, travel through the next neuron. Understanding it explains how reflexes can be so fast, why nerve damage disrupts specific functions, and how many medications (and toxins) work by interfering with synaptic transmission.",
    keyTerms: [
      { term: "Dendrite", definition: "A branch-like extension of a neuron that receives signals from other neurons." },
      { term: "Axon", definition: "The long fiber that carries a neuron's electrical signal away from the cell body." },
      { term: "Myelin sheath", definition: "A fatty coating around many axons that insulates them and speeds up signal transmission." },
      { term: "Synapse", definition: "The small gap between two neurons where communication happens via neurotransmitters." },
      { term: "Neurotransmitter", definition: "A chemical messenger released by a neuron that crosses the synapse and binds to receptors on the next cell." },
      { term: "Central nervous system (CNS)", definition: "The brain and spinal cord; where signals are processed and decisions are made." },
      { term: "Peripheral nervous system (PNS)", definition: "The network of nerves connecting the CNS to the rest of the body." },
    ],
    misconceptions: [
      {
        id: "misconception-synapse-is-wire",
        misconception: "Neurons are directly connected, like a continuous electrical wire, with no gap between them.",
        correction:
          "Neurons are separated by a small gap called the synapse. The signal doesn't cross it as electricity directly — the sending neuron releases neurotransmitters, which diffuse across the gap and bind to receptors, triggering a new signal in the receiving neuron.",
      },
      {
        id: "misconception-dendrites-and-axons-same",
        misconception: "Dendrites and axons do the same job, just on different ends of the neuron.",
        correction:
          "They have opposite roles. Dendrites receive incoming signals and carry them toward the cell body. The axon carries the signal away from the cell body, toward the axon terminals and the next cell.",
      },
      {
        id: "misconception-signal-any-direction",
        misconception: "A signal can travel in either direction through a neuron, depending on the situation.",
        correction:
          "Under normal conditions, a signal travels in one consistent direction: dendrites → cell body → axon → axon terminals. This one-way flow is what lets a chain of neurons reliably pass a signal from one place to another.",
      },
      {
        id: "misconception-cns-pns-interchangeable",
        misconception: "The central and peripheral nervous systems are just two names for the same thing.",
        correction:
          "They're distinct. The CNS (brain and spinal cord) is where signals are processed and decisions are made. The PNS is the network of nerves that connects the CNS to the rest of the body — without it, the CNS would have no way to receive sensory information or send out motor commands.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to a prediction before running the Action Potential or Synapse Explorer — then check what actually happens.",
    scenarios: [
      {
        id: "biology-nervous-system-predict-001",
        scenario: "A signal is arriving at a neuron from another cell.",
        question: "Which part of the neuron receives that incoming signal?",
        options: [
          { id: "dendrites", label: "The dendrites" },
          { id: "axon", label: "The axon" },
          { id: "axon-terminals", label: "The axon terminals" },
          { id: "myelin-sheath", label: "The myelin sheath" },
        ],
        actualResultOptionId: "dendrites",
        explanation: "Dendrites are the part of the neuron specialized to receive incoming signals from other neurons.",
        hint: "Think about which end of the neuron faces other cells sending signals in.",
      },
      {
        id: "biology-nervous-system-predict-002",
        scenario: "You trigger a signal at the cell body and watch it travel through the neuron.",
        question: "Which direction does the signal travel?",
        options: [
          { id: "cellbody-axon-terminals", label: "Cell body → axon → axon terminals" },
          { id: "terminals-axon-cellbody", label: "Axon terminals → axon → cell body" },
          { id: "dendrites-terminals-direct", label: "Directly from dendrites to axon terminals, skipping the axon" },
          { id: "random", label: "It can go either direction depending on the signal" },
        ],
        actualResultOptionId: "cellbody-axon-terminals",
        explanation: "Once integrated at the cell body, the signal travels down the axon toward the axon terminals — a consistent, one-way direction.",
        hint: "The axon has one job: carrying the signal away from the cell body.",
      },
      {
        id: "biology-nervous-system-predict-003",
        scenario: "The action potential has just reached the axon terminal.",
        question: "What happens next?",
        options: [
          { id: "neurotransmitter-release", label: "Neurotransmitters are released into the synapse" },
          { id: "signal-stops", label: "The signal simply stops there" },
          { id: "electricity-jumps", label: "Electrical current jumps directly to the next neuron" },
          { id: "signal-reverses", label: "The signal travels back toward the cell body" },
        ],
        actualResultOptionId: "neurotransmitter-release",
        explanation: "When the signal reaches the axon terminal, it triggers the release of neurotransmitters into the synaptic gap.",
        hint: "The synapse isn't a direct electrical connection — something has to cross the gap chemically.",
      },
      {
        id: "biology-nervous-system-predict-004",
        scenario: "Neurotransmitters have just been released into the synaptic gap.",
        question: "What crosses the gap?",
        options: [
          { id: "neurotransmitters", label: "The neurotransmitter molecules themselves" },
          { id: "electrical-current", label: "Electrical current directly" },
          { id: "the-axon", label: "Part of the axon itself" },
          { id: "nothing", label: "Nothing — the gap blocks the signal" },
        ],
        actualResultOptionId: "neurotransmitters",
        explanation: "Neurotransmitter molecules diffuse across the synaptic gap and bind to receptors on the receiving neuron.",
        hint: "The synapse is a chemical handoff, not a direct electrical one.",
      },
      {
        id: "biology-nervous-system-predict-005",
        scenario: "You're asked which system includes the brain and spinal cord.",
        question: "Which system is it?",
        options: [
          { id: "cns", label: "The central nervous system (CNS)" },
          { id: "pns", label: "The peripheral nervous system (PNS)" },
          { id: "somatic", label: "The somatic nervous system" },
          { id: "both-equally", label: "Both CNS and PNS equally" },
        ],
        actualResultOptionId: "cns",
        explanation: "The central nervous system is made up of the brain and spinal cord — the body's processing and decision-making center.",
        hint: "This is the system described as the body's 'control center.'",
      },
      {
        id: "biology-nervous-system-predict-006",
        scenario: "Sensory input has just been processed by the CNS.",
        question: "What happens after the CNS finishes processing information?",
        options: [
          { id: "motor-signal", label: "A motor signal is sent out to produce a response" },
          { id: "processing-stops", label: "Processing simply stops there, with no further signal" },
          { id: "sensory-input-repeats", label: "The same sensory input is sent back to be processed again" },
          { id: "cns-shuts-down", label: "The CNS temporarily shuts down" },
        ],
        actualResultOptionId: "motor-signal",
        explanation: "After integrating sensory input, the CNS sends out a motor signal that leads to a response — completing the sensory input → integration → motor response flow.",
        hint: "Processing information is only useful if it leads to some kind of output.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Use the Neuron Explorer to click each labeled part — dendrites, cell body, axon, myelin sheath, nodes of Ranvier, axon terminals — and read its function.",
      "Run the Action Potential playback and watch the membrane potential rise and fall through resting, depolarization, repolarization, and hyperpolarization.",
      "Step through the Synapse Explorer one stage at a time: arrival, neurotransmitter release, binding to receptors, new signal generation, and reuptake.",
      "Open the Nervous System Organization tree and explore how the CNS and PNS branch into their sub-systems.",
      "Try the simulation's built-in mini-challenge to test whether you can identify a neuron part or predict the next stage.",
    ],
    tryThis: [
      "Narrate a signal's full journey out loud: dendrites → cell body → axon → axon terminals → synapse → next neuron.",
      "Watch the action-potential playback once, then explain in your own words why the membrane potential first rises sharply, then falls past resting before recovering.",
      "Trace the Nervous System Organization tree from 'Nervous System' down to 'Sympathetic,' naming every branch along the way.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "biology-nervous-system-explain-001",
        question: "Why does a signal only travel in one direction through a neuron under normal conditions?",
        answer:
          "Each part of the neuron is structurally specialized for one role in the sequence: dendrites are built to receive input, the axon is built to carry a signal away from the cell body, and axon terminals are built to release neurotransmitters at the end. That specialization — not an arbitrary rule — is what keeps the signal moving consistently forward, dendrites → cell body → axon → axon terminals, so a chain of neurons can reliably relay information in one direction.",
      },
      {
        id: "biology-nervous-system-explain-002",
        question: "Why is the synapse a chemical handoff instead of a direct electrical connection between neurons?",
        answer:
          "Neurons aren't physically touching — there's a small physical gap, the synaptic gap, between the sending and receiving cell. Electrical current can't jump across that gap on its own, so the signal has to convert into a different form to cross it: the sending neuron releases neurotransmitter molecules that diffuse across the gap and bind to receptors, which is what triggers a new electrical signal in the receiving neuron.",
      },
      {
        id: "biology-nervous-system-explain-003",
        question: "Why does the myelin sheath speed up signal transmission along an axon?",
        answer:
          "Myelin insulates the axon, and the small gaps between myelin segments — the nodes of Ranvier — are the only places along a myelinated axon where the signal actively regenerates. Instead of the signal moving continuously along every point of the membrane, it effectively jumps from node to node, which covers distance much faster than an unmyelinated axon of the same length.",
      },
      {
        id: "biology-nervous-system-explain-004",
        question: "Why are the central and peripheral nervous systems both necessary, rather than the CNS working alone?",
        answer:
          "The CNS (brain and spinal cord) is where signals get processed and decisions get made, but on its own it has no way to sense the outside world or act on it — it has no direct connection to the eyes, skin, or muscles. The PNS is that connection: the network of nerves carrying sensory signals in to the CNS and motor signals back out to the body. Without the PNS, the CNS's processing would have nothing to work with and no way to produce a response.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE
  // -------------------------------------------------------------
  practice: {
    // Foreign key into the quiz-engine registry — all questions live in
    // @/features/quiz-engine/data/biology-nervous-system-gle-quiz.ts.
    // Deliberately a new id, not the pre-existing 5-question
    // "biology-nervous-system" bank (still used by the standalone
    // /dashboard/biology/nervous-system-quiz page), to avoid a
    // duplicate registration.
    quizId: "biology-nervous-system-gle",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro: "Harder, realistic problems than ordinary Practice. Use the Neuron Explorer, Action Potential playback, and Synapse Explorer to check anything you're unsure of.",
    scenarios: [
      {
        id: "biology-nervous-system-challenge-001",
        title: "Identify the Structure",
        scenario: "In the simulation, select the neuron part responsible for insulating the axon and speeding up signal conduction.",
        objective: "Name this structure.",
        tools: [{ id: "neuron-explorer", label: "Neuron Explorer" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Myelin sheath" },
            { id: "b", label: "Dendrites" },
            { id: "c", label: "Axon terminals" },
            { id: "d", label: "Cell body" },
          ],
          correctOptionId: "a",
        },
        explanation: "The myelin sheath insulates the axon and lets the signal jump between nodes of Ranvier, speeding transmission.",
        hints: ["Think about which structure's whole job is insulation, not signal reception or release."],
      },
      {
        id: "biology-nervous-system-challenge-002",
        title: "Predict the Next Step",
        scenario: "An action potential has just reached the axon terminal of the sending neuron.",
        objective: "Determine what happens next in the sequence.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Neurotransmitters are released into the synaptic gap" },
            { id: "b", label: "The signal reverses and travels back to the dendrites" },
            { id: "c", label: "The axon terminal absorbs the signal permanently" },
            { id: "d", label: "A new action potential begins at the dendrites of the same neuron" },
          ],
          correctOptionId: "a",
        },
        explanation: "Arrival at the axon terminal triggers neurotransmitter release into the synapse — the first step of synaptic transmission.",
        hints: ["This is the handoff point between one neuron and the next."],
      },
      {
        id: "biology-nervous-system-challenge-003",
        title: "CNS or PNS?",
        scenario: "A nerve outside the brain and spinal cord carries a sensory signal from the skin toward the spinal cord.",
        objective: "Identify which system this nerve belongs to.",
        tools: [{ id: "ns-organization", label: "Nervous System Organization tree" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Peripheral nervous system (PNS)" },
            { id: "b", label: "Central nervous system (CNS)" },
            { id: "c", label: "Neither — this nerve isn't part of either system" },
            { id: "d", label: "Both CNS and PNS simultaneously" },
          ],
          correctOptionId: "a",
        },
        explanation: "Nerves connecting the CNS to the rest of the body — including sensory nerves carrying signals toward the spinal cord — are part of the peripheral nervous system.",
        hints: ["The CNS is only the brain and spinal cord themselves — everything connecting to them from outside is the other system."],
      },
      {
        id: "biology-nervous-system-challenge-004",
        title: "Analyze a Synapse",
        scenario: "A drug blocks the reuptake of a neurotransmitter, so it stays in the synaptic gap much longer than normal.",
        objective: "Determine the most direct effect of this.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The neurotransmitter keeps binding to receptors longer, extending its effect on the receiving neuron" },
            { id: "b", label: "The action potential in the axon reverses direction" },
            { id: "c", label: "The myelin sheath dissolves" },
            { id: "d", label: "Dendrites stop receiving any signals" },
          ],
          correctOptionId: "a",
        },
        explanation: "Reuptake is what normally clears neurotransmitter from the gap and ends the signal. Blocking it leaves the neurotransmitter available to keep binding receptors, extending its effect on the receiving neuron.",
        hints: ["Reuptake's whole job is ending the signal — what happens if that job doesn't happen?"],
      },
      {
        id: "biology-nervous-system-challenge-005",
        title: "Complete the Signal Pathway",
        scenario: "Consider this partial sequence: Stimulus → sensory input → ??? → motor signal → response.",
        objective: "Fill in the missing step.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "CNS processing (integration)" },
            { id: "b", label: "A second, identical stimulus" },
            { id: "c", label: "Reuptake" },
            { id: "d", label: "Hyperpolarization only" },
          ],
          correctOptionId: "a",
        },
        explanation: "Between sensory input and a motor signal, the CNS has to process and integrate the information — that's what determines what response, if any, gets sent back out.",
        hints: ["Something has to happen to the sensory information before a response can be decided on."],
      },
      {
        id: "biology-nervous-system-challenge-006",
        title: "Diagnose the Incorrect Description",
        scenario: "A student describes a neuron this way: \"The axon receives signals from other neurons, and the dendrites send the signal out to the next cell.\"",
        objective: "Identify what's wrong with this description.",
        requiresExperiment: false,
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "The roles are swapped — dendrites receive, the axon sends the signal onward" },
            { id: "b", label: "Nothing is wrong with this description" },
            { id: "c", label: "Neurons don't have an axon at all" },
            { id: "d", label: "Neurons don't have dendrites at all" },
          ],
          correctOptionId: "a",
        },
        explanation: "The description has the roles reversed: dendrites receive incoming signals, and the axon is what carries the signal away, toward the axon terminals and the next cell.",
        hints: ["Compare this description against the actual dendrites → cell body → axon → axon terminals direction."],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "biology",
      topicSlug: "digestive-system",
      label: "Digestive System: The Journey of Food",
      href: "/dashboard/biology/digestive-system",
      reason: "See one of the internal processes the nervous system quietly regulates in the background.",
    },
  ],
};
