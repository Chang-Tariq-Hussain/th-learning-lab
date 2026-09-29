"use client";

import { useState } from "react";
import { Callout, PillButton, SectionHeading } from "../../osi-model-explorer/components/ui";
import { formatIPv4, parseIPv4 } from "../../ip-addressing-simulator/model";
import { Chip, KV, TextField } from "../../ip-addressing-simulator/components/parts";
import {
  HOST_PREFIX_CHOICES,
  HOST_QUESTIONS,
  REQUIREMENT_SCENARIOS,
  SUBNET_QUESTIONS,
  borrowedBitsForSubnets,
  buildPlan,
  checkHostsAnswer,
  checkRequirement,
  checkSubnetsAnswer,
  hostBitsForHosts,
  hostsHints,
  maxNewFor,
  pow2,
  requirementPlan,
  subnetsHints,
  usableFor,
  type AnswerFeedback,
  type RequirementResult,
} from "../model";
import { HintBox } from "./hint-box";
import { SubnetMap } from "./subnet-map";
import { SubnetTable } from "./subnet-table";

function Feedback({ fb }: { fb: AnswerFeedback }) {
  return (
    <Callout tone={fb.correct ? "good" : "warn"} title={fb.correct ? "Correct" : "Not quite"}>
      {fb.message}
    </Callout>
  );
}

function Nav({ index, total, onGo }: { index: number; total: number; onGo: (i: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs text-ink-soft dark:text-bone-soft">
        Question {index + 1} of {total}
      </span>
      <PillButton onClick={() => onGo((index + 1) % total)}>Next question</PillButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section 9: How many subnets?
// ---------------------------------------------------------------------------

export function SubnetsMode() {
  const [qi, setQi] = useState(0);
  const q = SUBNET_QUESTIONS[qi]!;
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<{ prefix: number; fb: AnswerFeedback } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);

  const base = parseIPv4(q.network);
  const choices = Array.from({ length: Math.min(9, maxNewFor(q.orig) - q.orig + 1) }, (_, i) => q.orig + i);
  const solved = result?.fb.correct === true;

  function go(i: number) {
    setQi(i);
    setPicked(null);
    setResult(null);
    setAttempts(0);
    setHints(0);
    setSolution(false);
  }
  function check() {
    if (picked === null) return;
    setResult({ prefix: picked, fb: checkSubnetsAnswer(q, picked) });
    setAttempts((a) => a + 1);
  }
  const b = borrowedBitsForSubnets(q.need);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="How many subnets?">Choose the new prefix that divides the network the way the question asks. Ask for hints if you get stuck; the answer is not shown until you solve it or ask for it.</SectionHeading>
      <Callout title="Your task">{q.story}</Callout>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Choose the new prefix</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="New prefix">
          {choices.map((c) => (
            <PillButton key={c} active={picked === c} onClick={() => setPicked(c)}>
              /{c}
            </PillButton>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={check} disabled={picked === null} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-5 text-xs font-medium text-paper disabled:opacity-40">
          Check my answer
        </button>
        <button type="button" onClick={() => setSolution(true)} disabled={!solved && attempts < 2} className="min-h-[44px] rounded-full border border-line px-5 text-xs font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone">
          Show solution
        </button>
      </div>
      {!solved && attempts < 2 && <p className="text-xs text-ink-soft dark:text-bone-soft">The solution unlocks after two attempts, or as soon as you get it right.</p>}
      <HintBox hints={subnetsHints(q)} shown={hints} onMore={() => setHints((h) => h + 1)} />
      {result && <Feedback fb={result.fb} />}
      {result && base.ok && (
        <div className="rounded-card border border-line p-3 dark:border-line-dark">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">What /{result.prefix} produces</p>
          <SubnetMap plan={buildPlan(base.value, q.orig, result.prefix)} />
        </div>
      )}
      {solution && (
        <Callout tone="good" title="Solution">
          {q.need} subnets{q.mode === "atLeast" ? " (at least)" : ""} need b borrowed bits with {pow2(b)} = {2 ** b}{q.mode === "atLeast" ? ` ≥ ${q.need}` : ""}, so b = {b}. New prefix = /{q.orig} + {b} = <strong>/{q.orig + b}</strong>.
        </Callout>
      )}
      <Nav index={qi} total={SUBNET_QUESTIONS.length} onGo={go} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section 10: How many hosts?
// ---------------------------------------------------------------------------

export function HostsMode({ initialId }: { initialId?: string }) {
  const start = Math.max(0, HOST_QUESTIONS.findIndex((h) => h.id === initialId));
  const [qi, setQi] = useState(start);
  const q = HOST_QUESTIONS[qi]!;
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerFeedback | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);
  const solved = result?.correct === true;

  function go(i: number) {
    setQi(i);
    setPicked(null);
    setResult(null);
    setAttempts(0);
    setHints(0);
    setSolution(false);
  }
  function check() {
    if (picked === null) return;
    setResult(checkHostsAnswer(q, picked));
    setAttempts((a) => a + 1);
  }
  const h = hostBitsForHosts(q.need);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="How many hosts?">Work from a host requirement to a prefix. Pick a prefix and follow the chain from host bits to usable hosts; then check whether it fits.</SectionHeading>
      <Callout title="Your task">{q.story} Choose the smallest subnet that still fits.</Callout>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Choose a prefix</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Prefix">
          {HOST_PREFIX_CHOICES.map((c) => (
            <PillButton key={c} active={picked === c} onClick={() => { setPicked(c); setResult(null); }}>
              /{c}
            </PillButton>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch" aria-live="polite">
        <Step label="Host bits" value={picked === null ? "?" : `32 − ${picked} = ${32 - picked}`} />
        <Arrow />
        <Step label="Addresses" value={picked === null ? "?" : `${pow2(32 - picked)} = ${(2 ** (32 - picked)).toLocaleString()}`} />
        <Arrow />
        <Step label="Typical usable hosts" value={picked === null ? "?" : `${(2 ** (32 - picked)).toLocaleString()} − 2 = ${usableFor(picked).toLocaleString()}`} />
        <Arrow />
        <Step label="Prefix" value={picked === null ? "?" : `/${picked}`} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={check} disabled={picked === null} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-5 text-xs font-medium text-paper disabled:opacity-40">
          Check my answer
        </button>
        <button type="button" onClick={() => setSolution(true)} disabled={!solved && attempts < 2} className="min-h-[44px] rounded-full border border-line px-5 text-xs font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone">
          Show solution
        </button>
      </div>
      <HintBox hints={hostsHints(q)} shown={hints} onMore={() => setHints((x) => x + 1)} />
      {result && <Feedback fb={result} />}
      {solution && (
        <Callout tone="good" title="Solution">
          Need at least {q.need} usable hosts: H = {h} gives {pow2(h)} − 2 = {usableFor(32 - h)} (H = {h - 1} would give only {usableFor(33 - h)}). Prefix = 32 − {h} = <strong>/{32 - h}</strong>.
        </Callout>
      )}
      <Nav index={qi} total={HOST_QUESTIONS.length} onGo={go} />
    </div>
  );
}

function Step({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-card border border-line p-2.5 dark:border-line-dark">
      <p className="text-[11px] text-ink-soft dark:text-bone-soft">{label}</p>
      <p className="break-words font-mono text-sm text-ink dark:text-bone">{value}</p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className="flex items-center justify-center font-mono text-ink-soft dark:text-bone-soft">
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Section 11: Network requirements
// ---------------------------------------------------------------------------

export function RequirementsMode() {
  const [si, setSi] = useState(0);
  const s = REQUIREMENT_SCENARIOS[si]!;
  const [prefix, setPrefix] = useState<number | null>(null);
  const [subnets, setSubnets] = useState("");
  const [usable, setUsable] = useState("");
  const [second, setSecond] = useState("");
  const [result, setResult] = useState<RequirementResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);

  function pick(i: number) {
    setSi(i);
    setPrefix(null);
    setSubnets("");
    setUsable("");
    setSecond("");
    setResult(null);
    setAttempts(0);
    setHints(0);
    setSolution(false);
  }
  function check() {
    setResult(checkRequirement(s, { prefix, subnets, usable, second }));
    setAttempts((a) => a + 1);
  }
  const choices = Array.from({ length: Math.min(9, maxNewFor(s.orig) - s.orig + 1) }, (_, i) => s.orig + i);
  const answer = requirementPlan(s);
  const solved = result?.allCorrect === true;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Network requirements">Realistic scenarios with one starting network. Work out the new prefix, then the number of subnets, the hosts per subnet, and where the second subnet starts. All subnets are the same size here.</SectionHeading>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
        {REQUIREMENT_SCENARIOS.map((r, i) => (
          <PillButton key={r.id} active={i === si} onClick={() => pick(i)}>
            {r.title}
          </PillButton>
        ))}
      </div>
      <Callout title={s.title}>
        {s.story} <span className="mt-1 block font-mono text-xs">Starting network: {s.network}/{s.orig}</span>
      </Callout>

      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">1. New prefix</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="New prefix">
          {choices.map((c) => (
            <PillButton key={c} active={prefix === c} onClick={() => setPrefix(c)}>
              /{c}
            </PillButton>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <TextField id="rq-subnets" label="2. Number of subnets" value={subnets} onChange={setSubnets} />
        <TextField id="rq-usable" label="3. Typical usable hosts per subnet" value={usable} onChange={setUsable} />
        <TextField id="rq-second" label="4. Network address of subnet 2" value={second} onChange={setSecond} placeholder="x.x.x.x" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={check} className="min-h-[44px] rounded-full border border-subject-it bg-subject-it px-5 text-xs font-medium text-paper">
          Check my answers
        </button>
        <button type="button" onClick={() => setSolution(true)} disabled={!solved && attempts < 2} className="min-h-[44px] rounded-full border border-line px-5 text-xs font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone">
          Show solution
        </button>
      </div>
      <HintBox hints={s.hints} shown={hints} onMore={() => setHints((x) => x + 1)} />

      {result && (
        <div className="flex flex-col gap-2" aria-live="polite">
          {([["New prefix", result.prefix], ["Number of subnets", result.subnets], ["Usable hosts", result.usable], ["Subnet 2 network", result.second]] as const).map(([label, r]) =>
            r ? (
              <div key={label} className="flex flex-wrap items-start gap-2 rounded-card border border-line p-2.5 text-sm dark:border-line-dark">
                <Chip tone={r.correct ? "good" : "warn"}>{r.correct ? "✓" : "✕"} {label}</Chip>
                <span className="min-w-0 flex-1 text-ink-soft dark:text-bone-soft">{r.message}</span>
              </div>
            ) : null,
          )}
          {result.allCorrect && <Callout tone="good" title="All four answers are right">Nice work. Open the solution to see the whole subnet table.</Callout>}
        </div>
      )}

      {solution && (
        <div className="flex flex-col gap-3">
          <Callout tone="good" title="Solution">
            <dl>
              <KV label="New prefix" value={`/${answer.newPrefix}`} mono />
              <KV label="Number of subnets" value={answer.subnetCount} mono />
              <KV label="Typical usable hosts" value={answer.usablePerSubnet} mono />
              <KV label="Subnet 2" value={answer.rows[1] ? `${formatIPv4(answer.rows[1].network)}/${answer.newPrefix}` : "—"} mono />
            </dl>
          </Callout>
          <SubnetTable plan={answer} maxHeight />
        </div>
      )}
    </div>
  );
}
