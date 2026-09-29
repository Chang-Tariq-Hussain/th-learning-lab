"use client";

import { cn } from "@/lib/utils";
import { DETAIL_LEVEL_LABELS, type DetailLevel } from "../model";

const LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];

const BLURBS: Record<DetailLevel, string> = {
  beginner: "IP → ARP → MAC → Ethernet: requests, replies, broadcast, the ARP cache, and the default gateway. ARP messages show five essential fields.",
  intermediate: "Adds manual (static) cache entries and the reasons behind each step, such as why the reply is unicast.",
  technical: "Adds every ARP header field (hardware and protocol types and lengths, operation codes) and notes on real-world behaviour.",
};

/** Same look as the other Networking level switches, with blurbs written for this simulation. */
export function LevelSwitch({ level, onChange }: { level: DetailLevel; onChange: (level: DetailLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Detail level">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={level === l}
            onClick={() => onChange(l)}
            className={cn(
              "min-h-[36px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              level === l ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {DETAIL_LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{BLURBS[level]}</p>
    </div>
  );
}
