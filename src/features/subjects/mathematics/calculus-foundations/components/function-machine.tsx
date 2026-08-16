"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { formatValue, type FunctionDef } from "../calculus-model";

export interface FunctionMachineProps {
  fn: FunctionDef;
  x: number;
}

/**
 * "INPUT x -> FUNCTION -> OUTPUT f(x)" made visual: a small vertical
 * pipeline where each value swaps in with a short fade/slide so the
 * student sees a fresh number arrive every time x or the function
 * changes, rather than just a value snapping in place.
 */
export function FunctionMachine({ fn, x }: FunctionMachineProps) {
  const output = fn.evaluate(x);

  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Input</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={`in-${formatValue(x)}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="font-display text-3xl font-semibold text-ink dark:text-bone tabular-nums"
        >
          x = {formatValue(x)}
        </motion.p>
      </AnimatePresence>

      <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

      <div className="rounded-full border-2 border-subject-math bg-subject-math-soft px-5 py-2 dark:bg-subject-math/15">
        <p className="font-mono text-sm font-semibold text-subject-math">{fn.label}</p>
      </div>

      <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Output</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={`out-${formatValue(output)}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="font-display text-3xl font-semibold text-subject-math tabular-nums"
        >
          f(x) = {formatValue(output)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
