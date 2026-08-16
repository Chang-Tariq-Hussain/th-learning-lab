export type OrganismId =
  | "sun"
  | "grass"
  | "grasshopper"
  | "rabbit"
  | "frog"
  | "bird"
  | "snake"
  | "hawk"
  | "fungi";

export type RoleId =
  | "source"
  | "producer"
  | "primary"
  | "secondary"
  | "tertiary"
  | "decomposer";

export type TrophicLevel = 1 | 2 | 3 | 4;

export interface Organism {
  id: OrganismId;
  label: string;
  role: RoleId;
  roleLabel: string;
  trophicLevel: TrophicLevel | null;
  /** Short explanation shown when the organism is selected. */
  description: string;
  /** Shown instead of `description` when an organism is selected while in Food Web mode. */
  webCaption?: string;
}

export interface WebEdge {
  from: OrganismId;
  to: OrganismId;
}

export type Mode = "chain" | "web";

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}
