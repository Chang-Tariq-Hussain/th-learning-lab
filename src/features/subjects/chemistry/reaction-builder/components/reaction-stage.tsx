"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AtomOrb } from "../../bond-builder/components/atom-orb";
import { BondDefs } from "../../bond-builder/components/bond-defs";
import { ValenceElectron } from "../../bond-builder/components/valence-electron";
import { MoleculeDefs } from "../../molecule-builder/components/molecule-defs";
import { BondLine } from "../../molecule-builder/components/bond-line";
import {
  trimToEdges,
  ATOM_RADIUS as MOLECULE_ATOM_RADIUS,
} from "../../molecule-builder/layout";
import {
  ATOM_INFO,
  GRADIENT_ID,
  type ReactionConfig,
  type ReactionStep,
} from "../reaction-model";
import { SCENE_WIDTH, SCENE_HEIGHT, ATOM_RADIUS } from "../layout";

interface ReactionStageProps {
  reaction: ReactionConfig;
  step: ReactionStep;
}

export function ReactionStage({ reaction, step }: ReactionStageProps) {
  const positions = new Map(
    reaction.atoms.map((a) => [a.id, a.positions[step]]),
  );

  const visibleBonds = reaction.bonds.filter((bond) =>
    bond.visibleSteps.includes(step),
  );

  const showReactantsLabel = step <= 2;
  const showProductsLabel = step === 6;

  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={`${reaction.equation} reaction builder, step ${step} of 6`}
    >
      <BondDefs />
      <MoleculeDefs />

      {/* Bonds render behind the atoms */}
      {reaction.bonds.map((bond) => {
        const from = positions.get(bond.from);
        const to = positions.get(bond.to);
        if (!from || !to) return null;
        return (
          <BondLine
            key={`${bond.from}-${bond.to}`}
            visible={bond.visibleSteps.includes(step)}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            order={1}
          />
        );
      })}

      {/* Shared-electron markers on every visible bond, matching Molecule Builder's visual language */}
      <AnimatePresence>
        {visibleBonds.map((bond) => {
          const from = positions.get(bond.from);
          const to = positions.get(bond.to);
          if (!from || !to) return null;
          const edges = trimToEdges(
            from.x,
            from.y,
            to.x,
            to.y,
            MOLECULE_ATOM_RADIUS,
          );
          const midX = (edges.x1 + edges.x2) / 2;
          const midY = (edges.y1 + edges.y2) / 2;
          return (
            <ValenceElectron
              key={`${bond.from}-${bond.to}-e`}
              x={midX}
              y={midY}
              delay={0.15}
            />
          );
        })}
      </AnimatePresence>

      {/* Atoms render on top of bonds/electrons */}
      {reaction.atoms.map((atom) => {
        const pos = positions.get(atom.id);
        if (!pos) return null;
        return (
          <AtomOrb
            key={atom.id}
            atom={ATOM_INFO[atom.element]}
            gradientId={GRADIENT_ID[atom.element]}
            x={pos.x}
            y={pos.y}
            radius={ATOM_RADIUS}
          />
        );
      })}

      {/* "Reactants" formula, shown while the original molecules are still intact */}
      <AnimatePresence>
        {showReactantsLabel ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <text
              x={180}
              y={26}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              {reaction.reactantsFormula}
            </text>
            <text
              x={180}
              y={48}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              className="fill-subject-chemistry"
            >
              {reaction.reactantsLabel}
            </text>
          </motion.g>
        ) : null}
      </AnimatePresence>

      {/* "Products" formula, revealed at the final step */}
      <AnimatePresence>
        {showProductsLabel ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <text
              x={730}
              y={26}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              {reaction.productsFormula}
            </text>
            <text
              x={730}
              y={48}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              className="fill-subject-chemistry"
            >
              {reaction.productsLabel}
            </text>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
}
