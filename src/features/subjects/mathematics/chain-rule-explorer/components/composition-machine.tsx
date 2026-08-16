"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { XSlider } from "../../calculus-foundations/components/x-slider";
import { ExampleSelector } from "./example-selector";
import { COMPOSITE_FUNCTIONS, formatValue, getComposite, type CompositeFunctionDef } from "../chain-rule-model";

/**
 * Two-stage version of Calculus Foundations' `FunctionMachine`: x flows
 * into the inner function, producing u, which flows into the outer
 * function, producing the final output. Same fade/slide-in value swap
 * so students see a fresh number arrive at every stage as x changes.
 */
export function CompositionMachine() {
  const [exampleId, setExampleId] = useState<CompositeFunctionDef["id"]>("c");
  const fn = getComposite(exampleId);
  const [x, setX] = useState(fn.defaultX);

  const handleExampleChange = (id: CompositeFunctionDef["id"]) => {
    const next = COMPOSITE_FUNCTIONS.find((f) => f.id === id) ?? COMPOSITE_FUNCTIONS[0]!;
    setExampleId(id);
    setX(next.defaultX);
  };

  const u = fn.evaluateInner(x);
  const output = fn.evaluateOuter(u);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A composite function is a function inside another function. The output of the inner function
        becomes the input of the outer function.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <ExampleSelector value={exampleId} onChange={handleExampleChange} />
        <BlockMath math={fn.fullLatex} />
      </div>

      <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">x</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`x-${formatValue(x)}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl font-semibold text-ink dark:text-bone tabular-nums"
          >
            {formatValue(x)}
          </motion.p>
        </AnimatePresence>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <div className="rounded-full border-2 border-subject-math bg-subject-math-soft px-5 py-2 dark:bg-subject-math/15">
          <p className="font-mono text-sm font-semibold text-subject-math">Inner: {fn.innerLatex}</p>
        </div>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">u</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`u-${formatValue(u)}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="font-display text-3xl font-semibold text-amber-600 tabular-nums dark:text-amber-300"
          >
            {formatValue(u)}
          </motion.p>
        </AnimatePresence>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <div className="rounded-full border-2 border-amber-500 bg-amber-50 px-5 py-2 dark:border-amber-400 dark:bg-amber-900/20">
          <p className="font-mono text-sm font-semibold text-amber-700 dark:text-amber-300">
            Outer: {fn.outerLatex}
          </p>
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
            {formatValue(output)}
          </motion.p>
        </AnimatePresence>
      </div>

      <XSlider value={x} onChange={setX} min={fn.domainMin} max={fn.domainMax} />

      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">
        The output of the inner function, <span className="font-mono">u = {formatValue(u)}</span>, becomes
        the input to the outer function.
      </p>
    </div>
  );
}
