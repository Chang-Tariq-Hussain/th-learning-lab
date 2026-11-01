import { positionMessage } from "../coordinate-model";

/** What the point's coordinates mean; the numbers themselves live in the stage readouts. */
export function PointNotes({ point }: { point: { x: number; y: number } }) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-subject-math">Point</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        <span className="font-medium text-pine-600 dark:text-pine-300">x = {point.x}</span> — horizontal position
        &nbsp;·&nbsp;
        <span className="font-medium text-amber-600 dark:text-amber-400">y = {point.y}</span> — vertical position
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{positionMessage(point.x, point.y)}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">Move over the plane to read off any coordinate.</p>
    </div>
  );
}
