"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { MoleculeConfig } from "../molecule-model";
import { MoleculeScene } from "./molecule-scene";

export interface MoleculeCanvasHandle {
  resetCamera: () => void;
}

interface MoleculeCanvasProps {
  molecule: MoleculeConfig;
  selectedAtomId: string | null;
  selectedBondId: string | null;
  onSelectAtom: (id: string) => void;
  onSelectBond: (id: string) => void;
  onClearSelection: () => void;
}

function boundingRadius(molecule: MoleculeConfig): number {
  return molecule.atoms.reduce((max, atom) => {
    const [x, y, z] = atom.position;
    return Math.max(max, Math.sqrt(x * x + y * y + z * z));
  }, 0.6);
}

/**
 * Owns the R3F `<Canvas>`, camera framing, and lighting; `MoleculeScene`
 * (atoms + bonds) is the only thing that actually changes per molecule.
 * Framing (camera distance, orbit min/max) is derived from each
 * molecule's own bounding radius rather than one fixed distance, so H2
 * isn't a speck and CH4 isn't clipped. Remounting the whole `<Canvas>`
 * on molecule change (via `key`) is deliberate: it's the simplest way
 * to snap to a sensible default view for the new molecule's scale
 * instead of carrying over a zoom level tuned for a different one.
 */
export const MoleculeCanvas = forwardRef<
  MoleculeCanvasHandle,
  MoleculeCanvasProps
>(function MoleculeCanvas(
  { molecule, selectedAtomId, selectedBondId, onSelectAtom, onSelectBond, onClearSelection },
  ref,
) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const radius = useMemo(() => boundingRadius(molecule), [molecule]);
  const cameraDistance = radius * 2.6 + 1.4;

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      controlsRef.current?.reset();
    },
  }));

  return (
    <Canvas
      key={molecule.id}
      camera={{
        position: [
          cameraDistance * 0.55,
          cameraDistance * 0.4,
          cameraDistance * 0.75,
        ],
        fov: 42,
      }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onPointerMissed={onClearSelection}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} />
      <directionalLight position={[-4, -2, -4]} intensity={0.35} />
      <MoleculeScene
        molecule={molecule}
        selectedAtomId={selectedAtomId}
        selectedBondId={selectedBondId}
        onSelectAtom={onSelectAtom}
        onSelectBond={onSelectBond}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={radius * 1.4 + 0.8}
        maxDistance={radius * 4 + 2}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
});
