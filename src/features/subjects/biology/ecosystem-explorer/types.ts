export type ComponentId =
  | "sun"
  | "air"
  | "water"
  | "soil"
  | "tree"
  | "grass"
  | "insect"
  | "rabbit"
  | "bird"
  | "fungus";

export type CategoryId = "biotic" | "abiotic";

export type RoleId = "producer" | "consumer" | "decomposer" | "abiotic";

export interface EcosystemComponent {
  id: ComponentId;
  label: string;
  category: CategoryId;
  role: RoleId;
  roleLabel: string;
  description: string;
  /** A short chain of steps shown as an animated flow when this component is selected. */
  relationship?: string[];
}

export type ExploreRoleId = "producer" | "consumer" | "decomposer";

export interface ChallengeQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
}
