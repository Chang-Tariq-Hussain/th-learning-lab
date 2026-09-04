"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Link2, Unlink } from "lucide-react";
import {
  MAX_BONDS,
  canFormBond,
  describeBuildBond,
  elementLabel,
  remainingValence,
  usedValence,
  type BuildAtomInstance,
  type BuildBondInstance,
} from "../../build-model";

interface BuildControlsPanelProps {
  atoms: BuildAtomInstance[];
  bonds: BuildBondInstance[];
  selectedAtomIds: string[];
  selectedBondId: string | null;
  onRemoveAtom: (id: string) => void;
  onCreateBond: (order: 1 | 2 | 3) => void;
  onChangeBondOrder: (order: 1 | 2 | 3) => void;
  onBreakBond: () => void;
}

const ORDER_OPTIONS: Array<{ order: 1 | 2 | 3; label: string }> = [
  { order: 1, label: "Single" },
  { order: 2, label: "Double" },
  { order: 3, label: "Triple" },
];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * The one panel below the canvas whose content depends entirely on
 * what's currently selected — this is where the actual "create a
 * bond" / "break a bond" / "remove an atom" actions live, since the
 * 3D scene itself only handles picking, not editing. Three mutually
 * exclusive states, matching the three selection states the lab's
 * selection model can be in (one atom / two atoms / one bond).
 */
export function BuildControlsPanel({
  atoms,
  bonds,
  selectedAtomIds,
  selectedBondId,
  onRemoveAtom,
  onCreateBond,
  onChangeBondOrder,
  onBreakBond,
}: BuildControlsPanelProps) {
  const selectedAtoms = atoms.filter((a) => selectedAtomIds.includes(a.id));
  const selectedBond = bonds.find((b) => b.id === selectedBondId) ?? null;
  const firstSelectedAtom = selectedAtoms[0] ?? null;
  const secondSelectedAtom = selectedAtoms[1] ?? null;

  return (
    <AnimatePresence mode="wait">
      {selectedAtoms.length === 1 && firstSelectedAtom && !selectedBond ? (
        <motion.div
          key="atom"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <SingleAtomPanel atom={firstSelectedAtom} bonds={bonds} onRemove={onRemoveAtom} />
        </motion.div>
      ) : null}

      {selectedAtoms.length === 2 && firstSelectedAtom && secondSelectedAtom ? (
        <motion.div
          key="create-bond"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <CreateBondPanel
            atomA={firstSelectedAtom}
            atomB={secondSelectedAtom}
            bonds={bonds}
            onCreateBond={onCreateBond}
          />
        </motion.div>
      ) : null}

      {selectedBond ? (
        <motion.div
          key="bond"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <BondEditPanel
            atoms={atoms}
            bond={selectedBond}
            bonds={bonds}
            onChangeOrder={onChangeBondOrder}
            onBreak={onBreakBond}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SingleAtomPanel({
  atom,
  bonds,
  onRemove,
}: {
  atom: BuildAtomInstance;
  bonds: BuildBondInstance[];
  onRemove: (id: string) => void;
}) {
  const used = usedValence(atom.id, bonds);
  const max = MAX_BONDS[atom.element];
  const remaining = remainingValence(atom, bonds);

  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex-1">
        <p className="font-display text-base font-medium text-ink dark:text-bone">
          {capitalize(elementLabel(atom.element))} ({atom.element})
        </p>
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          {used} of {max} bonds used
          {remaining > 0
            ? ` — can form ${remaining} more bond${remaining === 1 ? "" : "s"} (single, or fewer double/triple).`
            : " — bonding capacity full."}
        </p>
        <p className="mt-1 text-xs text-ink-soft/70 dark:text-bone-soft/70">
          Select a second atom to bond it to this one.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(atom.id)}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-red-300 hover:text-red-600 dark:border-line-dark dark:text-bone-soft dark:hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        Remove
      </button>
    </div>
  );
}

function CreateBondPanel({
  atomA,
  atomB,
  bonds,
  onCreateBond,
}: {
  atomA: BuildAtomInstance;
  atomB: BuildAtomInstance;
  bonds: BuildBondInstance[];
  onCreateBond: (order: 1 | 2 | 3) => void;
}) {
  return (
    <div className="rounded-card border border-subject-chemistry/30 bg-subject-chemistry-soft p-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-subject-chemistry" strokeWidth={1.75} />
        <p className="font-display text-base font-medium text-ink dark:text-bone">
          {capitalize(elementLabel(atomA.element))} — {capitalize(elementLabel(atomB.element))}
        </p>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
        Choose a bond order to connect these two atoms.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ORDER_OPTIONS.map(({ order, label }) => {
          const check = canFormBond(atomA, atomB, order, bonds);
          return (
            <button
              key={order}
              type="button"
              disabled={!check.ok}
              title={check.ok ? undefined : check.reason}
              onClick={() => onCreateBond(order)}
              className="rounded-full border border-subject-chemistry/40 px-3 py-1.5 text-sm font-medium text-subject-chemistry transition enabled:hover:bg-subject-chemistry enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              {label}
            </button>
          );
        })}
      </div>
      {(() => {
        const blockedReason = ORDER_OPTIONS.map(({ order }) => canFormBond(atomA, atomB, order, bonds)).find(
          (check) => !check.ok,
        )?.reason;
        return blockedReason ? (
          <p className="mt-2 text-xs text-ink-soft/70 dark:text-bone-soft/70">{blockedReason}</p>
        ) : null;
      })()}
    </div>
  );
}

function BondEditPanel({
  atoms,
  bond,
  bonds,
  onChangeOrder,
  onBreak,
}: {
  atoms: BuildAtomInstance[];
  bond: BuildBondInstance;
  bonds: BuildBondInstance[];
  onChangeOrder: (order: 1 | 2 | 3) => void;
  onBreak: () => void;
}) {
  const info = describeBuildBond(atoms, bond);
  const fromAtom = atoms.find((a) => a.id === bond.from);
  const toAtom = atoms.find((a) => a.id === bond.to);
  if (!info || !fromAtom || !toAtom) return null;

  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-subject-chemistry" strokeWidth={1.75} />
      <div className="flex-1">
        <p className="font-display text-base font-medium text-ink dark:text-bone">{info.kind}</p>
        <p className="font-mono text-sm text-ink-soft dark:text-bone-soft">{info.pairLabel}</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{info.explanation}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ORDER_OPTIONS.map(({ order, label }) => {
            const check =
              order === bond.order
                ? { ok: true }
                : canFormBond(fromAtom, toAtom, order, bonds, bond.id);
            return (
              <button
                key={order}
                type="button"
                disabled={!check.ok}
                title={check.ok ? undefined : check.reason}
                onClick={() => onChangeOrder(order)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-35 ${
                  order === bond.order
                    ? "border-subject-chemistry bg-subject-chemistry text-white"
                    : "border-subject-chemistry/40 text-subject-chemistry enabled:hover:bg-subject-chemistry enabled:hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onBreak}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-red-300 hover:text-red-600 dark:border-line-dark dark:text-bone-soft dark:hover:text-red-400"
      >
        <Unlink className="h-3.5 w-3.5" strokeWidth={1.75} />
        Break
      </button>
    </div>
  );
}
