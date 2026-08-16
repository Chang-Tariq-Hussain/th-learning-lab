/**
 * Nervous System — data model.
 *
 * Three small interactive pieces, each following the same shape used by
 * the other Human Physiology sims:
 *  - Neuron anatomy: a static labeled diagram with a click-to-explore part list.
 *  - Action potential: a continuous playback clock (0–1 progress) driving a
 *    playhead across a resting → depolarization → repolarization →
 *    hyperpolarization → resting cycle, same pattern as the digestive
 *    system's food-journey clock.
 *  - Synaptic transmission: a five-step click-through sequence.
 */

import type {
  ChallengeQuestion,
  NeuronPart,
  NsNode,
  PotentialPhaseInfo,
  SynapseStep,
} from "./types";

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// --- Neuron anatomy ---------------------------------------------------------------

export const NEURON_PARTS: NeuronPart[] = [
  {
    id: "dendrites",
    label: "Dendrites",
    function:
      "Branch-like extensions that receive signals from other neurons and carry them toward the cell body.",
  },
  {
    id: "cell-body",
    label: "Cell Body (Soma)",
    function:
      "Contains the nucleus and the organelles that keep the neuron alive and functioning.",
  },
  {
    id: "nucleus",
    label: "Nucleus",
    function: "Holds the neuron's genetic material and directs cell activity.",
  },
  {
    id: "axon",
    label: "Axon",
    function:
      "A long fiber that carries the electrical signal (action potential) away from the cell body toward other cells.",
  },
  {
    id: "myelin-sheath",
    label: "Myelin Sheath",
    function:
      "A fatty coating, formed by Schwann cells, that insulates the axon and speeds up signal transmission.",
  },
  {
    id: "node-of-ranvier",
    label: "Nodes of Ranvier",
    function:
      "Small gaps between myelin segments where the signal 'jumps' from node to node, speeding conduction.",
  },
  {
    id: "axon-terminals",
    label: "Axon Terminals",
    function:
      "The endpoints of the axon, where the signal reaches the synapse and neurotransmitters are released.",
  },
];

// --- Action potential --------------------------------------------------------------

export const AP_DURATION_S = 6;

export const POTENTIAL_PHASES: PotentialPhaseInfo[] = [
  {
    id: "resting",
    label: "Resting Potential",
    caption:
      "The membrane sits at about −70 mV. Sodium–potassium pumps keep more sodium outside and more potassium inside the cell.",
    ionFlow: null,
  },
  {
    id: "depolarization",
    label: "Depolarization",
    caption:
      "Sodium (Na⁺) channels open and Na⁺ rushes in, flipping the membrane potential from negative toward positive.",
    ionFlow: "na-in",
  },
  {
    id: "repolarization",
    label: "Repolarization",
    caption:
      "Sodium channels close and potassium (K⁺) channels open, so K⁺ flows out and the membrane potential falls again.",
    ionFlow: "k-out",
  },
  {
    id: "hyperpolarization",
    label: "Hyperpolarization",
    caption:
      "Potassium channels stay open a little too long, briefly dropping the potential below resting before it settles back.",
    ionFlow: "k-out",
  },
];

// Four windows of a full cycle, each mapped to a phase. Boundaries chosen so
// the depolarization spike reads clearly against a longer resting baseline.
const AP_WINDOWS: { end: number; phase: PotentialPhaseInfo["id"] }[] = [
  { end: 0.28, phase: "resting" },
  { end: 0.46, phase: "depolarization" },
  { end: 0.68, phase: "repolarization" },
  { end: 0.85, phase: "hyperpolarization" },
  { end: 1.0, phase: "resting" },
];

export function phaseAt(progress: number): PotentialPhaseInfo {
  const p = clamp01(progress);
  const window = AP_WINDOWS.find((w) => p <= w.end) ?? AP_WINDOWS[AP_WINDOWS.length - 1]!;
  return POTENTIAL_PHASES.find((ph) => ph.id === window.phase)!;
}

/**
 * Membrane potential in mV for a given progress in [0, 1], shaped to read
 * as a recognizable action-potential spike: a flat resting baseline, a
 * sharp rise through 0 to a positive peak, a fall back past resting into a
 * brief undershoot, then a slow recovery to rest.
 */
export function membranePotentialAt(progress: number): number {
  const p = clamp01(progress);
  const REST = -70;
  const PEAK = 35;
  const UNDERSHOOT = -82;

  if (p <= 0.28) return REST;
  if (p <= 0.46) {
    const t = (p - 0.28) / (0.46 - 0.28);
    return REST + (PEAK - REST) * easeOutCubic(t);
  }
  if (p <= 0.68) {
    const t = (p - 0.46) / (0.68 - 0.46);
    return PEAK + (UNDERSHOOT - PEAK) * easeInCubic(t);
  }
  if (p <= 0.85) {
    const t = (p - 0.68) / (0.85 - 0.68);
    return UNDERSHOOT;
  }
  const t = (p - 0.85) / (1 - 0.85);
  return UNDERSHOOT + (REST - UNDERSHOOT) * easeOutCubic(t);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number): number {
  return t * t * t;
}

// --- Synaptic transmission ----------------------------------------------------------

export const SYNAPSE_STEPS: SynapseStep[] = [
  {
    id: "arrival",
    label: "Arrival of Action Potential",
    caption:
      "An electrical signal travels down the axon and reaches the axon terminal of the sending (presynaptic) neuron.",
  },
  {
    id: "release",
    label: "Vesicle Fusion & Release",
    caption:
      "Vesicles filled with neurotransmitter (such as acetylcholine) fuse with the membrane and release their contents into the synaptic gap.",
  },
  {
    id: "binding",
    label: "Binding to Receptors",
    caption:
      "Neurotransmitter molecules diffuse across the gap and bind to receptors on the receiving (postsynaptic) neuron.",
  },
  {
    id: "signal",
    label: "New Signal Generated",
    caption:
      "Binding opens channels on the postsynaptic membrane, generating a new excitatory or inhibitory signal.",
  },
  {
    id: "reuptake",
    label: "Reuptake & Degradation",
    caption:
      "Leftover neurotransmitter is reabsorbed by the presynaptic neuron or broken down by enzymes, ending the signal.",
  },
];

// --- Nervous system organization -----------------------------------------------------

export const NS_NODES: NsNode[] = [
  {
    id: "nervous-system",
    label: "Nervous System",
    description:
      "The body's communication network, made up of the central and peripheral nervous systems.",
    children: ["cns", "pns"],
  },
  {
    id: "cns",
    label: "Central Nervous System",
    sublabel: "CNS",
    description:
      "The brain and spinal cord — the body's control center, where signals are processed and decisions are made.",
    children: ["brain", "spinal-cord"],
  },
  {
    id: "pns",
    label: "Peripheral Nervous System",
    sublabel: "PNS",
    description:
      "Nerves that connect the CNS to the rest of the body, carrying signals in and out.",
    children: ["somatic", "autonomic"],
  },
  {
    id: "brain",
    label: "Brain",
    description: "Processes sensory information, controls movement, and governs thought.",
  },
  {
    id: "spinal-cord",
    label: "Spinal Cord",
    description:
      "Relays signals between the brain and the body, and coordinates fast reflexes.",
  },
  {
    id: "somatic",
    label: "Somatic Nervous System",
    sublabel: "Voluntary",
    description: "Controls voluntary movements, like moving a hand or walking.",
  },
  {
    id: "autonomic",
    label: "Autonomic Nervous System",
    sublabel: "Involuntary",
    description:
      "Controls involuntary functions like heart rate and digestion, split into sympathetic and parasympathetic branches.",
    children: ["sympathetic", "parasympathetic"],
  },
  {
    id: "sympathetic",
    label: "Sympathetic",
    sublabel: "Fight or Flight",
    description:
      "Prepares the body for action — raises heart rate, redirects blood to muscles, and heightens alertness.",
  },
  {
    id: "parasympathetic",
    label: "Parasympathetic",
    sublabel: "Rest and Digest",
    description:
      "Calms the body down — slows heart rate and supports digestion and recovery.",
  },
];

export function nsNodeById(id: NsNode["id"]): NsNode {
  return NS_NODES.find((n) => n.id === id)!;
}

// --- Mini challenge ------------------------------------------------------------------

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    prompt: "Which part of the neuron receives signals from other neurons?",
    options: [
      { label: "Dendrites", correct: true },
      { label: "Axon", correct: false },
      { label: "Myelin sheath", correct: false },
    ],
  },
  {
    prompt: "During depolarization, which ion rushes into the neuron?",
    options: [
      { label: "Potassium (K⁺)", correct: false },
      { label: "Sodium (Na⁺)", correct: true },
      { label: "Chloride (Cl⁻)", correct: false },
    ],
  },
  {
    prompt: "What crosses the synaptic gap to carry a signal to the next neuron?",
    options: [
      { label: "Neurotransmitters", correct: true },
      { label: "Myelin", correct: false },
      { label: "Glucose", correct: false },
    ],
  },
  {
    prompt: "Which branch of the autonomic nervous system triggers 'fight or flight'?",
    options: [
      { label: "Parasympathetic", correct: false },
      { label: "Somatic", correct: false },
      { label: "Sympathetic", correct: true },
    ],
  },
];
