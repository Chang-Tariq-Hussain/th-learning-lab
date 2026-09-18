"use client";

import dynamic from "next/dynamic";
import type { ComponentId, BoardLayer, CameraPresetId } from "../model";

const HardwareLab3DScene = dynamic(() => import("./hardware-lab-3d-scene").then((mod) => mod.HardwareLab3DScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-card border border-line text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft sm:h-[420px]">
      Loading 3D lab…
    </div>
  ),
});

export function HardwareLab3D(props: {
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  preset: CameraPresetId;
  onPresetChange: (preset: CameraPresetId) => void;
  layer: BoardLayer;
  showLabels: boolean;
}) {
  return <HardwareLab3DScene {...props} />;
}
