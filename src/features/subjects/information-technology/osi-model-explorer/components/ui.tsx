"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OSI_LAYERS, type OsiLayerNumber } from "../model";

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

/** A row of seven buttons, one per OSI layer, used by the layer
 *  identification challenge and the troubleshooting mode so a student
 *  picks a layer number the same way in both places. */
export function LayerPicker({
  value,
  onChange,
  disabled,
  correctLayer,
}: {
  value: OsiLayerNumber | null;
  onChange: (layer: OsiLayerNumber) => void;
  disabled?: boolean;
  /** When set (after an answer is locked in), colors the correct and
   *  any incorrectly-chosen button so feedback is visible at a glance. */
  correctLayer?: OsiLayerNumber | null;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an OSI layer">
      {OSI_LAYERS.map((layer) => {
        const isChosen = value === layer.number;
        const isCorrect = correctLayer != null && layer.number === correctLayer;
        const isWrongChoice = correctLayer != null && isChosen && layer.number !== correctLayer;
        return (
          <button
            key={layer.number}
            onClick={() => onChange(layer.number)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-default",
              isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
              isWrongChoice && "border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
              !isCorrect && !isWrongChoice && isChosen && "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20",
              !isCorrect && !isWrongChoice && !isChosen && "border-line text-ink dark:border-line-dark dark:text-bone",
            )}
          >
            <span className="font-mono text-sm">{layer.number}</span>
            <span>{layer.name}</span>
          </button>
        );
      })}
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
