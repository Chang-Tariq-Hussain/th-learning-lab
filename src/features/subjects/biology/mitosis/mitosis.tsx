"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { Compass, FlaskConical, GitCompareArrows, Hash, ListChecks, Microscope, Puzzle, Search, Target, Zap } from "lucide-react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { ArrangePanel, ChallengePanel, PredictPanel } from "../meiosis/components/activity-panels";
import { PlaybackControls } from "../meiosis/components/playback-controls";
import { Tabs } from "../meiosis/components/tabs";
import { useBeatClock, useClockMeta, type Speed } from "../meiosis/hooks/use-beat-timeline";
import {
  CHALLENGE_BANK,
  PREDICT_EVENTS,
  arrangeReducer,
  blockingEvent,
  challengeReducer,
  checkPick,
  newArrange,
  newChallengeRound,
  questionsFor,
  type IdentifyFeedback,
  type PredictEvent,
} from "./activities/model";
import { ChromosomeExplorer } from "./components/chromosome-explorer";
import { ComparePanel } from "./components/compare-panel";
import { CountingLab } from "./components/counting-lab";
import { FinalSummary } from "./components/final-summary";
import { IdentifyPanel } from "./components/identify-panel";
import { LabStage } from "./components/lab-stage";
import { Legend, StageInfo } from "./components/stage-info";
import { StageNav } from "./components/stage-nav";
import { ViewControls } from "./components/view-controls";
import { BEATS, STAGES, type StructureId } from "./data/stages";
import { BEAT_COUNT, BEAT_STAGE, STAGE_FIRST_BEAT, buildBeats } from "./engine/beats";
import { PAIR_COUNTS, chromatidKey, makePlan, type PairCount } from "./engine/plan";
import { useViewport } from "./hooks/use-viewport";
import type { CellType, PracticeMode, Selection, SimMode, StagePick, Workspace } from "./types";

const WS_ITEMS: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "simulation", label: "Simulation", icon: <FlaskConical className="h-4 w-4" aria-hidden="true" /> },
  { id: "explorer", label: "Chromosome explorer", icon: <Microscope className="h-4 w-4" aria-hidden="true" /> },
  { id: "counts", label: "Counting", icon: <Hash className="h-4 w-4" aria-hidden="true" /> },
  { id: "compare", label: "Mitosis vs meiosis", icon: <GitCompareArrows className="h-4 w-4" aria-hidden="true" /> },
  { id: "practice", label: "Practice", icon: <ListChecks className="h-4 w-4" aria-hidden="true" /> },
];
const MODE_ITEMS: { id: SimMode; label: string; icon: React.ReactNode }[] = [
  { id: "explore", label: "Explore", icon: <Compass className="h-4 w-4" aria-hidden="true" /> },
  { id: "predict", label: "Predict", icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
  { id: "identify", label: "Identify", icon: <Search className="h-4 w-4" aria-hidden="true" /> },
];
const PRACTICE_ITEMS: { id: PracticeMode; label: string; icon: React.ReactNode }[] = [
  { id: "arrange", label: "Arrange the stages", icon: <Puzzle className="h-4 w-4" aria-hidden="true" /> },
  { id: "challenge", label: "Mitosis challenge", icon: <Target className="h-4 w-4" aria-hidden="true" /> },
];

const chip = (on: boolean) =>
  cn(
    "min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
  );

const sameSel = (a: Selection | null, b: StagePick): boolean => {
  if (!a) return false;
  if (a.kind === "structure") return b.kind === "structure" && a.id === b.id;
  return b.kind === "chromatid" && a.k === b.k && a.s === b.s;
};

/**
 * Mitosis lab. One plan drives the animation, the counts and every activity:
 *  - Simulation: large zoomable stage, 7-stage navigator, 15 sub-steps, Explore / Predict / Identify;
 *  - Chromosome explorer: one chromosome, two sister chromatids, separation at anaphase;
 *  - Counting: chromosomes, chromatids and DNA for a chosen starting chromosome number;
 *  - Mitosis vs meiosis: comparison that links to the Meiosis lab;
 *  - Practice: Arrange the stages and the Mitosis Challenge.
 */
export function Mitosis() {
  const reduced = usePrefersReducedMotion();
  const [speed, setSpeed] = useState<Speed>(1);
  const clock = useBeatClock(reduced, speed, BEAT_COUNT);
  const { beat, playing } = useClockMeta(clock);

  const [workspace, setWorkspace] = useState<Workspace>("simulation");
  const [mode, setMode] = useState<SimMode>("explore");
  const [practice, setPractice] = useState<PracticeMode>("arrange");
  const [pairs, setPairs] = useState<PairCount>(2);
  const [cellType, setCellType] = useState<CellType>("animal");
  const [stepMode, setStepMode] = useState(false);
  const [showSpindle, setShowSpindle] = useState(true);
  const [showLabels, setShowLabels] = useState(() => typeof window === "undefined" || window.innerWidth >= 768);
  const [selection, setSelection] = useState<Selection | null>(null);
  const vp = useViewport();

  const plan = useMemo(() => makePlan(pairs, cellType === "plant"), [pairs, cellType]);
  const beats = useMemo(() => buildBeats(plan), [plan]);
  const stageIndex = BEAT_STAGE[beat]!;
  const finished = beat >= BEAT_COUNT - 1;
  const selectedK = selection?.kind === "chromosome" ? selection.k : 0;

  /* ------------------------------------------------------------- predict */
  const answered = useRef<Set<string>>(new Set());
  const [predictLog, setPredictLog] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<PredictEvent | null>(null);
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "predict" && workspace === "simulation") {
      clock.gate = (b) => blockingEvent(b, answered.current) === null;
      clock.onBlocked = (b) => {
        setPending(blockingEvent(b, answered.current));
        setChoice(null);
      };
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
    // keep the question while the clock glides up to the gate; drop it once we are clearly elsewhere
    if (pending && (beat < pending.beat - 2 || beat >= pending.beat)) setPending(null);
  }, [beat, pending]);

  const resetPredictions = () => {
    answered.current = new Set();
    setPredictLog({});
    setPending(null);
    setChoice(null);
    clock.goTo(0, { immediate: true, ignoreGate: true });
  };

  /* ------------------------------------------------------------- identify */
  const idQuestions = useMemo(() => questionsFor(plan), [plan]);
  const [idIndex, setIdIndex] = useState(0);
  const [idFeedback, setIdFeedback] = useState<IdentifyFeedback | null>(null);
  const [idName, setIdName] = useState<string | null>(null);
  const [idMissed, setIdMissed] = useState(false);
  const [idScore, setIdScore] = useState(0);
  const [idDone, setIdDone] = useState(false);
  const idQ = idQuestions[Math.min(idIndex, idQuestions.length - 1)]!;
  const identifying = workspace === "simulation" && mode === "identify" && !idDone;

  useEffect(() => {
    if (identifying) {
      clock.goTo(idQ.beat, { immediate: true, ignoreGate: true });
      setSelection(null);
    }
  }, [identifying, idQ.beat, idIndex, clock]);

  const idRestart = () => {
    setIdIndex(0);
    setIdFeedback(null);
    setIdName(null);
    setIdMissed(false);
    setIdScore(0);
    setIdDone(false);
  };
  const idResolve = (fb: IdentifyFeedback) => {
    setIdFeedback(fb);
    if (!fb.ok) setIdMissed(true);
    else if (!idMissed) setIdScore((s) => s + 1);
  };
  const idNext = () => {
    if (idIndex + 1 >= idQuestions.length) {
      setIdDone(true);
      return;
    }
    setIdIndex((i) => i + 1);
    setIdFeedback(null);
    setIdName(null);
    setIdMissed(false);
  };

  /* ------------------------------------------------------------- practice */
  const [arrange, dispatchArrange] = useReducer(arrangeReducer, undefined, () => newArrange(11, STAGES.length));
  const [challenge, dispatchChallenge] = useReducer(challengeReducer, 5, newChallengeRound);

  /* ------------------------------------------------------------- navigation */
  const goStage = useCallback(
    (k: number) => {
      setPending(null);
      clock.goTo(STAGE_FIRST_BEAT[Math.min(STAGES.length - 1, Math.max(0, k))]!);
    },
    [clock],
  );
  const stageStep = (d: 1 | -1) => {
    const cur = BEAT_STAGE[Math.round(clock.getTarget())]!;
    if (d === 1) goStage(cur + 1);
    else goStage(Math.round(clock.getTarget()) > STAGE_FIRST_BEAT[cur]! ? cur : cur - 1);
  };
  const playPause = () => {
    if (playing) clock.pause();
    else clock.play(stepMode);
  };
  const restart = () => {
    setPending(null);
    clock.goTo(0, { ignoreGate: true });
  };
  const resetActivities = () => {
    setSelection(null);
    answered.current = new Set();
    setPredictLog({});
    setPending(null);
    idRestart();
  };
  const changePairs = (p: PairCount) => {
    if (p === pairs) return;
    setPairs(p);
    resetActivities();
    clock.goTo(0, { immediate: true, ignoreGate: true });
  };
  const changeCell = (c: CellType) => {
    if (c === cellType) return;
    setCellType(c);
    setSelection(null);
    idRestart();
  };

  const onPick = (p: StagePick) => {
    if (identifying) {
      if (idFeedback?.ok) return;
      if (idQ.kind === "name") return;
      idResolve(checkPick(idQ, p, plan.plant));
      return;
    }
    if (p.kind === "fiber") return;
    if (p.kind === "chromatid") setSelection((cur) => (sameSel(cur, p) ? null : { kind: "chromosome", k: p.k, s: p.s }));
    else setSelection((cur) => (sameSel(cur, p) ? null : p));
  };
  const selectStructure = (id: StructureId) => setSelection((cur) => (cur?.kind === "structure" && cur.id === id ? null : { kind: "structure", id }));

  /* ------------------------------------------------------------- keyboard */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("input,select,textarea,[role=tab],[role=radio],details")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === " " && t.closest("button,a,summary,[role=button]")) return;
    if (e.key === "+" || e.key === "=") (e.preventDefault(), vp.zoomIn());
    else if (e.key === "-" || e.key === "_") (e.preventDefault(), vp.zoomOut());
    else if (e.key === "0") vp.reset();
    else if (e.key === "s" || e.key === "S") setShowSpindle((v) => !v);
    else if (e.key === "l" || e.key === "L") setShowLabels((v) => !v);
    if (identifying) return;
    if (e.key === "ArrowRight") (e.preventDefault(), e.shiftKey ? stageStep(1) : clock.step(1));
    else if (e.key === "ArrowLeft") (e.preventDefault(), e.shiftKey ? stageStep(-1) : clock.step(-1));
    else if (e.key === " ") (e.preventDefault(), playPause());
    else if (e.key === "r" || e.key === "R") restart();
  };

  const runState: SimulationRunState = playing ? "running" : finished ? "finished" : beat > 0 ? "paused" : "idle";

  /* ------------------------------------------------------------- top bar */
  const topBar = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Tabs items={WS_ITEMS} value={workspace} onChange={setWorkspace} label="Lab sections" idPrefix="mito-ws" panelId="mito-ws-panel" className="w-full lg:w-auto" cols="grid-cols-2 sm:grid-flow-col sm:auto-cols-auto" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div role="radiogroup" aria-label="Starting chromosome number" className="flex items-center gap-1.5" data-testid="pairs-select">
          <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Starting cell</span>
          {PAIR_COUNTS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={pairs === p} data-pairs-top={p} onClick={() => changePairs(p)} className={chip(pairs === p)}>
              2n = {2 * p}
            </button>
          ))}
        </div>
        {workspace === "simulation" ? (
          <div role="radiogroup" aria-label="Cell type" className="flex items-center gap-1.5" data-testid="cell-type">
            <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Cell</span>
            {(["animal", "plant"] as const).map((c) => (
              <button key={c} type="button" role="radio" aria-checked={cellType === c} data-cell-type={c} onClick={() => changeCell(c)} className={chip(cellType === c)}>
                {c === "animal" ? "Animal" : "Plant"}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  /* ------------------------------------------------------------- panels */
  let modePanel: React.ReactNode = null;
  if (mode === "predict") {
    const entries = Object.values(predictLog);
    modePanel = (
      <PredictPanel
        event={pending}
        choice={choice}
        answeredCount={entries.length}
        correctCount={entries.filter(Boolean).length}
        total={PREDICT_EVENTS.length}
        onChoose={(id) => {
          if (!pending) return;
          setChoice(id);
          setPredictLog((l) => ({ ...l, [pending.id]: id === pending.correct }));
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
  } else if (mode === "identify") {
    modePanel = (
      <IdentifyPanel
        questions={idQuestions}
        index={idIndex}
        feedback={idFeedback}
        nameChoice={idName}
        score={idScore}
        done={idDone}
        onNameChoice={(id) => {
          if (idQ.kind !== "name" || idFeedback?.ok) return;
          setIdName(id);
          const o = idQ.options.find((x) => x.id === id)!;
          idResolve(id === idQ.correct ? { ok: true, message: "Yes. " + idQ.explain } : { ok: false, message: o.why });
        }}
        onNext={idNext}
        onRestart={idRestart}
      />
    );
  }

  const highlight = useMemo(() => {
    if (!identifying) return null;
    if (idQ.kind === "name") return new Set(idQ.highlight);
    if (idQ.kind === "sister") return new Set([idQ.target]);
    return null;
  }, [identifying, idQ]);
  const pickMode = identifying ? (idQ.kind === "name" ? "none" : "find") : "explore";

  const simulation = (
    <div onKeyDown={onKeyDown} data-testid="mitosis-sim" id="mito-ws-panel" role="tabpanel" aria-labelledby="mito-ws-tab-simulation">
      <SimulationLayout
        size="wide"
        stageLabel="Mitosis laboratory"
        aspect={1000 / 640}
        stageCap="76rem"
        runState={runState}
        statusDetail="Mitosis and cytokinesis are complete: two identical daughter cells."
        stage={<LabStage plan={plan} beats={beats} clock={clock} view={vp.view} onPan={vp.panBy} showLabels={showLabels} showSpindle={showSpindle} selected={identifying ? null : selection} highlight={highlight} pickMode={pickMode} onPick={onPick} />}
        readouts={
          <p className="line-clamp-2 min-h-10 text-center text-sm font-medium leading-5 text-ink dark:text-bone" data-testid="beat-caption" aria-live={playing ? "off" : "polite"}>
            {identifying ? "Identify the structure the question asks about." : BEATS[beat]!.caption}
          </p>
        }
        actions={
          <PlaybackControls
            playing={playing}
            atStart={beat === 0}
            atEnd={beat >= BEAT_COUNT - 1}
            stepMode={stepMode}
            speed={speed}
            showLabels={showLabels}
            disabled={identifying}
            onPlayPause={playPause}
            onStep={(d) => clock.step(d)}
            onStage={stageStep}
            onRestart={restart}
            onStepMode={() => setStepMode((v) => !v)}
            onSpeed={setSpeed}
            onLabels={() => setShowLabels((v) => !v)}
            extra={<ViewControls zoom={vp.view.z} showSpindle={showSpindle} onSpindle={() => setShowSpindle((v) => !v)} onZoomIn={vp.zoomIn} onZoomOut={vp.zoomOut} onReset={vp.reset} />}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <Tabs
              items={MODE_ITEMS}
              value={mode}
              onChange={(m) => {
                setMode(m);
                if (m !== "identify") setSelection(null);
              }}
              label="Activity"
              idPrefix="mito-mode"
              panelId="mito-mode-panel"
            />
            <div id="mito-mode-panel" role="tabpanel" aria-labelledby={`mito-mode-tab-${mode}`} className="flex min-w-0 flex-col gap-4">
              <Legend pairs={pairs} />
              <StageNav clock={clock} stageIndex={stageIndex} onSelect={goStage} disabled={identifying} />
              {modePanel}
              {identifying ? null : <StageInfo stageIndex={stageIndex} beat={beat} pairs={pairs} plan={plan} selection={selection} onSelectStructure={selectStructure} selectionEnabled />}
            </div>
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-4">
            <FinalSummary visible={finished && !identifying} pairs={pairs} />
            <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
              <summary className="min-h-9 cursor-pointer font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone">About this model and keyboard shortcuts</summary>
              <p className="mt-2">
                This is a simplified, not-to-scale model of one cell with {pairs * 2} chromosomes (2n = {2 * pairs}, {pairs} pairs of homologs) so every chromosome can be followed. Real cells have many more (humans: 2n = 46) and the phases blend into each other. Blue chromosomes came from one parent and orange from the other; in mitosis they do not pair. Which sister chromatid goes to which pole is arbitrary because the two are identical. Plant cells have no centrosomes with centrioles and divide by a cell plate; the lab draws the plant cell as a simplified rounded box. Zoom, pan and the spindle switch change only the view, not the biology. The picture is drawn as SVG, so it works without WebGL.
              </p>
              <p className="mt-2">
                Keys (when a control in the lab has focus): Left / Right = step, Shift + Left / Right = previous / next stage, Space = play or pause, R = restart, L = labels, S = spindle, + / - = zoom, 0 = reset view. Chromosomes and cell parts can be focused with Tab and selected with Enter. Drag the picture to pan when zoomed in.
              </p>
            </details>
          </div>
        }
      />
    </div>
  );

  return (
    <div className="py-2" data-testid="mitosis-lab">
      {topBar}
      {workspace === "simulation" ? simulation : null}
      {workspace === "explorer" ? (
        <div id="mito-ws-panel" role="tabpanel" aria-labelledby="mito-ws-tab-explorer">
          <ChromosomeExplorer plan={plan} selectedK={selectedK} onSelectK={(k) => setSelection({ kind: "chromosome", k, s: 0 })} />
        </div>
      ) : null}
      {workspace === "counts" ? (
        <div id="mito-ws-panel" role="tabpanel" aria-labelledby="mito-ws-tab-counts">
          <CountingLab plan={plan} pairs={pairs} onPairs={changePairs} />
        </div>
      ) : null}
      {workspace === "compare" ? (
        <div id="mito-ws-panel" role="tabpanel" aria-labelledby="mito-ws-tab-compare">
          <ComparePanel />
        </div>
      ) : null}
      {workspace === "practice" ? (
        <div id="mito-ws-panel" role="tabpanel" aria-labelledby="mito-ws-tab-practice" className="mx-auto flex max-w-3xl flex-col gap-4">
          <Tabs items={PRACTICE_ITEMS} value={practice} onChange={setPractice} label="Practice activity" idPrefix="mito-practice" panelId="mito-practice-panel" />
          <div id="mito-practice-panel" role="tabpanel" aria-labelledby={`mito-practice-tab-${practice}`}>
            {practice === "arrange" ? (
              <ArrangePanel
                state={arrange}
                dispatch={dispatchArrange}
                stages={STAGES}
                title="Arrange the stages"
                intro="Put the seven steps in order, from the first to the last. Interphase comes before mitosis; cytokinesis is the division of the cell. Tap a card to place it; use a placed card's arrows to move it."
                solvedNote="DNA is copied in interphase. Mitosis separates sister chromatids, and cytokinesis divides the cell."
                hint="Hint: interphase is first, then the four phases that move the chromosomes in the order prophase, prometaphase, metaphase, anaphase, then telophase, and cytokinesis last."
              />
            ) : (
              <ChallengePanel
                round={challenge}
                dispatch={dispatchChallenge}
                title="Mitosis challenge"
                renderExtra={(id) => {
                  const q = CHALLENGE_BANK.find((b) => b.id === id);
                  return q ? (
                    <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft" data-testid="challenge-stage">
                      Seen in the simulation at: <strong>{STAGES[q.stage]!.label}</strong>, step {q.beat + 1} of {BEAT_COUNT}.
                    </p>
                  ) : null;
                }}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
