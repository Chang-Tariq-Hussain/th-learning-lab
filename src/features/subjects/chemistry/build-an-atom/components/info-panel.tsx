"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AtomState } from "../atom-model";
import { massNumber, netCharge, chargeKind, chargeLabel } from "../atom-model";
import { getElement } from "../elements";

interface InfoPanelProps {
  atom: AtomState;
}

const chargeStyles: Record<string, string> = {
  positive: "bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/10",
  negative: "bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/10",
  neutral: "bg-ink/5 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
};

export function InfoPanel({ atom }: InfoPanelProps) {
  const element = getElement(atom.protons);
  const charge = netCharge(atom);
  const kind = chargeKind(charge);

  const stats: { label: string; value: string | number }[] = [
    { label: "Atomic number", value: element.atomicNumber },
    { label: "Mass number", value: massNumber(atom) },
    { label: "Protons", value: atom.protons },
    { label: "Neutrons", value: atom.neutrons },
    { label: "Electrons", value: atom.electrons },
  ];

  return (
    <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={element.name}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="font-display text-2xl font-medium text-ink dark:text-bone"
            >
              {element.name}
            </motion.p>
          </AnimatePresence>
          <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">Symbol: {element.symbol}</p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-subject-chemistry/30 bg-subject-chemistry-soft font-mono text-2xl font-semibold text-subject-chemistry dark:bg-subject-chemistry/10">
          {element.symbol}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-medium text-ink dark:text-bone">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className={cn("mt-4 rounded-lg px-3 py-2.5 text-center text-sm font-medium", chargeStyles[kind])}>
        {chargeLabel(charge)}
      </div>
    </div>
  );
}
