"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Copy, Sprout, Wrench } from "lucide-react";
import type { PairCount } from "../engine/plan";

const FLOW = ["1 diploid cell (2n)", "DNA replication (interphase)", "Mitosis: sister chromatids separate", "2 nuclei", "Cytokinesis", "2 identical daughter cells (2n)"];

const REASONS = [
  { icon: Sprout, text: "Growth: an organism grows by adding cells made by mitosis." },
  { icon: Wrench, text: "Repair and replacement: skin, gut lining and blood cells are replaced by mitosis." },
  { icon: Copy, text: "Identical copies: each daughter cell has the same genes as the parent. Some organisms reproduce asexually this way." },
];

/** Shown when the cell has divided: the flow summary, why mitosis matters, and the link to the Meiosis lab. */
export function FinalSummary({ visible, pairs }: { visible: boolean; pairs: PairCount }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.3 }} className="flex w-full flex-col gap-4" data-testid="final-summary">
          <section aria-label="Two daughter cells" className="rounded-2xl border border-subject-biology/40 bg-subject-biology-soft p-4 dark:bg-subject-biology/10">
            <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Two identical daughter cells</h3>
            <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
              The parent cell had {2 * pairs} chromosomes (2n = {2 * pairs}). Each daughter cell has {2 * pairs}: one copy of every chromosome, with one chromatid each. Mitosis does not reduce the chromosome number.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {FLOW.map((step, i) => (
                <span key={step} className="flex items-center gap-1.5">
                  <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-subject-biology dark:bg-white/10">{step}</span>
                  {i < FLOW.length - 1 ? <span className="text-subject-biology/50">&rarr;</span> : null}
                </span>
              ))}
            </div>
          </section>
          <section aria-label="Why mitosis matters" className="rounded-2xl border border-line bg-white/70 p-4 dark:border-line-dark dark:bg-white/[0.04]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Why is mitosis important?</p>
            <ul className="mt-2 flex flex-col gap-2">
              {REASONS.map((r) => (
                <li key={r.text} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/15">
                    <r.icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{r.text}</p>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/biology/meiosis" className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-subject-biology hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone">
              Compare with meiosis, which halves the chromosome number
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
