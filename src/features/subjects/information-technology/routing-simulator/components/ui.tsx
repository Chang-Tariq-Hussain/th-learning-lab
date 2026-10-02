"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared button styling for this lab (same look as the other Networking labs). */
export const BTN = "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";
export const BTN_PRIMARY = "border-subject-it bg-subject-it text-paper hover:opacity-90";
export const BTN_PLAIN = "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";
export const FIELD = "min-h-[44px] w-full rounded-xl border border-line bg-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-soft/60 focus:border-subject-it focus:outline-none focus:ring-1 focus:ring-subject-it disabled:opacity-50 dark:border-line-dark dark:bg-white/[0.05] dark:text-bone dark:placeholder:text-bone-soft/60";
export const LABEL = "mb-1 block font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft";

export function Chip({ selected, disabled, onClick, children, title }: { selected: boolean; disabled?: boolean; onClick: () => void; children: ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={title}
      className={cn(
        "flex min-h-[44px] flex-col items-start justify-center rounded-xl border px-3 py-1.5 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
      )}
    >
      {children}
    </button>
  );
}
