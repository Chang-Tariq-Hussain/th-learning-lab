"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  ParameterSchema,
  ParameterValues,
  SelectParameterDefinition,
} from "../types";

function buildDefaults(schema: ParameterSchema): ParameterValues {
  const defaults: ParameterValues = {};
  for (const def of schema.numeric ?? []) {
    defaults[def.key] = def.defaultValue;
  }
  for (const def of schema.select ?? []) {
    defaults[def.key] = def.defaultValue;
  }
  return defaults;
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export interface UseSimulationParametersResult {
  values: ParameterValues;
  /** Set a numeric parameter, clamped to its [min, max] range. */
  setNumeric: (key: string, value: number) => void;
  /** Set a select parameter to one of its declared option values. */
  setSelect: (key: string, value: string) => void;
  resetToDefaults: () => void;
  resetOne: (key: string) => void;
  schema: ParameterSchema;
}

/**
 * Turns a declarative `ParameterSchema` into live state plus validated
 * setters. A simulation defines its schema once; `ControlPanel` +
 * `ParameterSlider`/`Dropdown` read from the returned `values` and call
 * `setNumeric`/`setSelect` — no simulation-specific control code needed.
 */
export function useSimulationParameters(
  schema: ParameterSchema
): UseSimulationParametersResult {
  const [values, setValues] = useState<ParameterValues>(() =>
    buildDefaults(schema)
  );

  const numericByKey = useMemo(() => {
    const map = new Map(schema.numeric?.map((def) => [def.key, def]));
    return map;
  }, [schema.numeric]);

  const selectByKey = useMemo(() => {
    const map = new Map<string, SelectParameterDefinition>(
      schema.select?.map((def) => [def.key, def])
    );
    return map;
  }, [schema.select]);

  const setNumeric = useCallback(
    (key: string, value: number) => {
      const def = numericByKey.get(key);
      if (!def) return;
      setValues((prev) => ({
        ...prev,
        [key]: clamp(value, def.min, def.max),
      }));
    },
    [numericByKey]
  );

  const setSelect = useCallback(
    (key: string, value: string) => {
      const def = selectByKey.get(key);
      if (!def) return;
      const isValid = def.options.some((option) => option.value === value);
      if (!isValid) return;
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    [selectByKey]
  );

  const resetToDefaults = useCallback(() => {
    setValues(buildDefaults(schema));
  }, [schema]);

  const resetOne = useCallback(
    (key: string) => {
      const numericDef = numericByKey.get(key);
      if (numericDef) {
        setValues((prev) => ({ ...prev, [key]: numericDef.defaultValue }));
        return;
      }
      const selectDef = selectByKey.get(key);
      if (selectDef) {
        setValues((prev) => ({ ...prev, [key]: selectDef.defaultValue }));
      }
    },
    [numericByKey, selectByKey]
  );

  return { values, setNumeric, setSelect, resetToDefaults, resetOne, schema };
}
