"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

interface Block {
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const BLOCKS: Block[] = [
  { id: "storage", label: "Storage", sub: "SSD / HDD — persistent", position: [-3.4, 0, 0], size: [1.4, 0.5, 1.6], color: "#94A3B8" },
  { id: "ram", label: "RAM", sub: "Main memory — temporary", position: [-1, 0, 0], size: [1.6, 0.3, 2.2], color: "#B45309" },
  { id: "cpu", label: "CPU Package", sub: "Cache + core", position: [1.6, 0.3, 0], size: [1.8, 0.9, 1.8], color: "#78350F" },
];

function BlockMesh({ block }: { block: Block }) {
  return (
    <group position={block.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={block.size} />
        <meshStandardMaterial color={block.color} roughness={0.6} metalness={0.1} />
      </mesh>
      <Html position={[0, block.size[1] / 2 + 0.35, 0]} center distanceFactor={8} occlude>
        <div className="pointer-events-none select-none whitespace-nowrap rounded-md bg-chalkboard/85 px-2 py-1 text-center font-mono text-[10px] text-bone shadow-sm">
          <div className="font-semibold">{block.label}</div>
          <div className="opacity-75">{block.sub}</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Deliberately minimal: three labeled blocks with rough relative
 * proportions (storage/RAM/CPU package), not a literal motherboard
 * model. The point is spatial intuition — "these are three separate
 * physical components, data has to travel between them" — the actual
 * instruction/data flow is taught in the 2D modes, per the brief's
 * instruction to keep clarity in 2D and use 3D only for physical
 * layout.
 */
export function System3DScene() {
  return (
    <div className="h-[280px] w-full overflow-hidden rounded-card border border-line dark:border-line-dark sm:h-[340px]">
      <Canvas shadows camera={{ position: [2, 3, 6], fov: 42 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
          {BLOCKS.map((block) => (
            <BlockMesh key={block.id} block={block} />
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[14, 14]} />
            <meshStandardMaterial color="#1F2328" opacity={0.15} transparent />
          </mesh>
          <OrbitControls enablePan={false} minDistance={4} maxDistance={10} maxPolarAngle={Math.PI / 2.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
