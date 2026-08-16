"use client";

import { useState } from "react";
import { useSimulation } from "../../context/simulation-context";
import { cn } from "@/lib/utils";
import type { ParameterDefinition } from "../../types";

export interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
}

/**
 * Standalone, fully-controlled numeric input with min/max/step validation.
 * Not tied to the simulation context — usable anywhere a validated number
 * field is needed. For a version pre-wired to a simulation parameter, see
 * `ParameterNumberInput` below.
 */
export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled,
  className,
}: NumberInputProps) {
  const [draft, setDraft] = useState(String(value));

  // Keep the text draft in sync when the value changes externally
  // (e.g. a linked slider), but not while the field itself has focus.
  const displayValue = draft;

  const commit = (raw: string) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = clamp(parsed, min, max);
    onChange(next);
    setDraft(String(next));
  };

  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <span className="text-sm font-medium text-ink dark:text-bone">{label}</span>
      ) : null}
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit((event.target as HTMLInputElement).value);
          }}
          className="h-9 w-full rounded-md border border-ink/15 bg-transparent px-2.5 text-sm text-ink outline-none transition-colors focus-visible:border-pine-500 disabled:opacity-50 dark:border-bone/20 dark:text-bone"
        />
        {unit ? (
          <span className="shrink-0 font-mono text-xs text-ink-soft dark:text-bone-soft">
            {unit}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export interface ParameterNumberInputProps {
  parameter: ParameterDefinition;
  className?: string;
}

/**
 * `NumberInput` pre-wired to a simulation parameter via `useSimulation()` —
 * the numeric-entry counterpart to `ParameterSlider`. Use either or both
 * for the same parameter depending on the `control` field in its
 * `ParameterDefinition`.
 */
export function ParameterNumberInput({ parameter, className }: ParameterNumberInputProps) {
  const { values, setNumeric } = useSimulation();
  const value = Number(values[parameter.key] ?? parameter.defaultValue);

  return (
    <NumberInput
      label={parameter.label}
      value={value}
      onChange={(next) => setNumeric(parameter.key, next)}
      min={parameter.min}
      max={parameter.max}
      step={parameter.step}
      unit={parameter.unit}
      className={className}
    />
  );
}
