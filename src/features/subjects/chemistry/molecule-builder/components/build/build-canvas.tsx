"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { BuildScene } from "./build-scene";
import type { BuildAtomInstance, BuildBondInstance } from "../../build-model";

export interface BuildCanvasHandle {
  resetCamera: () => void;
}

interface BuildCanvasProps {
  atoms: BuildAtomInstance[];
  bonds: BuildBondInstance[];
  selectedAtomIds: string[];
  selectedBondId: string | null;
  onSelectAtom: (id: string) => void;
  onSelectBond: (id: string) => void;
  onMoveAtom: (id: string, position: [number, number, number]) => void;
  onClearSelection: () => void;
}

/** How far the pointer has to move (in CSS pixels) before a
 *  press-and-release counts as a drag instead of a click — small
 *  enough that a real drag never feels laggy to start, large enough
 *  that a slightly-shaky tap on mobile still registers as a select. */
const DRAG_THRESHOLD_PX = 4;

/** Reads the live camera + canvas DOM element out of the R3F context
 *  and mirrors them onto a plain ref, so the drag manager below
 *  (which lives outside the R3F tree, in `window` pointer listeners)
 *  can do its own raycasting without needing to be an R3F component
 *  itself. */
function ThreeContextBridge({
  contextRef,
}: {
  contextRef: React.MutableRefObject<{ camera: THREE.Camera; domElement: HTMLElement } | null>;
}) {
  const { camera, gl } = useThree();
  useEffect(() => {
    contextRef.current = { camera, domElement: gl.domElement };
  }, [camera, gl, contextRef]);
  return null;
}

function boundingRadius(atoms: BuildAtomInstance[]): number {
  return atoms.reduce((max, atom) => {
    const [x, y, z] = atom.position;
    return Math.max(max, Math.sqrt(x * x + y * y + z * z));
  }, 1.2);
}

/**
 * Owns the free-build `<Canvas>`, camera, and — the piece Explore
 * mode doesn't need — atom dragging. Deliberately does *not* remount
 * on every atom add/remove (no `key` tied to the atom list): the
 * learner is actively working in this scene, so their current camera
 * angle should persist exactly the way it would in a real 3D editor;
 * only "Reset View" and switching away from Build mode entirely reset
 * the camera.
 *
 * Dragging is implemented with manual raycasting against a plane
 * (facing the camera, passing through the atom's position at drag
 * start) computed from `window`-level pointermove/pointerup
 * listeners, rather than relying on R3F's per-mesh pointer events for
 * the move phase — those only fire when the cursor is still over the
 * original mesh, which breaks the moment a fast drag moves off it.
 * The same press-and-release is also how a plain "select" click is
 * detected: if the pointer never moved past `DRAG_THRESHOLD_PX`, the
 * gesture is treated as a click instead of a drag.
 */
export const BuildCanvas = forwardRef<BuildCanvasHandle, BuildCanvasProps>(
  function BuildCanvas(
    {
      atoms,
      bonds,
      selectedAtomIds,
      selectedBondId,
      onSelectAtom,
      onSelectBond,
      onMoveAtom,
      onClearSelection,
    },
    ref,
  ) {
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const threeCtxRef = useRef<{ camera: THREE.Camera; domElement: HTMLElement } | null>(null);
    const [draggingAtomId, setDraggingAtomId] = useState<string | null>(null);

    const atomsRef = useRef(atoms);
    atomsRef.current = atoms;

    const dragPlaneRef = useRef(new THREE.Plane());
    const raycasterRef = useRef(new THREE.Raycaster());
    const dragStartClientRef = useRef<{ x: number; y: number } | null>(null);
    const draggedEnoughRef = useRef(false);
    const draggingIdRef = useRef<string | null>(null);

    // Stable refs to the latest handlers so add/removeEventListener see
    // the exact same function reference across renders.
    const handlePointerMoveRef = useRef((_event: PointerEvent) => {});
    const handlePointerUpRef = useRef((_event: PointerEvent) => {});

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        controlsRef.current?.reset();
      },
    }));

    const endDrag = useCallback(
      (clickedId: string | null) => {
        window.removeEventListener("pointermove", handlePointerMoveRef.current);
        window.removeEventListener("pointerup", handlePointerUpRef.current);
        setDraggingAtomId(null);
        draggingIdRef.current = null;
        if (clickedId && !draggedEnoughRef.current) {
          onSelectAtom(clickedId);
        }
      },
      [onSelectAtom],
    );

    handlePointerMoveRef.current = (event: PointerEvent) => {
      const id = draggingIdRef.current;
      const ctx = threeCtxRef.current;
      const start = dragStartClientRef.current;
      if (!id || !ctx || !start) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!draggedEnoughRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
        draggedEnoughRef.current = true;
      }
      if (!draggedEnoughRef.current) return;

      const rect = ctx.domElement.getBoundingClientRect();
      const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycasterRef.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), ctx.camera);
      const point = new THREE.Vector3();
      const hit = raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, point);
      if (hit) {
        onMoveAtom(id, [point.x, point.y, point.z]);
      }
    };

    handlePointerUpRef.current = () => {
      endDrag(draggingIdRef.current);
    };

    const handleAtomDragStart = useCallback((id: string, event: ThreeEvent<PointerEvent>) => {
      const ctx = threeCtxRef.current;
      const atom = atomsRef.current.find((a) => a.id === id);
      if (!ctx || !atom) return;

      draggingIdRef.current = id;
      setDraggingAtomId(id);
      draggedEnoughRef.current = false;
      dragStartClientRef.current = {
        x: event.nativeEvent.clientX,
        y: event.nativeEvent.clientY,
      };

      const cameraDirection = new THREE.Vector3();
      ctx.camera.getWorldDirection(cameraDirection);
      dragPlaneRef.current.setFromNormalAndCoplanarPoint(
        cameraDirection,
        new THREE.Vector3(...atom.position),
      );

      window.addEventListener("pointermove", handlePointerMoveRef.current);
      window.addEventListener("pointerup", handlePointerUpRef.current);
    }, []);

    // Safety net: if the component unmounts mid-drag (e.g. leaving
    // Build mode), don't leak the window listeners.
    useEffect(() => {
      return () => {
        window.removeEventListener("pointermove", handlePointerMoveRef.current);
        window.removeEventListener("pointerup", handlePointerUpRef.current);
      };
    }, []);

    const radius = boundingRadius(atoms);

    return (
      <Canvas
        camera={{ position: [4.2, 3.2, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onPointerMissed={onClearSelection}
      >
        <ThreeContextBridge contextRef={threeCtxRef} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} />
        <directionalLight position={[-4, -2, -4]} intensity={0.35} />
        <BuildScene
          atoms={atoms}
          bonds={bonds}
          selectedAtomIds={selectedAtomIds}
          selectedBondId={selectedBondId}
          onAtomDragStart={handleAtomDragStart}
          onSelectBond={onSelectBond}
        />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enabled={!draggingAtomId}
          enablePan={false}
          minDistance={1.5}
          maxDistance={radius * 4 + 4}
          target={[0, 0, 0]}
        />
      </Canvas>
    );
  },
);
