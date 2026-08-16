export function RelationshipChain({ steps }: { steps: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          <span className="rounded-full border border-subject-biology/40 bg-subject-biology-soft px-2.5 py-1 text-[11px] font-medium text-ink dark:border-subject-biology/30 dark:bg-subject-biology/10 dark:text-bone">
            {step}
          </span>
          {i < steps.length - 1 ? (
            <span className="text-subject-biology/70 dark:text-subject-biology/60">→</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
