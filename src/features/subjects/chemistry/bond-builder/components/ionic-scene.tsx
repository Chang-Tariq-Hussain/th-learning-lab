"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondStage } from "../bond-model";
import { SODIUM, CHLORINE, BOND_CAPTION } from "../bond-model";
import { ATOM_Y, IONIC_NA_X, IONIC_CL_X, ringSlot } from "../layout";
import { AtomOrb } from "./atom-orb";
import { ValenceElectron } from "./valence-electron";

interface IonicSceneProps {
  stage: BondStage;
}

const CL_NATIVE_ELECTRONS = 7;
const CL_RING_SLOTS = 8;

export function IonicScene({ stage }: IonicSceneProps) {
  const settled = stage !== "separate";
  const naX = settled ? IONIC_NA_X.close : IONIC_NA_X.separate;
  const clX = settled ? IONIC_CL_X.close : IONIC_CL_X.separate;
  const bonded = stage === "bonded";

  const transferTarget = settled
    ? ringSlot(clX, ATOM_Y, CL_NATIVE_ELECTRONS, CL_RING_SLOTS)
    : { x: naX, y: ATOM_Y - 90 };

  return (
    <>
      <AtomOrb atom={SODIUM} gradientId="bond-sodium-gradient" x={naX} y={ATOM_Y} charge={bonded ? "+" : null} />
      <AtomOrb atom={CHLORINE} gradientId="bond-chlorine-gradient" x={clX} y={ATOM_Y} charge={bonded ? "−" : null} />

      {/* Chlorine's own 7 valence electrons, always attached to Cl's ring */}
      {Array.from({ length: CL_NATIVE_ELECTRONS }, (_, i) => {
        const pos = ringSlot(clX, ATOM_Y, i, CL_RING_SLOTS);
        return <ValenceElectron key={`cl-electron-${i}`} x={pos.x} y={pos.y} />;
      })}

      {/* The one electron that transfers from Na to Cl, moving after the atoms have mostly closed the gap */}
      <ValenceElectron x={transferTarget.x} y={transferTarget.y} delay={settled ? 0.45 : 0} />

      <AnimatePresence>
        {bonded ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <text
              x={(naX + clX) / 2}
              y={ATOM_Y + 130}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              Na⁺ &nbsp;→&nbsp;&nbsp;&nbsp;←&nbsp; Cl⁻
            </text>
            <text
              x={(naX + clX) / 2}
              y={ATOM_Y + 158}
              textAnchor="middle"
              fontSize={15}
              fontWeight={600}
              className="fill-subject-chemistry"
            >
              {BOND_CAPTION.ionic}
            </text>
          </motion.g>
        ) : null}
      </AnimatePresence>
    </>
  );
}
