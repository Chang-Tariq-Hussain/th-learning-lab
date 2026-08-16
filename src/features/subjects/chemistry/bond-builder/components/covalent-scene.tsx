"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondStage } from "../bond-model";
import { HYDROGEN, BOND_CAPTION } from "../bond-model";
import { ATOM_Y, COVALENT_H_X, COVALENT_H2_X } from "../layout";
import { AtomOrb } from "./atom-orb";
import { ValenceElectron } from "./valence-electron";

interface CovalentSceneProps {
  stage: BondStage;
}

export function CovalentScene({ stage }: CovalentSceneProps) {
  const settled = stage !== "separate";
  const h1X = settled ? COVALENT_H_X.close : COVALENT_H_X.separate;
  const h2X = settled ? COVALENT_H2_X.close : COVALENT_H2_X.separate;
  const bonded = stage === "bonded";
  const midX = (h1X + h2X) / 2;

  // Before bonding, each atom's single electron sits just above it. Once the
  // atoms settle, both electrons drift into the shared region between the
  // nuclei — separated slightly so the pair still reads as two electrons.
  const electron1Target = settled ? { x: midX - 9, y: ATOM_Y } : { x: h1X, y: ATOM_Y - 80 };
  const electron2Target = settled ? { x: midX + 9, y: ATOM_Y } : { x: h2X, y: ATOM_Y - 80 };

  return (
    <>
      <AtomOrb atom={HYDROGEN} gradientId="bond-hydrogen-gradient" x={h1X} y={ATOM_Y} />
      <AtomOrb atom={HYDROGEN} gradientId="bond-hydrogen-gradient" x={h2X} y={ATOM_Y} />

      <ValenceElectron x={electron1Target.x} y={electron1Target.y} delay={settled ? 0.45 : 0} />
      <ValenceElectron x={electron2Target.x} y={electron2Target.y} delay={settled ? 0.45 : 0} />

      <AnimatePresence>
        {bonded ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <text
              x={midX}
              y={ATOM_Y + 130}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              H — H
            </text>
            <text
              x={midX}
              y={ATOM_Y + 158}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              className="fill-subject-chemistry"
            >
              {BOND_CAPTION.covalent}
            </text>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </>
  );
}
