"use client";

import { Info, RotateCcw } from "lucide-react";
import { useSimulation } from "../../context/simulation-context";
import { cn } from "@/lib/utils";
import type { ParameterDefinition } from "../../types";

export interface ParameterSliderProps {
  parameter: ParameterDefinition;
  className?: string;
}

/**
 * Slider + numeric readout for one numeric parameter. Reads/writes the
 * shared simulation state via `useSimulation()` — a concrete simulation
 * only needs to declare the parameter in its `ParameterSchema` and drop
 * this component in; no local state or change handlers required.
 */
export function ParameterSlider({ parameter, className }: ParameterSliderProps) {
  const { values, setNumeric, resetParameter } = useSimulation();
  const value = Number(values[parameter.key] ?? parameter.defaultValue);
  const isDefault = value === parameter.defaultValue;

  const inputId = `param-${parameter.key}`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-bone"
        >
          {parameter.label}
          {parameter.description ? (
            <span
              tabIndex={0}
              title={parameter.description}
              aria-label={parameter.description}
              className="text-ink-soft/70 dark:text-bone-soft/70"
            >
              <Info className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
          ) : null}
        </label>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">
            {value.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            {parameter.unit ? ` ${parameter.unit}` : ""}
          </span>
          <button
            type="button"
            onClick={() => resetParameter(parameter.key)}
            disabled={isDefault}
            aria-label={`Reset ${parameter.label} to default`}
            title="Reset to default"
            className="rounded-full p-1 text-ink-soft/60 transition-colors hover:text-ink disabled:opacity-30 disabled:hover:text-ink-soft/60 dark:text-bone-soft/60 dark:hover:text-bone"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      <input
        id={inputId}
        type="range"
        min={parameter.min}
        max={parameter.max}
        step={parameter.step ?? (parameter.max - parameter.min) / 100}
        value={value}
        onChange={(event) => setNumeric(parameter.key, Number(event.target.value))}
        aria-valuemin={parameter.min}
        aria-valuemax={parameter.max}
        aria-valuenow={value}
        aria-valuetext={`${value}${parameter.unit ? ` ${parameter.unit}` : ""}`}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-pine-600 dark:bg-line-dark dark:accent-pine-300"
      />
    </div>
  );
}
