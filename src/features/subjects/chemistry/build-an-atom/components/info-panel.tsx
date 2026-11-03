"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AtomState } from "../atom-model";
import { chargeKind, chargeLabel, chargeSuffix, massNumber, netCharge } from "../atom-model";
import { getElement } from "../elements";
import { formulas, notationText } from "../explain";
import { ISOTOPE_STATUS_TEXT, isotopeName, isotopeStatus } from "../isotopes";

interface InfoPanelProps {
  atom: AtomState;
}

const chargeStyles: Record<string, string> = {
  positive: "bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/10",
  negative: "bg-subject-biology-soft text-subject-biology dark:bg-subject-biology/10",
  neutral: "bg-ink/5 text-ink-soft dark:bg-bone/10 dark:text-bone-soft",
};

/** The standard isotope symbol: mass number above atomic number, then the element symbol and charge. */
export function IsotopeSymbol({ atom, className }: { atom: AtomState; className?: string }) {
  const element = getElement(atom.protons);
  const charge = chargeSuffix(netCharge(atom));
  return (
    <span className={cn("inline-flex items-center font-mono text-ink dark:text-bone", className)} role="img" aria-label={`Isotope notation: ${notationText(atom)}`}>
      <span className="mr-0.5 inline-flex flex-col items-end text-[0.55em] leading-[1.05]" aria-hidden="true">
        <span>{massNumber(atom)}</span>
        <span>{atom.protons}</span>
      </span>
      <span aria-hidden="true" className="text-[1em] font-semibold">
        {element.symbol}
      </span>
      {charge ? (
        <sup aria-hidden="true" className="ml-0.5 text-[0.55em] font-semibold">
          {charge}
        </sup>
      ) : null}
    </span>
  );
}

export function InfoPanel({ atom }: InfoPanelProps) {
  const element = getElement(atom.protons);
  const charge = netCharge(atom);
  const kind = chargeKind(charge);
  const status = isotopeStatus(atom.protons, massNumber(atom));

  const stats: { label: string; value: string | number }[] = [
    { label: "Atomic number", value: element.atomicNumber },
    { label: "Protons", value: atom.protons },
    { label: "Neutrons", value: atom.neutrons },
    { label: "Electrons", value: atom.electrons },
    { label: "Mass number", value: massNumber(atom) },
    { label: "Net charge", value: charge === 0 ? "0" : chargeSuffix(charge) },
  ];

  return (
    <section aria-label="Atom information" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${element.name}-${massNumber(atom)}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="font-display text-2xl font-medium text-ink dark:text-bone"
            >
              {isotopeName(atom)}
              {charge !== 0 ? <span className="text-ink-soft dark:text-bone-soft"> ion</span> : null}
            </motion.p>
          </AnimatePresence>
          <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">
            {element.name} · symbol {element.symbol}
          </p>
        </div>
        <div className="flex h-20 min-w-20 shrink-0 items-center justify-center rounded-xl border border-subject-chemistry/30 bg-subject-chemistry-soft px-3 text-3xl dark:bg-subject-chemistry/10">
          <IsotopeSymbol atom={atom} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line px-3 py-2 dark:border-line-dark">
            <dt className="font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">{stat.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-medium text-ink dark:text-bone">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className={cn("mt-3 rounded-lg px-3 py-2.5 text-center text-sm font-medium", chargeStyles[kind])}>{chargeLabel(charge)}</div>

      <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-soft dark:text-bone-soft" aria-label="How each property is worked out">
        {formulas(atom).map((f) => (
          <li key={f.label}>
            <span className="font-medium text-ink dark:text-bone">{f.label}:</span> {f.formula}
          </li>
        ))}
        <li>
          <span className="font-medium text-ink dark:text-bone">Isotope:</span> {ISOTOPE_STATUS_TEXT[status]}
        </li>
      </ul>

    </section>
  );
}
