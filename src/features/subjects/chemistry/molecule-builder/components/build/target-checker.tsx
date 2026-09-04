"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Target, XCircle } from "lucide-react";
import {
  BUILD_TARGETS,
  checkAgainstTarget,
  type BuildAtomInstance,
  type BuildBondInstance,
} from "../../build-model";
import type { MoleculeId } from "../../molecule-model";

interface TargetCheckerProps {
  atoms: BuildAtomInstance[];
  bonds: BuildBondInstance[];
  /** When set, locks the picker to this one target (no dropdown) —
   *  see `MoleculeBuildLabProps.lockedTargetId`. */
  lockedTargetId?: MoleculeId;
}

/**
 * The "Build H₂O" style challenge (Stage 5/7 of the brief's proposed
 * progression): pick a target molecule, build it, and check. Owns its
 * own local result state rather than lifting it to the lab, since the
 * check is a point-in-time snapshot ("here's how your current build
 * compares"), not something that needs to react live to every atom
 * drag — re-checking is one click away.
 */
const DEFAULT_TARGET_ID: MoleculeId = BUILD_TARGETS[0]?.moleculeId ?? "h2o";

export function TargetChecker({ atoms, bonds, lockedTargetId }: TargetCheckerProps) {
  const [targetId, setTargetId] = useState<MoleculeId>(lockedTargetId ?? DEFAULT_TARGET_ID);
  const [result, setResult] = useState<ReturnType<typeof checkAgainstTarget> | null>(null);
  const activeTargetId = lockedTargetId ?? targetId;
  const activeTarget = BUILD_TARGETS.find((t) => t.moleculeId === activeTargetId) ?? BUILD_TARGETS[0];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 shrink-0 text-subject-chemistry" strokeWidth={1.75} />
        <p className="font-display text-base font-medium text-ink dark:text-bone">Build challenge</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {lockedTargetId ? (
          <span className="rounded-full border border-subject-chemistry/40 bg-subject-chemistry-soft px-3 py-1.5 text-sm font-medium text-subject-chemistry">
            Build {activeTarget?.formula} ({activeTarget?.name})
          </span>
        ) : (
          <select
            value={targetId}
            onChange={(event) => {
              setTargetId(event.target.value as MoleculeId);
              setResult(null);
            }}
            className="rounded-full border border-line bg-transparent px-3 py-1.5 text-sm text-ink dark:border-line-dark dark:text-bone"
          >
            {BUILD_TARGETS.map((target) => (
              <option key={target.moleculeId} value={target.moleculeId}>
                Build {target.formula} ({target.name})
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={() => setResult(checkAgainstTarget(atoms, bonds, activeTargetId))}
          className="rounded-full bg-subject-chemistry px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Check my build
        </button>
      </div>
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={result.matches ? "match" : "no-match"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-sm ${
              result.matches
                ? "border-emerald-300/60 bg-emerald-50 text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300"
            }`}
          >
            {result.matches ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
            )}
            <span>{result.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
