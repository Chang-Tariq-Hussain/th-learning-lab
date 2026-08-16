import { quadrantOf, QUADRANT_INFO, type Quadrant } from "../model";

interface TargetCardProps {
  target: { x: number; y: number };
  showHint: boolean;
  isFinal: boolean;
}

export function TargetCard({ target, showHint, isFinal }: TargetCardProps) {
  const quadrant: Quadrant | null = quadrantOf(target.x, target.y);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
        {isFinal ? "Final Challenge" : "Plot This Point"}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink dark:text-bone">
        P = ({target.x}, {target.y})
      </p>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Tap or click the coordinate plane to plot the point.</p>
      {showHint && quadrant ? (
        <p className="mt-2 inline-block rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft dark:border-line-dark dark:bg-white/[0.05] dark:text-bone-soft">
          This point is in {QUADRANT_INFO[quadrant].title}.
        </p>
      ) : null}
    </div>
  );
}
