"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { MoleculeBondMesh } from "../molecule-bond-mesh";
import { BuildAtomMesh } from "./build-atom-mesh";
import type { BuildAtomInstance, BuildBondInstance } from "../../build-model";

interface BuildSceneProps {
  atoms: BuildAtomInstance[];
  bonds: BuildBondInstance[];
  selectedAtomIds: string[];
  selectedBondId: string | null;
  onAtomDragStart: (id: string, event: ThreeEvent<PointerEvent>) => void;
  onSelectBond: (id: string) => void;
}

/**
 * Renders the free-build atoms and bonds. Reuses `MoleculeBondMesh`
 * from Explore mode as-is (same click target, same order-cylinder
 * rendering, same grow-in animation on mount — a newly-created bond
 * visibly forms the same way a preset molecule's bonds do) and a
 * build-specific `BuildAtomMesh` for atoms, since atoms here need
 * drag support Explore mode's atoms don't. Same two-way highlighting
 * pattern as `molecule-scene.tsx`: an atom that's an endpoint of the
 * selected bond gets the soft ring (handled inside `BuildAtomMesh`
 * only for the *selected* atoms list here — the bond-adjacency ring
 * is intentionally left to Explore mode, since Build mode's own
 * selection semantics already show "which atoms are involved" via
 * multi-select for bond creation).
 */
export function BuildScene({
  atoms,
  bonds,
  selectedAtomIds,
  selectedBondId,
  onAtomDragStart,
  onSelectBond,
}: BuildSceneProps) {
  const atomById = new Map(atoms.map((atom) => [atom.id, atom]));

  return (
    <group>
      {bonds.map((bond) => {
        const from = atomById.get(bond.from);
        const to = atomById.get(bond.to);
        if (!from || !to) return null;
        const touchesSelectedAtom =
          selectedAtomIds.includes(bond.from) || selectedAtomIds.includes(bond.to);
        return (
          <MoleculeBondMesh
            key={bond.id}
            id={bond.id}
            from={from.position}
            to={to.position}
            order={bond.order}
            highlighted={touchesSelectedAtom}
            selected={bond.id === selectedBondId}
            onSelect={onSelectBond}
          />
        );
      })}
      {atoms.map((atom) => (
        <BuildAtomMesh
          key={atom.id}
          atom={atom}
          selected={selectedAtomIds.includes(atom.id)}
          onDragStart={onAtomDragStart}
        />
      ))}
    </group>
  );
}
