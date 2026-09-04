"use client";

import type { MoleculeConfig } from "../molecule-model";
import { MoleculeAtomMesh } from "./molecule-atom-mesh";
import { MoleculeBondMesh } from "./molecule-bond-mesh";

interface MoleculeSceneProps {
  molecule: MoleculeConfig;
  selectedAtomId: string | null;
  selectedBondId: string | null;
  onSelectAtom: (id: string) => void;
  onSelectBond: (id: string) => void;
}

/**
 * Assembles one molecule's atoms + bonds inside a single group, so the
 * parent canvas can rotate/scale it as one rigid body. Also resolves
 * the two-way highlighting the brief asks for: selecting an atom
 * highlights its bonds, and selecting a bond highlights its two
 * atoms — both directions computed here, once, rather than duplicated
 * in each mesh component.
 */
export function MoleculeScene({
  molecule,
  selectedAtomId,
  selectedBondId,
  onSelectAtom,
  onSelectBond,
}: MoleculeSceneProps) {
  const atomById = new Map(molecule.atoms.map((atom) => [atom.id, atom]));
  const selectedBond = molecule.bonds.find((b) => b.id === selectedBondId) ?? null;

  return (
    <group>
      {molecule.bonds.map((bond) => {
        const from = atomById.get(bond.from);
        const to = atomById.get(bond.to);
        if (!from || !to) return null;
        const touchesSelectedAtom =
          selectedAtomId === bond.from || selectedAtomId === bond.to;
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
      {molecule.atoms.map((atom) => (
        <MoleculeAtomMesh
          key={atom.id}
          atom={atom}
          selected={selectedAtomId === atom.id}
          connectedToSelectedBond={
            selectedBond !== null &&
            (selectedBond.from === atom.id || selectedBond.to === atom.id)
          }
          onSelect={onSelectAtom}
        />
      ))}
    </group>
  );
}
