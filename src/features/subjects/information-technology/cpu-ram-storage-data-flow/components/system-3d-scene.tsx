"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Locate, RotateCcw, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAnyComponentDef, type ComponentId, type PhysicalComponentId } from "../model";
import {
  Pcb,
  CpuAssembly,
  DimmSlots,
  M2Storage,
  PcieSlots,
  ChipsetAndBios,
  Vrm,
  RearIo,
  Traces,
  getFocus,
  type SelectableId,
} from "./motherboard-parts";
import { CameraRig } from "./camera-rig";

type Selection = ComponentId | PhysicalComponentId | null;
type PresetId = "overview" | "cpu" | "ram" | "storage";

const PRESETS: { id: PresetId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "Memory" },
  { id: "storage", label: "Storage" },
];

/** Ids that get a persistent (toggleable) floor label; the rest only label on hover/select. */
const LABEL_ANCHORS: Partial<Record<SelectableId, [number, number, number]>> = {
  cpu: [1.8, 1.15, 0],
  cpuSocket: [1.8, 0.05, 0.85],
  ram: [3.6, 0.9, 1.55],
  storage: [-2.5, 0.25, 1.05],
  chipset: [0.3, 0.35, 1.8],
  bios: [0.3, 0.15, 0.9],
  pcie: [-1.0, 1.15, 3.1],
  vrm: [1.8, 0.5, -1.7],
  io: [-3.9, 0.9, -3.1],
};

function PartLabel({ id, active, show }: { id: SelectableId; active: boolean; show: boolean }) {
  const anchor = LABEL_ANCHORS[id];
  if (!anchor || !(show || active)) return null;
  const def = getAnyComponentDef(id);
  return (
    <Html position={anchor} center distanceFactor={9} occlude>
      <div
        className={cn(
          "pointer-events-none select-none whitespace-nowrap rounded-md px-2 py-1 text-center font-mono text-[10px] shadow-sm transition-colors",
          active ? "bg-subject-it text-paper" : "bg-chalkboard/85 text-bone"
        )}
      >
        <div className="font-semibold">{def.label}</div>
        {active && <div className="opacity-80">Tap for details</div>}
      </div>
    </Html>
  );
}

interface SceneProps {
  selected: Selection;
  hovered: SelectableId | null;
  onSelect: (id: SelectableId) => void;
  onHover: (id: SelectableId | null) => void;
  showLabels: boolean;
}

function MotherboardModel({ selected, hovered, onSelect, onHover, showLabels }: SceneProps) {
  const shared = (id: SelectableId) => ({ id, selected: selected as SelectableId | null, hovered, onSelect, onHover });
  return (
    <group>
      <Pcb {...shared("motherboard")} />
      <Traces />
      <CpuAssembly socketProps={shared("cpuSocket")} cpuProps={shared("cpu")} />
      <DimmSlots {...shared("ram")} />
      <M2Storage {...shared("storage")} />
      <PcieSlots {...shared("pcie")} />
      <ChipsetAndBios chipsetProps={shared("chipset")} biosProps={shared("bios")} />
      <Vrm {...shared("vrm")} />
      <RearIo {...shared("io")} />

      {(Object.keys(LABEL_ANCHORS) as SelectableId[]).map((id) => (
        <PartLabel key={id} id={id} active={selected === id || hovered === id} show={showLabels} />
      ))}
    </group>
  );
}

/**
 * The upgraded 3D base: a procedurally-built motherboard (socket, CPU
 * package + cooler, four DIMM slots with two populated, an M.2 SSD,
 * PCIe slots with a populated card, chipset, VRM, rear I/O, and BIOS
 * chip), fully clickable. Selecting a part here drives the same
 * `InspectPanel` the 2D diagram uses in `OverviewMode`, so the two
 * views of "what is this component" stay in sync — this scene handles
 * physical layout and camera framing, the 2D modes still own the
 * step-by-step data-flow animation.
 */
export function System3DScene({
  selected,
  onSelect,
}: {
  selected: Selection;
  onSelect: (id: ComponentId | PhysicalComponentId) => void;
}) {
  const [hovered, setHovered] = useState<SelectableId | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [preset, setPreset] = useState<PresetId>("overview");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const focusTarget = (selected as SelectableId | null) ?? preset;
  const focus = getFocus(focusTarget);

  function handleSelect(id: SelectableId) {
    onSelect(id as ComponentId | PhysicalComponentId);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="h-[380px] w-full overflow-hidden rounded-card border border-line dark:border-line-dark sm:h-[460px]">
        <Canvas shadows camera={{ position: [3.4, 4.6, 7.4], fov: 40 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 4]} intensity={1.1} castShadow />
          <directionalLight position={[-6, 4, -4]} intensity={0.3} color="#B45309" />
          <fog attach="fog" args={["#0d1410", 14, 26]} />
          <MotherboardModel selected={selected} hovered={hovered} onSelect={handleSelect} onHover={setHovered} showLabels={showLabels} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
            <planeGeometry args={[24, 24]} />
            <meshStandardMaterial color="#1F2328" opacity={0.18} transparent />
          </mesh>
          <OrbitControls
            ref={controlsRef}
            enablePan
            minDistance={3}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.12}
          />
          <CameraRig focus={focus} focusKey={String(focusTarget)} controlsRef={controlsRef} />
        </Canvas>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark" role="group" aria-label="Camera view">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPreset(p.id);
                onSelect(p.id === "overview" ? "motherboard" : (p.id as ComponentId | PhysicalComponentId));
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                preset === p.id && selected === (p.id === "overview" ? "motherboard" : p.id)
                  ? "bg-subject-it text-paper"
                  : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setPreset("overview");
            controlsRef.current?.reset();
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-medium text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset view
        </button>

        <button
          onClick={() => setShowLabels((s) => !s)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
            showLabels
              ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
              : "border-line text-ink-soft hover:border-ink/40 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/40"
          )}
        >
          <Tag className="h-3.5 w-3.5" />
          Labels
        </button>

        <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-soft dark:text-bone-soft">
          <Locate className="h-3.5 w-3.5" />
          Click any part to inspect it
        </span>
      </div>
    </div>
  );
}
