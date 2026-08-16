"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnswerStepperProps {
  value: number;
  onChange: (value: number) => void;
  hex: string;
  label: string;
  max?: number;
  disabled?: boolean;
}

export function AnswerStepper({ value, onChange, hex, label, max = 24, disabled }: AnswerStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(0, Math.round(next)));

  return (
    <div className="flex items-center gap-2">
      <StepButton onClick={() => onChange(clamp(value - 1))} disabled={disabled || value <= 0} label={`Decrease ${label}`}>
        <Minus className="h-4 w-4" strokeWidth={2} />
      </StepButton>

      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isNaN(parsed)) return;
          onChange(clamp(parsed));
        }}
        aria-label={label}
        style={{ color: hex }}
        className={cn(
          "h-12 w-16 rounded-xl border border-ink/15 bg-transparent text-center font-display text-3xl font-medium tabular-nums outline-none",
          "focus-visible:ring-2 focus-visible:ring-pine-500 disabled:opacity-60 dark:border-bone/20",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <StepButton onClick={() => onChange(clamp(value + 1))} disabled={disabled || value >= max} label={`Increase ${label}`}>
        <Plus className="h-4 w-4" strokeWidth={2} />
      </StepButton>
    </div>
  );
}

function StepButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:bg-ink/[0.04] disabled:pointer-events-none disabled:opacity-30 dark:border-bone/20 dark:text-bone-soft dark:hover:bg-bone/[0.06]"
    >
      {children}
    </button>
  );
}
