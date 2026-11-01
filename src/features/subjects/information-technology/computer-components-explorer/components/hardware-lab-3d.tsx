"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { CAMERA_PRESETS, type ComponentId, type BoardLayer, type CameraPresetId } from "../model";

const HardwareLab3DScene = dynamic(() => import("./hardware-lab-3d-scene").then((mod) => mod.HardwareLab3DScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-card border border-line text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft">
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

/** Camera preset buttons for the 3D scene; they live in the layout controls, under the sticky stage. */
export function CameraPresetButtons({
  selected,
  preset,
  onSelect,
  onPresetChange,
}: {
  selected: ComponentId | null;
  preset: CameraPresetId;
  onSelect: (id: ComponentId) => void;
  onPresetChange: (preset: CameraPresetId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Camera presets">
      {CAMERA_PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            onSelect(null as unknown as ComponentId);
            onPresetChange(p.id);
          }}
          className={cn(
            "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
            preset === p.id && !selected
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
