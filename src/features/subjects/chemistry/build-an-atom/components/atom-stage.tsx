"use client";

import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/features/simulation";
import type { AtomState } from "../atom-model";
import type { ShellModelId } from "../shells";
import type { ParticleKind } from "../particle-info";
import { AtomVisualization } from "./atom-visualization";
import { ParticleLegend } from "./legend";

const AtomScene3D = dynamic(() => import("./atom-scene-3d"), {
  ssr: false,
  loading: () => (
    <div role="status" className="flex h-full w-full items-center justify-center text-sm text-ink-soft dark:text-bone-soft">
      Loading 3D atom…
    </div>
  ),
});

export type AtomView = "3d" | "2d";

/** True when the browser can create a WebGL context at all. */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Catches a crash inside the 3D scene so the 2D diagram can take over instead of blanking the page. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface AtomStageProps {
  atom: AtomState;
  view: AtomView;
  shellModel: ShellModelId;
  selectedShell: number | null;
  showShellLabels: boolean;
  zoom: number;
  resetKey: number;
  onSelectParticle: (kind: ParticleKind) => void;
  onSelectShell: (n: number | null) => void;
  /** Called with a plain-language message whenever the 3D view cannot be used, and with null when it can. */
  onNotice: (message: string | null) => void;
}

/**
 * The atom picture. Prefers the instanced 3D scene; falls back to the 2D SVG diagram when the
 * learner picks it, WebGL is unavailable, the scene throws, or the graphics context is lost.
 */
export function AtomStage({ atom, view, shellModel, selectedShell, showShellLabels, zoom, resetKey, onSelectParticle, onSelectShell, onNotice }: AtomStageProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [lost, setLost] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setWebgl(detectWebGL()), []);

  const wants3d = view === "3d";
  const notice =
    wants3d && webgl === false
      ? "3D is not available in this browser, so the 2D diagram is shown. Everything else works the same."
      : wants3d && failed
        ? "The 3D view stopped working, so the 2D diagram is shown."
        : wants3d && lost
          ? "The graphics context was lost. Showing the 2D diagram while the 3D view recovers."
          : null;
  useEffect(() => onNotice(notice), [notice, onNotice]);

  const onLost = useCallback(() => setLost(true), []);
  const onRestored = useCallback(() => setLost(false), []);
  const onFail = useCallback(() => setFailed(true), []);

  const show3d = wants3d && webgl === true && !failed;
  const showDiagram = webgl !== null && (!show3d || lost);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-b from-paper to-ink/[0.04] dark:from-chalkboard dark:to-bone/[0.05]">
      {show3d ? (
        <div className="absolute inset-0">
          <SceneBoundary onError={onFail}>
            <AtomScene3D
              atom={atom}
              shellModel={shellModel}
              selectedShell={selectedShell}
              showShellLabels={showShellLabels}
              zoom={zoom}
              resetKey={resetKey}
              reducedMotion={reducedMotion}
              onSelectParticle={onSelectParticle}
              onSelectShell={onSelectShell}
              onContextLost={onLost}
              onContextRestored={onRestored}
            />
          </SceneBoundary>
        </div>
      ) : null}

      {showDiagram ? (
        <div className="absolute inset-0 bg-paper dark:bg-chalkboard" style={{ transform: `scale(${show3d ? 1 : zoom})`, transformOrigin: "center" }}>
          <AtomVisualization atom={atom} onSelectParticle={onSelectParticle} shellModel={shellModel} selectedShell={selectedShell} showShellLabels={showShellLabels} />
        </div>
      ) : null}

      <p className="pointer-events-none absolute left-2 top-2 rounded-full bg-paper/85 px-2 py-0.5 text-label text-ink-soft dark:bg-chalkboard/85 dark:text-bone-soft">
        Simplified model, not to scale
      </p>
      <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg bg-paper/85 px-2 py-1 dark:bg-chalkboard/85">
        <ParticleLegend compact />
      </div>
    </div>
  );
}
