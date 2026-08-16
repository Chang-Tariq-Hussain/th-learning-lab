export function TrendConceptNote() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
        Why do periodic trends happen?
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-line p-3 text-center dark:border-line-dark">
          <p className="text-sm text-ink-soft dark:text-bone-soft">More electron shells</p>
          <p aria-hidden className="my-1 text-ink/40 dark:text-bone/40">
            ↓
          </p>
          <p className="text-sm font-medium text-ink dark:text-bone">Larger atoms</p>
        </div>
        <div className="rounded-card border border-line p-3 text-center dark:border-line-dark">
          <p className="text-sm text-ink-soft dark:text-bone-soft">Stronger nuclear attraction</p>
          <p aria-hidden className="my-1 text-ink/40 dark:text-bone/40">
            ↓
          </p>
          <p className="text-sm font-medium text-ink dark:text-bone">
            Smaller atomic radius / higher ionization energy
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-soft/80 dark:text-bone-soft/80">
        Periodic trends show general patterns. Some elements have exceptions.
      </p>
    </div>
  );
}
