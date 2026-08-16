import { QUADRANT_INFO, type Quadrant } from "../coordinate-model";

interface SelectionInfoProps {
  selection: { type: "quadrant"; quadrant: Quadrant } | { type: "origin" } | null;
}

const ORIGIN_EXPLANATION = "The origin is where the x-axis and y-axis intersect.";

/** Shows a short explanation when the student clicks a quadrant or the origin. */
export function SelectionInfo({ selection }: SelectionInfoProps) {
  if (!selection) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 p-4 text-center text-xs text-ink-soft dark:border-bone/20 dark:text-bone-soft">
        Click a quadrant or the origin to learn more about it.
      </div>
    );
  }

  if (selection.type === "origin") {
    return (
      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-display text-sm font-medium text-ink dark:text-bone">Origin — O (0, 0)</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{ORIGIN_EXPLANATION}</p>
      </div>
    );
  }

  const info = QUADRANT_INFO[selection.quadrant];
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-sm font-medium text-ink dark:text-bone">{info.title}</p>
      <p className="mt-1 font-mono text-sm text-subject-math">{info.signs}</p>
    </div>
  );
}
