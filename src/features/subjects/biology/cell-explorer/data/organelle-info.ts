/**
 * TASK 5 added the first five organelles (Nucleus, Mitochondria, Golgi
 * Apparatus, Rough ER, Ribosomes). This pass (finishing the Plant Cell)
 * adds the eight new structures the Plant Cell needs: Cell Wall, Cell
 * Membrane, Cytoplasm, Nucleolus, Smooth ER, Large Central Vacuole,
 * Chloroplast, and Plasmodesmata. Deliberately its own file, separate
 * from the components that own rendering (`animal-cell-organelles.tsx`,
 * `plant-cell-body.tsx`, `plant-cell-organelles.tsx`) and interaction
 * (`organelle-hotspot.tsx`) — this file only supplies what the info
 * panel displays.
 */
export interface OrganelleInfo {
  id: string;
  name: string;
  /** One simple sentence — what it does. */
  description: string;
  /** One sentence — a memorable, concrete detail. */
  fact: string;
}
export interface OrganelleInfo {
  id: string;
  name: string;
  /** One simple sentence — what it does. */
  description: string;
  /** One sentence — a memorable, concrete detail. */
  fact: string;
}

export const ORGANELLE_INFO: Record<string, OrganelleInfo> = {
  nucleus: {
    id: "nucleus",
    name: "Nucleus",
    description: "Stores the cell's DNA and directs all of its activities.",
    fact: "It's often called the cell's control center, since it manages almost everything the cell does.",
  },
  mitochondria: {
    id: "mitochondria",
    name: "Mitochondria",
    description: "Produces energy for the cell.",
    fact: 'Often called the "Powerhouse of the Cell."',
  },
  golgi: {
    id: "golgi",
    name: "Golgi Apparatus",
    description:
      "Packages and ships proteins to wherever they're needed in the cell.",
    fact: "Think of it as the cell's post office — sorting, wrapping, and mailing packages.",
  },
  roughER: {
    id: "roughER",
    name: "Rough Endoplasmic Reticulum",
    description:
      "Folds and processes proteins made by the ribosomes attached to it.",
    fact: 'It looks "rough" under a microscope because ribosomes are dotted all over its surface.',
  },
  ribosomes: {
    id: "ribosomes",
    name: "Ribosomes",
    description: "Builds proteins the cell needs to function.",
    fact: "A single busy cell can contain millions of ribosomes at once.",
  },
  cellWall: {
    id: "cellWall",
    name: "Cell Wall",
    description:
      "A rigid outer layer that gives the plant cell its shape and protects it.",
    fact: "It's built mainly from cellulose — the same tough fiber found in wood and paper.",
  },
  cellMembrane: {
    id: "cellMembrane",
    name: "Cell Membrane",
    description:
      "Controls what enters and leaves the cell, just inside the rigid cell wall.",
    fact: "It's selectively permeable — it lets some substances through while keeping others out.",
  },
  cytoplasm: {
    id: "cytoplasm",
    name: "Cytoplasm",
    description:
      "The fluid that fills the cell and holds all its organelles in place.",
    fact: "Most of a cell's everyday chemical reactions actually happen right here.",
  },
  nucleolus: {
    id: "nucleolus",
    name: "Nucleolus",
    description: "A dense region inside the nucleus that builds ribosomes.",
    fact: "A busy cell's nucleolus can assemble thousands of new ribosomes every minute.",
  },
  smoothER: {
    id: "smoothER",
    name: "Smooth Endoplasmic Reticulum",
    description: "Builds lipids and helps break down toxins in the cell.",
    fact: 'It\'s called "smooth" because, unlike its neighbor, it has no ribosomes attached.',
  },
  largeVacuole: {
    id: "largeVacuole",
    name: "Large Central Vacuole",
    description: "Stores water and helps keep the plant cell firm and upright.",
    fact: "It can take up to 90% of a mature plant cell's total volume.",
  },
  chloroplast: {
    id: "chloroplast",
    name: "Chloroplast",
    description:
      "Captures sunlight and turns it into food through photosynthesis.",
    fact: "Its green color comes from chlorophyll, the pigment that absorbs sunlight.",
  },
  plasmodesmata: {
    id: "plasmodesmata",
    name: "Plasmodesmata",
    description:
      "Tiny channels through the cell wall that connect a plant cell to its neighbors.",
    fact: "Water, nutrients, and even signaling molecules can pass directly between cells through them.",
  },
};

export function getOrganelleInfo(id: string | null): OrganelleInfo | null {
  if (!id) return null;
  return ORGANELLE_INFO[id] ?? null;
}
