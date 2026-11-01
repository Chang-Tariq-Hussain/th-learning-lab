"use client";

import type { ReactNode } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { NetworkGraphSvg, type NetworkGraphSvgProps } from "./network-graph-svg";

const DEFAULT_W = 520;
const DEFAULT_H = 300;

interface NetLayoutProps {
  graph: Omit<NetworkGraphSvgProps, "fill">;
  stageLabel: string;
  runState?: SimulationRunState;
  statusDetail?: string;
  actions?: ReactNode;
  controls?: ReactNode;
  explanation?: ReactNode;
}

/** One SimulationLayout for every network-diagram lab: sticky diagram, controls below. */
export function NetLayout({ graph, stageLabel, runState = "idle", statusDetail, actions, controls, explanation }: NetLayoutProps) {
  const w = graph.width ?? DEFAULT_W;
  const h = graph.height ?? DEFAULT_H;
  return (
    <SimulationLayout
      stageLabel={stageLabel}
      stage={<NetworkGraphSvg {...graph} fill />}
      aspect={w / h}
      stageCap="40rem"
      runState={runState}
      statusDetail={statusDetail}
      actions={actions}
      controls={controls}
      explanation={explanation}
    />
  );
}
