"use client";

import { DETAIL_LEVEL_LABELS, DETAIL_LEVEL_ORDER, INFO_TEXT, type DetailLevel } from "../model";
import { Collapsible } from "./parts";

/** Progressively deeper explanation of DNS, following the detail level the student chose. */
export function InfoPanel({ level, onChange }: { level: DetailLevel; onChange: (level: DetailLevel) => void }) {
  const info = INFO_TEXT[level];
  const next = DETAIL_LEVEL_ORDER[DETAIL_LEVEL_ORDER.indexOf(level) + 1];
  return (
    <Collapsible title={`${DETAIL_LEVEL_LABELS[level]}: ${info.title}`}>
      <div className="flex flex-col gap-2">
        {info.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {p}
          </p>
        ))}
        {next && (
          <button onClick={() => onChange(next)} className="min-h-[44px] self-start text-sm font-medium text-subject-it underline-offset-2 hover:underline">
            Go deeper: {INFO_TEXT[next].title} →
          </button>
        )}
      </div>
    </Collapsible>
  );
}
