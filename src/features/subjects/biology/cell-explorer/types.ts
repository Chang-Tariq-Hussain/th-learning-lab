/** Which cell the learner is looking at. */
export type CellKind = "animal" | "plant";

/** The four ways of working with the cell. */
export type CellMode = "explore" | "identify" | "function" | "compare";

/** Where a structure is found. "both" = shared by plant and animal cells. */
export type Presence = "both" | "plant" | "animal";

export type OrganelleId =
  | "cellWall"
  | "plasmodesmata"
  | "cellMembrane"
  | "cytoplasm"
  | "nucleus"
  | "nuclearEnvelope"
  | "nucleolus"
  | "mitochondria"
  | "ribosomes"
  | "roughER"
  | "smoothER"
  | "golgi"
  | "vesicles"
  | "vacuole"
  | "largeVacuole"
  | "chloroplast";
