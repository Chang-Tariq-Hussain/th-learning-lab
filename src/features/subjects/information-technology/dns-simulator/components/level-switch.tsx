"use client";

import { cn } from "@/lib/utils";
import { DETAIL_LEVEL_LABELS, DETAIL_LEVEL_ORDER, type DetailLevel } from "../model";

const BLURBS: Record<DetailLevel, string> = {
  beginner: "Plain-language steps and the essentials of each DNS message.",
  intermediate: "Adds the server contacted, the answer, the TTL and a short \"under the hood\" note for each step.",
  technical: "Adds flags, response codes, transport (UDP/TCP port 53) and extra detail on the hierarchy, caching and records.",
};

/** Same look as the other Networking level switches, with blurbs written for this simulation. */
export function LevelSwitch({ level, onChange }: { level: DetailLevel; onChange: (level: DetailLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Detail level">
        {DETAIL_LEVEL_ORDER.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={level === l}
            onClick={() => onChange(l)}
            className={cn("min-h-[36px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", level === l ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}
          >
            {DETAIL_LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{BLURBS[level]}</p>
    </div>
  );
}
