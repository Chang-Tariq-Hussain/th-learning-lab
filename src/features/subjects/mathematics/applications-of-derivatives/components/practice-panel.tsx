"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PointChallengePanel } from "./point-challenge-panel";
import { MiniPracticePanel } from "./mini-practice-panel";

type View = "identify" | "quiz";

const VIEWS: { id: View; label: string }[] = [
  { id: "identify", label: "Identify the Point" },
  { id: "quiz", label: "Quick Check" },
];

/** Level 9 — Practice. Section 11's "Find the Maximum/Minimum" challenge and the four-question Mini Practice, one segmented control apart. */
export function PracticePanel() {
  const [view, setView] = useState<View>("identify");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            aria-pressed={view === v.id}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              view === v.id
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "identify" ? <PointChallengePanel key="identify" /> : <MiniPracticePanel key="quiz" />}
    </div>
  );
}
