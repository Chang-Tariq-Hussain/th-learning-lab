export const GRID_ROWS = 6;
export const GRID_COLS = 8;
/** Columns 0–3 are the interactive left half; 4–7 are their mirror image. */
export const LEFT_COLS = GRID_COLS / 2;

export function isLeftColumn(col: number): boolean {
  return col < LEFT_COLS;
}

/** The column on the opposite side of the mirror line that corresponds to `col`. */
export function mirrorColumn(col: number): number {
  return GRID_COLS - 1 - col;
}

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

/**
 * The right half is never stored — only ever derived from the left half
 * at render time. This is what guarantees "the matching square appears
 * instantly" and that the grid can never fall out of sync: there is no
 * separate right-side state to keep in sync in the first place.
 */
export function isFilled(filledLeft: ReadonlySet<string>, row: number, col: number): boolean {
  const leftCol = isLeftColumn(col) ? col : mirrorColumn(col);
  return filledLeft.has(cellKey(row, leftCol));
}
