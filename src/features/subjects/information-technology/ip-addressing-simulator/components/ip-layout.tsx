"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SimulationLayout, type SimulationRunState } from "@/features/simulation";
import { NetworkMapDiagram, type DiagramProps } from "./network-map-diagram";

const TRUE_ASPECT = 740 / 310;
/** Below 640px the diagram is wider than the screen, so the stage is taller and the diagram scrolls sideways inside it. */
const PHONE_ASPECT = 1.5;

function useWideStage(): boolean {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

interface IpLayoutProps {
  diagram: DiagramProps;
  stageLabel: string;
  runState?: SimulationRunState;
  statusDetail?: string;
  actions?: ReactNode;
  controls?: ReactNode;
  explanation?: ReactNode;
}

/** The IP lab network map as a sticky stage; controls and explanations scroll under it. */
export function IpLayout({ diagram, stageLabel, runState = "idle", statusDetail, actions, controls, explanation }: IpLayoutProps) {
  const wide = useWideStage();
  return (
    <SimulationLayout
      stageLabel={stageLabel}
      stage={<NetworkMapDiagram {...diagram} fill />}
      aspect={wide ? TRUE_ASPECT : PHONE_ASPECT}
      stageCap="52rem"
      runState={runState}
      statusDetail={statusDetail}
      actions={actions}
      controls={controls}
      explanation={explanation}
    />
  );
}
