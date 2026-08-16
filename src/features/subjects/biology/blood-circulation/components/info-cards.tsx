export function InfoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Oxygen Exchange</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">Oxygen-poor</span>
          <span className="text-ink-soft dark:text-bone-soft">→ Lungs →</span>
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">Oxygen-rich</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          In the lungs, blood releases carbon dioxide and picks up oxygen.
        </p>
      </div>

      <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Why do we need circulation?</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Your cells need oxygen and nutrients. The circulatory system delivers them and carries away waste products
          such as carbon dioxide.
        </p>
      </div>
    </div>
  );
}
