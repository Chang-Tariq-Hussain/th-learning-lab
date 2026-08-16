import { positionMessage } from "../coordinate-model";

interface ReadoutsProps {
  point: { x: number; y: number };
  hover: { x: number; y: number } | null;
}

export function Readouts({ point, hover }: ReadoutsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Point</p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink dark:text-bone">
          P = ({point.x}, {point.y})
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-pine-600 dark:text-pine-300">x = {point.x}</span> — horizontal position
          &nbsp;·&nbsp;
          <span className="font-medium text-amber-600 dark:text-amber-400">y = {point.y}</span> — vertical position
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{positionMessage(point.x, point.y)}</p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Cursor</p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ink dark:text-bone">
          {hover ? `(${hover.x}, ${hover.y})` : "—"}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Move over the plane to read off any coordinate.
        </p>
      </div>
    </div>
  );
}
