"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]", className)}>
      {title && <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</p>}
      <div className={title ? "mt-2" : undefined}>{children}</div>
    </div>
  );
}

export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{title}</h3>
      {children && <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{children}</p>}
    </div>
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "good" | "bad" | "warn";
  title: string;
  children?: ReactNode;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "border-line bg-ink/[0.03] dark:border-line-dark dark:bg-bone/[0.05]",
    good: "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
    bad: "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10",
    warn: "border-amber-400/60 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
  };
  const titleClasses: Record<string, string> = {
    neutral: "text-ink dark:text-bone",
    good: "text-emerald-700 dark:text-emerald-300",
    bad: "text-red-700 dark:text-red-300",
    warn: "text-amber-700 dark:text-amber-300",
  };
  return (
    <div className={cn("rounded-card border p-4 text-sm", toneClasses[tone])}>
      <p className={cn("font-mono font-semibold", titleClasses[tone])}>{title}</p>
      {children && <div className="mt-1 text-ink-soft dark:text-bone-soft">{children}</div>}
    </div>
  );
}

export function PillButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40",
        active
          ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
          : "border-line text-ink dark:border-line-dark dark:text-bone",
      )}
    >
      {children}
    </button>
  );
}

export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-xs text-ink-soft dark:text-bone-soft">
        <span>{label}</span>
        <span className="font-mono text-ink dark:text-bone">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="h-8 w-full accent-subject-it"
        aria-label={label}
      />
    </label>
  );
}
