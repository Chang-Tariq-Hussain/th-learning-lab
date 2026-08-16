import { LEARNING_PANEL_SECTIONS } from "../wave-model";

export function LearningPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
        Understand Wave Speed
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {LEARNING_PANEL_SECTIONS.map((section) => (
          <div key={section.title} className="rounded-card border border-line p-3 dark:border-line-dark">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-medium text-ink dark:text-bone">{section.title}</p>
              {section.unit ? (
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                  {section.unit}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{section.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center font-display text-lg font-medium text-ink dark:text-bone">v = fλ</p>
    </div>
  );
}
