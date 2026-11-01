"use client";

import { useCallback, useRef, useState } from "react";
import { Contrast, RotateCcw, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { HYDROGEN_ATOM, type AtomState } from "./atom-model";
import { getElement } from "./elements";
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
    "flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
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
      </div>

      <SimulationLayout
        stageLabel="Atom model: nucleus and electron shells"
        aspect={1}
        stageCap="26rem"
        stage={
          <div
            ref={dropZoneRef}
            className={cn(
              "relative h-full w-full overflow-hidden rounded-xl transition-colors",
              isDragActive && "outline-dashed outline-2 -outline-offset-2 outline-pine-500 bg-pine-50/60 dark:outline-pine-300 dark:bg-pine-900/20"
            )}
          >
            <div className="h-full w-full transition-transform duration-150 ease-out motion-reduce:transition-none" style={{ transform: `scale(${zoom})` }}>
              <AtomVisualization atom={atom} onSelectParticle={setSelectedParticle} />
            </div>

            {isDragActive ? (
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-pine-600 px-3 py-1 text-sm font-medium text-paper dark:bg-pine-300 dark:text-chalkboard">
                Drop here to add
              </p>
            ) : null}
          </div>
        }
        readouts={
          <SimulationReadouts
            label="Atom"
            items={[
              { id: "el", label: "Element", value: getElement(atom.protons).symbol },
              { id: "p", label: "Protons", value: String(atom.protons) },
              { id: "n", label: "Neutrons", value: String(atom.neutrons) },
              { id: "e", label: "Electrons", value: String(atom.electrons) },
            ]}
          />
        }
        actions={
          <>
            <ZoomControls
              zoom={zoom}
              min={ZOOM_MIN}
              max={ZOOM_MAX}
              onZoomIn={() => setZoom((z) => Math.min(ZOOM_MAX, Number((z + ZOOM_STEP).toFixed(2))))}
              onZoomOut={() => setZoom((z) => Math.max(ZOOM_MIN, Number((z - ZOOM_STEP).toFixed(2))))}
              onReset={() => setZoom(1)}
            />
            <Button variant="secondary" size="md" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset to Hydrogen
            </Button>
          </>
        }
        controls={
          <div className="flex flex-col gap-4">
            <ParticleTray onDropParticle={handleDropParticle} onDragStateChange={setIsDragActive} />
            <InfoPanel atom={atom} />
            <ParticleDetail selected={selectedParticle} onClose={() => setSelectedParticle(null)} />
            <HintBanner hint={hint} />
            <ControlsPanel onChange={handleChange} protons={atom.protons} neutrons={atom.neutrons} electrons={atom.electrons} />
          </div>
        }
      />
    </div>
  );
}
