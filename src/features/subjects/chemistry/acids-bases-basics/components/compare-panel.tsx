"use client";

import { CLASSIFICATION_COLOR, classificationLabel, comparePrompt, type Substance } from "../acids-bases-model";
import { PhScale } from "./ph-scale";

interface ComparePanelProps {
  a: Substance | null;
  b: Substance | null;
}

export function ComparePanel({ a, b }: ComparePanelProps) {
  if (!a || !b) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-center text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
        Pick two substances above to compare them ({!a ? "1st" : "2nd"} pick).
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-display text-base font-medium text-ink dark:text-bone">
        Compare: {a.name} vs {b.name}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[a, b].map((substance) => {
          const color = CLASSIFICATION_COLOR[substance.classification];
          return (
            <div key={substance.slug} className="rounded-card border border-line p-3 dark:border-line-dark">
              <p className="font-display text-sm font-medium text-ink dark:text-bone">{substance.name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide" style={{ color }}>
                {classificationLabel(substance.classification)}
              </p>
              <p className="mt-1 font-mono text-xs text-ink-soft dark:text-bone-soft">pH ≈ {substance.approxPH}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 px-1">
        <PhScale markers={[{ substance: a, label: a.name }, { substance: b, label: b.name }]} />
      </div>

      <p className="mt-8 text-center text-sm font-medium text-ink dark:text-bone">Which is more acidic?</p>
      <p className="mt-1 text-center text-sm text-ink-soft dark:text-bone-soft">{comparePrompt(a, b)}</p>
    </div>
  );
}
