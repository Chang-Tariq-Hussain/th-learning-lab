"use client";

import { RefreshCw, Check } from "lucide-react";

export interface ActionButtonsProps {
  onCheck: () => void;
  onNewQuestion: () => void;
}

export function ActionButtons({ onCheck, onNewQuestion }: ActionButtonsProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onCheck}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-subject-math px-6 py-4 text-lg font-semibold text-white shadow-md transition-transform hover:brightness-110 active:scale-95"
      >
        <Check className="h-5 w-5" strokeWidth={2.5} />
        Check
      </button>
      <button
        type="button"
        onClick={onNewQuestion}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-6 py-4 text-lg font-semibold text-ink transition-colors hover:border-ink/30 active:scale-95 dark:border-bone/20 dark:text-bone dark:hover:border-bone/35"
      >
        <RefreshCw className="h-5 w-5" strokeWidth={2.25} />
        New Question
      </button>
    </div>
  );
}
