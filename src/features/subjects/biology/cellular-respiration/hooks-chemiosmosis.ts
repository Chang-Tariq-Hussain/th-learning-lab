"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChemiState {
  gradient: number;
  rot: number;
  atp: number;
}

/** Eight protons turn the c-ring once and make 3 ATP (so each proton is 45° and 3/8 ATP). */
export const H_PER_TURN = 8;
export const ATP_PER_TURN = 3;

/**
 * Live chemiosmosis model. `pump` (0–1) is how hard the electron transport chain is pumping (zero without oxygen);
 * `flow` (0–10) is how open the ATP synthase channel is. Gradient rises with pumping, falls with flow and a small leak.
 * Runs on requestAnimationFrame only while `running` and not reduced motion; `stepProton()` advances one proton for
 * reduced-motion and keyboard use. Cleans up its frame on unmount.
 */
export function useChemiosmosis(running: boolean, reduced: boolean, flow: number, pump: number) {
  const [s, setS] = useState<ChemiState>({ gradient: 0.85, rot: 0, atp: 0 });
  const prm = useRef({ flow, pump });
  prm.current = { flow, pump };

  useEffect(() => {
    if (!running || reduced) return;
    let raf = 0;
    let last = 0;
    const frame = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      const { flow: f, pump: p } = prm.current;
      setS((c) => {
        const active = f > 0 && c.gradient > 0.03;
        const protonsPerSec = active ? f * 1.6 * Math.min(1, c.gradient * 1.4) : 0;
        const dProtons = protonsPerSec * dt;
        const gradient = Math.min(1, Math.max(0, c.gradient + p * 0.1 * dt * (1 - c.gradient) - dProtons * 0.035 - 0.004 * dt));
        return { gradient, rot: (c.rot + dProtons * (360 / H_PER_TURN)) % 36000, atp: c.atp + dProtons * (ATP_PER_TURN / H_PER_TURN) };
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, reduced]);

  const stepProton = useCallback(() => {
    setS((c) => (c.gradient <= 0.03 ? c : { gradient: Math.max(0, c.gradient - 0.035), rot: c.rot + 360 / H_PER_TURN, atp: c.atp + ATP_PER_TURN / H_PER_TURN }));
  }, []);
  const reset = useCallback(() => setS({ gradient: 0.85, rot: 0, atp: 0 }), []);
  return { ...s, stepProton, reset };
}
