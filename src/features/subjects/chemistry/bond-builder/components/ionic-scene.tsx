"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { BondStage, IonicPairConfig } from "../bond-model";
import { BOND_CAPTION, ionicCharge } from "../bond-model";
import { ATOM_Y, IONIC_NA_X, IONIC_CL_X, ringSlot } from "../layout";
import { AtomOrb } from "./atom-orb";
import { ValenceElectron } from "./valence-electron";

interface IonicSceneProps {
  stage: BondStage;
  pair: IonicPairConfig;
}

const ACCEPTOR_RING_SLOTS = 8;

/**
 * Generalized from the original fixed Na/Cl scene: `pair` now
 * supplies which two atoms and how many electrons move between
 * them, so the same component renders both Na+Cl (1 electron) and
 * Mg+O (2 electrons) — geometry (positions, ring) stays identical,
 * only the electron count and resulting charge labels change.
 */
export function IonicScene({ stage, pair }: IonicSceneProps) {
  const { donor, acceptor, transferElectrons } = pair;
  const settled = stage !== "separate";
  const donorX = settled ? IONIC_NA_X.close : IONIC_NA_X.separate;
  const acceptorX = settled ? IONIC_CL_X.close : IONIC_CL_X.separate;
  const bonded = stage === "bonded";

  const nativeCount = acceptor.valenceElectrons;

  return (
    <>
      <AtomOrb
        atom={donor}
        gradientId="bond-sodium-gradient"
        x={donorX}
        y={ATOM_Y}
        charge={bonded ? ionicCharge(transferElectrons, "+") : null}
      />
      <AtomOrb
        atom={acceptor}
        gradientId="bond-chlorine-gradient"
        x={acceptorX}
        y={ATOM_Y}
        charge={bonded ? ionicCharge(transferElectrons, "−") : null}
      />

      {/* The acceptor's own native valence electrons, always attached to its ring */}
      {Array.from({ length: nativeCount }, (_, i) => {
        const pos = ringSlot(acceptorX, ATOM_Y, i, ACCEPTOR_RING_SLOTS);
        return <ValenceElectron key={`acceptor-native-${i}`} x={pos.x} y={pos.y} />;
      })}

      {/* Every electron that transfers from the donor to the acceptor, moving after the atoms have mostly closed the gap */}
      {Array.from({ length: transferElectrons }, (_, i) => {
        const target = settled
          ? ringSlot(acceptorX, ATOM_Y, nativeCount + i, ACCEPTOR_RING_SLOTS)
          : { x: donorX, y: ATOM_Y - 90 - i * 22 };
        return (
          <ValenceElectron
            key={`transfer-${i}`}
            x={target.x}
            y={target.y}
            delay={settled ? 0.45 + i * 0.12 : 0}
          />
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
              x={(donorX + acceptorX) / 2}
              y={ATOM_Y + 130}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              className="fill-ink dark:fill-bone"
            >
              {donor.symbol}
              {ionicCharge(transferElectrons, "+")} &nbsp;→&nbsp;&nbsp;&nbsp;←&nbsp; {acceptor.symbol}
              {ionicCharge(transferElectrons, "−")}
            </text>
            <text
              x={(donorX + acceptorX) / 2}
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
