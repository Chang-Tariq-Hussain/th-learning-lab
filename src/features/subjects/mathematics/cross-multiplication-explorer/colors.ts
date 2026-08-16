/**
 * The two diagonals of a cross-multiplication, colored consistently
 * across the diagram, the equation labels, and the input fields they
 * originate from — so a student can trace "purple number × purple
 * number" without reading a legend.
 */
export const DIAGONAL_COLORS = {
  /** a (top-left) × d (bottom-right) */
  first: { hex: "#7C4FE0", label: "First diagonal" },
  /** b (bottom-left) × c (top-right) */
  second: { hex: "#F2A65A", label: "Second diagonal" },
} as const;

export const EQUIVALENT_HEX = "#2E9E5B";
export const DIFFERENT_HEX = "#D2504A";

export const FIELD_MIN = 1;
export const FIELD_MAX = 20;
