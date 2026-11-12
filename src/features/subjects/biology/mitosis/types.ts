import type { StructureId } from "./data/stages";

/** What a click on the stage reports. */
export type StagePick = { kind: "chromatid"; k: number; s: 0 | 1 } | { kind: "structure"; id: StructureId } | { kind: "fiber" };

/** What is selected: a chromosome (with the chromatid that was clicked) or a cell structure. */
export type Selection = { kind: "chromosome"; k: number; s: 0 | 1 } | { kind: "structure"; id: StructureId };

export type Workspace = "simulation" | "explorer" | "counts" | "compare" | "practice";
export type SimMode = "explore" | "predict" | "identify";
export type PracticeMode = "arrange" | "challenge";
export type CellType = "animal" | "plant";
