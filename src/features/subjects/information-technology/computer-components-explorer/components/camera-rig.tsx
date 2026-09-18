"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { FocusSpec } from "./motherboard-parts";

interface OrbitControlsLike {
  target: THREE.Vector3;
  update: () => void;
}

/**
 * Animates the camera to `focus` whenever `focusKey` changes, then hands
 * control back to OrbitControls — it never fights the user mid-drag,
 * because it only runs for ~900ms right after a preset/selection change.
 *
 * Adapted from the CPU–RAM–Storage Data Flow simulation's
 * `camera-rig.tsx` (built there but never wired up) — same animation
 * approach, kept local to this feature so each simulation stays
 * self-contained.
 */
export function CameraRig({
  focus,
  focusKey,
  controlsRef,
}: {
  focus: FocusSpec;
  focusKey: string;
  controlsRef: React.RefObject<OrbitControlsLike | null>;
}) {
  const { camera } = useThree();
  const anim = useRef({
    from: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    start: 0,
    active: false,
  });

  useEffect(() => {
    if (!controlsRef.current) return;
    anim.current.from.copy(camera.position);
    anim.current.fromTarget.copy(controlsRef.current.target);
    anim.current.start = performance.now();
    anim.current.active = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  useFrame(() => {
    const a = anim.current;
    const controls = controlsRef.current;
    if (!a.active || !controls) return;
    const t = Math.min((performance.now() - a.start) / 900, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const toPos = new THREE.Vector3(...focus.position);
    const toTarget = new THREE.Vector3(...focus.target);
    camera.position.lerpVectors(a.from, toPos, eased);
    controls.target.lerpVectors(a.fromTarget, toTarget, eased);
    controls.update();
    if (t >= 1) a.active = false;
  });

  return null;
}
