"use client";

import { useReducer, useState, type KeyboardEvent } from "react";
import { Coins, Compass, Flame, Layers, ListChecks, Tag } from "lucide-react";
import { SimulationLayout, usePrefersReducedMotion, type SimulationRunState } from "@/features/simulation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { arrangeReducer, newArrange } from "../meiosis/activities/model";
import { ArrangePanel } from "../meiosis/components/activity-panels";
import { Tabs } from "../meiosis/components/tabs";
import { useBeatClock, useClockMeta, type Speed } from "../meiosis/hooks/use-beat-timeline";
import { JourneyNav, LabLink } from "../cellular-energy-shared/journey-nav";
import { QuizPanel } from "../cellular-energy-shared/quiz-panel";
import { SortPanel } from "../cellular-energy-shared/sort-panel";
import { CE_STYLE, card, eyebrow } from "../cellular-energy-shared/style";
import { StepStrip, Transport, transportKeys } from "../cellular-energy-shared/transport";
import { CURRENCY_STEPS, CurrencyStage } from "./components/currency-stage";
import { EnergySystemStage, type SystemPart } from "./components/energy-system-stage";
import { FlowDiagram, FreeEnergyDiagrams } from "./components/flow-diagrams";
import { MetabolismStage, type MetaMode } from "./components/metabolism-stage";
import { ANABOLIC_EXAMPLES, ARRANGE_LABELS, CATABOLIC_EXAMPLES, CHALLENGE_BANK, COMPARE_ROWS, FLOW_STEPS, IDENTIFY_BANK, KEY_TERMS, LEDGER, PREDICT_BANK, SORT_COUPLING, SORT_FREE, SORT_META } from "./model";

type Workspace = "system" | "transform" | "metabolism" | "currency" | "challenge";
type Challenge = "sources" | "arrange" | "classify" | "free" | "coupling" | "predict" | "final";

const WS: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "system", label: "Energy system", icon: <Compass className="h-4 w-4" aria-hidden="true" /> },
  { id: "transform", label: "Transformations", icon: <Flame className="h-4 w-4" aria-hidden="true" /> },
  { id: "metabolism", label: "Metabolism", icon: <Layers className="h-4 w-4" aria-hidden="true" /> },
  { id: "currency", label: "ATP currency", icon: <Coins className="h-4 w-4" aria-hidden="true" /> },
  { id: "challenge", label: "Energy flow challenge", icon: <ListChecks className="h-4 w-4" aria-hidden="true" /> },
];
const CH: { id: Challenge; label: string }[] = [
  { id: "sources", label: "Sources & transfers" },
  { id: "arrange", label: "Arrange the sequence" },
  { id: "classify", label: "Catabolic or anabolic?" },
  { id: "free", label: "Releases or requires?" },
  { id: "coupling", label: "ATP & work" },
  { id: "predict", label: "Predict" },
  { id: "final", label: "Mixed challenge" },
];

const PART_INFO: Record<SystemPart, { title: string; text: string }> = {
  nutrient: { title: "Nutrient molecules (e.g. glucose)", text: "Energy source. Chemical energy is stored in their bonds. Cells obtain nutrients from food, or make them (producers use light)." },
  cytoplasm: { title: "Cytoplasm (cytosol)", text: "Where glycolysis begins: glucose is split into two pyruvate molecules and a small amount of ATP is made." },
  mitochondrion: { title: "Mitochondrion", text: "Completes the oxidation of fuel and makes most of the cell's ATP in aerobic eukaryotic cells (oxygen is used, CO₂ released)." },
  atp: { title: "ATP", text: "The shared energy carrier. Made where energy is released, spent where work is done, then recycled as ADP + Pi." },
  work: { title: "Cellular work", text: "Active transport, movement and biosynthesis require free energy. ATP hydrolysis is coupled to them." },
  heat: { title: "Heat", text: "No energy conversion is perfectly efficient. Energy is conserved: whatever is not captured in ATP or used for work is released as heat." },
};

const chip = (on: boolean) =>
  cn(
    "min-h-10 rounded-full border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
    on ? "border-subject-biology bg-subject-biology text-white dark:text-chalkboard" : "border-line text-ink-soft hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:text-bone",
  );

/**
 * Introduction to Cellular Energy: the conceptual foundation. A large animated cell shows energy moving from nutrients
 * through mitochondria to ATP and work (with heat); other sections unpack transformations (exergonic vs endergonic),
 * catabolism vs anabolism, ATP as a currency (linking to the ATP lab) and an Energy Flow Challenge.
 */
export function CellularEnergy() {
  const reduced = usePrefersReducedMotion();
  const [speed, setSpeed] = useState<Speed>(1);
  const [workspace, setWorkspace] = useState<Workspace>("system");
  const [challenge, setChallenge] = useState<Challenge>("sources");
  const [showLabels, setShowLabels] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [part, setPart] = useState<SystemPart | null>(null);
  const [flow, setFlow] = useState(0);
  const [coupled, setCoupled] = useState(false);
  const [metaMode, setMetaMode] = useState<MetaMode>("compare");
  const [cur, setCur] = useState(0);
  const [arrange, dispatchArrange] = useReducer(arrangeReducer, undefined, () => newArrange(3, FLOW_STEPS.length));

  const sys = useBeatClock(reduced, speed, FLOW_STEPS.length);
  const meta = useBeatClock(reduced, speed, 4);
  const sm = useClockMeta(sys);
  const mm = useClockMeta(meta);

  const activeClock = workspace === "system" ? { c: sys, m: sm, n: FLOW_STEPS.length } : workspace === "metabolism" ? { c: meta, m: mm, n: 4 } : null;
  const playPause = () => activeClock && (activeClock.m.playing ? activeClock.c.pause() : activeClock.c.play());
  const restart = () => activeClock?.c.goTo(0, { immediate: true, ignoreGate: true });
  const onKeyDown = (e: KeyboardEvent) => activeClock && transportKeys(e, { playPause, step: (d) => activeClock.c.step(d), restart });
  const runState: SimulationRunState | undefined = activeClock ? (activeClock.m.playing ? "running" : activeClock.m.beat >= activeClock.n - 1 ? "finished" : activeClock.m.beat > 0 ? "paused" : "idle") : undefined;

  let stage: React.ReactNode;
  let label = "Cellular energy system";
  if (workspace === "metabolism") {
    stage = <MetabolismStage mode={metaMode} clock={meta} />;
    label = "Metabolism: catabolism and anabolism";
  } else if (workspace === "currency") {
    stage = <CurrencyStage step={cur} />;
    label = "ATP as an energy currency";
  } else if (workspace === "transform") {
    stage = (
      <div className="flex h-full w-full flex-col justify-center gap-3 overflow-y-auto rounded-[18px] bg-[var(--ce-field-a)] p-3 sm:p-4" data-testid="transform-stage">
        <FlowDiagram selected={flow} onSelect={(i) => (setFlow(i), sys.goTo(i, { immediate: true, ignoreGate: true }))} />
        <FreeEnergyDiagrams coupled={coupled} />
      </div>
    );
    label = "Energy transformation explorer";
  } else {
    stage = <EnergySystemStage clock={sys} showLabels={showLabels} selected={part} onPick={(p) => setPart((c) => (c === p ? null : p))} />;
  }

  const readout = (() => {
    if (workspace === "system") return part ? PART_INFO[part].title : `${sm.beat + 1}. ${FLOW_STEPS[sm.beat]!.title}`;
    if (workspace === "transform") return `${flow + 1}. ${FLOW_STEPS[flow]!.title}`;
    if (workspace === "metabolism") return metaMode === "compare" ? "Compare catabolism and anabolism side by side." : metaMode === "catabolism" ? "Catabolism: large molecules are broken down and free energy is released." : "Anabolism: small molecules are built up using ATP-coupled free energy.";
    if (workspace === "currency") return CURRENCY_STEPS[cur]!.title;
    return "Energy flow challenge: sort, arrange and predict.";
  })();

  const labelsBtn = (
    <Button size="sm" variant={showLabels ? "secondary" : "ghost"} onClick={() => setShowLabels((v) => !v)} aria-pressed={showLabels} data-testid="labels-toggle" title="Labels (L)">
      <Tag className="h-4 w-4" aria-hidden="true" />
      Labels
    </Button>
  );
  const actions = activeClock ? (
    <Transport playing={activeClock.m.playing} atStart={activeClock.m.beat === 0} atEnd={activeClock.m.beat >= activeClock.n - 1} speed={speed} onPlayPause={playPause} onStep={(d) => activeClock.c.step(d)} onRestart={restart} onSpeed={setSpeed} extra={workspace === "system" ? labelsBtn : undefined} />
  ) : workspace === "currency" ? (
    <div className="flex flex-wrap justify-center gap-1.5">
      <Button size="sm" variant="secondary" onClick={() => setCur((c) => (c + 3) % 4)} aria-label="Previous step" data-testid="cur-prev">Previous</Button>
      <Button size="sm" variant="primary" onClick={() => setCur((c) => (c + 1) % 4)} aria-label="Next step" data-testid="cur-next">Next step</Button>
    </div>
  ) : undefined;

  const info = (title: string, text: string, adv?: string) => (
    <div className={card} data-testid="info-card">
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

  const systemPanel = (
    <div className="flex flex-col gap-3">
      <StepStrip steps={FLOW_STEPS.map((s) => s.short)} beat={sm.beat} onGo={(i) => sys.goTo(i)} label="Energy flow steps" />
      {part ? info(PART_INFO[part].title, PART_INFO[part].text) : info(`Step ${sm.beat + 1} of ${FLOW_STEPS.length}: ${FLOW_STEPS[sm.beat]!.title}`, FLOW_STEPS[sm.beat]!.text, FLOW_STEPS[sm.beat]!.advanced)}
      <div className={card}>
        <p className={eyebrow}>Select a part</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.keys(PART_INFO) as SystemPart[]).map((p) => (
            <button key={p} type="button" aria-pressed={part === p} onClick={() => setPart((c) => (c === p ? null : p))} className={chip(part === p)} data-pick={p}>
              {p === "nutrient" ? "Nutrient" : p === "cytoplasm" ? "Cytoplasm" : p === "mitochondrion" ? "Mitochondrion" : p === "atp" ? "ATP" : p === "work" ? "Cellular work" : "Heat"}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">You can also click the parts on the picture. Cells transform energy; they never create it.</p>
      </div>
    </div>
  );

  const transformPanel = (
    <div className="flex flex-col gap-3">
      {info(`${flow + 1}. ${FLOW_STEPS[flow]!.title}`, FLOW_STEPS[flow]!.text, FLOW_STEPS[flow]!.advanced)}
      <div className={card}>
        <p className={eyebrow}>Releasing or requiring free energy</p>
        <div role="radiogroup" aria-label="Free energy diagram" className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" role="radio" aria-checked={!coupled} className={chip(!coupled)} onClick={() => setCoupled(false)} data-coupled="no">Alone</button>
          <button type="button" role="radio" aria-checked={coupled} className={chip(coupled)} onClick={() => setCoupled(true)} data-coupled="yes">Coupled to ATP hydrolysis</button>
        </div>
        <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">An <strong>exergonic</strong> reaction (ΔG &lt; 0) releases free energy. An <strong>endergonic</strong> reaction (ΔG &gt; 0) needs it. Coupling to ATP hydrolysis can make an endergonic reaction proceed because the total ΔG is negative.</p>
      </div>
      <div className={card} data-testid="ledger">
        <p className={eyebrow}>Where does the energy go? (aerobic glucose oxidation)</p>
        <div className="mt-2 flex h-6 overflow-hidden rounded-full border border-line dark:border-line-dark" role="img" aria-label={`About ${Math.round(LEDGER.atpLow * 100)} to ${Math.round(LEDGER.atpHigh * 100)} percent captured in ATP, the rest released as heat`}>
          <div className="flex items-center justify-center bg-[var(--ce-atp)] text-[10px] font-bold text-black" style={{ width: `${LEDGER.atpLow * 100}%` }}>ATP</div>
          <div className="flex flex-1 items-center justify-center bg-[var(--ce-adp)] text-[10px] font-bold text-black">heat</div>
        </div>
        <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">Commonly cited: roughly one third to somewhat over a third of the free energy is captured in ATP; the rest is released as heat. Energy is conserved.</p>
      </div>
      <div className={card}>
        <p className={eyebrow}>Key terms</p>
        <dl className="mt-1 grid gap-1 text-sm">
          {KEY_TERMS.map((k) => (
            <div key={k.term}>
              <dt className="inline font-semibold text-ink dark:text-bone">{k.term}: </dt>
              <dd className="inline text-ink-soft dark:text-bone-soft">{k.def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );

  const metabolismPanel = (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Metabolism view" className="flex flex-wrap gap-1.5">
        {(["catabolism", "anabolism", "compare"] as MetaMode[]).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={metaMode === m} onClick={() => setMetaMode(m)} className={chip(metaMode === m)} data-meta={m}>
            {m === "compare" ? "Compare both" : m === "catabolism" ? "Catabolism" : "Anabolism"}
          </button>
        ))}
      </div>
      {metaMode !== "anabolism" ? (
        <div className={card}>
          <p className={eyebrow}>Catabolism — examples</p>
          <ul className="mt-1 flex flex-col gap-1 text-sm text-ink dark:text-bone">
            {CATABOLIC_EXAMPLES.map((e) => (
              <li key={e.id}><strong>{e.label}:</strong> {e.from} → {e.to}. <span className="text-ink-soft dark:text-bone-soft">{e.note}</span></li>
            ))}
          </ul>
          <div className="mt-2"><LabLink href="/dashboard/biology/cellular-respiration" testId="link-respiration">See glucose breakdown in detail</LabLink></div>
        </div>
      ) : null}
      {metaMode !== "catabolism" ? (
        <div className={card}>
          <p className={eyebrow}>Anabolism — examples</p>
          <ul className="mt-1 flex flex-col gap-1 text-sm text-ink dark:text-bone">
            {ANABOLIC_EXAMPLES.map((e) => (
              <li key={e.id}><strong>{e.label}:</strong> {e.from} → {e.to}. <span className="text-ink-soft dark:text-bone-soft">{e.note}</span></li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className={card}>
        <table className="w-full text-sm" data-testid="meta-table">
          <caption className="sr-only">Catabolism compared with anabolism</caption>
          <thead>
            <tr className="text-left text-xs text-ink-soft dark:text-bone-soft"><th scope="col" className="pb-1 font-medium">&nbsp;</th><th scope="col" className="pb-1 font-medium">Catabolism</th><th scope="col" className="pb-1 font-medium">Anabolism</th></tr>
          </thead>
          <tbody className="align-top text-ink dark:text-bone">
            {COMPARE_ROWS.map((r) => (
              <tr key={r.feature}><th scope="row" className="py-1 pr-2 text-left text-xs font-semibold">{r.feature}</th><td className="py-1 pr-2">{r.cat}</td><td className="py-1">{r.ana}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const currencyPanel = (
    <div className="flex flex-col gap-3">
      <StepStrip steps={CURRENCY_STEPS.map((s) => s.short)} beat={cur} onGo={setCur} label="ATP currency steps" />
      {info(CURRENCY_STEPS[cur]!.title, CURRENCY_STEPS[cur]!.text)}
      <div className={card}>
        <p className={eyebrow}>Go deeper</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">See ATP&apos;s structure, the hydrolysis reaction, the free-energy numbers and four examples of ATP-coupled work.</p>
        <div className="mt-2"><LabLink href="/dashboard/biology/atp-energy-release" testId="link-atp">Open ATP &amp; Energy Release</LabLink></div>
      </div>
    </div>
  );

  const challengePanel = (
    <div className="flex flex-col gap-3">
      <Tabs items={CH} value={challenge} onChange={setChallenge} label="Challenge activity" idPrefix="ce-ch" panelId="ce-ch-panel" cols="grid-cols-2 sm:grid-cols-4" />
      <div id="ce-ch-panel" role="tabpanel" aria-labelledby={`ce-ch-tab-${challenge}`}>
        {challenge === "sources" ? <QuizPanel title="Energy sources and transfers" intro="Identify where energy comes from and how it moves." bank={IDENTIFY_BANK} size={5} testId="sources-quiz" /> : null}
        {challenge === "arrange" ? <ArrangePanel state={arrange} dispatch={dispatchArrange} stages={ARRANGE_LABELS} title="Arrange the energy transformation sequence" intro="Put the five steps of energy transformation in order." solvedNote="Fuel energy → oxidation → carriers and gradient → ATP → work (with heat lost along the way)." hint="Hint: it starts with energy stored in nutrients and ends with ATP being used." /> : null}
        {challenge === "classify" ? <SortPanel title="Catabolic or anabolic?" intro="Classify each process." items={SORT_META} categories={[{ id: "cat", label: "Catabolic" }, { id: "ana", label: "Anabolic" }]} testId="classify-sort" /> : null}
        {challenge === "free" ? <SortPanel title="Does it release or require free energy?" intro="ΔG < 0 releases; ΔG > 0 requires." items={SORT_FREE} categories={[{ id: "rel", label: "Releases free energy" }, { id: "req", label: "Requires free energy" }]} testId="free-sort" /> : null}
        {challenge === "coupling" ? <SortPanel title="Which processes use ATP?" intro="Connect ATP to cellular work." items={SORT_COUPLING} categories={[{ id: "atp", label: "Uses ATP" }, { id: "no", label: "No ATP needed" }]} testId="coupling-sort" /> : null}
        {challenge === "predict" ? <QuizPanel title="Predict" intro="Predict what happens to energy in each case." bank={PREDICT_BANK} size={4} testId="predict-quiz" /> : null}
        {challenge === "final" ? <QuizPanel title="Mixed challenge" intro="All the ideas together." bank={CHALLENGE_BANK} size={8} testId="final-quiz" /> : null}
      </div>
    </div>
  );

  const side = workspace === "system" ? systemPanel : workspace === "transform" ? transformPanel : workspace === "metabolism" ? metabolismPanel : workspace === "currency" ? currencyPanel : challengePanel;

  return (
    <div className="ce-root py-2" data-testid="energy-lab" onKeyDown={onKeyDown}>
      <style>{CE_STYLE}</style>
      <JourneyNav current="intro" className="mb-3" />
      <Tabs items={WS} value={workspace} onChange={setWorkspace} label="Cellular energy sections" idPrefix="ce-ws" panelId="ce-ws-panel" className="mb-3" cols="grid-cols-2 sm:grid-cols-5" />
      <div id="ce-ws-panel" role="tabpanel" aria-labelledby={`ce-ws-tab-${workspace}`}>
        <SimulationLayout
          size="wide"
          stageLabel={label}
          aspect={960 / 540}
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
                <p className={eyebrow}>Where this fits</p>
                <p className="mt-1 text-sm text-ink dark:text-bone">Start here: how cells obtain, transform and use energy. Next, <strong>ATP &amp; Energy Release</strong> explains the carrier; then <strong>Cellular Respiration</strong> follows glucose step by step.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <LabLink href="/dashboard/biology/atp-energy-release" testId="link-atp-2">ATP &amp; Energy Release</LabLink>
                  <LabLink href="/dashboard/biology/cellular-respiration" testId="link-respiration-2">Cellular Respiration</LabLink>
                </div>
              </div>
              <details className="rounded-2xl border border-line bg-white/50 px-4 py-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:bg-white/[0.03] dark:text-bone-soft">
                <summary className="min-h-9 cursor-pointer font-medium text-ink dark:text-bone">About this model and keyboard shortcuts</summary>
                <p className="mt-2">Simplified, not to scale, drawn as SVG (no WebGL needed). The percentage of glucose free energy captured in ATP is an approximate, commonly cited range, not a fixed constant. In the animated sections: Left / Right = step, Space = play or pause, R = restart. Parts of the picture can be focused with Tab and selected with Enter.</p>
              </details>
            </div>
          }
        />
      </div>
    </div>
  );
}
