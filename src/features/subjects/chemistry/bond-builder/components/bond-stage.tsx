"use client";

import type { BondMode, BondStage } from "../bond-model";
import { SCENE_WIDTH, SCENE_HEIGHT } from "../layout";
import { BondDefs } from "./bond-defs";
import { IonicScene } from "./ionic-scene";
import { CovalentScene } from "./covalent-scene";

interface BondStageProps {
  mode: BondMode;
  stage: BondStage;
}

/**
 * The large central simulation canvas. Purely a stage: it owns no state
 * of its own, just renders whichever scene matches `mode` at the given
 * `stage`. Follows the same "one shared `<defs>`, particles as small
 * self-contained components" structure as Build an Atom's
 * `AtomVisualization`.
 */
export function BondStage({ mode, stage }: BondStageProps) {
  return (
    <svg
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={
        mode === "ionic"
          ? `Ionic bonding simulation between sodium and chlorine, currently ${stage}`
          : `Covalent bonding simulation between two hydrogen atoms, currently ${stage}`
      }
    >
      <BondDefs />
      {mode === "ionic" ? <IonicScene stage={stage} /> : <CovalentScene stage={stage} />}
    </svg>
  );
}
