"use client";

interface ExplanationPanelProps {
  activeLabel?: string;
  explanation?: string;
  idleText: string;
}

export function ExplanationPanel({ activeLabel, explanation, idleText }: ExplanationPanelProps) {
  return (
    <div aria-live="polite" className="min-h-[3.5rem] rounded-card bg-ink/[0.03] p-3 text-sm text-ink dark:bg-bone/[0.05] dark:text-bone">
      {explanation ? (
        <>
          {activeLabel && <span className="font-mono text-xs uppercase tracking-wide text-subject-it">{activeLabel}</span>}
          <p className="mt-1 leading-relaxed">{explanation}</p>
        </>
      ) : (
        <p className="text-ink-soft dark:text-bone-soft">{idleText}</p>
      )}
    </div>
  );
}
