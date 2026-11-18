"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { card, eyebrow } from "./style";

export interface SortItem {
  id: string;
  text: string;
  category: string;
  why: string;
}

/** Classify each item into one of the categories; immediate per-item feedback and a final score. Keyboard accessible (all buttons). */
export function SortPanel({ title, intro, items, categories, testId }: { title: string; intro: string; items: SortItem[]; categories: { id: string; label: string }[]; testId: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const done = items.every((i) => answers[i.id] !== undefined);
  const score = items.filter((i) => answers[i.id] === i.category).length;
  return (
    <div className={card} data-testid={testId}>
      <div className="flex items-center justify-between gap-2">
        <p className={eyebrow}>{title}</p>
        <p className="text-xs text-ink-soft dark:text-bone-soft" data-testid={`${testId}-score`}>
          {Object.keys(answers).length} of {items.length} sorted · {score} correct
        </p>
      </div>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{intro}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((it) => {
          const a = answers[it.id];
          const ok = a === it.category;
          return (
            <li key={it.id} className={cn("rounded-xl border px-3 py-2", a === undefined ? "border-line dark:border-line-dark" : ok ? "border-subject-biology bg-subject-biology-soft dark:bg-subject-biology/15" : "border-amber-500 bg-amber-50 dark:bg-amber-500/10")} data-item={it.id} data-state={a === undefined ? "idle" : ok ? "ok" : "bad"}>
              <p className="text-sm text-ink dark:text-bone">{it.text}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={`Classify: ${it.text}`}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    disabled={a !== undefined}
                    onClick={() => setAnswers((s) => ({ ...s, [it.id]: c.id }))}
                    data-cat={c.id}
                    aria-pressed={a === c.id}
                    className={cn("min-h-9 rounded-full border px-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", a === c.id ? "border-ink bg-ink text-white dark:border-bone dark:bg-bone dark:text-chalkboard" : "border-line text-ink hover:border-subject-biology dark:border-line-dark dark:text-bone")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {a !== undefined ? (
                <p role="status" className="mt-1.5 flex items-start gap-1.5 text-xs text-ink dark:text-bone">
                  {ok ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                  <span>
                    <strong>{ok ? "Correct." : `Not quite — it is ${categories.find((c) => c.id === it.category)!.label}.`}</strong> {it.why}
                  </span>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {done ? (
        <p className="mt-3 text-sm font-semibold text-ink dark:text-bone" data-testid={`${testId}-final`}>
          Final score: {score} of {items.length}.
        </p>
      ) : null}
      <Button className="mt-3" size="sm" variant="ghost" onClick={() => setAnswers({})}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Start over
      </Button>
    </div>
  );
}
