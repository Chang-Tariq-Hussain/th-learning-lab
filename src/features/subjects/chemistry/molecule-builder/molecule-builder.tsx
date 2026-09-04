"use client";

import { useCallback, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MoleculeCanvas,
  type MoleculeCanvasHandle,
} from "./components/molecule-canvas";
import { MoleculeTabs } from "./components/molecule-tabs";
import { GeometryPanel } from "./components/geometry-panel";
import { AtomDetailPanel } from "./components/atom-detail-panel";
import { BondDetailPanel } from "./components/bond-detail-panel";
import { MoleculeBuildLab } from "./components/molecule-build-lab";
import { MOLECULES, type MoleculeId } from "./molecule-model";

type BuilderMode = "explore" | "build";

const MODE_OPTIONS: Array<{ id: BuilderMode; label: string }> = [
  { id: "explore", label: "Explore molecules" },
  { id: "build", label: "Build your own" },
];

/**
 * Molecule Builder (3D) — a real VSEPR viewer, not a formula animation.
 * Has two modes: Explore (the 5 hand-authored preset molecules, with
 * atom/bond selection and inspection) and Build (`MoleculeBuildLab`,
 * a free-form lab where the learner adds atoms and creates bonds
 * themselves). Explore owns the molecule choice and which atom *or*
 * bond is selected for its info popup (mutually exclusive — selecting
 * one clears the other); the 3D scene (`MoleculeCanvas`/
 * `MoleculeScene`) owns rendering and camera control, and reports
 * clicks back up via `onSelectAtom`/`onSelectBond`. Switching modes
 * unmounts whichever mode isn't active, so Build mode's in-progress
 * structure is deliberately not preserved across a trip back to
 * Explore — the two are separate activities, not one shared canvas.
 */
export function MoleculeBuilder() {
  const [mode, setMode] = useState<BuilderMode>("explore");
  const [moleculeId, setMoleculeId] = useState<MoleculeId>("h2o");
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);
  const canvasRef = useRef<MoleculeCanvasHandle>(null);

  const molecule = MOLECULES[moleculeId];

  const handleMoleculeChange = useCallback((id: MoleculeId) => {
    setMoleculeId(id);
    setSelectedAtomId(null);
    setSelectedBondId(null);
  }, []);

  const handleSelectAtom = useCallback((id: string) => {
    setSelectedBondId(null);
    setSelectedAtomId((current) => (current === id ? null : id));
  }, []);

  const handleSelectBond = useCallback((id: string) => {
    setSelectedAtomId(null);
    setSelectedBondId((current) => (current === id ? null : id));
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedAtomId(null);
    setSelectedBondId(null);
  }, []);

  const handleResetCamera = useCallback(() => {
    canvasRef.current?.resetCamera();
  }, []);

  const selectedAtom =
    molecule.atoms.find((a) => a.id === selectedAtomId) ?? null;
  const selectedBond =
    molecule.bonds.find((b) => b.id === selectedBondId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Molecule Builder mode"
        className="inline-flex w-fit items-center gap-1 rounded-full border border-line bg-white/50 p-1 dark:border-line-dark dark:bg-white/[0.03]"
      >
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={mode === option.id}
            onClick={() => setMode(option.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              mode === option.id
                ? "bg-subject-chemistry text-white"
                : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {mode === "build" ? <MoleculeBuildLab /> : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <MoleculeTabs moleculeId={moleculeId} onChange={handleMoleculeChange} />
            <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">
              {molecule.formula} · {molecule.name}
            </p>
          </div>

          <div className="touch-none overflow-hidden rounded-card border border-line bg-white/40 dark:border-line-dark dark:bg-white/[0.02]">
            <div className="h-[360px] w-full sm:h-[440px]">
              <MoleculeCanvas
                ref={canvasRef}
                molecule={molecule}
                selectedAtomId={selectedAtomId}
                selectedBondId={selectedBondId}
                onSelectAtom={handleSelectAtom}
                onSelectBond={handleSelectBond}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>

          <p className="text-center text-xs text-ink-soft/70 dark:text-bone-soft/70">
            Drag to rotate · scroll or pinch to zoom · tap an atom or a bond to inspect it
          </p>

          <div className="flex justify-center">
            <Button variant="ghost" size="sm" onClick={handleResetCamera}>
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Reset View
            </Button>
          </div>

          <AtomDetailPanel
            molecule={molecule}
            selectedAtom={selectedAtom}
            onClose={() => setSelectedAtomId(null)}
          />
          <BondDetailPanel
            molecule={molecule}
            selectedBond={selectedBond}
            onClose={() => setSelectedBondId(null)}
          />
          <GeometryPanel molecule={molecule} />
        </>
      )}
    </div>
  );
}
