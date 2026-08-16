"use client";

import {
  InstructionsPanel,
  Legend,
  SimulationContainer,
  Toolbar,
  useSimulation,
} from "@/features/simulation";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useCartEngine, useCartSnapshot } from "./cart-engine";
import {
  AccessibilityBar,
  type AccessibilitySettings,
} from "./components/accessibility-bar";
import { CartCanvas, type CartDisplayOptions } from "./components/cart-canvas";
import { ChallengeMode } from "./components/challenge-mode";
import { CartDataPanel, Law3DataPanel } from "./components/data-panel";
import { FormulaSection } from "./components/formula-section";
import { Law1Panel } from "./components/law1-panel";
import { Law2Graphs } from "./components/law2-graphs";
import { Law2Panel } from "./components/law2-panel";
import { Law3Canvas } from "./components/law3-canvas";
import { Law3Panel } from "./components/law3-panel";
import { LearningMode } from "./components/learning-mode";
import {
  TeacherControls,
  type TeacherSettings,
} from "./components/teacher-mode";
import { useLaw3Engine, useLaw3Snapshot } from "./law3-engine";
import type { Law3ScenarioKey } from "./physics";
import { newtonsLawsSchema } from "./schema";

type Law = 1 | 2 | 3;
type SidePanelTab = "formulas" | "learn" | "challenge" | "teacher";

const LAW_LABELS: Record<Law, string> = {
  1: "Law 1 — Inertia",
  2: "Law 2 — F = ma",
  3: "Law 3 — Action & Reaction",
};
const TAB_LABELS: Record<SidePanelTab, string> = {
  formulas: "Formulas",
  learn: "Learning mode",
  challenge: "Challenge mode",
  teacher: "Teacher mode",
};

export function NewtonsLaws() {
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
  });

  return (
    <div
      className={cn(
        accessibility.largeText && "text-[1.0625rem] leading-relaxed",
        accessibility.highContrast && "contrast-125 saturate-150",
      )}
    >
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <AccessibilityBar
          settings={accessibility}
          onChange={setAccessibility}
        />
      </div>
      <SimulationContainer
        label="Newton's Laws interactive laboratory"
        schema={newtonsLawsSchema}
        initialSpeed={1}
        className="relative"
      >
        <NewtonsLawsBody />
      </SimulationContainer>
    </div>
  );
}

function NewtonsLawsBody() {
  const { values, frameCount } = useSimulation();
  const [law, setLaw] = useState<Law>(1);
  const [tab, setTab] = useState<SidePanelTab>("formulas");
  const [teacher, setTeacher] = useState<TeacherSettings>({
    presentationMode: false,
    highlightVectors: false,
    formulasOnly: false,
  });
  const [cartView, setCartView] = useState<CartDisplayOptions>({
    showVectors: true,
    showFreeBody: true,
    showForceLabels: true,
    highlightVectors: false,
  });

  const cartEngine = useCartEngine();
  const cartSnapshot = useCartSnapshot(cartEngine, values);

  const law3Engine = useLaw3Engine(law === 3);
  const law3Readouts = useLaw3Snapshot(law3Engine, values);

  // The framework's Reset button (in the Toolbar) resets its own time/parameter
  // state via `resetAll()`, but has no idea these two `World`s exist —
  // their bodies' position/velocity persist independently. Detecting the
  // frameCount-drops-to-zero edge (not just "frameCount === 0", which is
  // also true on first mount) lets Reset also put both rigs back to their
  // starting state, so "Reset" means what a student expects it to mean.
  const prevFrameCountRef = useRef(frameCount);
  useEffect(() => {
    if (frameCount === 0 && prevFrameCountRef.current > 0) {
      cartEngine.reset();
      law3Engine.reset();
    }
    prevFrameCountRef.current = frameCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  const setLawAndScenario = (nextLaw: Law) => setLaw(nextLaw);
  const setLaw3Scenario = (key: Law3ScenarioKey) => {
    setLaw(3);
    law3Engine.setScenario(key);
  };

  const presentation = teacher.presentationMode;
  const displayOptions = {
    ...cartView,
    highlightVectors: teacher.highlightVectors,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!presentation ? (
          <div
            role="tablist"
            aria-label="Newton's Law"
            className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
          >
            {([1, 2, 3] as Law[]).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={law === l}
                onClick={() => setLawAndScenario(l)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  law === l
                    ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                    : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                )}
              >
                {LAW_LABELS[l]}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            {LAW_LABELS[law]} — Presentation mode
          </span>
        )}
        <TeacherControls settings={teacher} onChange={setTeacher} />
      </div>

      <div
        className={cn(
          "grid gap-6",
          !presentation && !teacher.formulasOnly && "lg:grid-cols-[1fr_360px]",
        )}
      >
        <div className="flex flex-col gap-4">
          {!teacher.formulasOnly ? (
            law === 3 ? (
              <Law3Canvas
                engine={law3Engine}
                readouts={law3Readouts}
                highlightVectors={teacher.highlightVectors}
              />
            ) : (
              <CartCanvas
                engine={cartEngine}
                snapshot={cartSnapshot}
                options={displayOptions}
              />
            )
          ) : null}
          <Toolbar exportFilename="newtons-laws" />
          {!presentation && !teacher.formulasOnly ? (
            <Legend
              items={[
                { label: "Applied / action", color: "#3D5AFE", shape: "line" },
                {
                  label: "Friction / reaction",
                  color: "#E0524F",
                  shape: "line",
                },
                { label: "Velocity", color: "#2E9E5B", shape: "line" },
              ]}
            />
          ) : null}
        </div>

        {!presentation ? (
          <div className="flex flex-col gap-4">
            {!teacher.formulasOnly ? (
              law === 1 ? (
                <Law1Panel
                  engine={cartEngine}
                  forceOn={cartEngine.forceOn}
                  viewOptions={cartView}
                  onViewOptionsChange={setCartView}
                />
              ) : law === 2 ? (
                <Law2Panel
                  engine={cartEngine}
                  forceOn={cartEngine.forceOn}
                  readouts={cartSnapshot.readouts}
                />
              ) : (
                <Law3Panel engine={law3Engine} />
              )
            ) : null}

            {law === 3 ? (
              <Law3DataPanel readouts={law3Readouts} />
            ) : (
              <CartDataPanel readouts={cartSnapshot.readouts} />
            )}
          </div>
        ) : null}
      </div>

      {!presentation ? (
        <>
          <InstructionsPanel
            title="How to use this lab"
            defaultOpen={false}
            steps={[
              "Pick a Law tab above — each one uses the same underlying physics engine, with different controls surfaced.",
              "Adjust sliders, then Apply Force (Law 1/2) or run the scenario's action (Law 3) and watch the live data update.",
              'Switch to Learning Mode for guided "why does this happen?" walkthroughs, or Challenge Mode to test your intuition.',
              "Teacher Mode adds presentation controls: freeze, slow motion, bolder vectors, formulas-only, and fullscreen.",
            ]}
          />

          <div
            role="tablist"
            aria-label="Panel"
            className="flex flex-wrap gap-2 border-t border-line pt-4 dark:border-line-dark"
          >
            {(Object.keys(TAB_LABELS) as SidePanelTab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  tab === key
                    ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                    : "border border-ink/10 text-ink-soft hover:text-ink dark:border-bone/15 dark:text-bone-soft dark:hover:text-bone",
                )}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>

          {tab === "formulas" ? (
            <FormulaSection readouts={cartSnapshot.readouts} />
          ) : null}
          {tab === "learn" ? (
            <LearningMode
              onSelectLaw={setLawAndScenario}
              onSelectLaw3Scenario={setLaw3Scenario}
            />
          ) : null}
          {tab === "challenge" ? (
            <ChallengeMode
              activeLaw={law}
              cartReadouts={cartSnapshot.readouts}
              law3Readouts={law3Readouts}
            />
          ) : null}
          {tab === "teacher" ? (
            <div className="rounded-card border border-line bg-white/50 p-4 text-sm text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft sm:p-5">
              Teacher Mode controls live in the pill in the top-right —
              Presentation, Highlight vectors, Formulas only, Freeze, Slow
              motion, and Fullscreen. They work from any Law tab.
            </div>
          ) : null}

          {law === 2 ? (
            <Law2Graphs
              trail={cartSnapshot.trail}
              readouts={cartSnapshot.readouts}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
