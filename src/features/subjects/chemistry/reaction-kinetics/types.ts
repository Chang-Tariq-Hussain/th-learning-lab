export type ParticleType = "A" | "B" | "AB";

export interface KineticsParticle {
  id: number;
  type: ParticleType;
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  cooldownUntil: number;
}

export interface ChamberStats {
  reactantsRemaining: number;
  productCount: number;
  totalParticles: number;
  successfulCollisions: number;
  failedCollisions: number;
  elapsed: number;
  history: { t: number; product: number }[];
}

export interface Spark {
  id: number;
  x: number;
  y: number;
  kind: "success" | "fail";
}

export type LevelId =
  | "rate"
  | "collisions"
  | "successful"
  | "concentration"
  | "temperature"
  | "surface-area"
  | "progress"
  | "compare"
  | "catalyst"
  | "experiment"
  | "challenge";

export interface LevelMeta {
  id: LevelId;
  index: number;
  title: string;
  kicker: string;
}
