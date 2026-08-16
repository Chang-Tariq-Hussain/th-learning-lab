"use client";

import { useCallback, useRef, useState } from "react";
import { Contrast, RotateCcw, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HYDROGEN_ATOM, type AtomState } from "./atom-model";
import type { ParticleKind, ChangeKind } from "./particle-info";
import { getExperimentHint } from "./particle-info";
import { getClientPoint, isPointInRect } from "./drag-utils";
import { AtomVisualization } from "./components/atom-visualization";
import { ControlsPanel } from "./components/controls-panel";
import { InfoPanel } from "./components/info-panel";
import { ParticleDetail } from "./components/particle-detail";
import { HintBanner } from "./components/hint-banner";
import { ParticleTray } from "./components/particle-tray";
import { ZoomControls } from "./components/zoom-controls";

const toggleClass = (active: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
      : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
  );

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

export function BuildAnAtom() {
  const [atom, setAtom] = useState<AtomState>(HYDROGEN_ATOM);
  const [selectedParticle, setSelectedParticle] = useState<ParticleKind | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragActive, setIsDragActive] = useState(false);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((particle: "proton" | "neutron" | "electron", delta: 1 | -1) => {
    setAtom((prev) => {
      const key = particle === "proton" ? "protons" : particle === "neutron" ? "neutrons" : "electrons";
      const next = Math.max(0, prev[key] + delta);
      if (next === prev[key]) return prev;
      const changeKind: ChangeKind = `${particle}${delta > 0 ? "+" : "-"}` as ChangeKind;
      setHint(getExperimentHint(changeKind));
      return { ...prev, [key]: next };
    });
  }, []);

  const handleDropParticle = useCallback(
    (kind: ParticleKind, event: MouseEvent | TouchEvent | PointerEvent) => {
      const rect = dropZoneRef.current?.getBoundingClientRect();
      const point = getClientPoint(event);
      if (!rect || !point || !isPointInRect(point, rect)) return;
      handleChange(kind, 1);
    },
    [handleChange]
  );

  const handleReset = () => {
    setAtom(HYDROGEN_ATOM);
    setHint(null);
    setSelectedParticle(null);
    setZoom(1);
  };

  return (
    <div className={cn(largeText && "text-[1.0625rem] leading-relaxed", highContrast && "contrast-125 saturate-150")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Accessibility settings" className="flex items-center gap-2">
          <button type="button" aria-pressed={largeText} onClick={() => setLargeText((v) => !v)} className={toggleClass(largeText)}>
            <Type className="h-3.5 w-3.5" strokeWidth={1.75} />
            Large text
          </button>
          <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast((v) => !v)} className={toggleClass(highContrast)}>
            <Contrast className="h-3.5 w-3.5" strokeWidth={1.75} />
            High contrast
          </button>
        </div>
        <Button variant="secondary" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset to Hydrogen
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: visualization */}
        <div className="flex flex-col gap-3">
          <div
            ref={dropZoneRef}
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-card border bg-white/40 p-4 transition-colors dark:bg-white/[0.02]",
              isDragActive
                ? "border-dashed border-pine-500 bg-pine-50/60 dark:border-pine-300 dark:bg-pine-900/20"
                : "border-line dark:border-line-dark"
            )}
          >
            <div
              className="aspect-square w-full max-w-[420px] transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <AtomVisualization atom={atom} onSelectParticle={setSelectedParticle} />
            </div>

            {isDragActive ? (
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-pine-600 px-3 py-1 text-xs font-medium text-paper dark:bg-pine-300 dark:text-chalkboard">
                Drop here to add
              </p>
            ) : null}
          </div>

          <div className="flex justify-center">
            <ZoomControls
              zoom={zoom}
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))))}
              onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, Number((z - ZOOM_STEP).toFixed(2))))}
              onReset={() => setZoom(1)}
            />
          </div>

          <ParticleTray onDropParticle={handleDropParticle} onDragStateChange={setIsDragActive} />
        </div>

        {/* Right: info + controls */}
        <div className="flex flex-col gap-4">
          <InfoPanel atom={atom} />
          <ParticleDetail selected={selectedParticle} onClose={() => setSelectedParticle(null)} />
          <HintBanner hint={hint} />
          <ControlsPanel onChange={handleChange} protons={atom.protons} neutrons={atom.neutrons} electrons={atom.electrons} />
        </div>
      </div>
    </div>
  );
}
