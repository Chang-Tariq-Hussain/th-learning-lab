/** A conceptual, non-numerical illustration of "extensive" vs "partial" ionization — explicitly not a measurement scale. */
export function StrengthScale() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Conceptual illustration, not a measurement</p>

      <div className="mt-3 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
            <span>Strong</span>
            <span className="text-ink-soft/60 dark:text-bone-soft/50">Extensive ionization</span>
          </div>
          <div className="mt-1 h-3 w-full rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
            <div className="h-3 w-[90%] rounded-full bg-pine-600 dark:bg-pine-300" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-ink-soft dark:text-bone-soft">
            <span>Weak</span>
            <span className="text-ink-soft/60 dark:text-bone-soft/50">Partial ionization</span>
          </div>
          <div className="mt-1 h-3 w-full rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
            <div className="h-3 w-[25%] rounded-full bg-pine-600 dark:bg-pine-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
