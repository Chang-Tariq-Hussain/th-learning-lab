"use client";

import { useCallback, useMemo, useReducer, useState, type KeyboardEvent } from "react";
import { Atom, BatteryCharging, FlaskConical, ListChecks, Maximize2, RefreshCw, Tag, Wrench, ZoomIn, ZoomOut } from "lucide-react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { arrangeReducer, newArrange } from "../meiosis/activities/model";
import { ArrangePanel } from "../meiosis/components/activity-panels";
import { Tabs } from "../meiosis/components/tabs";
import { useBeatClock, useClockMeta, type Speed } from "../meiosis/hooks/use-beat-timeline";
import { JourneyNav, LabLink } from "../cellular-energy-shared/journey-nav";
import { QuizPanel } from "../cellular-energy-shared/quiz-panel";
import { CE_STYLE, card, eyebrow } from "../cellular-energy-shared/style";
import { StepStrip, Transport, transportKeys } from "../cellular-energy-shared/transport";
import { CycleStage } from "./components/cycle-stage";
import { HydrolysisStage } from "./components/hydrolysis-stage";
import { MoleculeView } from "./components/molecule-view";
import { WorkStage } from "./components/work-stage";
import {
  CHALLENGE_BANK,
  COMPARE_BANK,
  CYCLE_ARRANGE_LABELS,
  CYCLE_STEPS,
  DELTA_G_CELL,
  DELTA_G_STANDARD,
  HYDROLYSIS_BEATS,
  IDENTIFY,
  NET_CHARGE,
  PARTS,
  PART_ORDER,
  PHOSPHATE_COUNT,
  PREDICT_BANK,
  REGENERATION_SOURCES,
  WORK,
  WORK_BANK,
  atpFraction,
  type MoleculeKind,
  type PartId,
  type WorkId,
} from "./model";

type Workspace = "molecule" | "hydrolysis" | "cycle" | "work" | "practice";
type Practice = "identify" | "compare" | "predict" | "arrange" | "work" | "challenge";
type View = "ATP" | "ADP" | "Compare";

const WS: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "molecule", label: "ATP laboratory", icon: <Atom className="h-4 w-4" aria-hidden="true" /> },
  { id: "hydrolysis", label: "Hydrolysis", icon: <FlaskConical className="h-4 w-4" aria-hidden="true" /> },
  { id: "cycle", label: "ATP cycle", icon: <RefreshCw className="h-4 w-4" aria-hidden="true" /> },
  { id: "work", label: "Cellular work", icon: <Wrench className="h-4 w-4" aria-hidden="true" /> },
  { id: "practice", label: "Practice & challenge", icon: <ListChecks className="h-4 w-4" aria-hidden="true" /> },
];
const PR: { id: Practice; label: string }[] = [
  { id: "identify", label: "Identify structure" },
  { id: "compare", label: "ATP vs ADP" },
  { id: "predict", label: "Predict" },
  { id: "arrange", label: "Arrange the cycle" },
  { id: "work", label: "Cellular work" },
  { id: "challenge", label: "Challenge" },
];

const chip = (on: boolean) =>
  cn(
    "min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
  );

/**
 * ATP & Energy Release — a free-exploration lab (no single stage navigator): a pseudo-3D molecule laboratory, a stepped
 * hydrolysis animation with a free-energy diagram and energy coupling, the ATP cycle with regeneration, four cellular-work
 * examples and a practice set. Pure SVG, so it works without WebGL.
 */
export function AtpEnergyRelease() {
  const reduced = usePrefersReducedMotion();
  const [speed, setSpeed] = useState<Speed>(1);
  const [workspace, setWorkspace] = useState<Workspace>("molecule");
  const [practice, setPractice] = useState<Practice>("identify");
  const [showLabels, setShowLabels] = useState(true);
  const [advanced, setAdvanced] = useState(false);

  /* molecule */
  const [view, setView] = useState<View>("ATP");
  const [rot, setRot] = useState({ ry: -0.35, rx: 0.18 });
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [hiP, setHiP] = useState(false);
  const rotate = useCallback((dy: number, dx: number) => setRot((r) => ({ ry: r.ry + dy, rx: Math.max(-1.1, Math.min(1.1, r.rx + dx)) })), []);
  const resetView = () => (setRot({ ry: -0.35, rx: 0.18 }), setZoom(1), setSelected(null), setHiP(false));

  /* clocks: one per animated workspace so each keeps its own position */
  const hydro = useBeatClock(reduced, speed, HYDROLYSIS_BEATS.length);
  const cycle = useBeatClock(reduced, speed, CYCLE_STEPS.length);
  const work = useBeatClock(reduced, speed, 5);
  const hm = useClockMeta(hydro);
  const cm = useClockMeta(cycle);
  const wm = useClockMeta(work);
  const [workId, setWorkId] = useState<WorkId>("pump");
  const ex = WORK.find((w) => w.id === workId)!;

  /* cycle controls */
  const [supply, setSupply] = useState(6);
  const [demand, setDemand] = useState(4);
  const fraction = atpFraction(supply, demand);

  /* practice */
  const [arrange, dispatchArrange] = useReducer(arrangeReducer, undefined, () => newArrange(5, CYCLE_STEPS.length));
  const [idIndex, setIdIndex] = useState(0);
  const [idState, setIdState] = useState<{ ok: boolean | null; score: number; done: boolean }>({ ok: null, score: 0, done: false });
  const idQ = IDENTIFY[idIndex]!;

  const active = workspace === "hydrolysis" ? { clock: hydro, meta: hm, count: HYDROLYSIS_BEATS.length } : workspace === "cycle" ? { clock: cycle, meta: cm, count: CYCLE_STEPS.length } : workspace === "work" ? { clock: work, meta: wm, count: 5 } : practice === "predict" && workspace === "practice" ? { clock: hydro, meta: hm, count: HYDROLYSIS_BEATS.length } : practice === "arrange" && workspace === "practice" ? { clock: cycle, meta: cm, count: CYCLE_STEPS.length } : practice === "work" && workspace === "practice" ? { clock: work, meta: wm, count: 5 } : null;

  const playPause = () => {
    if (!active) return;
    active.meta.playing ? active.clock.pause() : active.clock.play();
  };
  const restart = () => active?.clock.goTo(0, { immediate: true, ignoreGate: true });
  const onKeyDown = (e: KeyboardEvent) => active && transportKeys(e, { playPause, step: (d) => active.clock.step(d), restart });

  const animated = active !== null;
  const runState: SimulationRunState | undefined = animated ? (active.meta.playing ? "running" : active.meta.beat >= active.count - 1 ? "finished" : active.meta.beat > 0 ? "paused" : "idle") : undefined;

  const identifying = workspace === "practice" && practice === "identify";
  const onPick = (id: PartId) => {
    if (identifying) {
      if (idState.ok !== null || idState.done) return;
      setSelected(id);
      setIdState((s) => ({ ...s, ok: id === idQ.target, score: s.score + (id === idQ.target ? 1 : 0) }));
      return;
    }
    setSelected((s) => (s === id ? null : id));
  };

  const molKinds: MoleculeKind[] = identifying ? [idQ.molecule] : view === "Compare" ? ["ATP", "ADP"] : [view];

  /* ------------------------------------------------------------------------------ stage */
  let stage: React.ReactNode;
  let label = "ATP laboratory";
  if (workspace === "hydrolysis" || (workspace === "practice" && practice === "predict")) {
    stage = <HydrolysisStage clock={hydro} showLabels={showLabels} />;
    label = "ATP hydrolysis animation";
  } else if (workspace === "cycle" || (workspace === "practice" && practice === "arrange")) {
    stage = <CycleStage clock={cycle} showLabels={showLabels} supply={supply} demand={demand} fraction={fraction} />;
    label = "ATP cycle";
  } else if (workspace === "work" || (workspace === "practice" && practice === "work")) {
    stage = <WorkStage id={workId} clock={work} showLabels={showLabels} />;
    label = "Cellular work";
  } else {
    stage = <MoleculeView kinds={molKinds} ry={rot.ry} rx={rot.rx} zoom={zoom} selected={selected} highlightPhosphates={hiP} showLabels={showLabels} hideNames={identifying && idState.ok === null} onPick={onPick} onRotate={rotate} />;
  }

  /* ------------------------------------------------------------------------------ readout + actions */
  const readout = (() => {
    if (workspace === "hydrolysis") return `${hm.beat + 1}. ${HYDROLYSIS_BEATS[hm.beat]!.title}`;
    if (workspace === "cycle") return `${cm.beat + 1}. ${CYCLE_STEPS[cm.beat]!.label}`;
    if (workspace === "work") return `${ex.title} — ${wm.beat + 1}. ${ex.beats[wm.beat]!.title}`;
    if (identifying) return idQ.prompt;
    if (workspace === "molecule") return selected ? `${PARTS[selected].name}: ${PARTS[selected].blurb}` : "Drag to rotate. Select any part for details.";
    return "Practice: answer, then use the lab above to check.";
  })();

  const actions = animated ? (
    <Transport
      playing={active.meta.playing}
      atStart={active.meta.beat === 0}
      atEnd={active.meta.beat >= active.count - 1}
      speed={speed}
      onPlayPause={playPause}
      onStep={(d) => active.clock.step(d)}
      onRestart={restart}
      onSpeed={setSpeed}
      extra={
        <Button size="sm" variant={showLabels ? "secondary" : "ghost"} onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} data-testid="labels-toggle" title="Labels (L)">
          <Tag className="h-4 w-4" aria-hidden="true" />
          Labels
        </Button>
      }
    />
  ) : (
    <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Molecule view controls">
      <label className="flex items-center gap-2 text-xs text-ink-soft dark:text-bone-soft">
        Rotate
        <input type="range" min={-3.14} max={3.14} step={0.02} value={Math.max(-3.14, Math.min(3.14, rot.ry))} onChange={(e) => setRot((r) => ({ ...r, ry: Number(e.target.value) }))} aria-label="Rotate the molecule around the vertical axis" data-testid="rotate-slider" className="w-28 accent-[var(--ce-atp)]" />
      </label>
      <Button size="sm" variant="ghost" onClick={() => setZoom((z) => Math.max(0.7, z / 1.2))} aria-label="Zoom out" data-testid="zoom-out">
        <ZoomOut className="h-4 w-4" aria-hidden="true" />
      </Button>
      <span className="min-w-10 text-center text-xs tabular-nums text-ink-soft dark:text-bone-soft" data-testid="zoom-level">{zoom.toFixed(1)}×</span>
      <Button size="sm" variant="ghost" onClick={() => setZoom((z) => Math.min(2.2, z * 1.2))} aria-label="Zoom in" data-testid="zoom-in">
        <ZoomIn className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button size="sm" variant={hiP ? "secondary" : "ghost"} onClick={() => setHiP((v) => !v)} aria-pressed={hiP} data-testid="highlight-phosphates">
        Highlight phosphates
      </Button>
      <Button size="sm" variant={showLabels ? "secondary" : "ghost"} onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} data-testid="labels-toggle">
        <Tag className="h-4 w-4" aria-hidden="true" />
        Labels
      </Button>
      <Button size="sm" variant="ghost" onClick={resetView} data-testid="reset-view">
        <Maximize2 className="h-4 w-4" aria-hidden="true" />
        Reset view
      </Button>
    </div>
  );

  /* ------------------------------------------------------------------------------ side panels */
  const moleculePanel = (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Molecule" className="flex flex-wrap gap-1.5">
        {(["ATP", "ADP", "Compare"] as View[]).map((v) => (
          <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => (setView(v), setSelected(null))} className={chip(view === v)} data-view={v}>
            {v === "Compare" ? "Compare ATP and ADP" : v}
          </button>
        ))}
      </div>
      <div className={card} data-testid="part-info">
        {selected ? (
          <>
            <p className={eyebrow}>{PARTS[selected].group === "phosphate" ? "Phosphate group" : PARTS[selected].group === "base" ? "Nitrogenous base" : "Sugar"}</p>
            <p className="mt-1 text-base font-semibold text-ink dark:text-bone">{PARTS[selected].name}</p>
            <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">{PARTS[selected].detail}</p>
          </>
        ) : (
          <p className="text-sm text-ink-soft dark:text-bone-soft">Select adenine, ribose or any phosphate on the model. Use <strong>Highlight phosphates</strong> to see the three phosphates of ATP and the terminal one that hydrolysis removes.</p>
        )}
      </div>
      <div className={card}>
        <p className={eyebrow}>{view === "Compare" ? "ATP vs ADP" : view}</p>
        <table className="mt-2 w-full text-sm">
          <caption className="sr-only">Comparison of ATP and ADP</caption>
          <thead>
            <tr className="text-left text-xs text-ink-soft dark:text-bone-soft">
              <th scope="col" className="pb-1 font-medium">Feature</th>
              <th scope="col" className="pb-1 font-medium">ATP</th>
              <th scope="col" className="pb-1 font-medium">ADP</th>
            </tr>
          </thead>
          <tbody className="text-ink dark:text-bone">
            <tr><th scope="row" className="py-0.5 pr-2 text-left font-normal">Phosphate groups</th><td>{PHOSPHATE_COUNT.ATP}</td><td>{PHOSPHATE_COUNT.ADP}</td></tr>
            <tr><th scope="row" className="py-0.5 pr-2 text-left font-normal">Net charge (cell pH)</th><td>about {NET_CHARGE.ATP}</td><td>about {NET_CHARGE.ADP}</td></tr>
            <tr><th scope="row" className="py-0.5 pr-2 text-left font-normal">Adenosine part</th><td colSpan={2}>adenine + ribose (same)</td></tr>
            <tr><th scope="row" className="py-0.5 pr-2 text-left font-normal">With H₂O / Pi</th><td>ATP + H₂O → ADP + Pi</td><td>ADP + Pi → ATP</td></tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Parts shown: {PART_ORDER[view === "ADP" ? "ADP" : "ATP"].map((p) => PARTS[p].name).join(", ")}.</p>
      </div>
    </div>
  );

  const stepCard = (title: string, text: string, adv?: string) => (
    <div className={card} data-testid="beat-info">
      <p className={eyebrow}>{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink dark:text-bone">{text}</p>
      {adv ? (
        <>
          <button type="button" className="mt-2 inline-flex min-h-9 items-center text-xs font-medium text-ink-soft underline dark:text-bone-soft" onClick={() => setAdvanced((v) => !v)} aria-expanded={advanced} data-testid="advanced-toggle">
            {advanced ? "Hide advanced detail" : "Advanced detail"}
          </button>
          {advanced ? <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{adv}</p> : null}
        </>
      ) : null}
    </div>
  );

  const hydrolysisPanel = (
    <div className="flex flex-col gap-3">
      <StepStrip steps={HYDROLYSIS_BEATS.map((b) => b.short)} beat={hm.beat} onGo={(i) => hydro.goTo(i)} label="Hydrolysis steps" />
      {stepCard(`Step ${hm.beat + 1} of ${HYDROLYSIS_BEATS.length}`, HYDROLYSIS_BEATS[hm.beat]!.text, HYDROLYSIS_BEATS[hm.beat]!.advanced)}
      <div className={card}>
        <p className={eyebrow}>Free energy of ATP hydrolysis</p>
        <p className="mt-1 text-sm text-ink dark:text-bone">ΔG°′ ≈ {DELTA_G_STANDARD} kJ/mol (standard) · in cells ≈ {DELTA_G_CELL[0]} to {DELTA_G_CELL[1]} kJ/mol</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">The energy is not stored in one special bond. Breaking bonds costs energy; the overall reaction is favourable because ADP + Pi are more stable than ATP + H₂O.</p>
      </div>
    </div>
  );

  const cyclePanel = (
    <div className="flex flex-col gap-3">
      <StepStrip steps={["ATP", "Hydrolysis", "ADP + Pi", "Energy in", "Regenerated"]} beat={cm.beat} onGo={(i) => cycle.goTo(i)} label="ATP cycle steps" />
      {stepCard(`Step ${cm.beat + 1} of ${CYCLE_STEPS.length}`, CYCLE_STEPS[cm.beat]!.text)}
      <div className={card}>
        <p className={eyebrow}>Recycling model</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Simplified: change how fast ATP is regenerated and how fast the cell spends it. Without regeneration the ATP pool runs down — ATP is a carrier, not a long-term store.</p>
        {([["Regeneration (energy input)", supply, setSupply, "supply"], ["Cellular work (demand)", demand, setDemand, "demand"]] as const).map(([name, v, set, id]) => (
          <label key={id} className="mt-2 flex items-center justify-between gap-3 text-sm text-ink dark:text-bone">
            <span>{name}</span>
            <input type="range" min={0} max={10} step={1} value={v} onChange={(e) => set(Number(e.target.value))} data-testid={`slider-${id}`} className="w-40 accent-[var(--ce-atp)]" aria-label={name} />
            <span className="w-5 text-right tabular-nums">{v}</span>
          </label>
        ))}
        <p className="mt-2 text-sm font-medium text-ink dark:text-bone" data-testid="pool-readout" aria-live="polite">
          {supply === 0 ? "No regeneration: the ATP pool collapses within moments." : demand === 0 ? "No demand: nearly all adenine nucleotides stay as ATP." : `About ${Math.round(fraction * 100)}% of the pool is ATP.`}
        </p>
      </div>
      <div className={card}>
        <p className={eyebrow}>How ATP is regenerated</p>
        <ul className="mt-1 flex flex-col gap-1.5 text-sm text-ink dark:text-bone">
          {REGENERATION_SOURCES.map((r) => (
            <li key={r.name}>
              <strong>{r.name}</strong> — <span className="text-ink-soft dark:text-bone-soft">{r.where}. {r.note}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <LabLink href="/dashboard/biology/cellular-respiration" testId="link-respiration">Open the Cellular Respiration lab</LabLink>
        </div>
      </div>
    </div>
  );

  const workPanel = (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Cellular work example" className="flex flex-wrap gap-1.5">
        {WORK.map((w) => (
          <button key={w.id} type="button" role="radio" aria-checked={workId === w.id} onClick={() => (setWorkId(w.id), work.goTo(0, { immediate: true, ignoreGate: true }))} className={chip(workId === w.id)} data-work={w.id}>
            {w.title.split(" — ")[0]}
          </button>
        ))}
      </div>
      <StepStrip steps={ex.beats.map((b) => b.title)} beat={wm.beat} onGo={(i) => work.goTo(i)} label="Steps" />
      {stepCard(ex.title, ex.beats[wm.beat]!.text)}
      <div className={card}>
        <p className={eyebrow}>How ATP is coupled</p>
        <p className="mt-1 text-sm text-ink dark:text-bone">{ex.coupling}</p>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{ex.summary}</p>
      </div>
    </div>
  );

  const idDone = idState.done;
  const identifyPanel = (
    <div className={card} data-testid="identify-panel">
      <p className={eyebrow}>Identify the structure</p>
      {idDone ? (
        <>
          <p className="mt-2 text-lg font-semibold text-ink dark:text-bone">{idState.score} of {IDENTIFY.length} correct</p>
          <Button className="mt-3" variant="secondary" onClick={() => (setIdIndex(0), setIdState({ ok: null, score: 0, done: false }), setSelected(null))}>Try again</Button>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Question {idIndex + 1} of {IDENTIFY.length}. Click the part on the model above.</p>
          <p className="mt-2 text-sm font-semibold text-ink dark:text-bone" data-testid="identify-prompt">{idQ.prompt}</p>
          {idState.ok !== null ? (
            <div role="status" aria-live="polite" className={cn("mt-3 rounded-xl border px-3 py-2 text-sm", idState.ok ? "border-subject-biology/50 bg-subject-biology-soft dark:bg-subject-biology/10" : "border-amber-500/60 bg-amber-50 dark:bg-amber-500/10")} data-testid="identify-feedback">
              <p className="font-semibold">{idState.ok ? "Correct" : `Not quite — it is the ${PARTS[idQ.target].name}.`}</p>
              <p className="mt-1">{idQ.why}</p>
              <Button className="mt-2" size="sm" variant="secondary" onClick={() => (idIndex + 1 >= IDENTIFY.length ? setIdState((s) => ({ ...s, done: true })) : (setIdIndex((i) => i + 1), setIdState((s) => ({ ...s, ok: null })), setSelected(null)))} data-testid="identify-next">
                {idIndex + 1 >= IDENTIFY.length ? "See score" : "Next"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );

  const practicePanel = (
    <div className="flex flex-col gap-3">
      <Tabs items={PR} value={practice} onChange={(p) => (setPractice(p), setSelected(null))} label="Practice activity" idPrefix="atp-pr" panelId="atp-pr-panel" cols="grid-cols-2 sm:grid-cols-3" />
      <div id="atp-pr-panel" role="tabpanel" aria-labelledby={`atp-pr-tab-${practice}`} className="flex flex-col gap-3">
        {practice === "identify" ? identifyPanel : null}
        {practice === "compare" ? <QuizPanel title="ATP versus ADP" intro="Compare the two molecules." bank={COMPARE_BANK} size={5} testId="compare-quiz" /> : null}
        {practice === "predict" ? <QuizPanel title="Predict what happens" intro="Commit to a prediction, then step through the hydrolysis animation to check it." bank={PREDICT_BANK} size={5} testId="predict-quiz" /> : null}
        {practice === "arrange" ? (
          <ArrangePanel state={arrange} dispatch={dispatchArrange} stages={CYCLE_ARRANGE_LABELS} title="Arrange the ATP cycle" intro="Put the five steps of the ATP cycle in order. Tap a card to place it; use a placed card's arrows to move it." solvedNote="ATP hydrolysis releases usable free energy for work; regeneration needs an energy input — that is why the cycle never stops." hint="Hint: ATP is used first, then ADP and Pi are released, energy is added, and ATP comes back." />
        ) : null}
        {practice === "work" ? (
          <>
            <div role="radiogroup" aria-label="Cellular work example shown" className="flex flex-wrap gap-1.5">
              {WORK.map((w) => (
                <button key={w.id} type="button" role="radio" aria-checked={workId === w.id} onClick={() => (setWorkId(w.id), work.goTo(0, { immediate: true, ignoreGate: true }))} className={chip(workId === w.id)}>
                  {w.title.split(" — ")[0]}
                </button>
              ))}
            </div>
            <QuizPanel title="Identify cellular work" intro="Which processes use ATP, and how?" bank={WORK_BANK} size={5} testId="work-quiz" />
          </>
        ) : null}
        {practice === "challenge" ? <QuizPanel title="ATP challenge" intro="Mixed, harder questions with explanations." bank={CHALLENGE_BANK} size={8} testId="challenge-quiz" /> : null}
      </div>
    </div>
  );

  const side = workspace === "molecule" ? moleculePanel : workspace === "hydrolysis" ? hydrolysisPanel : workspace === "cycle" ? cyclePanel : workspace === "work" ? workPanel : practicePanel;

  return (
    <div className="ce-root py-2" data-testid="atp-lab" onKeyDown={onKeyDown}>
      <style>{CE_STYLE}</style>
      <JourneyNav current="atp" className="mb-3" />
      <Tabs items={WS} value={workspace} onChange={(w) => (setWorkspace(w), setSelected(null))} label="ATP laboratory sections" idPrefix="atp-ws" panelId="atp-ws-panel" className="mb-3" cols="grid-cols-2 sm:grid-cols-5" />
      <div id="atp-ws-panel" role="tabpanel" aria-labelledby={`atp-ws-tab-${workspace}`}>
        <SimulationLayout
          size="wide"
          stageLabel={label}
          aspect={workspace === "molecule" && view === "Compare" ? 960 / 640 : 960 / 540}
          stageCap="76rem"
          runState={runState}
          statusDetail="Animation complete."
          stage={stage}
          readouts={<p className="line-clamp-2 min-h-10 text-center text-sm font-medium leading-5 text-ink dark:text-bone" data-testid="beat-caption" aria-live="polite">{readout}</p>}
          actions={actions}
          controls={<div className="flex min-w-0 flex-col gap-4">{side}</div>}
          explanation={
            <div className="flex min-w-0 flex-col gap-3">
              <div className={card}>
                <p className={eyebrow}>The one-line summary</p>
                <p className="mt-1 text-sm text-ink dark:text-bone">ATP + H₂O → ADP + Pi has a negative ΔG, and cells couple it to work. ATP is not a long-term store: it is continually regenerated using energy from respiration.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <LabLink href="/dashboard/biology/cellular-energy" testId="link-intro">Intro to Cellular Energy</LabLink>
                  <LabLink href="/dashboard/biology/cellular-respiration" testId="link-respiration-2">Cellular Respiration</LabLink>
                </div>
              </div>
              <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
                <summary className="min-h-9 cursor-pointer font-medium text-ink dark:text-bone">About this model and keyboard shortcuts</summary>
                <p className="mt-2">The ATP model is simplified and not to scale. It is drawn as perspective SVG so it works without WebGL. ΔG values are the commonly quoted standard value (about −30.5 kJ/mol at pH 7) and the typical cellular range (about −50 to −65 kJ/mol). Drag or use the arrow keys on the molecule to rotate it. In the animated sections: Left / Right = step, Space = play or pause, R = restart.</p>
              </details>
              <BatteryNote />
            </div>
          }
        />
      </div>
    </div>
  );
}

function BatteryNote() {
  return (
    <p className="flex items-start gap-2 rounded-2xl border border-line bg-white/50 px-4 py-3 text-xs leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
      <BatteryCharging className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      A rechargeable-battery analogy is useful only up to a point: ATP is recharged constantly (many times per minute), and each ATP molecule carries a small packet of usable free energy, not a large reserve.
    </p>
  );
}
