"use client";

import { DropdownSelector } from "@/features/simulation/components/controls/dropdown-selector";
import { APP_FUNCTIONS, type AppFunctionDef } from "../applications-model";

export interface ExampleSelectorProps {
  value: AppFunctionDef["id"];
  onChange: (id: AppFunctionDef["id"]) => void;
  className?: string;
}

/** Thin wrapper around the shared `DropdownSelector`, restricted to this activity's three predefined functions (Section 9's "Movable Function Explorer"). */
export function ExampleSelector({ value, onChange, className }: ExampleSelectorProps) {
  return (
    <DropdownSelector
      label="Function"
      value={value}
      options={APP_FUNCTIONS.map((f) => ({ value: f.id, label: f.label }))}
      onChange={(next) => onChange(next as AppFunctionDef["id"])}
      className={className}
    />
  );
}
