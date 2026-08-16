"use client";

import { ChevronDown } from "lucide-react";
import { useSimulation } from "../../context/simulation-context";
import { cn } from "@/lib/utils";
import type { SelectOption, SelectParameterDefinition } from "../../types";

export interface DropdownSelectorProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/** Standalone, fully-controlled dropdown — usable outside the simulation context too. */
export function DropdownSelector({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
}: DropdownSelectorProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <span className="text-sm font-medium text-ink dark:text-bone">{label}</span>
      ) : null}
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-ink/15 bg-transparent pl-2.5 pr-8 text-sm text-ink outline-none transition-colors focus-visible:border-pine-500 disabled:opacity-50 dark:border-bone/20 dark:text-bone [&>option]:bg-paper dark:[&>option]:bg-chalkboard"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft dark:text-bone-soft"
          strokeWidth={1.75}
        />
      </div>
    </label>
  );
}

export interface ParameterDropdownSelectorProps {
  parameter: SelectParameterDefinition;
  className?: string;
}

/** `DropdownSelector` pre-wired to a select-type simulation parameter. */
export function ParameterDropdownSelector({
  parameter,
  className,
}: ParameterDropdownSelectorProps) {
  const { values, setSelect } = useSimulation();
  const value = String(values[parameter.key] ?? parameter.defaultValue);

  return (
    <DropdownSelector
      label={parameter.label}
      value={value}
      options={parameter.options}
      onChange={(next) => setSelect(parameter.key, next)}
      className={className}
    />
  );
}
