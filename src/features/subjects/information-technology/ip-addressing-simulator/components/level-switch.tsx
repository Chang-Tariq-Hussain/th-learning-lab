"use client";

import { cn } from "@/lib/utils";
import { DETAIL_LEVEL_LABELS, type DetailLevel } from "../model";

const LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];
const BLURBS: Record<DetailLevel, string> = {
  beginner: "Addresses, masks, network vs. host, network/broadcast/host range, same vs. different network, and the default gateway. Ordinary subnets /8–/30.",
  intermediate: "Adds the CIDR prefix visualizer, the address inspector, and prefixes from /1 to /30.",
  technical: "Adds the /0, /31 and /32 special cases and wildcard masks.",
};

export function LevelSwitch({ level, onChange }: { level: DetailLevel; onChange: (l: DetailLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Detail level">
        {LEVELS.map((l) => (
          <button key={l} role="radio" aria-checked={level === l} onClick={() => onChange(l)} className={cn("min-h-[36px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors", level === l ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30")}>
            {DETAIL_LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{BLURBS[level]}</p>
    </div>
  );
}
