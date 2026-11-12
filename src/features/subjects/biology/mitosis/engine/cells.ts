import { COUNT_ROWS } from "./counts";
import { daughterOf, type MitosisPlan } from "./plan";


export interface Glyph {
  k: number;
  /** One entry per chromatid drawn: 1 or 2. */
  sisters: (0 | 1)[];
}
export interface CellContent {
  groups: Glyph[][];
  /** Draw each group as its own nucleus (telophase). */
  nuclei: boolean;
}

/** What is inside each cell at a counting row, derived from the same plan the animation uses. */
export function cellContents(plan: MitosisPlan, row: number): CellContent[] {
  const all = Array.from({ length: plan.n }, (_, k) => k);
  const id = COUNT_ROWS[row]!.id;
  if (id === "g1") return [{ nuclei: false, groups: [all.map((k) => ({ k, sisters: [0] as (0 | 1)[] }))] }];
  if (id === "g2" || id === "prophase" || id === "prometaphase" || id === "metaphase") return [{ nuclei: false, groups: [all.map((k) => ({ k, sisters: [0, 1] as (0 | 1)[] }))] }];
  const half = (side: 0 | 1): Glyph[] => all.map((k) => ({ k, sisters: [([0, 1] as const).find((s) => daughterOf(plan, { k, s }) === side)!] }));
  if (id === "anaphase" || id === "telophase") return [{ nuclei: id === "telophase", groups: [half(0), half(1)] }];
  return [0, 1].map((side) => ({ nuclei: false, groups: [half(side as 0 | 1)] }));
}
