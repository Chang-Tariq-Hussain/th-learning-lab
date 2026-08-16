import { DECOMPOSER_STEPS } from "../food-web-model";

export function DecomposersPanel() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Decomposers
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {DECOMPOSER_STEPS.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded-full border border-subject-biology/40 bg-subject-biology-soft px-2.5 py-1 text-[11px] font-medium text-ink dark:border-subject-biology/30 dark:bg-subject-biology/10 dark:text-bone">
              {step}
            </span>
            {i < DECOMPOSER_STEPS.length - 1 ? (
              <span className="text-subject-biology/70 dark:text-subject-biology/60">→</span>
            ) : null}
          </span>
        ))}
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        Decomposers break down dead organisms and return nutrients to the environment, closing
        the loop back to producers.
      </p>
    </div>
  );
}
