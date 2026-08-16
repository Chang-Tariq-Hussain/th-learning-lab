"use client";

import { DropdownSelector } from "@/features/simulation/components/controls/dropdown-selector";
import { FUNCTIONS, type FunctionId } from "../calculus-model";

export interface FunctionSelectorProps {
  value: FunctionId;
  onChange: (id: FunctionId) => void;
  className?: string;
}

/** Thin wrapper around the shared `DropdownSelector` control, restricted to the small set of functions this activity uses. */
export function FunctionSelector({ value, onChange, className }: FunctionSelectorProps) {
  return (
    <DropdownSelector
      label="Function"
      value={value}
      options={FUNCTIONS.map((f) => ({ value: f.id, label: f.label }))}
      onChange={(next) => onChange(next as FunctionId)}
      className={className}
    />
  );
}
