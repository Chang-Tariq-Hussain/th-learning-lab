import type { ChromatidId } from "./engine/plan";
import type { StructureId } from "./data/stages";

export type Selection = { kind: "chromatid"; id: ChromatidId } | { kind: "structure"; id: StructureId };

/** What a click on the stage reports. */
export type StagePick = Selection | { kind: "fiber" };

export type Workspace = "simulation" | "variation" | "counts" | "practice";
export type SimMode = "explore" | "predict" | "identify";
export type PracticeMode = "arrange" | "challenge";
