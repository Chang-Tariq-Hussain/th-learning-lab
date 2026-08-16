export function ChainVsWebSummary() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Food Chain vs Food Web
      </p>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="text-center">
          <p className="text-xs font-semibold text-ink dark:text-bone">Food Chain</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            One pathway of energy flow.
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-ink dark:text-bone">Food Web</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Many connected pathways.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-0.5 border-t border-line pt-4 dark:border-line-dark">
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Sun
        </span>
        <span className="text-ink-soft/40 dark:text-bone-soft/40">↓</span>
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Producers
        </span>
        <span className="text-ink-soft/40 dark:text-bone-soft/40">↓</span>
        <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
          Consumers
        </span>
        <span className="text-ink-soft/40 dark:text-bone-soft/40">↓</span>
        <span className="rounded-full border border-subject-biology bg-subject-biology px-3 py-1 text-xs font-medium text-paper dark:text-chalkboard">
          Higher Consumers
        </span>
      </div>
    </div>
  );
}
