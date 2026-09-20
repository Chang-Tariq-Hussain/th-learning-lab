"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Hit/miss/info colours. Outcomes are always also spelled out in text or a glyph — never colour alone. */
export const TONE = {
  hit: "border-emerald-500/60 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  miss: "border-rose-500/60 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300",
  info: "border-subject-it/50 bg-subject-it-soft text-amber-800 dark:text-amber-300 dark:bg-subject-it/15",
  neutral: "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
} as const;
export type Tone = keyof typeof TONE;

export const LABEL_CLASS = "font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft";

export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-card border border-line p-4 dark:border-line-dark", className)}>
      {title || aside ? (
        <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          {title ? <h3 className="font-display text-base font-medium text-ink dark:text-bone">{title}</h3> : <span />}
          {aside}
        </header>
      ) : null}
      {children}
    </section>
  );
}

const CALLOUT_BOX: Record<Tone, string> = {
  hit: "border-emerald-500/60 bg-emerald-50 dark:bg-emerald-500/10",
  miss: "border-rose-500/60 bg-rose-50 dark:bg-rose-500/10",
  info: "border-subject-it/50 bg-subject-it-soft dark:bg-subject-it/15",
  neutral: "border-line dark:border-line-dark",
};
const CALLOUT_TITLE: Record<Tone, string> = {
  hit: "text-emerald-800 dark:text-emerald-300",
  miss: "text-rose-800 dark:text-rose-300",
  info: "text-amber-800 dark:text-amber-300",
  neutral: "text-ink dark:text-bone",
};

/** Only the title carries the tone colour; body text stays in normal ink for contrast. */
export function Callout({ tone = "info", title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-lg border-l-4 px-3 py-2 text-sm leading-relaxed text-ink dark:text-bone", CALLOUT_BOX[tone])} role="note">
      {title ? <p className={cn("font-medium", CALLOUT_TITLE[tone])}>{title}</p> : null}
      <div className={title ? "mt-0.5" : undefined}>{children}</div>
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: Tone }) {
  return (
    <div className={cn("rounded-lg border p-3", tone ? TONE[tone] : "border-line dark:border-line-dark")}>
      <p className={cn(LABEL_CLASS, tone && "text-current opacity-80")}>{label}</p>
      <p className="mt-0.5 font-display text-xl font-medium tabular-nums text-ink dark:text-bone">{value}</p>
      {sub ? <p className="text-[11px] text-ink-soft dark:text-bone-soft">{sub}</p> : null}
    </div>
  );
}

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  hint?: string;
}

/** A radio-style group of pill buttons — reachable by keyboard and large enough to tap. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className={LABEL_CLASS}>{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              title={option.hint}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-[40px] rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selected
                  ? "border-subject-it bg-subject-it-soft text-amber-800 dark:text-amber-300 dark:bg-subject-it/20"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OutcomeBadge({ hit, label }: { hit: boolean; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide",
        hit ? TONE.hit : TONE.miss,
      )}
    >
      <span aria-hidden="true">{hit ? "✓" : "✕"}</span>
      {label ?? (hit ? "HIT" : "MISS")}
    </span>
  );
}

export interface ChipItem {
  label: string;
  hit: boolean;
}

/** One chip per access: green ✓ for a hit, red ✕ for a miss. */
export function ChipStrip({
  items,
  activeIndex,
  onSelect,
  emptyText = "No accesses yet.",
}: {
  items: ChipItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  emptyText?: string;
}) {
  if (items.length === 0) return <p className="text-xs text-ink-soft dark:text-bone-soft">{emptyText}</p>;
  return (
    <ol className="flex flex-wrap gap-1" aria-label="Access outcomes">
      {items.map((item, index) => {
        const active = activeIndex === index;
        const content = (
          <>
            <span className="tabular-nums">{item.label}</span>
            <span aria-hidden="true">{item.hit ? "✓" : "✕"}</span>
            <span className="sr-only">{item.hit ? "hit" : "miss"}</span>
          </>
        );
        const className = cn(
          "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
          item.hit ? TONE.hit : TONE.miss,
          active && "ring-2 ring-ink/60 dark:ring-bone/70",
        );
        return (
          <li key={index}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(index)} className={cn(className, "min-h-[28px]")}>
                {content}
              </button>
            ) : (
              <span className={className}>{content}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className={LABEL_CLASS}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-line bg-transparent px-2 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ActionButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "border-subject-it bg-subject-it text-white hover:bg-subject-it/90"
          : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
        className,
      )}
    >
      {children}
    </button>
  );
}
