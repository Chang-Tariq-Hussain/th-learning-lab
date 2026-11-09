"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

/** Arrow-key tablist (roving tabindex): one tab stop, Left/Right/Home/End move between tabs. */
export function Tabs<T extends string>({ items, value, onChange, label, idPrefix, panelId, className, cols }: { items: TabItem<T>[]; value: T; onChange: (v: T) => void; label: string; idPrefix: string; panelId: string; className?: string; cols?: string }) {
  const move = (from: number, to: number) => {
    const next = items[(to + items.length) % items.length]!;
    onChange(next.id);
    requestAnimationFrame(() => document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus());
    void from;
  };
  return (
    <div role="tablist" aria-label={label} className={cn("grid gap-1 rounded-2xl border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]", cols ?? "grid-flow-col auto-cols-fr", className)}>
      {items.map((t, i) => {
        const on = t.id === value;
        return (
          <button
            key={t.id}
            id={`${idPrefix}-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            data-tab={t.id}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") (e.preventDefault(), move(i, i + 1));
              else if (e.key === "ArrowLeft") (e.preventDefault(), move(i, i - 1));
              else if (e.key === "Home") (e.preventDefault(), move(i, 0));
              else if (e.key === "End") (e.preventDefault(), move(i, items.length - 1));
            }}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
              on ? "bg-subject-biology text-white dark:text-chalkboard" : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
            )}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
