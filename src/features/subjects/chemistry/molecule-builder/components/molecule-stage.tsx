"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BuildStep, MoleculeConfig } from "../molecule-model";
import { ATOM_INFO, GRADIENT_ID } from "../molecule-model";
import {
  ATOM_Y,
  ATOM_RADIUS,
  SCENE_WIDTH,
  SCENE_HEIGHT,
  DOUBLE_BOND_GAP,
  trimToEdges,
} from "../layout";
import { BondDefs } from "../../bond-builder/components/bond-defs";
import { ValenceElectron } from "../../bond-builder/components/valence-electron";
import { MoleculeDefs } from "./molecule-defs";
import { MoleculeAtom } from "./molecule-atom";
import { BondLine } from "./bond-line";

interface MoleculeStageProps {
  molecule: MoleculeConfig;
  step: BuildStep;
  selectedAtomId: string | null;
  onSelectAtom: (id: string) => void;
}

export function MoleculeStage({
  molecule,
  step,
  selectedAtomId,
  onSelectAtom,
}: MoleculeStageProps) {
  const settled = step >= 2;
  const bonded = step >= 3;

  const positions = new Map(
    molecule.atoms.map((a) => [a.id, settled ? a.closeX : a.separateX]),
  );

  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={`${molecule.name} molecule builder, step ${step} of 4`}
    >
      <BondDefs />
      <MoleculeDefs />

      {/* Bonds render behind the atoms */}
      {molecule.bonds.map((bond) => {
        const x1 = positions.get(bond.from) ?? 0;
        const x2 = positions.get(bond.to) ?? 0;
        return (
          <BondLine
            key={`${bond.from}-${bond.to}`}
            visible={bonded}
            x1={x1}
            y1={ATOM_Y}
            x2={x2}
            y2={ATOM_Y}
            order={bond.order}
          />
        );
      })}

      {/* Shared-electron markers, one per bond line, appearing once bonds form */}
      <AnimatePresence>
        {bonded
          ? molecule.bonds.flatMap((bond) => {
              const x1 = positions.get(bond.from) ?? 0;
              const x2 = positions.get(bond.to) ?? 0;
              const edges = trimToEdges(x1, ATOM_Y, x2, ATOM_Y, ATOM_RADIUS);
              const midX = (edges.x1 + edges.x2) / 2;
              const midY = (edges.y1 + edges.y2) / 2;
              if (bond.order === 1) {
                return [
                  <ValenceElectron
                    key={`${bond.from}-${bond.to}-e`}
                    x={midX}
                    y={midY}
                    delay={0.15}
                  />,
                ];
              }
              return [
                <ValenceElectron
                  key={`${bond.from}-${bond.to}-e1`}
                  x={midX}
                  y={midY - DOUBLE_BOND_GAP}
                  delay={0.15}
                />,
                <ValenceElectron
                  key={`${bond.from}-${bond.to}-e2`}
                  x={midX}
                  y={midY + DOUBLE_BOND_GAP}
                  delay={0.15}
                />,
              ];
            })
          : null}
      </AnimatePresence>

      {/* Decorative "this atom has electrons" dots, shown before bonding */}
      <AnimatePresence>
        {!bonded
          ? molecule.atoms.flatMap((a) => {
              const x = positions.get(a.id) ?? 0;
              const dotY = ATOM_Y - ATOM_RADIUS - 18;
              return [
                <ValenceElectron key={`${a.id}-e1`} x={x - 10} y={dotY} />,
                <ValenceElectron key={`${a.id}-e2`} x={x + 10} y={dotY} />,
              ];
            })
          : null}
      </AnimatePresence>

      {/* Atoms render on top of bonds/electrons */}
      {molecule.atoms.map((a) => (
        <MoleculeAtom
          key={a.id}
          atom={ATOM_INFO[a.element]}
          gradientId={GRADIENT_ID[a.element]}
          x={positions.get(a.id) ?? 0}
          y={ATOM_Y}
          radius={ATOM_RADIUS}
          selected={selectedAtomId === a.id}
          onSelect={() => onSelectAtom(a.id)}
        />
      ))}

      {/* Final formula + caption, revealed at step 4 */}
      <AnimatePresence>
        {step === 4 ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <text
              x={SCENE_WIDTH / 2}
              y={ATOM_Y + ATOM_RADIUS + 56}
              textAnchor="middle"
              fontSize={26}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              {molecule.formulaDisplay}
            </text>
            <text
              x={SCENE_WIDTH / 2}
              y={ATOM_Y + ATOM_RADIUS + 86}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              className="fill-subject-chemistry"
            >
              {molecule.caption}
            </text>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
}
