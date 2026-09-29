"use client";

import { Callout } from "../../osi-model-explorer/components/ui";

/** Progressive hints: one more is revealed each time the student asks. */
export function HintBox({ hints, shown, onMore }: { hints: string[]; shown: number; onMore: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      {hints.slice(0, shown).map((h, i) => (
        <Callout key={i} title={`Hint ${i + 1}`}>
          {h}
        </Callout>
      ))}
      {shown < hints.length && (
        <button type="button" onClick={onMore} className="min-h-[44px] self-start rounded-full border border-line px-4 text-xs font-medium text-ink dark:border-line-dark dark:text-bone">
          {shown === 0 ? "Give me a hint" : "Another hint"}
        </button>
      )}
    </div>
  );
}
