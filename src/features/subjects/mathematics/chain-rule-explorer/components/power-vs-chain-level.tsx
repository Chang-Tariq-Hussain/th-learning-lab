"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PowerVsChainPanel } from "./power-vs-chain-panel";
import { ChooseMethodPanel } from "./choose-method-panel";

type View = "compare" | "practice";

const VIEWS: { id: View; label: string }[] = [
  { id: "compare", label: "Compare" },
  { id: "practice", label: "Choose the Method" },
];

/** Level 5 — Chain Rule vs Power Rule. Section 7's comparison and Section 8's challenge, one segmented control apart. */
export function PowerVsChainLevel() {
  const [view, setView] = useState<View>("compare");

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

      {view === "compare" ? <PowerVsChainPanel /> : <ChooseMethodPanel />}
    </div>
  );
}
