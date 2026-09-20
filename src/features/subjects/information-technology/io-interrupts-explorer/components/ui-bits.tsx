"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small presentational helpers shared by every lab — kept together so
 *  the lab files stay focused on their own simulation logic. */

export function Panel({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <div className={cn("rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]", className)}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          {title && <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</p>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{title}</h3>
      {children && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{children}</p>}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "outline",
  disabled,
  className,
  ariaLabel,
  pressed,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        variant === "solid"
          ? "border-subject-it bg-subject-it text-white hover:opacity-90"
          : pressed
            ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
            : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "good" | "warn" | "neutral" }) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="text-xs text-ink-soft dark:text-bone-soft">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-mono text-xl font-medium",
          tone === "good" && "text-emerald-700 dark:text-emerald-300",
          tone === "warn" && "text-amber-700 dark:text-amber-300",
          (!tone || tone === "neutral") && "text-ink dark:text-bone",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function Callout({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "note" }) {
  return (
    <p
      className={cn(
        "rounded-card border px-3.5 py-2.5 text-xs leading-relaxed sm:text-sm",
        tone === "info"
          ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
          : "border-line bg-white/60 text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft",
      )}
    >
      {children}
    </p>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-card border border-line p-3 dark:border-line-dark">
      <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#B45309]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm">
        <span className="block font-medium text-ink dark:text-bone">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink-soft dark:text-bone-soft">{hint}</span>}
      </span>
    </label>
  );
}

export function SegmentedChoice<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <Btn key={String(o.id)} pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </Btn>
      ))}
    </div>
  );
}
