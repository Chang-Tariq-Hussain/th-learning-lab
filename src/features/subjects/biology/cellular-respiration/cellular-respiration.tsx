"use client";

import { useEffect, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { BarChart3, Compass, FlaskConical, ListChecks, Scale, Tag, Wind, Zap, ZoomIn, ZoomOut } from "lucide-react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { arrangeReducer, newArrange } from "../meiosis/activities/model";
import { ArrangePanel, PredictPanel } from "../meiosis/components/activity-panels";
import { Tabs } from "../meiosis/components/tabs";
import { useBeatClock, useClockMeta, type Speed } from "../meiosis/hooks/use-beat-timeline";
import { JourneyNav, LabLink } from "../cellular-energy-shared/journey-nav";
import { QuizPanel } from "../cellular-energy-shared/quiz-panel";
import { SortPanel } from "../cellular-energy-shared/sort-panel";
import { CE_STYLE, card, eyebrow } from "../cellular-energy-shared/style";
import { StepStrip, Transport, transportKeys } from "../cellular-energy-shared/transport";
import { ARRANGE_LABELS, CHALLENGE_BANK, PREDICT_EVENTS, SORT_LOCATION, blockingEvent } from "./activities";
import { AerobicPanel, EquationPanel, YieldExplorer } from "./components/workspaces";
import { RespirationStage, type Level } from "./components/respiration-stage";
import type { Tracer } from "./components/world";
import { useChemiosmosis } from "./hooks-chemiosmosis";
import { BEAT_COUNT, BEAT_STAGE, CYCLE_NODES, STAGES, STAGE_FIRST_BEAT, carbonLedger, carbonTotal } from "./model";

type Workspace = "lab" | "yield" | "equation" | "aerobic" | "practice";
type Mode = "explore" | "predict";
type Practice = "arrange" | "location" | "challenge";

const WS: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "lab", label: "Respiration lab", icon: <FlaskConical className="h-4 w-4" aria-hidden="true" /> },
  { id: "yield", label: "ATP yield", icon: <BarChart3 className="h-4 w-4" aria-hidden="true" /> },
  { id: "equation", label: "Overall equation", icon: <Scale className="h-4 w-4" aria-hidden="true" /> },
  { id: "aerobic", label: "Aerobic vs no oxygen", icon: <Wind className="h-4 w-4" aria-hidden="true" /> },
  { id: "practice", label: "Practice & challenge", icon: <ListChecks className="h-4 w-4" aria-hidden="true" /> },
];
const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  { id: "explore", label: "Explore", icon: <Compass className="h-4 w-4" aria-hidden="true" /> },
  { id: "predict", label: "Predict", icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
];
const PR: { id: Practice; label: string }[] = [
  { id: "arrange", label: "Arrange the stages" },
  { id: "location", label: "Where does it happen?" },
  { id: "challenge", label: "Challenge" },
];
const LEVELS: { id: Level; label: string }[] = [
  { id: "cell", label: "Whole cell" },
  { id: "mito", label: "Mitochondrion" },
  { id: "molecular", label: "Molecular" },
];
const TRACERS: { id: Tracer; label: string }[] = [
  { id: "none", label: "No overlay" },
  { id: "carbon", label: "Carbon" },
  { id: "electrons", label: "Electrons" },
  { id: "energy", label: "Energy (ATP)" },
];

const chip = (on: boolean) =>
  cn(
    "min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
  );

const LOC_COLOR: Record<string, string> = { cytosol: "var(--ce-fuel)", matrix: "var(--ce-adp)", inner: "var(--ce-work)" };

/**
 * Cellular Respiration — the detailed lab. One beat clock (30 beats) drives five stages; stage navigation, three zoom
 * levels (cell → mitochondrion → molecule), tracer overlays (carbon, electrons, energy), Explore / Predict modes,
 * an interactive chemiosmosis controller, ATP yield explorer, equation and carbon accounting, aerobic vs fermentation
 * and practice. Pure SVG: no WebGL needed.
 */
export function CellularRespiration() {
  const reduced = usePrefersReducedMotion();
  const [speed, setSpeed] = useState<Speed>(1);
  const clock = useBeatClock(reduced, speed, BEAT_COUNT);
  const { beat, playing } = useClockMeta(clock);
  const stage = BEAT_STAGE[beat]!;
  const st = STAGES[stage]!;
  const local = beat - STAGE_FIRST_BEAT[stage]!;

  const [workspace, setWorkspace] = useState<Workspace>("lab");
  const [mode, setMode] = useState<Mode>("explore");
  const [practice, setPractice] = useState<Practice>("arrange");
  const [level, setLevel] = useState<Level>("molecular");
  const [tracer, setTracer] = useState<Tracer>("none");
  const [showLabels, setShowLabels] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [node, setNode] = useState<string | null>(null);
  const [perGlucose, setPerGlucose] = useState(false);
  const [arrange, dispatchArrange] = useReducer(arrangeReducer, undefined, () => newArrange(9, STAGES.length));

  /* chemiosmosis live controller */
  const [live, setLive] = useState(false);
  const [flow, setFlow] = useState(5);
  const [oxygen, setOxygen] = useState(true);
  const chemi = useChemiosmosis(live && workspace === "lab" && stage === 4 && level === "molecular", reduced, flow, oxygen ? 1 : 0);

  /* predict mode */
  const answered = useRef<Set<string>>(new Set());
  const [log, setLog] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<(typeof PREDICT_EVENTS)[number] | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => {
    if (mode === "predict" && workspace === "lab") {
      clock.gate = (b) => blockingEvent(b, answered.current) === null;
      clock.onBlocked = (b) => (setPending(blockingEvent(b, answered.current)), setChoice(null));
    } else {
      clock.gate = null;
      clock.onBlocked = null;
      setPending(null);
    }
    return () => {
      clock.gate = null;
      clock.onBlocked = null;
    };
  }, [mode, workspace, clock]);
  useEffect(() => {
    if (pending && (beat < pending.beat - 2 || beat >= pending.beat)) setPending(null);
  }, [beat, pending]);
  const resetPredictions = () => {
    answered.current = new Set();
    setLog({});
    setPending(null);
    setChoice(null);
    clock.goTo(0, { immediate: true, ignoreGate: true });
  };

  const playPause = () => (playing ? clock.pause() : clock.play());
  const restart = () => (mode === "predict" ? resetPredictions() : clock.goTo(0, { immediate: true, ignoreGate: true }));
  const goStage = (s: number) => {
    clock.goTo(STAGE_FIRST_BEAT[s]!, { ignoreGate: mode !== "predict" });
    if (level !== "molecular") setLevel("molecular");
  };
  const stageStep = (d: 1 | -1) => goStage(Math.min(STAGES.length - 1, Math.max(0, stage + d)));
  const onKeyDown = (e: KeyboardEvent) => {
    if (workspace !== "lab") return;
    const t = e.target as HTMLElement;
    if (t.closest("input,select,textarea,[role=tab],[role=radio]")) return;
    if (e.shiftKey && e.key === "ArrowRight") (e.preventDefault(), stageStep(1));
    else if (e.shiftKey && e.key === "ArrowLeft") (e.preventDefault(), stageStep(-1));
    else if (e.key === "l" || e.key === "L") setShowLabels((v) => !v);
    else transportKeys(e, { playPause, step: (d) => clock.step(d), restart });
  };

  const finished = beat >= BEAT_COUNT - 1;
  const runState: SimulationRunState | undefined = workspace === "lab" ? (playing ? "running" : finished ? "finished" : beat > 0 ? "paused" : "idle") : undefined;
  const selNode = CYCLE_NODES.find((n) => n.id === node) ?? null;
  const carbon = stage <= 2 ? carbonLedger(stage === 2 ? 2 : stage) : carbonLedger(2);
  const beatDef = st.beats[local]!;

  const stage_ = (
    <RespirationStage clock={clock} level={level} reduced={reduced} showLabels={showLabels} tracer={tracer} onLevel={setLevel} onStage={(s) => clock.goTo(STAGE_FIRST_BEAT[s]!, { ignoreGate: true })} node={node} onNode={(id) => setNode((c) => (c === id ? null : id))} perGlucose={perGlucose} live={live && stage === 4} chemi={{ rot: chemi.rot, gradient: chemi.gradient, atp: chemi.atp, flow }} />
  );

  const actions = (
    <div className="flex w-full flex-col items-center gap-2">
      <Transport
        playing={playing}
        atStart={beat === 0}
        atEnd={finished}
        speed={speed}
        onPlayPause={playPause}
        onStep={(d) => clock.step(d)}
        onRestart={restart}
        onSpeed={setSpeed}
        extra={
          <>
            <Button size="sm" variant="ghost" onClick={() => stageStep(-1)} disabled={stage === 0} aria-label="Previous stage" title="Previous stage (Shift+Left)" data-testid="prev-stage">Prev stage</Button>
            <Button size="sm" variant="ghost" onClick={() => stageStep(1)} disabled={stage === STAGES.length - 1} aria-label="Next stage" title="Next stage (Shift+Right)" data-testid="next-stage">Next stage</Button>
            <Button size="sm" variant={showLabels ? "secondary" : "ghost"} onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} data-testid="labels-toggle" title="Labels (L)"><Tag className="h-4 w-4" aria-hidden="true" />Labels</Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center justify-center gap-1.5" role="radiogroup" aria-label="Zoom level">
        <ZoomOut className="h-4 w-4 text-ink-soft dark:text-bone-soft" aria-hidden="true" />
        {LEVELS.map((l) => <button key={l.id} type="button" role="radio" aria-checked={level === l.id} onClick={() => setLevel(l.id)} className={chip(level === l.id)} data-level={l.id}>{l.label}</button>)}
        <ZoomIn className="h-4 w-4 text-ink-soft dark:text-bone-soft" aria-hidden="true" />
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ lab side panel */
  const predictPanel = (
    <PredictPanel
      event={pending}
      choice={choice}
      answeredCount={Object.keys(log).length}
      correctCount={Object.values(log).filter(Boolean).length}
      total={PREDICT_EVENTS.length}
      onChoose={(id) => {
        if (!pending || choice) return;
        setChoice(id);
        setLog((l) => ({ ...l, [pending.id]: id === pending.correct }));
      }}
      onReveal={() => {
        if (!pending) return;
        answered.current.add(pending.id);
        setPending(null);
        setChoice(null);
        clock.step(1);
      }}
      onReset={resetPredictions}
    />
  );

  const chemiControls = stage === 4 ? (
    <div className={card} data-testid="chemi-controls">
      <p className={eyebrow}>Proton-flow controller</p>
      <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Switch to live mode to control how fast protons flow through ATP synthase. Without oxygen the chain stops pumping and the gradient runs down.</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" variant={live ? "secondary" : "primary"} onClick={() => (setLive((v) => !v), chemi.reset())} aria-pressed={live} data-testid="live-toggle">{live ? "Back to guided steps" : "Take control"}</Button>
        {live ? <Button size="sm" variant={oxygen ? "secondary" : "ghost"} onClick={() => setOxygen((v) => !v)} aria-pressed={oxygen} data-testid="oxygen-toggle">Oxygen: {oxygen ? "available" : "removed"}</Button> : null}
      </div>
      {live ? (
        <div className="mt-2 flex flex-col gap-2 text-sm text-ink dark:text-bone">
          <label className="flex items-center justify-between gap-3">
            <span>H⁺ flow through ATP synthase</span>
            <input type="range" min={0} max={10} value={flow} onChange={(e) => setFlow(Number(e.target.value))} className="w-36 accent-[var(--ce-atp)]" aria-label="Proton flow through ATP synthase" data-testid="flow-slider" />
            <span className="w-5 text-right tabular-nums">{flow}</span>
          </label>
          {reduced ? <Button size="sm" variant="secondary" onClick={chemi.stepProton} data-testid="step-proton">Let one proton through</Button> : null}
          <p className="text-xs text-ink-soft dark:text-bone-soft" data-testid="chemi-readout" aria-live="polite">Gradient {Math.round(chemi.gradient * 100)}% · ATP made {chemi.atp.toFixed(1)} · 8 H⁺ per rotation → 3 ATP</p>
        </div>
      ) : null}
    </div>
  ) : null;

  const labPanel = (
    <div className="flex min-w-0 flex-col gap-3">
      <Tabs items={MODES} value={mode} onChange={(m) => (setMode(m), m === "explore" ? undefined : resetPredictions())} label="Mode" idPrefix="resp-mode" panelId="resp-mode-panel" />
      <div id="resp-mode-panel" role="tabpanel" aria-labelledby={`resp-mode-tab-${mode}`} className="flex min-w-0 flex-col gap-3">
        {mode === "predict" ? predictPanel : null}
        <nav aria-label="Respiration stages" className="grid gap-1" data-testid="stage-nav">
          {STAGES.map((s, i) => (
            <button key={s.id} type="button" onClick={() => goStage(i)} aria-current={i === stage ? "step" : undefined} data-stage={s.id} className={cn("flex min-h-11 items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone", i === stage ? "border-subject-biology bg-subject-biology-soft font-semibold text-ink dark:bg-subject-biology/15 dark:text-bone" : i < stage ? "border-subject-biology/40 text-ink dark:text-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}>
              <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-black" style={{ background: LOC_COLOR[s.location] }}>{i + 1}</span>
              <span className="flex-1">{s.name}</span>
              <span className="text-[11px] text-ink-soft dark:text-bone-soft">{s.locationLabel.split(" (")[0]}</span>
            </button>
          ))}
        </nav>
        <StepStrip steps={st.beats.map((b) => b.title)} beat={local} onGo={(i) => clock.goTo(STAGE_FIRST_BEAT[stage]! + i, { ignoreGate: mode !== "predict" })} label={`${st.name} steps`} />
        <div className={card} data-testid="stage-info">
          <p className={eyebrow}>{st.name} · {st.locationLabel}</p>
          <p className="mt-1 text-base font-semibold text-ink dark:text-bone">{local + 1}. {beatDef.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{beatDef.text}</p>
          <button type="button" className="mt-2 inline-flex min-h-9 items-center text-xs font-medium text-ink-soft underline dark:text-bone-soft" onClick={() => setAdvanced((v) => !v)} aria-expanded={advanced} data-testid="advanced-toggle">{advanced ? "Hide advanced detail" : "Advanced detail"}</button>
          {advanced ? <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{beatDef.advanced}</p> : null}
          <p className="mt-2 text-xs font-medium text-ink-soft dark:text-bone-soft">{st.perGlucose}</p>
        </div>
        {stage === 2 ? (
          <div className={card} data-testid="cycle-info">
            <div className="flex items-center justify-between gap-2">
              <p className={eyebrow}>Citric acid cycle</p>
              <div role="radiogroup" aria-label="Counting unit" className="flex gap-1">
                <button type="button" role="radio" aria-checked={!perGlucose} className={chip(!perGlucose)} onClick={() => setPerGlucose(false)} data-unit="turn">Per turn</button>
                <button type="button" role="radio" aria-checked={perGlucose} className={chip(perGlucose)} onClick={() => setPerGlucose(true)} data-unit="glucose">Per glucose</button>
              </div>
            </div>
            {selNode ? (
              <div className="mt-2 text-sm text-ink dark:text-bone" data-testid="node-info">
                <p className="font-semibold">{selNode.name} ({selNode.carbons} C)</p>
                <p>{selNode.simple}</p>
                <p className="text-xs text-ink-soft dark:text-bone-soft">Produces: {selNode.gives}{advanced ? ` · Enzyme: ${selNode.enzyme}` : ""}</p>
              </div>
            ) : <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Select an intermediate on the cycle for a simple explanation (turn on advanced detail to see enzymes).</p>}
          </div>
        ) : null}
        {chemiControls}
        <div className={card}>
          <p className={eyebrow}>Follow the…</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Overlay">
            {TRACERS.map((t) => <button key={t.id} type="button" role="radio" aria-checked={tracer === t.id} className={chip(tracer === t.id)} onClick={() => { setTracer(t.id); if (t.id !== "none" && level === "molecular") setLevel("mito"); }} data-tracer={t.id}>{t.label}</button>)}
          </div>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft" data-testid="tracer-text">
            {tracer === "carbon" ? "Carbon: glucose carbons leave as CO₂ — 2 in pyruvate oxidation, 4 in the citric acid cycle. None in glycolysis or the electron transport chain." : tracer === "electrons" ? "Electrons: removed from fuel and carried by NADH and FADH₂ to the electron transport chain, ending on oxygen to form water." : tracer === "energy" ? "Energy: ATP is made by substrate-level phosphorylation (cytosol, matrix) and mostly by ATP synthase at the inner membrane. The rest is heat." : "Choose an overlay to trace carbon, electrons or energy across the cell and mitochondrion."}
          </p>
        </div>
        <div className={card} data-testid="carbon-tracker">
          <p className={eyebrow}>Carbon tracker (per glucose)</p>
          <p className="mt-1 text-sm text-ink dark:text-bone">{(stage === 0 ? [{ molecule: "Glucose → pyruvate", count: 2, carbonsEach: 3 }] : carbon).map((r) => `${r.count} × ${r.molecule} (${r.carbonsEach} C)`).join(" + ")} = <strong>{stage === 0 ? 6 : stage === 1 ? carbonTotal(carbonLedger(1)) : 6} C</strong></p>
          <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{stage <= 1 ? `After this stage, ${stage === 0 ? "6" : "2 CO₂ have left and 4 carbons remain in acetyl groups"}.` : "All 6 carbons have left as CO₂ by the end of the citric acid cycle."}</p>
        </div>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ practice panel */
  const practicePanel = (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      <Tabs items={PR} value={practice} onChange={setPractice} label="Practice activity" idPrefix="resp-pr" panelId="resp-pr-panel" />
      <div id="resp-pr-panel" role="tabpanel" aria-labelledby={`resp-pr-tab-${practice}`}>
        {practice === "arrange" ? <ArrangePanel state={arrange} dispatch={dispatchArrange} stages={ARRANGE_LABELS} title="Arrange the stages of cellular respiration" intro="Put the five stages in the order glucose-derived carbon, electrons and energy pass through them." solvedNote="Glycolysis (cytosol) → pyruvate oxidation → citric acid cycle (matrix) → electron transport chain → chemiosmosis (inner membrane)." hint="Hint: the stage that uses oxygen as the final electron acceptor comes before ATP synthase is driven by the gradient it builds." /> : null}
        {practice === "location" ? <SortPanel title="Where does it happen?" intro="Classify each event by location." items={SORT_LOCATION} categories={[{ id: "cytosol", label: "Cytosol" }, { id: "matrix", label: "Mitochondrial matrix" }, { id: "inner", label: "Inner membrane" }]} testId="location-sort" /> : null}
        {practice === "challenge" ? <QuizPanel title="Cellular respiration challenge" intro="Carbon accounting, carriers, yields and oxygen." bank={CHALLENGE_BANK} size={10} testId="resp-challenge" /> : null}
      </div>
    </div>
  );

  const aside = (
    <div className="flex min-w-0 flex-col gap-3">
      <div className={card}>
        <p className={eyebrow}>Where this fits</p>
        <p className="mt-1 text-sm text-ink dark:text-bone">ATP is produced here and spent in cellular work. Review the ATP molecule and its hydrolysis, or the big picture of energy flow.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <LabLink href="/dashboard/biology/atp-energy-release" testId="link-atp">ATP &amp; Energy Release</LabLink>
          <LabLink href="/dashboard/biology/cellular-energy" testId="link-intro">Intro to Cellular Energy</LabLink>
        </div>
      </div>
      <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
        <summary className="min-h-9 cursor-pointer font-medium text-ink dark:text-bone">About this model and keyboard shortcuts</summary>
        <p className="mt-2">Simplified and not to scale, drawn as SVG (no WebGL needed). Stage locations are for typical eukaryotic cells; in prokaryotes glycolysis and the cycle occur in the cytoplasm and the chain is in the plasma membrane. Yields are per glucose unless a quantity says per turn or per pyruvate; the 30–32 ATP figure is an estimate. Electrons follow a fixed route through the protein complexes, not random paths.</p>
        <p className="mt-2">Keys: Left / Right = step, Shift + Left / Right = previous / next stage, Space = play or pause, R = restart, L = labels. Parts with a button role can be focused with Tab and selected with Enter.</p>
      </details>
    </div>
  );

  const lab = (
    <SimulationLayout
      size="wide"
      stageLabel="Cellular respiration laboratory"
      aspect={960 / 600}
      stageCap="76rem"
      runState={runState}
      statusDetail="All five stages are complete."
      stage={stage_}
      readouts={<p className="line-clamp-2 min-h-10 text-center text-sm font-medium leading-5 text-ink dark:text-bone" data-testid="beat-caption" aria-live={playing ? "off" : "polite"}>{level === "molecular" ? `Stage ${stage + 1} · ${beatDef.title}` : `${st.name} happens in the ${st.locationLabel.toLowerCase()}.`}</p>}
      actions={actions}
      controls={labPanel}
      explanation={aside}
    />
  );

  return (
    <div className="ce-root py-2" data-testid="respiration-lab" onKeyDown={onKeyDown}>
      <style>{CE_STYLE}</style>
      <JourneyNav current="respiration" className="mb-3" />
      <Tabs items={WS} value={workspace} onChange={setWorkspace} label="Cellular respiration sections" idPrefix="resp-ws" panelId="resp-ws-panel" className="mb-3" cols="grid-cols-2 sm:grid-cols-5" />
      <div id="resp-ws-panel" role="tabpanel" aria-labelledby={`resp-ws-tab-${workspace}`}>
        {workspace === "lab" ? lab : null}
        {workspace === "yield" ? <YieldExplorer /> : null}
        {workspace === "equation" ? <EquationPanel /> : null}
        {workspace === "aerobic" ? <AerobicPanel /> : null}
        {workspace === "practice" ? practicePanel : null}
      </div>
      {workspace !== "lab" ? <div className="mx-auto mt-4 max-w-5xl">{aside}</div> : null}
    </div>
  );
}
