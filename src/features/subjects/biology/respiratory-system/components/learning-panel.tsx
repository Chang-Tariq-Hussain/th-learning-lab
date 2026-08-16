export function LearningPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Respiration in Action</p>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        <li>Breathing brings air into and out of the lungs.</li>
        <li>Gas exchange happens in the alveoli.</li>
        <li>Oxygen enters the blood.</li>
        <li>Carbon dioxide leaves the blood.</li>
      </ul>
    </div>
  );
}
