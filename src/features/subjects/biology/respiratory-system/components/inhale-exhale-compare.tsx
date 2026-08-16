export function InhaleExhaleCompare() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Inhale</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Air moves <span className="font-medium text-ink dark:text-bone">outside → lungs</span>. Lungs expand.
        </p>
      </div>
      <div className="rounded-card border border-line bg-white/60 p-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Exhale</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Air moves <span className="font-medium text-ink dark:text-bone">lungs → outside</span>. Lungs contract.
        </p>
      </div>
    </div>
  );
}
