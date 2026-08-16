"use client";

import { DropdownSelector } from "@/features/simulation/components/controls/dropdown-selector";
import { COMPOSITE_FUNCTIONS, type CompositeFunctionDef } from "../chain-rule-model";

export interface ExampleSelectorProps {
  value: CompositeFunctionDef["id"];
  onChange: (id: CompositeFunctionDef["id"]) => void;
  className?: string;
}

/** Thin wrapper around the shared `DropdownSelector`, restricted to this activity's three composite-function examples. */
export function ExampleSelector({ value, onChange, className }: ExampleSelectorProps) {
  return (
    <DropdownSelector
      label="Example"
      value={value}
      options={COMPOSITE_FUNCTIONS.map((f) => ({ value: f.id, label: f.label }))}
      onChange={(next) => onChange(next as CompositeFunctionDef["id"])}
      className={className}
    />
  );
}
