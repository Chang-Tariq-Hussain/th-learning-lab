const SECTIONS = [
  { title: "Slope", body: "Tells us how steep a line is: m = rise / run." },
  { title: "Positive", body: "Line rises from left to right." },
  { title: "Negative", body: "Line falls from left to right." },
  { title: "Zero / Undefined", body: "Horizontal lines have zero slope; vertical lines have undefined slope." },
];

export function LearningPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Understand Slope</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-card border border-line p-3 dark:border-line-dark">
            <p className="font-display text-sm font-medium text-ink dark:text-bone">{section.title}</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
