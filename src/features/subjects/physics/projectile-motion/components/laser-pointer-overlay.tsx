"use client";

import { useEffect, useState } from "react";
import { useSimulationSurface } from "@/features/simulation";

/**
 * Renders a glowing dot that follows the cursor over the whole simulation
 * surface. Purely a presentation aid for Teacher Mode — listens on the
 * surface's own DOM node (via `useSimulationSurface`, the same ref
 * `FullscreenButton`/`ExportScreenshotButton` use) rather than an
 * overlay `div`, so it never intercepts clicks or blocks canvas
 * pan/zoom underneath it.
 */
export function LaserPointerOverlay() {
  const { containerRef } = useSimulationSurface();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const onLeave = () => setPos(null);

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  if (!pos) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_16px_6px_rgba(239,68,68,0.55)]"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}
