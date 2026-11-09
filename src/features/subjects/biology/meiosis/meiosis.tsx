"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { Compass, Dna, FlaskConical, Hash, ListChecks, Puzzle, Search, Target, Zap } from "lucide-react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import {
  PREDICT_EVENTS,
  arrangeReducer,
  blockingEvent,
  buildIdentifyQuestions,
  challengeReducer,
  checkChromatidPick,
  newArrange,
  newChallengeRound,
  type IdentifyFeedback,
  type PredictEvent,
} from "./activities/model";
import { ArrangePanel, ChallengePanel, IdentifyPanel, PredictPanel } from "./components/activity-panels";
import { CrossoverLab } from "./components/crossover-lab";
import { FinalResult } from "./components/final-result";
import { LabStage } from "./components/lab-stage";
import { MitosisComparison } from "./components/mitosis-comparison";
import { PlaybackControls } from "./components/playback-controls";
import { PloidyExplorer } from "./components/ploidy-explorer";
import { StageInfo, Legend } from "./components/stage-info";
import { StageNav } from "./components/stage-nav";
import { Tabs } from "./components/tabs";
import { WhyItMatters } from "./components/why-it-matters";
import { BEATS, STAGES, type StructureId } from "./data/stages";
import { BEAT_COUNT, BEAT_STAGE, STAGE_FIRST_BEAT, buildBeats } from "./engine/beats";
import { PAIR_COUNTS, chromatidKey, finalCells, isRecombinant, makePlan, type PairCount } from "./engine/plan";
import { HOMOLOG_COLOR } from "./engine/palette";
import { useBeatClock, useClockMeta, type Speed } from "./hooks/use-beat-timeline";
import type { PracticeMode, Selection, SimMode, StagePick, Workspace } from "./types";

const WS_ITEMS: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "simulation", label: "Simulation", icon: <FlaskConical className="h-4 w-4" aria-hidden="true" /> },
  { id: "variation", label: "Crossing over & variation", icon: <Dna className="h-4 w-4" aria-hidden="true" /> },
  { id: "counts", label: "2n vs n", icon: <Hash className="h-4 w-4" aria-hidden="true" /> },
  { id: "practice", label: "Practice", icon: <ListChecks className="h-4 w-4" aria-hidden="true" /> },
];
const MODE_ITEMS: { id: SimMode; label: string; icon: React.ReactNode }[] = [
  { id: "explore", label: "Explore", icon: <Compass className="h-4 w-4" aria-hidden="true" /> },
  { id: "predict", label: "Predict", icon: <Zap className="h-4 w-4" aria-hidden="true" /> },
  { id: "identify", label: "Identify", icon: <Search className="h-4 w-4" aria-hidden="true" /> },
];
const PRACTICE_ITEMS: { id: PracticeMode; label: string; icon: React.ReactNode }[] = [
  { id: "arrange", label: "Arrange the stages", icon: <Puzzle className="h-4 w-4" aria-hidden="true" /> },
  { id: "challenge", label: "Meiosis challenge", icon: <Target className="h-4 w-4" aria-hidden="true" /> },
];

const selEq = (a: Selection | null, b: Selection) =>
  !!a && a.kind === b.kind && (a.kind === "structure" ? a.id === (b as { id: StructureId }).id : chromatidKey(a.id) === chromatidKey((b as { id: typeof a.id }).id));

/**
 * Meiosis lab. One plan (random but reproducible) drives the animation, the counts and every activity:
 *  - Simulation: large stage, 9-stage navigator, 16 sub-steps, Explore / Predict / Identify;
 *  - Crossing over & variation: a dedicated crossover lab and independent-assortment explorer;
 *  - 2n vs n: chromosome number versus DNA amount, for a chosen starting chromosome number;
 *  - Practice: Arrange the stages and the Meiosis Challenge.
 */
export function Meiosis() {
  const reduced = usePrefersReducedMotion();
  const [speed, setSpeed] = useState<Speed>(1);
  const clock = useBeatClock(reduced, speed);
  const { beat, playing } = useClockMeta(clock);

  const [workspace, setWorkspace] = useState<Workspace>("simulation");
  const [mode, setMode] = useState<SimMode>("explore");
  const [practice, setPractice] = useState<PracticeMode>("arrange");
  const [pairs, setPairs] = useState<PairCount>(2);
  const [seed, setSeed] = useState(3);
  const [stepMode, setStepMode] = useState(false);
  const [showLabels, setShowLabels] = useState(() => typeof window === "undefined" || window.innerWidth >= 768);
  const [selection, setSelection] = useState<Selection | null>(null);

  const plan = useMemo(() => makePlan(pairs, seed), [pairs, seed]);
  const beats = useMemo(() => buildBeats(plan), [plan]);
  const stageIndex = BEAT_STAGE[beat]!;
  const finished = beat >= BEAT_COUNT - 1;

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
  const idQuestions = useMemo(() => buildIdentifyQuestions(plan), [plan]);
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
  const [arrange, dispatchArrange] = useReducer(arrangeReducer, 11, newArrange);
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
  const newCell = () => {
    setSeed((s) => s + 1);
    setSelection(null);
    clock.goTo(0, { immediate: true, ignoreGate: true });
  };
  const changePairs = (p: PairCount) => {
    if (p === pairs) return;
    setPairs(p);
    setSelection(null);
    answered.current = new Set();
    setPredictLog({});
    setPending(null);
    idRestart();
    clock.goTo(0, { immediate: true, ignoreGate: true });
  };

  const onPick = (p: StagePick) => {
    if (identifying) {
      if (idFeedback?.ok) return;
      if (idQ.kind === "sister" || idQ.kind === "homolog") {
        if (p.kind === "chromatid") idResolve(checkChromatidPick(idQ, p.id));
        else idResolve({ ok: false, message: "Pick one of the chromatids." });
      } else if (idQ.kind === "fiber") {
        if (p.kind === "fiber") idResolve({ ok: true, message: "Yes. Spindle fibers are the thin lines (microtubules) running from the poles to the centromeres." });
        else if (p.kind === "chromatid") idResolve({ ok: false, message: "That is a chromatid. Spindle fibers are the thin lines running from the spindle poles to the chromosomes." });
        else idResolve({ ok: false, message: "That is not a spindle fiber. Look for the thin lines between the poles and the chromosomes." });
      } else if (idQ.kind === "centrosome") {
        if (p.kind === "structure" && p.id === "centrosome") idResolve({ ok: true, message: "Yes. The centrosome sits at each pole and organizes the spindle fibers." });
        else idResolve({ ok: false, message: p.kind === "fiber" ? "That is a spindle fiber. The centrosome is the small star-shaped structure at the end of the spindle, at the cell's pole." : "That is not a centrosome. Look for the small star-shaped structure at a pole of the cell." });
      }
      return;
    }
    if (p.kind === "fiber") return;
    setSelection((cur) => (selEq(cur, p) ? null : p));
  };

  const selectStructure = (id: StructureId) => setSelection((cur) => (cur?.kind === "structure" && cur.id === id ? null : { kind: "structure", id }));

  /* ------------------------------------------------------------- keyboard */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("input,select,textarea,[role=tab],[role=radio],details")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === " " && t.closest("button,a,summary,[role=button]")) return;
    if (identifying) return;
    if (e.key === "ArrowRight") (e.preventDefault(), e.shiftKey ? stageStep(1) : clock.step(1));
    else if (e.key === "ArrowLeft") (e.preventDefault(), e.shiftKey ? stageStep(-1) : clock.step(-1));
    else if (e.key === " ") (e.preventDefault(), playPause());
    else if (e.key === "r" || e.key === "R") restart();
    else if (e.key === "l" || e.key === "L") setShowLabels((v) => !v);
  };

  const runState: SimulationRunState = playing ? "running" : finished ? "finished" : beat > 0 ? "paused" : "idle";
  const cells = useMemo(() => finalCells(plan), [plan]);

  /* ------------------------------------------------------------- top bar */
  const topBar = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Tabs items={WS_ITEMS} value={workspace} onChange={setWorkspace} label="Lab sections" idPrefix="meio-ws" panelId="meio-ws-panel" className="w-full sm:w-auto" cols="grid-cols-2 sm:grid-flow-col sm:auto-cols-auto" />
      <div role="radiogroup" aria-label="Starting chromosome number" className="flex items-center gap-1.5" data-testid="pairs-select">
        <span className="text-xs font-medium text-ink-soft dark:text-bone-soft">Starting cell</span>
        {PAIR_COUNTS.map((p) => (
          <button key={p} type="button" role="radio" aria-checked={pairs === p} data-pairs-top={p} onClick={() => changePairs(p)} className={`min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone ${pairs === p ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone"}`}>
            2n = {2 * p}
          </button>
        ))}
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
    modePanel = <IdentifyPanel questions={idQuestions} index={idIndex} feedback={idFeedback} nameChoice={idName} score={idScore} done={idDone} onNameChoice={(id) => { if (idQ.kind !== "name" || idFeedback?.ok) return; setIdName(id); const o = idQ.options.find((x) => x.id === id)!; idResolve(id === idQ.correct ? { ok: true, message: "Yes. " + (idQ.id === "id-tetrad" ? "A tetrad is a pair of homologous chromosomes: 2 chromosomes, 4 chromatids." : idQ.id === "id-anaphase1" ? "Each homolog is still a chromosome with two sister chromatids." : "Sister chromatids separate in anaphase II.") } : { ok: false, message: o.why }); }} onNext={idNext} onRestart={idRestart} />;
  }

  const highlight = useMemo(() => {
    if (!identifying) return null;
    if (idQ.kind === "name") return new Set(idQ.highlight);
    if (idQ.kind === "sister") return new Set([idQ.target]);
    if (idQ.kind === "homolog") return new Set(idQ.target);
    return null;
  }, [identifying, idQ]);

  const pickMode = identifying ? (idQ.kind === "name" ? "none" : "find") : "explore";

  const simulation = (
    <div onKeyDown={onKeyDown} data-testid="meiosis-sim" id="meio-ws-panel" role="tabpanel" aria-labelledby="meio-ws-tab-simulation">
      <SimulationLayout
        size="wide"
        stageLabel="Meiosis laboratory"
        aspect={1000 / 640}
        stageCap="76rem"
        runState={runState}
        statusDetail="Meiosis is complete: four haploid cells."
        stage={<LabStage plan={plan} beats={beats} clock={clock} showLabels={showLabels} selected={identifying ? null : selection} highlight={highlight} pickMode={pickMode} onPick={onPick} />}
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
            onNewCell={newCell}
          />
        }
        controls={
          <div className="flex min-w-0 flex-col gap-4">
            <Tabs items={MODE_ITEMS} value={mode} onChange={(m) => { setMode(m); if (m !== "identify") setSelection(null); }} label="Activity" idPrefix="meio-mode" panelId="meio-mode-panel" />
            <div id="meio-mode-panel" role="tabpanel" aria-labelledby={`meio-mode-tab-${mode}`} className="flex min-w-0 flex-col gap-4">
              <Legend pairs={pairs} />
              <StageNav clock={clock} stageIndex={stageIndex} onSelect={goStage} disabled={identifying} />
              {modePanel}
              {identifying ? null : <StageInfo stageIndex={stageIndex} beat={beat} pairs={pairs} plan={plan} selection={selection} onSelectStructure={selectStructure} selectionEnabled />}
            </div>
          </div>
        }
        explanation={
          <div className="flex min-w-0 flex-col gap-4">
            {finished && !identifying ? (
              <section aria-label="The four cells" className="rounded-2xl border border-subject-biology/40 bg-white/70 p-4 dark:bg-white/[0.04]" data-testid="final-cells">
                <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Four different haploid cells</h3>
                <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Alleles carried by each cell. Capital letters came from the maternal chromosome, small letters from the paternal one. A starred pair is a new (recombinant) combination.</p>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {cells.map((c) => (
                    <li key={c.index} className="rounded-xl border border-line px-2 py-1.5 text-sm dark:border-line-dark" data-final-cell={c.index}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft dark:text-bone-soft">Cell {c.index + 1}</p>
                      <p className="mt-0.5 flex flex-wrap gap-x-3 font-mono text-sm">
                        {c.chromatids.map((ch, i) => (
                          <span key={i} style={{ color: HOMOLOG_COLOR[ch.homolog] }} className="font-bold">
                            {c.genotype[i]}
                            {isRecombinant(plan, ch) ? "*" : ""}
                          </span>
                        ))}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Press &quot;New cell&quot; to run another meiosis: the crossovers and the orientations change, so the four cells come out differently.</p>
              </section>
            ) : null}
            <FinalResult visible={finished && !identifying} />
            <WhyItMatters visible={finished && !identifying} />
            <MitosisComparison visible={finished && !identifying} />
            <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
              <summary className="min-h-9 cursor-pointer font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone">About this model and keyboard shortcuts</summary>
              <p className="mt-2">
                This is a simplified, not-to-scale model of one cell with {pairs} pairs of chromosomes (2n = {2 * pairs}) so every chromosome can be followed. Real cells have many more chromosomes (humans: 2n = 46), and crossovers, orientations and which sister chromatid goes where are random, which is why &quot;New cell&quot; gives different results. Spindles in meiosis II are drawn at right angles to the first spindle. Egg formation in many animals divides unevenly; the model shows the standard equal division.
              </p>
              <p className="mt-2">
                Keys (when a control in the lab has focus): Left / Right = step, Shift + Left / Right = previous / next stage, Space = play or pause, R = restart, L = labels. Chromosomes, spindle fibers and cell parts can be focused with Tab and selected with Enter.
              </p>
            </details>
          </div>
        }
      />
    </div>
  );

  return (
    <div className="py-2" data-testid="meiosis-lab">
      {topBar}
      {workspace === "simulation" ? simulation : null}
      {workspace === "variation" ? (
        <div id="meio-ws-panel" role="tabpanel" aria-labelledby="meio-ws-tab-variation">
          <CrossoverLab plan={plan} showLabels={showLabels} />
        </div>
      ) : null}
      {workspace === "counts" ? (
        <div id="meio-ws-panel" role="tabpanel" aria-labelledby="meio-ws-tab-counts">
          <PloidyExplorer plan={plan} pairs={pairs} onPairs={changePairs} />
        </div>
      ) : null}
      {workspace === "practice" ? (
        <div id="meio-ws-panel" role="tabpanel" aria-labelledby="meio-ws-tab-practice" className="mx-auto flex max-w-3xl flex-col gap-4">
          <Tabs items={PRACTICE_ITEMS} value={practice} onChange={setPractice} label="Practice activity" idPrefix="meio-practice" panelId="meio-practice-panel" />
          <div id="meio-practice-panel" role="tabpanel" aria-labelledby={`meio-practice-tab-${practice}`}>
            {practice === "arrange" ? <ArrangePanel state={arrange} dispatch={dispatchArrange} /> : <ChallengePanel round={challenge} dispatch={dispatchChallenge} />}
          </div>
        </div>
      ) : null}
    </div>
  );
}
