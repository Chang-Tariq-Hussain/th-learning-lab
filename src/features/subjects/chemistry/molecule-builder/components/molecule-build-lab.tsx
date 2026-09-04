"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { BuildCanvas, type BuildCanvasHandle } from "./build/build-canvas";
import { ElementPalette } from "./build/element-palette";
import { BuildControlsPanel } from "./build/build-controls-panel";
import { TargetChecker } from "./build/target-checker";
import {
  canFormBond,
  checkAgainstTarget,
  generateAtomId,
  generateBondId,
  nextSpawnPosition,
  type BuildAtomInstance,
  type BuildBondInstance,
  type ElementSymbol,
} from "../build-model";
import type { MoleculeId } from "../molecule-model";

export interface MoleculeBuildLabHandle {
  /** Checks the lab's current live structure against a target preset
   *  molecule — the hook a Challenge scenario's `onVerify` uses to
   *  grade "did the student actually build this," rather than asking
   *  them to describe it in a multiple-choice option. Same structural
   *  comparison `TargetChecker` uses internally. */
  checkTarget: (targetId: MoleculeId) => boolean;
}

interface MoleculeBuildLabProps {
  /** When set, the lab's own "Build challenge" panel is locked to this
   *  one target (no dropdown) — used when the lab is embedded inside a
   *  GLE Challenge scenario that already states the objective, so the
   *  student isn't offered a different target than the one being
   *  graded. Omitted (the default) for the standalone Build mode tab,
   *  where the student picks freely. */
  lockedTargetId?: MoleculeId;
}

/**
 * "Build Your Own" mode — the free-form counterpart to Explore mode's
 * 5 fixed molecules. Owns every piece of build state (atoms, bonds,
 * selection) in one place, same shape as `molecule-builder.tsx` owns
 * Explore mode's state, so the two modes stay easy to compare and
 * neither one leaks state into the other when the learner switches
 * between them (see the mode toggle in `molecule-builder.tsx`, which
 * unmounts whichever mode isn't active).
 *
 * Selection model: `selectedAtomIds` holds 0–2 atom ids and
 * `selectedBondId` holds at most one bond id, and the two are always
 * mutually exclusive — selecting a bond clears atom selection and
 * vice versa. Two atoms selected at once is specifically the "about
 * to bond these" state (see `BuildControlsPanel`'s create-bond UI).
 *
 * Exposes `checkTarget` via ref (see `MoleculeBuildLabHandle`) so a
 * GLE Challenge scenario can grade the student's actual structure —
 * see `molecule-build-challenge-experiment.tsx`, which wraps this
 * component specifically for that purpose.
 */
export const MoleculeBuildLab = forwardRef<MoleculeBuildLabHandle, MoleculeBuildLabProps>(
  function MoleculeBuildLab({ lockedTargetId }, ref) {
  const [atoms, setAtoms] = useState<BuildAtomInstance[]>([]);
  const [bonds, setBonds] = useState<BuildBondInstance[]>([]);
  const [selectedAtomIds, setSelectedAtomIds] = useState<string[]>([]);
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);
  const canvasRef = useRef<BuildCanvasHandle>(null);

  useImperativeHandle(
    ref,
    () => ({
      checkTarget: (targetId: MoleculeId) => checkAgainstTarget(atoms, bonds, targetId).matches,
    }),
    [atoms, bonds],
  );

  const handleAddAtom = useCallback((element: ElementSymbol) => {
    setAtoms((current) => [
      ...current,
      { id: generateAtomId(), element, position: nextSpawnPosition(current.length) },
    ]);
  }, []);

  const handleMoveAtom = useCallback((id: string, position: [number, number, number]) => {
    setAtoms((current) => current.map((atom) => (atom.id === id ? { ...atom, position } : atom)));
  }, []);

  const handleSelectAtom = useCallback((id: string) => {
    setSelectedBondId(null);
    setSelectedAtomIds((current) => {
      if (current.includes(id)) return current.filter((existing) => existing !== id);
      if (current.length >= 2) return [id];
      return [...current, id];
    });
  }, []);

  const handleSelectBond = useCallback((id: string) => {
    setSelectedAtomIds([]);
    setSelectedBondId((current) => (current === id ? null : id));
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedAtomIds([]);
    setSelectedBondId(null);
  }, []);

  const handleRemoveAtom = useCallback((id: string) => {
    setAtoms((current) => current.filter((atom) => atom.id !== id));
    setBonds((current) => current.filter((bond) => bond.from !== id && bond.to !== id));
    setSelectedAtomIds([]);
    setSelectedBondId(null);
  }, []);

  const handleCreateBond = useCallback((order: 1 | 2 | 3) => {
    setSelectedAtomIds((currentSelection) => {
      if (currentSelection.length !== 2) return currentSelection;
      const [firstId, secondId] = currentSelection;
      setAtoms((currentAtoms) => {
        const atomA = currentAtoms.find((a) => a.id === firstId);
        const atomB = currentAtoms.find((a) => a.id === secondId);
        if (!atomA || !atomB) return currentAtoms;
        setBonds((currentBonds) => {
          const check = canFormBond(atomA, atomB, order, currentBonds);
          if (!check.ok) return currentBonds;
          return [...currentBonds, { id: generateBondId(), from: atomA.id, to: atomB.id, order }];
        });
        return currentAtoms;
      });
      return [];
    });
  }, []);

  const handleChangeBondOrder = useCallback((order: 1 | 2 | 3) => {
    setSelectedBondId((currentBondId) => {
      if (!currentBondId) return currentBondId;
      setAtoms((currentAtoms) => {
        setBonds((currentBonds) => {
          const bond = currentBonds.find((b) => b.id === currentBondId);
          if (!bond) return currentBonds;
          const atomA = currentAtoms.find((a) => a.id === bond.from);
          const atomB = currentAtoms.find((a) => a.id === bond.to);
          if (!atomA || !atomB) return currentBonds;
          const check = canFormBond(atomA, atomB, order, currentBonds, bond.id);
          if (!check.ok) return currentBonds;
          return currentBonds.map((b) => (b.id === currentBondId ? { ...b, order } : b));
        });
        return currentAtoms;
      });
      return currentBondId;
    });
  }, []);

  const handleBreakBond = useCallback(() => {
    setSelectedBondId((currentBondId) => {
      if (!currentBondId) return currentBondId;
      setBonds((currentBonds) => currentBonds.filter((b) => b.id !== currentBondId));
      return null;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setAtoms([]);
    setBonds([]);
    setSelectedAtomIds([]);
    setSelectedBondId(null);
  }, []);

  const handleResetView = useCallback(() => {
    canvasRef.current?.resetCamera();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ElementPalette onAdd={handleAddAtom} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-subject-chemistry/50 hover:text-subject-chemistry dark:border-line-dark dark:text-bone-soft"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Reset view
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={atoms.length === 0}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-dark dark:text-bone-soft"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Clear build
          </button>
        </div>
      </div>

      <div className="relative h-[360px] w-full overflow-hidden rounded-card border border-line bg-gradient-to-b from-white/40 to-white/10 dark:border-line-dark dark:from-white/[0.02] dark:to-transparent sm:h-[420px]">
        {atoms.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-ink-soft/70 dark:text-bone-soft/70">
            Add an atom above to start building. Drag atoms to position them, select two to bond
            them.
          </div>
        ) : null}
        <BuildCanvas
          ref={canvasRef}
          atoms={atoms}
          bonds={bonds}
          selectedAtomIds={selectedAtomIds}
          selectedBondId={selectedBondId}
          onSelectAtom={handleSelectAtom}
          onSelectBond={handleSelectBond}
          onMoveAtom={handleMoveAtom}
          onClearSelection={handleClearSelection}
        />
      </div>

      <p className="text-center text-xs text-ink-soft/70 dark:text-bone-soft/70">
        Drag to rotate · scroll or pinch to zoom · drag an atom to reposition it · tap two atoms to
        bond them
      </p>

      <BuildControlsPanel
        atoms={atoms}
        bonds={bonds}
        selectedAtomIds={selectedAtomIds}
        selectedBondId={selectedBondId}
        onRemoveAtom={handleRemoveAtom}
        onCreateBond={handleCreateBond}
        onChangeBondOrder={handleChangeBondOrder}
        onBreakBond={handleBreakBond}
      />

      <TargetChecker atoms={atoms} bonds={bonds} lockedTargetId={lockedTargetId} />
    </div>
  );
});
