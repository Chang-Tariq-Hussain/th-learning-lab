"use client";

import { cn } from "@/lib/utils";
import type { RunnerQuestion } from "../engine-types";
import { isUrdu } from "../engine";
import type { Letter } from "../engine";

interface Props {
  q: RunnerQuestion;
  selected: Letter | undefined;
  /** exam mode: pass onSelect. review mode: pass reveal. */
  onSelect?: (letter: Letter) => void;
  reveal?: boolean;
  disabled?: boolean;
}

const LETTERS: Letter[] = ["A", "B", "C", "D"];

export function QuestionBody({ q, selected, onSelect, reveal = false, disabled = false }: Props) {
  const rtl = isUrdu(q);
  return (
    <div>
      {q.passage ? (
        <div className="mb-4 max-h-56 overflow-y-auto rounded-lg border border-line bg-ink/[0.03] p-4 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Passage</p>
          {q.passage}
        </div>
      ) : null}
      <p
        dir={rtl ? "rtl" : "ltr"}
        lang={rtl ? "ur" : "en"}
        className={cn(
          "whitespace-pre-line text-lg leading-relaxed text-ink dark:text-bone",
          rtl && "text-xl leading-loose"
        )}
      >
        {q.question}
      </p>
      <ul className="mt-5 space-y-2.5" role={onSelect ? "radiogroup" : "list"} aria-label="Answer options">
        {LETTERS.map((letter) => {
          const isSelected = selected === letter;
          const isCorrect = q.correctAnswer === letter;
          let state = "border-line bg-transparent hover:border-pine-500 dark:border-line-dark";
          if (reveal) {
            if (isCorrect) state = "border-emerald-600 bg-emerald-500/10";
            else if (isSelected) state = "border-rose-600 bg-rose-500/10";
            else state = "border-line opacity-80 dark:border-line-dark";
          } else if (isSelected) {
            state = "border-pine-600 bg-pine-500/10 ring-1 ring-pine-600";
          }
          const body = (
            <>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                  isSelected && !reveal ? "border-pine-600 bg-pine-600 text-paper" : "border-line dark:border-line-dark",
                  reveal && isCorrect && "border-emerald-600 bg-emerald-600 text-white",
                  reveal && isSelected && !isCorrect && "border-rose-600 bg-rose-600 text-white"
                )}
              >
                {letter}
              </span>
              <span dir={rtl ? "rtl" : "ltr"} lang={rtl ? "ur" : "en"} className={cn("flex-1 text-base text-ink dark:text-bone", rtl && "text-lg")}>
                {q.options[letter]}
              </span>
              {reveal && isCorrect ? <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Correct</span> : null}
              {reveal && isSelected && !isCorrect ? <span className="text-xs font-medium text-rose-700 dark:text-rose-400">Your answer</span> : null}
            </>
          );
          return (
            <li key={letter}>
              {onSelect ? (
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={disabled}
                  onClick={() => onSelect(letter)}
                  className={cn("flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60", state)}
                >
                  {body}
                </button>
              ) : (
                <div className={cn("flex w-full items-center gap-3 rounded-lg border px-4 py-3", state)}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
