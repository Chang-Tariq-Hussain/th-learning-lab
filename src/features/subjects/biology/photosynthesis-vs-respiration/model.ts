import type { ProcessDetail, ProcessKey } from "./types";

/**
 * The quick, always-visible comparison table (four rows, matching the
 * brief's exact layout). Deliberately smaller than `PROCESS_DETAILS`
 * below — this is the "glance at both at once" view; the toggle cards
 * are the "read one process fully" view. Keeping them as two separate,
 * small pieces of data (rather than one big merged table) is what
 * keeps this component simple, per the brief's "don't build a large
 * new framework" guidance.
 */
export const QUICK_COMPARISON_ROWS: Array<{ label: string; photosynthesis: string; respiration: string }> = [
  { label: "Energy", photosynthesis: "Stores energy", respiration: "Releases/captures energy" },
  { label: "Main inputs", photosynthesis: "CO\u2082 + H\u2082O + light", respiration: "Glucose + O\u2082" },
  { label: "Main outputs", photosynthesis: "Glucose + O\u2082", respiration: "CO\u2082 + H\u2082O + ATP" },
  { label: "Major organelle", photosynthesis: "Chloroplast", respiration: "Mitochondrion*" },
];

/**
 * The click-to-reveal detail behind each process, per the brief's
 * "Inputs / Outputs / Energy / Organelle / Purpose" spec — a level
 * deeper than the quick table above, including *why* each process
 * happens (`purpose`), which the quick table doesn't have room for.
 */
export const PROCESS_DETAILS: Record<ProcessKey, ProcessDetail> = {
  photosynthesis: {
    key: "photosynthesis",
    label: "Photosynthesis",
    inputs: "Carbon dioxide, water, and light energy",
    outputs: "Glucose and oxygen",
    energy: "Captures light energy and stores it in glucose",
    organelle: "Chloroplast",
    purpose: "Lets a plant make its own food (glucose) using sunlight",
  },
  respiration: {
    key: "respiration",
    label: "Cellular Respiration",
    inputs: "Glucose and oxygen",
    outputs: "Carbon dioxide, water, and ATP",
    energy: "Releases the energy stored in glucose and captures it in ATP",
    organelle: "Mitochondrion*",
    purpose: "Gives a cell usable energy (ATP) to power its work",
  },
};

export function processDetail(key: ProcessKey): ProcessDetail {
  return PROCESS_DETAILS[key];
}
