export function DigestionAbsorptionCompare() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Digestion
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">Food</span> is
          broken down into smaller molecules.
        </p>
      </div>
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Absorption
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          <span className="font-medium text-ink dark:text-bone">Nutrients</span>{" "}
          move into the blood.
        </p>
      </div>
    </div>
  );
}
