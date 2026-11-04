"use client";

import { useCallback, useRef, useState } from "react";
import { Box, Contrast, Layers, RotateCcw, Tag, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, SimulationReadouts } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { HYDROGEN_ATOM, changeParticle, chargeSuffix, clampAtom, massNumber, netCharge, sameAtom, type AtomState } from "./atom-model";
import { getElement } from "./elements";
import { describeChange } from "./explain";
import { commonNeutrons } from "./isotopes";
import type { AtomPreset } from "./presets";
import { distribute, shellFeedback, type ShellModelId } from "./shells";
import type { ParticleKind, ChangeKind } from "./particle-info";
import { getExperimentHint } from "./particle-info";
import { getClientPoint, isPointInRect } from "./drag-utils";
import { AtomStage, type AtomView } from "./components/atom-stage";
import { ChangeNote } from "./components/change-note";
import { ControlsPanel } from "./components/controls-panel";
import { ElementPicker } from "./components/element-picker";
import { ExperimentsPanel } from "./components/experiments-panel";
import { HintBanner } from "./components/hint-banner";
import { InfoPanel } from "./components/info-panel";
import { ParticleLegend } from "./components/legend";
import { ModelNote } from "./components/model-note";
import { ParticleDetail } from "./components/particle-detail";
import { ParticleTray } from "./components/particle-tray";
import { PresetPicker } from "./components/preset-picker";
import { ShellPanel } from "./components/shell-panel";
import { ZoomControls } from "./components/zoom-controls";

const toggleClass = (active: boolean) =>
  cn(
    "flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "border-pine-500 bg-pine-600 text-paper dark:border-pine-300 dark:bg-pine-300 dark:text-chalkboard"
      : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
  );

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.2;
const ZOOM_STEP = 0.2;

type PanelTab = "build" | "info" | "shells" | "experiments";
const PANEL_TABS: { id: PanelTab; label: string }[] = [
  { id: "build", label: "Build" },
  { id: "info", label: "Info" },
  { id: "shells", label: "Shells" },
  { id: "experiments", label: "Experiments" },
];

export function BuildAnAtom() {
  const [atom, setAtom] = useState<AtomState>(HYDROGEN_ATOM);
  const atomRef = useRef<AtomState>(HYDROGEN_ATOM);
  const [changes, setChanges] = useState<string[]>([]);
  const [shellMessage, setShellMessage] = useState<string | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<ParticleKind | null>(null);
  const [selectedShell, setSelectedShell] = useState<number | null>(null);
  const [shellModel, setShellModel] = useState<ShellModelId>("intro");
  const [view, setView] = useState<AtomView>("3d");
  const [showShellLabels, setShowShellLabels] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [tab, setTab] = useState<PanelTab>("build");

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const shellModelRef = useRef(shellModel);
  shellModelRef.current = shellModel;

  /**
   * The one place the atom changes. It reads the latest atom from a ref, not from render state, so many fast
   * clicks in a row each build on the previous result, and every result is forced into the valid range.
   */
  const commit = useCallback((proposed: AtomState): boolean => {
    const prev = atomRef.current;
    const next = clampAtom(proposed);
    if (sameAtom(prev, next)) return false;
    atomRef.current = next;
    setAtom(next);
    setChanges(describeChange(prev, next));
    setShellMessage(prev.electrons !== next.electrons ? shellFeedback(prev.electrons, next.electrons, shellModelRef.current) : null);
    return true;
  }, []);

  const handleChange = useCallback(
    (particle: "proton" | "neutron" | "electron", delta: 1 | -1) => {
      const key = particle === "proton" ? "protons" : particle === "neutron" ? "neutrons" : "electrons";
      if (commit(changeParticle(atomRef.current, key, delta))) {
        setHint(getExperimentHint(`${particle}${delta > 0 ? "+" : "-"}` as ChangeKind));
      }
    },
    [commit]
  );

  const handleDropParticle = useCallback(
    (kind: ParticleKind, event: MouseEvent | TouchEvent | PointerEvent) => {
      const rect = dropZoneRef.current?.getBoundingClientRect();
      const point = getClientPoint(event);
      if (!rect || !point || !isPointInRect(point, rect)) return;
      handleChange(kind, 1);
    },
    [handleChange]
  );

  const handlePickElement = useCallback(
    (z: number) => {
      setActivePresetId(null);
      setHint(null);
      commit({ protons: z, neutrons: commonNeutrons(z), electrons: z });
    },
    [commit]
  );

  const handleLoadPreset = useCallback(
    (preset: AtomPreset) => {
      setActivePresetId(preset.id);
      setHint(null);
      commit(preset.atom);
    },
    [commit]
  );

  const handleResetAtom = useCallback(() => {
    atomRef.current = HYDROGEN_ATOM;
    setAtom(HYDROGEN_ATOM);
    setChanges([]);
    setShellMessage(null);
    setHint(null);
    setSelectedParticle(null);
    setSelectedShell(null);
    setActivePresetId(null);
  }, []);

  const resetCamera = useCallback(() => {
    setZoom(1);
    setResetKey((k) => k + 1);
  }, []);

  const handleReset = () => {
    handleResetAtom();
    resetCamera();
  };

  const handleModelChange = (model: ShellModelId) => {
    setShellModel(model);
    shellModelRef.current = model;
    setShellMessage(null);
  };

  const element = getElement(atom.protons);
  const charge = netCharge(atom);
  const arrangement = distribute(atom.electrons, shellModel).shells.map((s) => s.count).join(", ") || "none";

  return (
    <div className={cn(largeText && "text-[1.0625rem] leading-relaxed", highContrast && "contrast-125 saturate-150")}>
      <SimulationLayout
        stageLabel="Atom model: nucleus and electron shells"
        size="wide"
        aspect={1}
        aspectLg={1.45}
        stageCap="64rem"
        stage={
          <div
            ref={dropZoneRef}
            className={cn(
              "relative h-full w-full overflow-hidden rounded-xl transition-colors",
              isDragActive && "outline-dashed outline-2 -outline-offset-2 outline-pine-500 bg-pine-50/60 dark:outline-pine-300 dark:bg-pine-900/20"
            )}
          >
            <AtomStage
              atom={atom}
              view={view}
              shellModel={shellModel}
              selectedShell={selectedShell}
              showShellLabels={showShellLabels}
              zoom={zoom}
              resetKey={resetKey}
              onSelectParticle={setSelectedParticle}
              onSelectShell={setSelectedShell}
              onNotice={setNotice}
            />

            {isDragActive ? (
              <p className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-pine-600 px-3 py-1 text-sm font-medium text-paper dark:bg-pine-300 dark:text-chalkboard">
                Drop here to add
              </p>
            ) : null}
          </div>
        }
        readouts={
          <SimulationReadouts
            label="Atom"
            items={[
              { id: "el", label: "Element", value: element.symbol },
              { id: "a", label: "Mass number", value: String(massNumber(atom)) },
              { id: "q", label: "Charge", value: charge === 0 ? "0" : chargeSuffix(charge) },
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
              onReset={resetCamera}
            />
            <Button variant="secondary" size="md" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
              Reset atom
            </Button>
          </>
        }
        controls={
          <div className="flex flex-col gap-4">
            <div role="group" aria-label="Accessibility settings" className="flex flex-wrap items-center gap-2">
              <button type="button" aria-pressed={largeText} onClick={() => setLargeText((v) => !v)} className={toggleClass(largeText)}>
                <Type className="h-3.5 w-3.5" strokeWidth={1.75} />
                Large text
              </button>
              <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast((v) => !v)} className={toggleClass(highContrast)}>
                <Contrast className="h-3.5 w-3.5" strokeWidth={1.75} />
                High contrast
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="View options">
              <button type="button" aria-pressed={view === "3d"} onClick={() => setView("3d")} className={toggleClass(view === "3d")}>
                <Box className="h-3.5 w-3.5" strokeWidth={1.75} />
                3D view
              </button>
              <button type="button" aria-pressed={view === "2d"} onClick={() => setView("2d")} className={toggleClass(view === "2d")}>
                <Layers className="h-3.5 w-3.5" strokeWidth={1.75} />
                2D diagram
              </button>
              <button type="button" aria-pressed={showShellLabels} onClick={() => setShowShellLabels((v) => !v)} className={toggleClass(showShellLabels)}>
                <Tag className="h-3.5 w-3.5" strokeWidth={1.75} />
                Shell labels
              </button>
            </div>
            {notice ? (
              <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:bg-amber-500/10 dark:text-amber-100">
                {notice}
              </p>
            ) : null}
            {view === "3d" && !notice ? (
              <p className="text-helper text-ink-soft dark:text-bone-soft">Drag to rotate. Use the zoom buttons, or click the picture and press the arrow keys. Click a shell or particle to learn about it.</p>
            ) : null}

            <div role="tablist" aria-label="Controls" className="grid grid-cols-4 gap-1 rounded-full border border-line p-1 dark:border-line-dark">
              {PANEL_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`atom-tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`atom-panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "min-h-11 rounded-full px-1 text-sm font-medium transition-colors",
                    tab === t.id ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard" : "text-ink-soft hover:bg-ink/5 dark:text-bone-soft dark:hover:bg-bone/10"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`atom-panel-${tab}`} aria-labelledby={`atom-tab-${tab}`} className="flex flex-col gap-4">
              {tab === "build" ? (
                <>
                  <ControlsPanel onChange={handleChange} protons={atom.protons} neutrons={atom.neutrons} electrons={atom.electrons} />
                  <ChangeNote changes={changes} shellMessage={shellMessage} />
                  <HintBanner hint={hint} />
                  <ElementPicker protons={atom.protons} onPick={handlePickElement} />
                  <PresetPicker atom={atom} onLoad={handleLoadPreset} activeId={activePresetId} />
                  <ParticleTray onDropParticle={handleDropParticle} onDragStateChange={setIsDragActive} />
                </>
              ) : null}

              {tab === "info" ? (
                <>
                  <InfoPanel atom={atom} />
                  <ChangeNote changes={changes} shellMessage={shellMessage} />
                  <ParticleDetail selected={selectedParticle} onClose={() => setSelectedParticle(null)} />
                  <section aria-label="Particle key" className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
                    <h3 className="mb-2 font-display text-base font-medium text-ink dark:text-bone">Particle key</h3>
                    <ParticleLegend />
                  </section>
                  <ModelNote />
                </>
              ) : null}

              {tab === "shells" ? (
                <>
                  <ShellPanel electrons={atom.electrons} model={shellModel} onModelChange={handleModelChange} selectedShell={selectedShell} onSelectShell={setSelectedShell} feedback={shellMessage} />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="md" onClick={() => handleChange("electron", 1)} disabled={atom.electrons >= 40}>
                      Add electron
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => handleChange("electron", -1)} disabled={atom.electrons <= 0}>
                      Remove electron
                    </Button>
                  </div>
                  <p className="text-helper text-ink-soft dark:text-bone-soft">
                    Electrons are added to the innermost shell that has room and removed from the outermost shell. Arrangement now: {arrangement}.
                  </p>
                </>
              ) : null}

              {/* Stays mounted (hidden) so experiment progress survives switching to the Build tab to edit the atom. */}
              <div hidden={tab !== "experiments"} className={tab === "experiments" ? "flex flex-col gap-4" : "hidden"}>
                <ExperimentsPanel atom={atom} shellModel={shellModel} onResetAtom={handleResetAtom} />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
