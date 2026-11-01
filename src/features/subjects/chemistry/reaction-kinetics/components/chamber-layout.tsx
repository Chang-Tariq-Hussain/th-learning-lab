"use client";

import type { ReactNode } from "react";
import { SimulationLayout, SimulationReadouts, type ReadoutItem } from "@/features/simulation";

interface ChamberLayoutProps {
  /** One chamber, or two side by side (a reference and the learner's). */
  columns?: 1 | 2;
  /** The chamber(s). Each fills its grid cell. */
  chambers: ReactNode;
  stageLabel: string;
  readouts?: ReadoutItem[];
  /** Free-form status shown with the stage instead of numeric readouts (keep its height stable). */
  readoutsNode?: ReactNode;
  controls?: ReactNode;
  explanation?: ReactNode;
  actions?: ReactNode;
}

/** Every level of Reaction Kinetics shares this: the chamber(s) and counts stay on screen while the controls are used. */
export function ChamberLayout({ columns = 1, chambers, stageLabel, readouts, readoutsNode, controls, explanation, actions }: ChamberLayoutProps) {
  return (
    <SimulationLayout
      stageLabel={stageLabel}
      aspect={columns === 1 ? 1.4 : 2.3}
      stageCap={columns === 1 ? "17rem" : "13rem"}
      stage={<div className={columns === 1 ? "h-full w-full" : "grid h-full w-full grid-cols-2 gap-2"}>{chambers}</div>}
      readouts={readouts ? <SimulationReadouts label="Chamber counts" items={readouts} /> : readoutsNode}
      actions={actions}
      controls={controls}
      explanation={explanation}
    />
  );
}
