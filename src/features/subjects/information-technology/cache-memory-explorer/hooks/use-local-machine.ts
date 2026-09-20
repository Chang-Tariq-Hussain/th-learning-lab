"use client";

import { useCallback, useState } from "react";
import { accessSystem, createSystem, type AccessResult, type CacheConfig, type SystemState } from "../model";

interface LocalMachine {
  system: SystemState;
  history: AccessResult[];
}

/**
 * A small self-contained cache for labs that drive their own accesses
 * (Eviction, Cache Lines). Callers remount with a `key` when the
 * config changes, which is what resets it — so there's no effect
 * syncing state to props.
 */
export function useLocalMachine(config: CacheConfig) {
  const [machine, setMachine] = useState<LocalMachine>(() => ({ system: createSystem(config), history: [] }));

  const access = useCallback((address: number) => {
    setMachine((prev) => {
      const { next, result } = accessSystem(prev.system, address);
      return { system: next, history: [...prev.history, result] };
    });
  }, []);

  const reset = useCallback(() => setMachine({ system: createSystem(config), history: [] }), [config]);

  return { system: machine.system, history: machine.history, last: machine.history[machine.history.length - 1], access, reset };
}
