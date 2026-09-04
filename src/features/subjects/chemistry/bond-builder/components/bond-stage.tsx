"use client";

import type { BondMode, BondStage, CovalentPairConfig, IonicPairConfig } from "../bond-model";
import { SCENE_WIDTH, SCENE_HEIGHT } from "../layout";
import { BondDefs } from "./bond-defs";
import { IonicScene } from "./ionic-scene";
import { CovalentScene } from "./covalent-scene";

interface BondStageProps {
  mode: BondMode;
  stage: BondStage;
  ionicPair: IonicPairConfig;
  covalentPair: CovalentPairConfig;
}

/**
 * The large central simulation canvas. Purely a stage: it owns no state
 * of its own, just renders whichever scene matches `mode` at the given
 * `stage`, for whichever pair is currently selected. Follows the same
 * "one shared `<defs>`, particles as small self-contained components"
 * structure as Build an Atom's `AtomVisualization`.
 */
export function BondStage({ mode, stage, ionicPair, covalentPair }: BondStageProps) {
  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={
        mode === "ionic"
          ? `Ionic bonding simulation between ${ionicPair.donor.name.toLowerCase()} and ${ionicPair.acceptor.name.toLowerCase()}, currently ${stage}`
          : `Covalent bonding simulation between two ${covalentPair.atom.name.toLowerCase()} atoms, currently ${stage}`
      }
    >
      <BondDefs />
      {mode === "ionic" ? (
        <IonicScene stage={stage} pair={ionicPair} />
      ) : (
        <CovalentScene stage={stage} pair={covalentPair} />
      )}
    </svg>
  );
}
