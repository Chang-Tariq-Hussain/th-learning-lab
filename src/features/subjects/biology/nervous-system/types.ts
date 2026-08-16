export type NeuronPartId =
  | "dendrites"
  | "cell-body"
  | "nucleus"
  | "axon"
  | "myelin-sheath"
  | "node-of-ranvier"
  | "axon-terminals";

export interface NeuronPart {
  id: NeuronPartId;
  label: string;
  function: string;
}

export type PotentialPhase =
  | "resting"
  | "depolarization"
  | "repolarization"
  | "hyperpolarization";

export interface PotentialPhaseInfo {
  id: PotentialPhase;
  label: string;
  caption: string;
  /** Dominant ion movement shown in the channel inset, or null at rest. */
  ionFlow: "na-in" | "k-out" | null;
}

export type SynapseStepId =
  | "arrival"
  | "release"
  | "binding"
  | "signal"
  | "reuptake";

export interface SynapseStep {
  id: SynapseStepId;
  label: string;
  caption: string;
}

export type NsNodeId =
  | "nervous-system"
  | "cns"
  | "pns"
  | "brain"
  | "spinal-cord"
  | "somatic"
  | "autonomic"
  | "sympathetic"
  | "parasympathetic";

export interface NsNode {
  id: NsNodeId;
  label: string;
  sublabel?: string;
  description: string;
  children?: NsNodeId[];
}

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}
