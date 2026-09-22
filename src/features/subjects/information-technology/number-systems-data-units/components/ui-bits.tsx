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

export function Callout({ children, tone = "info", className }: { children: ReactNode; tone?: "info" | "note"; className?: string }) {
  return (
    <p
      className={cn(
        "rounded-card border px-3.5 py-2.5 text-xs leading-relaxed sm:text-sm",
        tone === "info"
          ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
          : "border-line bg-white/60 text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft",
        className,
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

/** A labeled text input with an inline error line — the shared shape every converter/calculator in this lab uses for typed values. */
export function TextField({
  label,
  value,
  onChange,
  onSubmit,
  error,
  placeholder,
  mono = true,
  className,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  error?: string | null;
  placeholder?: string;
  mono?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-ink-soft dark:text-bone-soft">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-subject-it",
          mono && "font-mono",
          error ? "border-rose-500" : "border-line dark:border-line-dark",
        )}
      />
      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A row of tappable bit switches with their place value shown above each — the shared visual for every "toggle bits" interaction in this lab. */
export function BitRow({
  bits,
  onToggle,
  highlightIndex,
  disabled,
  places,
  className,
}: {
  /** MSB first, e.g. ["1","0","1","1"]. */
  bits: string[];
  onToggle?: (index: number) => void;
  highlightIndex?: number | null;
  disabled?: boolean;
  /** Place value shown above each bit, MSB first (as strings so BigInts format cleanly). */
  places?: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-1.5 sm:gap-2", className)} role="group" aria-label={`${bits.length}-bit value, most significant bit first`}>
      {bits.map((bit, i) => {
        const isOn = bit === "1";
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            {places && (
              <span className="font-mono text-[9px] text-ink-soft dark:text-bone-soft sm:text-[10px]">{places[i]}</span>
            )}
            <button
              type="button"
              disabled={disabled || !onToggle}
              onClick={() => onToggle?.(i)}
              aria-pressed={isOn}
              aria-label={`Bit ${i + 1} of ${bits.length}, currently ${isOn ? "on" : "off"}`}
              className={cn(
                "flex h-10 w-9 items-center justify-center rounded-lg border-2 font-mono text-base font-semibold transition-all sm:h-12 sm:w-10 sm:text-lg",
                isOn
                  ? "border-subject-it bg-subject-it text-white"
                  : "border-line bg-paper text-ink-soft dark:border-line-dark dark:bg-chalkboard dark:text-bone-soft",
                highlightIndex === i && "ring-2 ring-offset-2 ring-amber-500 dark:ring-offset-chalkboard",
                onToggle && !disabled ? "cursor-pointer hover:opacity-90" : "cursor-default",
              )}
            >
              {bit}
            </button>
          </div>
        );
      })}
    </div>
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
