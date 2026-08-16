const FLOW = [
  { label: "Food", caption: null },
  { label: "Mouth", caption: "Digestion begins" },
  { label: "Stomach", caption: "Food is mixed and broken down" },
  { label: "Small Intestine", caption: "Nutrients are absorbed" },
  { label: "Large Intestine", caption: "Water is absorbed" },
  { label: "Waste", caption: "Removed from the body" },
];

export function LearningFlow() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Journey at a Glance
      </p>

      <ol className="mt-3 flex flex-col items-center gap-0.5">
        {FLOW.map((step, i) => (
          <li key={step.label} className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-xs font-medium text-ink dark:border-bone/20 dark:bg-white/[0.04] dark:text-bone">
                {step.label}
              </span>
              {step.caption ? (
                <span className="text-xs text-ink-soft dark:text-bone-soft">
                  {step.caption}
                </span>
              ) : null}
            </div>
            {i < FLOW.length - 1 ? (
              <span className="my-0.5 text-ink-soft/40 dark:text-bone-soft/40">
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
