import { HORIZONTAL_CASE, VERTICAL_CASE, formatPoint, midpoint } from "../model";

interface SpecialCasePanelProps {
  onLoad: (a: { x: number; y: number }, b: { x: number; y: number }) => void;
}

/**
 * Two low-key demos: a horizontal segment (same y) and a vertical
 * segment (same x). Both make it obvious that the midpoint formula
 * just averages whichever coordinate actually changes.
 */
export function SpecialCasePanel({ onLoad }: SpecialCasePanelProps) {
  const hMid = midpoint(HORIZONTAL_CASE.a, HORIZONTAL_CASE.b);
  const vMid = midpoint(VERTICAL_CASE.a, VERTICAL_CASE.b);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Special Cases</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onLoad(HORIZONTAL_CASE.a, HORIZONTAL_CASE.b)}
          className="rounded-card border border-line px-3 py-2 text-left transition-colors hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
        >
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">Horizontal segment</p>
          <p className="mt-0.5 text-xs text-ink-soft/80 dark:text-bone-soft/80">
            ({HORIZONTAL_CASE.a.x}, {HORIZONTAL_CASE.a.y}) to ({HORIZONTAL_CASE.b.x}, {HORIZONTAL_CASE.b.y}) → M = {formatPoint(hMid)}
          </p>
        </button>
        <button
          type="button"
          onClick={() => onLoad(VERTICAL_CASE.a, VERTICAL_CASE.b)}
          className="rounded-card border border-line px-3 py-2 text-left transition-colors hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
        >
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">Vertical segment</p>
          <p className="mt-0.5 text-xs text-ink-soft/80 dark:text-bone-soft/80">
            ({VERTICAL_CASE.a.x}, {VERTICAL_CASE.a.y}) to ({VERTICAL_CASE.b.x}, {VERTICAL_CASE.b.y}) → M = {formatPoint(vMid)}
          </p>
        </button>
      </div>
    </div>
  );
}
