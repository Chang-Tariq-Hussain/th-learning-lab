export type Species = "acid" | "base";
export type Strength = "strong" | "weak";

export interface StrongWeakState {
  species: Species;
  ionized: boolean;
}
