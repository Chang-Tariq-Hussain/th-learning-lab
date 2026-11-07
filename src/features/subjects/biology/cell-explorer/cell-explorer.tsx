"use client";

import { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { RotateCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationLayout, usePrefersReducedMotion } from "@/features/simulation";
import { buildFunctionQuestions, buildIdentifyQuestions, buildSortQuestions, roundReducer, startRound } from "./activities/model";
import { ChoicePanel } from "./components/choice-panel";
import { CellStage, CENTERS } from "./components/cell-stage";
import { CellSwitch } from "./components/cell-switch";
import { CompareTable } from "./components/compare-table";
import { IdentifyPanel } from "./components/identify-panel";
import { InfoPanel } from "./components/info-panel";
import { MODES, ModeTabs } from "./components/mode-tabs";
import { StructureList } from "./components/structure-list";
import { getOrganelle, isPresent, ORGANELLES, PRESENCE_SHORT } from "./data/organelles";
import { useViewport } from "./hooks/use-viewport";
import type { SceneState } from "./scene/part";
import type { CellKind, CellMode, OrganelleId } from "./types";

const PANEL_ID = "cell-mode-panel";

/**
 * Interactive cell lab. One large SVG stage (animal or plant cell) with four ways to work with it:
 * Explore (select anything), Identify (find a named structure), Function (match a highlighted structure to its
 * job) and Compare (what plant and animal cells share). Content lives in `data/organelles.ts`; activity logic
 * in `activities/model.ts`; the scene in `scene/`.
 *
 * Everything shares one selection / cell-kind state, so switching activity or cell type never leaves the learner
 * with a stale highlight or a question about a structure the current cell does not have.
 */
export function CellExplorer() {
  const reducedMotion = usePrefersReducedMotion();
  const viewport = useViewport();

  const [cellKind, setCellKind] = useState<CellKind>("animal");
  const [mode, setMode] = useState<CellMode>("explore");
  const [selectedId, setSelectedId] = useState<OrganelleId | null>(null);
  const [showLabels, setShowLabels] = useState(() => typeof window === "undefined" || window.innerWidth >= 640);
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  const [identify, dispatchIdentify] = useReducer(roundReducer, undefined, () => startRound(buildIdentifyQuestions("animal")));
  const [fn, dispatchFn] = useReducer(roundReducer, undefined, () => startRound(buildFunctionQuestions("animal")));
  const [sort, dispatchSort] = useReducer(roundReducer, undefined, () => startRound(buildSortQuestions()));

  const restartIdentify = useCallback((kind: CellKind) => dispatchIdentify({ type: "restart", questions: buildIdentifyQuestions(kind) }), []);
  const restartFunction = useCallback((kind: CellKind) => dispatchFn({ type: "restart", questions: buildFunctionQuestions(kind) }), []);
  const restartSort = useCallback(() => dispatchSort({ type: "restart", questions: buildSortQuestions() }), []);

  const switchCell = (kind: CellKind, keepSelection: OrganelleId | null = null) => {
    setCellKind(kind);
    setSelectedId(keepSelection);
    viewport.reset();
    // Questions are built from the structures in the cell being viewed, so a new cell means a fresh round.
    restartIdentify(kind);
    restartFunction(kind);
  };

  const handleCellChange = (kind: CellKind) => {
    if (kind !== cellKind) switchCell(kind);
  };

  const handleModeChange = (next: CellMode) => {
    setMode(next);
    setSelectedId(null);
  };

  const handleReset = () => {
    setMode("explore");
    setHighlightDiffs(false);
    switchCell("animal");
    restartSort();
  };

  /** Explore / Compare: select (or deselect) a structure and, if zoomed in, bring it into view. */
  const exploreSelect = (id: string) => {
    const next = selectedId === id ? null : (id as OrganelleId);
    setSelectedId(next);
    if (next) {
      const c = CENTERS[cellKind][next];
      if (c) viewport.centerOn(c.x, c.y);
    }
  };

  /** Table row: show a plant-only structure by switching to the plant cell first. */
  const compareRowSelect = (id: string) => {
    const oid = id as OrganelleId;
    if (!isPresent(oid, cellKind)) switchCell(cellKind === "animal" ? "plant" : "animal", oid);
    else exploreSelect(id);
  };

  const review = (id: OrganelleId) => {
    setMode("explore");
    if (!isPresent(id, cellKind)) switchCell(cellKind === "animal" ? "plant" : "animal", id);
    else setSelectedId(id);
  };

  const onPick = (id: string) => {
    if (mode === "identify") {
      if (identify.status === "asking" && !identify.finished) {
        setSelectedId(id as OrganelleId);
        dispatchIdentify({ type: "answer", value: id });
      }
      return;
    }
    if (mode === "function") return;
    exploreSelect(id);
  };

  // Latest click handler behind a stable function, so the scene context does not change on every render.
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;
  const stablePick = useCallback((id: string) => onPickRef.current(id), []);

  const identifyTarget = identify.questions[identify.index]?.id ?? null;
  const fnTarget = fn.questions[fn.index]?.id ?? null;
  const identifyAnswered = mode === "identify" && !identify.finished && identify.status !== "asking";
  const fnAnswered = mode === "function" && !fn.finished && fn.status !== "asking";
  const labelsAllowed = mode === "explore" || mode === "compare";

  const markedIds = useMemo<ReadonlySet<string> | null>(() => {
    if (mode !== "compare" || !highlightDiffs || cellKind !== "plant") return null;
    return new Set((Object.keys(ORGANELLES) as OrganelleId[]).filter((id) => ORGANELLES[id].presence === "plant"));
  }, [mode, highlightDiffs, cellKind]);

  const scene = useMemo<Omit<SceneState, "reducedMotion">>(
    () => ({
      selectedId: mode === "function" ? null : selectedId,
      targetId: mode === "function" && !fn.finished && !fnAnswered ? fnTarget : null,
      interactive: mode !== "function",
      dimOthers: mode === "explore" || mode === "compare",
      hideNames: mode === "function" && !fnAnswered,
      markedIds,
      onPick: stablePick,
    }),
    [mode, selectedId, fn.finished, fnAnswered, fnTarget, markedIds, stablePick],
  );

  const focusLabelId: string | null = labelsAllowed ? selectedId : identifyAnswered ? identifyTarget : fnAnswered ? fnTarget : null;

  const selected = getOrganelle(selectedId);
  const modeInfo = MODES.find((m) => m.mode === mode)!;

  /* --------------------------- readouts (stay visible with the stage) --------------------------- */
  let readout: React.ReactNode;
  if (mode === "identify" && !identify.finished) {
    const t = getOrganelle(identifyTarget);
    readout = (
      <>
        <p className="truncate text-center font-display text-base font-medium text-ink dark:text-bone">
          Find: <span className="font-semibold">{t?.name}</span>
        </p>
        <p className="truncate text-center text-helper text-ink-soft dark:text-bone-soft" data-testid="readout-sub">
          {identify.status === "asking"
            ? identify.wrong.length > 0
              ? `Not quite (${getOrganelle(identify.wrong[identify.wrong.length - 1])?.name}). Try again.`
              : `Question ${identify.index + 1} of ${identify.questions.length}`
            : "Correct! See below to continue."}
        </p>
      </>
    );
  } else if (mode === "function" && !fn.finished) {
    readout = (
      <>
        <p className="truncate text-center font-display text-base font-medium text-ink dark:text-bone">What does the highlighted structure do?</p>
        <p className="truncate text-center text-helper text-ink-soft dark:text-bone-soft" data-testid="readout-sub">
          {fn.status === "asking" ? `Question ${fn.index + 1} of ${fn.questions.length}` : `It was the ${getOrganelle(fnTarget)?.name}`}
        </p>
      </>
    );
  } else if (mode === "identify" || mode === "function") {
    readout = <p className="truncate text-center font-display text-base font-medium text-ink dark:text-bone">Round complete</p>;
  } else {
    readout = (
      <>
        <p className="truncate text-center font-display text-base font-medium text-ink dark:text-bone" data-testid="readout-name">
          {selected ? selected.name : mode === "compare" ? "Compare the two cells" : "Select a part of the cell"}
        </p>
        <p className="truncate text-center text-helper text-ink-soft dark:text-bone-soft">
          {selected ? PRESENCE_SHORT[selected.presence] : `${cellKind === "animal" ? "Animal" : "Plant"} cell · illustration, not to scale`}
        </p>
      </>
    );
  }

  /* ---------------------------------------- side panel ---------------------------------------- */
  let panel: React.ReactNode;
  if (mode === "explore") {
    panel = (
      <div className="flex flex-col gap-5">
        <InfoPanel organelle={selected} kind={cellKind} />
        <StructureList kind={cellKind} selectedId={selectedId} onSelect={exploreSelect} />
      </div>
    );
  } else if (mode === "identify") {
    panel = <IdentifyPanel round={identify} dispatch={dispatchIdentify} kind={cellKind} onRestart={() => restartIdentify(cellKind)} onReview={review} />;
  } else if (mode === "function") {
    panel = <ChoicePanel round={fn} dispatch={dispatchFn} variant="function" kind={cellKind} onRestart={() => restartFunction(cellKind)} onReview={review} />;
  } else {
    panel = (
      <div className="flex flex-col gap-6">
        <CompareTable kind={cellKind} selectedId={selectedId} onSelect={compareRowSelect} highlightDifferences={highlightDiffs} onToggleHighlight={() => setHighlightDiffs((v) => !v)} />
        {selected ? <InfoPanel organelle={selected} kind={cellKind} /> : null}
        <div className="border-t border-line pt-5 dark:border-line-dark">
          <ChoicePanel round={sort} dispatch={dispatchSort} variant="sort" kind={cellKind} onRestart={restartSort} onReview={review} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <SimulationLayout
        size="wide"
        stageLabel={`${cellKind === "animal" ? "Animal" : "Plant"} cell diagram`}
        aspect={1.2}
        aspectLg={4 / 3}
        stageCap="64rem"
        stage={<CellStage kind={cellKind} scene={scene} reducedMotion={reducedMotion} viewport={viewport} showAllLabels={showLabels && labelsAllowed} focusLabelId={focusLabelId} />}
        readouts={<div aria-live="polite">{readout}</div>}
        actions={
          <>
            <CellSwitch value={cellKind} onChange={handleCellChange} />
            <Button
              size="md"
              variant={showLabels && labelsAllowed ? "secondary" : "ghost"}
              onClick={() => setShowLabels((v) => !v)}
              aria-pressed={showLabels && labelsAllowed}
              disabled={!labelsAllowed}
              title={labelsAllowed ? undefined : "Names are hidden during this activity"}
            >
              <Tag className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {showLabels && labelsAllowed ? "Hide labels" : "Show labels"}
            </Button>
            <Button size="md" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Reset
            </Button>
          </>
        }
        controls={
          <div className="flex flex-col gap-4">
            <ModeTabs value={mode} onChange={handleModeChange} panelId={PANEL_ID} />
            <p className="text-sm text-ink-soft dark:text-bone-soft">{modeInfo.blurb}</p>
            <div id={PANEL_ID} role="tabpanel" aria-labelledby={`cell-mode-tab-${mode}`} tabIndex={-1}>
              {panel}
            </div>
          </div>
        }
        explanation={
          <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
            <summary className="min-h-9 cursor-pointer font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:text-bone dark:focus-visible:outline-bone">
              About this diagram
            </summary>
            <p className="mt-2">
              This is a simplified, <strong>not to scale</strong> illustration of a typical cell. Sizes, shapes, positions and numbers are chosen to make each structure easy to see.
              In a real cell, ribosomes (about 25 nanometres) are thousands of times smaller than the nucleus (several micrometres), organelles are packed much more tightly, and a
              cell can hold hundreds or thousands of mitochondria rather than a few.
            </p>
            <p className="mt-2">
              Cells also differ from one another. Mature human red blood cells have no nucleus, root cells have no chloroplasts, and different cell types have more or fewer of each organelle.
            </p>
          </details>
        }
      />
    </div>
  );
}
