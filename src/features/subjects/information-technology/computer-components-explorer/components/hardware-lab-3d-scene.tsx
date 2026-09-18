"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { CameraRig } from "./camera-rig";
import {
  Pcb,
  CpuAssembly,
  DimmSlots,
  M2Storage,
  SataStorage,
  PcieSlots,
  GpuCard,
  Chipset,
  Vrm,
  Psu,
  RearIo,
  Traces,
  getFocus,
} from "./motherboard-parts";
import { COMPONENTS, CAMERA_PRESETS, type ComponentId, type BoardLayer, type CameraPresetId } from "../model";

interface OrbitControlsLike {
  target: import("three").Vector3;
  update: () => void;
}

function Label({ id, position, active }: { id: ComponentId; position: [number, number, number]; active: boolean }) {
  return (
    <Html position={position} center distanceFactor={9} occlude>
      <div
        className={cn(
          "pointer-events-none select-none whitespace-nowrap rounded-md px-2 py-0.5 text-center font-mono text-[9px] shadow-sm transition-opacity",
          active ? "bg-amber-500 text-chalkboard opacity-100" : "bg-chalkboard/80 text-bone opacity-80"
        )}
      >
        {COMPONENTS[id].label}
      </div>
    </Html>
  );
}

const LABEL_POSITIONS: Record<ComponentId, [number, number, number]> = {
  motherboard: [3.9, 0.4, -3.4],
  cpu: [1.8, 1.1, 0],
  cpuCooler: [1.8, 2.0, 0],
  ram: [3.6, 0.9, 0],
  gpu: [-1.0, 1.1, 2.6],
  storageM2: [-2.5, 0.3, 1.9],
  storageSata: [-3.9, 0.85, 0.6],
  chipset: [0.3, 0.4, 1.8],
  pcie: [-1.0, 0.15, 3.1],
  vrm: [1.8, 0.35, -1.7],
  psu: [-4.6, 1.4, -3.2],
  rearIo: [-3.9, 0.85, -3.1],
};

export function HardwareLab3DScene({
  selected,
  onSelect,
  preset,
  onPresetChange,
  layer,
  showLabels,
}: {
  selected: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  preset: CameraPresetId;
  onPresetChange: (preset: CameraPresetId) => void;
  layer: BoardLayer;
  showLabels: boolean;
}) {
  const [hovered, setHovered] = useState<ComponentId | null>(null);
  const controlsRef = useRef<OrbitControlsLike | null>(null);

  const focusId: ComponentId | "overview" = selected ?? CAMERA_PRESETS.find((p) => p.id === preset)?.focusId ?? "overview";
  const focus = getFocus(focusId);

  const commonProps = (id: ComponentId) => ({
    id,
    selected,
    hovered,
    onSelect: (pid: ComponentId) => {
      onSelect(pid);
    },
    onHover: setHovered,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Camera presets">
        {CAMERA_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              onSelect(null as unknown as ComponentId);
              onPresetChange(p.id);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              preset === p.id && !selected
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="h-[320px] w-full touch-none overflow-hidden rounded-card border border-line dark:border-line-dark sm:h-[420px]">
        <Canvas shadows camera={{ position: focus.position, fov: 42 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.65} />
            <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
            <directionalLight position={[-4, 3, -3]} intensity={0.35} />

            <Pcb {...commonProps("motherboard")} />
            <CpuAssembly cpuProps={commonProps("cpu")} coolerProps={commonProps("cpuCooler")} />
            <DimmSlots {...commonProps("ram")} />
            <M2Storage {...commonProps("storageM2")} />
            <SataStorage {...commonProps("storageSata")} />
            <PcieSlots {...commonProps("pcie")} />
            <GpuCard {...commonProps("gpu")} />
            <Chipset {...commonProps("chipset")} />
            <Vrm {...commonProps("vrm")} />
            <Psu {...commonProps("psu")} />
            <RearIo {...commonProps("rearIo")} />

            {layer !== "basic" && <Traces />}

            {showLabels &&
              (Object.keys(LABEL_POSITIONS) as ComponentId[]).map((id) => (
                <Label key={id} id={id} position={LABEL_POSITIONS[id]} active={selected === id || hovered === id} />
              ))}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#1F2328" opacity={0.12} transparent />
            </mesh>

            <CameraRig focus={focus} focusKey={`${focusId}`} controlsRef={controlsRef} />
            <OrbitControls
              ref={controlsRef as never}
              enablePan
              minDistance={2.5}
              maxDistance={14}
              maxPolarAngle={Math.PI / 2.1}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
