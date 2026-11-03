"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { AtomState } from "../atom-model";
import { LIMITS } from "../atom-model";
import { NUCLEON_RADIUS, nucleonPositions, shellRadius, type Vec3 } from "../nucleus-layout-3d";
import { distribute, type ShellModelId } from "../shells";
import type { ParticleKind } from "../particle-info";

const PROTON_COLOR = "#E0524F";
const NEUTRON_COLOR = "#8B95A1";
const ELECTRON_COLOR = "#3D5AFE";
const SELECTED_COLOR = "#F0A54A";
const ELECTRON_RADIUS = 0.26;
const DEFAULT_DIRECTION = new THREE.Vector3(0, 0.62, 0.8).normalize();

export interface AtomScene3DProps {
  atom: AtomState;
  shellModel: ShellModelId;
  selectedShell: number | null;
  showShellLabels: boolean;
  /** 1 = framed to fit the whole atom; larger zooms in. */
  zoom: number;
  /** Bump to put the camera back at its starting view. */
  resetKey: number;
  reducedMotion: boolean;
  onSelectParticle: (kind: ParticleKind) => void;
  onSelectShell: (n: number | null) => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}

/** One instanced mesh for all protons or all neutrons: the whole nucleus costs two draw calls. */
function NucleonCloud({ positions, color, kind, max, onSelect }: { positions: Vec3[]; color: string; kind: ParticleKind; max: number; onSelect: (kind: ParticleKind) => void }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    positions.forEach((p, i) => {
      dummy.position.set(p[0], p[1], p[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.count = positions.length;
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, max]}
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(kind);
      }}
    >
      <sphereGeometry args={[NUCLEON_RADIUS, 20, 14]} />
      <meshStandardMaterial color={color} roughness={0.38} metalness={0.05} />
    </instancedMesh>
  );
}

interface ShellProps {
  index: number;
  n: number;
  letter: string;
  count: number;
  capacity: number;
  radius: number;
  selected: boolean;
  showLabel: boolean;
  reducedMotion: boolean;
  onSelect: (n: number) => void;
}

/** A shell: a thin ring plus one instanced mesh holding that shell's electrons, rotated slowly as a group. */
function Shell({ index, n, letter, count, capacity, radius, selected, showLabel, reducedMotion, onSelect }: ShellProps) {
  const group = useRef<THREE.Group>(null);
  const electrons = useRef<THREE.InstancedMesh>(null);
  const direction = index % 2 === 0 ? 1 : -1;
  const speed = 0.32 / (1 + index * 0.45);

  useFrame((_, delta) => {
    if (!reducedMotion && group.current) group.current.rotation.y += direction * speed * Math.min(delta, 0.05);
  });

  useLayoutEffect(() => {
    const mesh = electrons.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const phase = index * 0.7;
    const scale = selected ? 1.4 : 1;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + phase;
      dummy.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, radius, selected, index]);

  // Each shell label sits at its own angle around the ring so labels never stack on top of each other.
  const labelAngle = -2.4 + index * 0.62;
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, selected ? 0.07 : 0.03, 8, 128]} />
        <meshBasicMaterial color={selected ? SELECTED_COLOR : "#9AA3AD"} transparent opacity={selected ? 0.95 : 0.5} />
      </mesh>
      <group ref={group}>
        <instancedMesh
          ref={electrons}
          args={[undefined, undefined, LIMITS.electrons.max]}
          frustumCulled={false}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(n);
          }}
        >
          <sphereGeometry args={[ELECTRON_RADIUS, 16, 12]} />
          <meshStandardMaterial color={ELECTRON_COLOR} emissive={selected ? SELECTED_COLOR : ELECTRON_COLOR} emissiveIntensity={selected ? 0.55 : 0.35} roughness={0.3} />
        </instancedMesh>
      </group>
      {showLabel ? (
        <Html position={[Math.cos(labelAngle) * radius, 0, Math.sin(labelAngle) * radius]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <span
            className={
              "whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-label " +
              (selected
                ? "border-amber-500 bg-amber-100 text-amber-950"
                : "border-ink/20 bg-paper/90 text-ink dark:border-bone/25 dark:bg-chalkboard/90 dark:text-bone")
            }
          >
            {letter} · {count}/{capacity}
          </span>
        </Html>
      ) : null}
    </>
  );
}

/** Camera framing, zoom, reset, keyboard rotation and touch behaviour. */
function CameraRig({ fit, zoom, resetKey, reducedMotion, onContextLost, onContextRestored }: { fit: number; zoom: number; resetKey: number; reducedMotion: boolean; onContextLost: () => void; onContextRestored: () => void }) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const { camera, gl } = useThree();

  // Keep the current viewing direction, change only the distance.
  useEffect(() => {
    const c = controls.current;
    const dir = camera.position.clone().sub(c?.target ?? new THREE.Vector3()).normalize();
    if (!Number.isFinite(dir.x) || dir.lengthSq() === 0) dir.copy(DEFAULT_DIRECTION);
    camera.position.copy(c?.target ?? new THREE.Vector3()).addScaledVector(dir, fit / zoom);
    camera.lookAt(c?.target ?? new THREE.Vector3());
    c?.update();
  }, [fit, zoom, camera]);

  useEffect(() => {
    camera.position.copy(DEFAULT_DIRECTION).multiplyScalar(fit / zoom);
    controls.current?.target.set(0, 0, 0);
    camera.lookAt(0, 0, 0);
    controls.current?.update();
    // Only a reset request should re-run this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    const el = gl.domElement;
    // One-finger vertical swipes keep scrolling the page; horizontal drags rotate the atom.
    el.style.touchAction = "pan-y";
    el.tabIndex = 0;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", "3D atom model. Use the arrow keys to rotate the view.");
    const onKey = (e: KeyboardEvent) => {
      const step = 0.14;
      let handled = true;
      if (e.key === "ArrowLeft") camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -step);
      else if (e.key === "ArrowRight") camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), step);
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const next = camera.position.clone().applyAxisAngle(right, e.key === "ArrowUp" ? -step : step);
        const lift = next.y / next.length();
        if (lift > -0.92 && lift < 0.98) camera.position.copy(next);
      } else handled = false;
      if (!handled) return;
      e.preventDefault();
      camera.lookAt(0, 0, 0);
      controls.current?.update();
    };
    const lost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    el.addEventListener("keydown", onKey);
    el.addEventListener("webglcontextlost", lost);
    el.addEventListener("webglcontextrestored", onContextRestored);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("webglcontextlost", lost);
      el.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, [camera, gl, onContextLost, onContextRestored]);

  return (
    <OrbitControls
      ref={controls as never}
      enablePan={false}
      enableZoom={false}
      enableDamping={!reducedMotion}
      dampingFactor={0.12}
      rotateSpeed={0.8}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
    />
  );
}

export default function AtomScene3D({ atom, shellModel, selectedShell, showShellLabels, zoom, resetKey, reducedMotion, onSelectParticle, onSelectShell, onContextLost, onContextRestored }: AtomScene3DProps) {
  const nucleonCount = atom.protons + atom.neutrons;
  const layout = useMemo(() => nucleonPositions(atom.protons, atom.neutrons), [atom.protons, atom.neutrons]);
  const { shells } = useMemo(() => distribute(atom.electrons, shellModel), [atom.electrons, shellModel]);
  const outer = shells.length > 0 ? shellRadius(shells.length - 1, nucleonCount) : shellRadius(0, nucleonCount);
  const fit = (outer + 1) * 2.15;

  return (
    <Canvas
      camera={{ position: DEFAULT_DIRECTION.clone().multiplyScalar(fit).toArray() as Vec3, fov: 40, near: 0.1, far: 400 }}
      frameloop={reducedMotion ? "demand" : "always"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onPointerMissed={() => onSelectShell(null)}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 9, 7]} intensity={1.05} />
      <directionalLight position={[-6, -3, -5]} intensity={0.3} />

      <NucleonCloud positions={layout.protons} color={PROTON_COLOR} kind="proton" max={LIMITS.protons.max} onSelect={onSelectParticle} />
      <NucleonCloud positions={layout.neutrons} color={NEUTRON_COLOR} kind="neutron" max={LIMITS.neutrons.max} onSelect={onSelectParticle} />

      {shells.map((s, i) => (
        <Shell
          key={s.n}
          index={i}
          n={s.n}
          letter={s.letter}
          count={s.count}
          capacity={s.capacity}
          radius={shellRadius(i, nucleonCount)}
          selected={selectedShell === s.n}
          showLabel={showShellLabels}
          reducedMotion={reducedMotion}
          onSelect={(n) => {
            onSelectShell(n);
            onSelectParticle("electron");
          }}
        />
      ))}

      <CameraRig fit={fit} zoom={zoom} resetKey={resetKey} reducedMotion={reducedMotion} onContextLost={onContextLost} onContextRestored={onContextRestored} />
    </Canvas>
  );
}
