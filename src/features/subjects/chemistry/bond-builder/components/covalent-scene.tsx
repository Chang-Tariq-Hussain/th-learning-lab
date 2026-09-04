"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondStage, CovalentPairConfig } from "../bond-model";
import { BOND_CAPTION, lonePairsFor } from "../bond-model";
import { ATOM_Y, COVALENT_H_X, COVALENT_H2_X, ringSlot } from "../layout";
import { AtomOrb } from "./atom-orb";
import { ValenceElectron } from "./valence-electron";

interface CovalentSceneProps {
  stage: BondStage;
  pair: CovalentPairConfig;
}

const LONE_PAIR_RING_SLOTS = 8;
/** Horizontal spacing between shared-pair columns, so a double/triple bond reads as multiple distinct pairs rather than one clump. */
const SHARED_PAIR_GAP = 20;

/**
 * Generalized from the original fixed H-H scene: `pair.order` now
 * decides how many electron pairs are shared (rendered as side-by-side
 * columns between the atoms, the same "how many lines" idea as a
 * Lewis structure's —/=/≡), and any electrons left over
 * (`lonePairsFor`) stay attached to their own atom's ring, the same
 * way the ionic scene's acceptor keeps its native electrons.
 */
export function CovalentScene({ stage, pair }: CovalentSceneProps) {
  const { atom, order } = pair;
  const settled = stage !== "separate";
  const h1X = settled ? COVALENT_H_X.close : COVALENT_H_X.separate;
  const h2X = settled ? COVALENT_H2_X.close : COVALENT_H2_X.separate;
  const bonded = stage === "bonded";
  const midX = (h1X + h2X) / 2;
  const lonePairs = lonePairsFor(pair);
  const loneElectronsEach = lonePairs * 2;

  return (
    <>
      <AtomOrb atom={atom} gradientId="bond-hydrogen-gradient" x={h1X} y={ATOM_Y} />
      <AtomOrb atom={atom} gradientId="bond-hydrogen-gradient" x={h2X} y={ATOM_Y} />

      {/* Each atom's own lone-pair electrons, staying on its own ring — none for H2, present for O2 and N2 */}
      {Array.from({ length: loneElectronsEach }, (_, i) => {
        const posA = ringSlot(h1X, ATOM_Y, i, LONE_PAIR_RING_SLOTS);
        const posB = ringSlot(h2X, ATOM_Y, i, LONE_PAIR_RING_SLOTS);
        return (
          <g key={`lone-${i}`}>
            <ValenceElectron x={posA.x} y={posA.y} />
            <ValenceElectron x={posB.x} y={posB.y} />
          </g>
        );
      })}

      {/* order shared electron pairs, drawn as side-by-side columns between the two nuclei */}
      {Array.from({ length: order }, (_, col) => {
        const colOffset = (col - (order - 1) / 2) * SHARED_PAIR_GAP;
        const e1Target = settled
          ? { x: midX + colOffset - 9, y: ATOM_Y }
          : { x: h1X, y: ATOM_Y - 80 - col * 22 };
        const e2Target = settled
          ? { x: midX + colOffset + 9, y: ATOM_Y }
          : { x: h2X, y: ATOM_Y - 80 - col * 22 };
        return (
          <g key={`shared-${col}`}>
            <ValenceElectron x={e1Target.x} y={e1Target.y} delay={settled ? 0.45 : 0} />
            <ValenceElectron x={e2Target.x} y={e2Target.y} delay={settled ? 0.45 : 0} />
          </g>
        );
      })}

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
              {atom.symbol} {pair.bondSymbol} {atom.symbol}
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
