export function LearningSummary() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Ecosystem at a Glance
      </p>

      <div className="mt-3 flex flex-col items-center gap-0.5">
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Living components
        </span>
        <span className="text-ink-soft/40 dark:text-bone-soft/40">+</span>
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Non-living components
        </span>
        <span className="my-0.5 text-ink-soft/40 dark:text-bone-soft/40">↓</span>
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Interactions
        </span>
        <span className="my-0.5 text-ink-soft/40 dark:text-bone-soft/40">↓</span>
        <span className="rounded-full border border-subject-biology bg-subject-biology px-3 py-1 text-xs font-medium text-paper dark:text-chalkboard">
          Ecosystem
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="text-center">
          <p className="text-xs font-semibold text-ink dark:text-bone">Biotic</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Plants, animals, fungi
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-ink dark:text-bone">Abiotic</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Sunlight, water, soil, air, temperature
          </p>
        </div>
      </div>
    </div>
  );
}
