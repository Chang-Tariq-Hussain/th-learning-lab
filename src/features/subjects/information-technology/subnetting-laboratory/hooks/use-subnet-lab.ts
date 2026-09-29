"use client";

import { useCallback, useMemo, useState } from "react";
import { parseIPv4 } from "../../ip-addressing-simulator/model";
import { DEFAULT_NETWORK, DEFAULT_NEW, DEFAULT_ORIG, buildPlan, clampNew, clampOrig, type SplitPlan, type SubnetRow } from "../model";

export interface PlanPreset {
  network: string;
  orig: number;
  next: number;
}

/**
 * Shared lab state: the starting network, the original prefix, the new prefix, the selected subnet and the
 * "show binary" toggle. It lives in the shell so every tab (split, binary, table, calculator) edits the same plan.
 */
export function useSubnetLab(initial?: Partial<PlanPreset>) {
  const [ipText, setIpText] = useState(initial?.network ?? DEFAULT_NETWORK);
  const [orig, setOrigState] = useState(clampOrig(initial?.orig ?? DEFAULT_ORIG));
  const [next, setNextState] = useState(() => clampNew(clampOrig(initial?.orig ?? DEFAULT_ORIG), initial?.next ?? DEFAULT_NEW));
  const [selected, setSelected] = useState(1);
  const [showBinary, setShowBinary] = useState(true);

  const parsed = parseIPv4(ipText);
  const ipValue = parsed.ok ? parsed.value : null;
  const ipError = parsed.ok ? null : parsed.reason;

  const plan: SplitPlan | null = useMemo(() => (ipValue === null ? null : buildPlan(ipValue, orig, next)), [ipValue, orig, next]);
  const selectedRow: SubnetRow | null = plan ? (plan.rows[selected - 1] ?? plan.rows[0] ?? null) : null;

  const setOrig = useCallback((p: number) => {
    const o = clampOrig(p);
    setOrigState(o);
    setNextState((n) => clampNew(o, n));
    setSelected(1);
  }, []);

  const setNext = useCallback(
    (p: number) => {
      setNextState(clampNew(orig, p));
      setSelected(1);
    },
    [orig],
  );

  const load = useCallback((p: PlanPreset) => {
    const o = clampOrig(p.orig);
    setIpText(p.network);
    setOrigState(o);
    setNextState(clampNew(o, p.next));
    setSelected(1);
  }, []);

  const reset = useCallback(() => load({ network: DEFAULT_NETWORK, orig: DEFAULT_ORIG, next: DEFAULT_NEW }), [load]);

  return { ipText, setIpText, ipError, orig, setOrig, next, setNext, plan, selected, setSelected, selectedRow, showBinary, setShowBinary, load, reset };
}

export type SubnetLab = ReturnType<typeof useSubnetLab>;
