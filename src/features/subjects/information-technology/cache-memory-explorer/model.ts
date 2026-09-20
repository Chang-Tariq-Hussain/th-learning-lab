/**
 * Cache Memory Explorer — pure simulation model.
 *
 * Nothing in this file touches React, the DOM, timers, or storage.
 * Every function takes plain data and returns new plain data, so the
 * whole lab can be memoized, stepped forwards/backwards by moving an
 * index, and verified in isolation.
 *
 * WHAT THIS MODELS (and what it deliberately does not)
 * ---------------------------------------------------
 * A conceptual, read-only memory hierarchy: CPU → L1 → L2 → L3 → RAM.
 * It is an educational model, not a reproduction of any particular
 * commercial processor. Real CPUs differ in cache sizes, line sizes,
 * associativity, replacement policies, inclusion rules, write
 * handling, prefetching, and how lookups overlap in time. Nothing
 * here should be read as a hardware specification.
 *
 * Simplifications, all stated in the UI too:
 *  - Loads only. Stores, write-back/write-through, and dirty bits are
 *    not modelled (coherence is a separate, purely conceptual lab).
 *  - Addresses are word addresses, 0–1023 (10 bits). One "word" is one
 *    addressable unit; real systems address bytes.
 *  - On a miss, a copy of the line is placed in every cache level the
 *    request passed through on its way back to the CPU. Evicting from
 *    one level never invalidates another.
 *
 * TIMING MODEL — serial and cumulative
 * ------------------------------------
 * Each level that is checked costs its own lookup time; RAM costs its
 * access time if the request reaches it. A request found in L2 costs
 * `L1 + L2`; one that reaches RAM costs `L1 + L2 + L3 + RAM`. Real
 * hardware overlaps and pipelines these steps, so this is a teaching
 * simplification. It has one deliberate benefit: with a single cache
 * level in front of RAM, the average access time the simulation
 * *measures* is exactly the textbook formula
 *
 *      average access time = hit time + miss rate × miss penalty
 *
 * (a hit costs `hit time`; a miss costs `hit time + miss penalty`),
 * so the Performance Lab can show a real formula check rather than a
 * number that merely resembles it. Every latency here is a
 * SIMULATION VALUE in abstract units — never a real-world time.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ADDRESS_BITS = 10;
export const ADDRESS_MAX = (1 << ADDRESS_BITS) - 1; // 1023
export const MAX_SEQUENCE_LENGTH = 200;

export type LevelId = "l1" | "l2" | "l3";
export type Servicer = LevelId | "ram";
export const LEVEL_ORDER: LevelId[] = ["l1", "l2", "l3"];

/** Illustrative simulated latencies, in abstract "simulated units". */
export const DEFAULT_LATENCY: Record<Servicer, number> = { l1: 1, l2: 4, l3: 12, ram: 50 };

export type DetailLevel = "beginner" | "intermediate" | "technical";
export const DETAIL_LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];
export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  technical: "Technical",
};
export const DETAIL_LEVEL_DESCRIPTIONS: Record<DetailLevel, string> = {
  beginner: "What cache is and why it exists: CPU vs cache vs RAM, hits, misses, and the speed/size trade-off.",
  intermediate: "Adds L1/L2/L3, hit and miss rates, locality, cache lines, eviction, and the Performance Lab.",
  technical: "Adds mapping, associativity, tag/index/offset, replacement policies, instruction vs data cache, coherence, and the average access time formula.",
};

export function levelIndex(level: DetailLevel): number {
  return DETAIL_LEVELS.indexOf(level);
}
export function atLeast(level: DetailLevel, minimum: DetailLevel): boolean {
  return levelIndex(level) >= levelIndex(minimum);
}

export type Mapping = "direct" | "set2" | "full";
export const MAPPING_LABELS: Record<Mapping, string> = {
  direct: "Direct-mapped",
  set2: "2-way set-associative",
  full: "Fully associative",
};

export type Policy = "fifo" | "lru" | "random";
export const POLICY_LABELS: Record<Policy, string> = { fifo: "FIFO", lru: "LRU", random: "Random" };
export const POLICY_DESCRIPTIONS: Record<Policy, string> = {
  fifo: "Evicts the line that has been in the cache the longest, ignoring how recently it was used.",
  lru: "Evicts the line that was used least recently, betting that recent use predicts future use.",
  random: "Evicts a pseudo-randomly chosen line. Cheap to build, and surprisingly hard to trick.",
};

// ---------------------------------------------------------------------------
// Configuration & state
// ---------------------------------------------------------------------------

export interface CacheConfig {
  /** 1 = one cache in front of RAM (two-level model); 3 = L1 + L2 + L3. */
  levelCount: 1 | 3;
  /** Lines in L1. L2 has 2×, L3 has 4× as many. */
  l1Lines: number;
  /** Words per cache line. */
  lineSize: number;
  mapping: Mapping;
  policy: Policy;
  /** Seed for the Random policy — fixed, so every run is reproducible. */
  seed: number;
  latency: Record<Servicer, number>;
}

export const DEFAULT_CONFIG: CacheConfig = {
  levelCount: 1,
  l1Lines: 4,
  lineSize: 1,
  mapping: "full",
  policy: "lru",
  seed: 7,
  latency: DEFAULT_LATENCY,
};

export interface CacheLine {
  /** Memory block number held by this line (address ÷ line size, rounded down). */
  block: number;
  loadedAt: number;
  lastUsed: number;
}

export interface LevelState {
  id: LevelId;
  lines: number;
  ways: number;
  setCount: number;
  /** `sets[setIndex][way]` — `null` is an empty (invalid) way. */
  sets: (CacheLine | null)[][];
}

export interface Stats {
  total: number;
  /** Requests served by any cache level. */
  hits: number;
  /** Requests that had to go all the way to RAM. */
  misses: number;
  byLevel: Record<Servicer, number>;
  evictions: number;
  totalTime: number;
}

export interface SystemState {
  config: CacheConfig;
  levels: LevelState[];
  clock: number;
  rng: number;
  stats: Stats;
}

export function levelLineCounts(config: CacheConfig): number[] {
  const all = [config.l1Lines, config.l1Lines * 2, config.l1Lines * 4];
  return all.slice(0, config.levelCount);
}

export function waysFor(mapping: Mapping, lines: number): number {
  if (mapping === "direct") return 1;
  if (mapping === "full") return Math.max(1, lines);
  return lines >= 2 && lines % 2 === 0 ? 2 : 1;
}

function emptyStats(): Stats {
  return { total: 0, hits: 0, misses: 0, byLevel: { l1: 0, l2: 0, l3: 0, ram: 0 }, evictions: 0, totalTime: 0 };
}

export function createSystem(config: CacheConfig): SystemState {
  const counts = levelLineCounts(config);
  const levels: LevelState[] = counts.map((lines, i) => {
    const ways = waysFor(config.mapping, lines);
    const setCount = Math.max(1, Math.floor(lines / ways));
    return {
      id: LEVEL_ORDER[i]!,
      lines,
      ways,
      setCount,
      sets: Array.from({ length: setCount }, () => Array.from({ length: ways }, () => null)),
    };
  });
  return { config, levels, clock: 0, rng: config.seed >>> 0, stats: emptyStats() };
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-randomness (mulberry32)
// ---------------------------------------------------------------------------

export function nextRandom(state: number): { value: number; state: number } {
  const t = (state + 0x6d2b79f5) >>> 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return { value: ((r ^ (r >>> 14)) >>> 0) / 4294967296, state: t };
}

/** A reproducible list of `count` addresses in `[0, max]`. */
export function seededAddresses(seed: number, count: number, max = ADDRESS_MAX): number[] {
  let state = seed >>> 0;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const r = nextRandom(state);
    state = r.state;
    out.push(Math.floor(r.value * (max + 1)));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Simulated memory contents
// ---------------------------------------------------------------------------

/** The (fake, deterministic) value stored in RAM at an address. */
export function wordValue(address: number): number {
  return (address * 37 + 11) % 100;
}

export function blockOf(address: number, lineSize: number): number {
  return Math.floor(address / lineSize);
}

export function blockStart(block: number, lineSize: number): number {
  return block * lineSize;
}

export function lineWords(block: number, lineSize: number): { address: number; value: number }[] {
  const start = blockStart(block, lineSize);
  return Array.from({ length: lineSize }, (_, i) => ({ address: start + i, value: wordValue(start + i) }));
}

export function formatHex(value: number, digits = 4): string {
  return `0x${value.toString(16).toUpperCase().padStart(digits, "0")}`;
}

export function formatRange(block: number, lineSize: number): string {
  const start = blockStart(block, lineSize);
  return lineSize === 1 ? `${start}` : `${start}–${start + lineSize - 1}`;
}

// ---------------------------------------------------------------------------
// Names
// ---------------------------------------------------------------------------

/** With one cache level the lab just calls it "Cache"; with three, L1/L2/L3. */
export function levelName(id: Servicer, levelCount: 1 | 3): string {
  if (id === "ram") return "RAM";
  if (levelCount === 1) return "Cache";
  return id.toUpperCase();
}

// ---------------------------------------------------------------------------
// Access
// ---------------------------------------------------------------------------

export interface LookupEvent {
  level: LevelId;
  outcome: "hit" | "miss";
  setIndex: number;
}

export interface FillEvent {
  level: LevelId;
  setIndex: number;
  way: number;
  /** Block that had to be thrown out to make room, if the set was full. */
  evictedBlock: number | null;
}

export interface LatencyPart {
  id: Servicer;
  units: number;
}

export interface AccessResult {
  seq: number;
  address: number;
  block: number;
  offset: number;
  data: number;
  foundAt: Servicer;
  /** Served by some cache level (i.e. did not need RAM). */
  hit: boolean;
  lookups: LookupEvent[];
  fills: FillEvent[];
  latency: number;
  latencyParts: LatencyPart[];
}

function findWay(set: (CacheLine | null)[], block: number): number {
  return set.findIndex((line) => line !== null && line.block === block);
}

function chooseVictim(set: (CacheLine | null)[], policy: Policy, rng: number): { way: number; rng: number } {
  const empty = set.findIndex((line) => line === null);
  if (empty !== -1) return { way: empty, rng };

  if (policy === "random") {
    const r = nextRandom(rng);
    return { way: Math.min(set.length - 1, Math.floor(r.value * set.length)), rng: r.state };
  }

  let best = 0;
  let bestKey = Infinity;
  set.forEach((line, way) => {
    if (!line) return;
    const key = policy === "fifo" ? line.loadedAt : line.lastUsed;
    if (key < bestKey) {
      bestKey = key;
      best = way;
    }
  });
  return { way: best, rng };
}

/**
 * Performs one read. Returns the new state (the input is never
 * mutated) and a full description of what happened, which the UI
 * turns into animation steps and table highlights.
 */
export function accessSystem(state: SystemState, address: number): { next: SystemState; result: AccessResult } {
  const { config } = state;
  const clock = state.clock + 1;
  const block = blockOf(address, config.lineSize);
  const offset = address - blockStart(block, config.lineSize);

  const levels = state.levels.map((level) => ({ ...level, sets: level.sets.slice() }));
  const lookups: LookupEvent[] = [];
  const latencyParts: LatencyPart[] = [];
  let foundIndex = -1;

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]!;
    const setIndex = block % level.setCount;
    const set = level.sets[setIndex]!;
    latencyParts.push({ id: level.id, units: config.latency[level.id] });
    const way = findWay(set, block);
    if (way !== -1) {
      lookups.push({ level: level.id, outcome: "hit", setIndex });
      const updated = set.slice();
      const line = updated[way]!;
      updated[way] = { ...line, lastUsed: clock };
      level.sets[setIndex] = updated;
      foundIndex = i;
      break;
    }
    lookups.push({ level: level.id, outcome: "miss", setIndex });
  }

  const reachedRam = foundIndex === -1;
  if (reachedRam) latencyParts.push({ id: "ram", units: config.latency.ram });

  // Fill every level the request passed through, outermost first.
  const fills: FillEvent[] = [];
  let rng = state.rng;
  let evictions = 0;
  const fillFrom = (reachedRam ? levels.length : foundIndex) - 1;
  for (let i = fillFrom; i >= 0; i--) {
    const level = levels[i]!;
    const setIndex = block % level.setCount;
    const set = level.sets[setIndex]!;
    const victim = chooseVictim(set, config.policy, rng);
    rng = victim.rng;
    const evicted = set[victim.way];
    const updated = set.slice();
    updated[victim.way] = { block, loadedAt: clock, lastUsed: clock };
    level.sets[setIndex] = updated;
    if (evicted) evictions += 1;
    fills.push({ level: level.id, setIndex, way: victim.way, evictedBlock: evicted ? evicted.block : null });
  }

  const foundAt: Servicer = reachedRam ? "ram" : levels[foundIndex]!.id;
  const latency = latencyParts.reduce((sum, p) => sum + p.units, 0);

  const stats: Stats = {
    total: state.stats.total + 1,
    hits: state.stats.hits + (reachedRam ? 0 : 1),
    misses: state.stats.misses + (reachedRam ? 1 : 0),
    byLevel: { ...state.stats.byLevel, [foundAt]: state.stats.byLevel[foundAt] + 1 },
    evictions: state.stats.evictions + evictions,
    totalTime: state.stats.totalTime + latency,
  };

  const result: AccessResult = {
    seq: clock,
    address,
    block,
    offset,
    data: wordValue(address),
    foundAt,
    hit: !reachedRam,
    lookups,
    fills,
    latency,
    latencyParts,
  };

  return { next: { config, levels, clock, rng, stats }, result };
}

// ---------------------------------------------------------------------------
// Running a whole pattern
// ---------------------------------------------------------------------------

export interface PatternStep {
  result: AccessResult;
  after: SystemState;
}

export interface PatternRun {
  steps: PatternStep[];
  initial: SystemState;
  final: SystemState;
}

export function runPattern(config: CacheConfig, addresses: number[]): PatternRun {
  const initial = createSystem(config);
  let state = initial;
  const steps: PatternStep[] = [];
  for (const address of addresses) {
    const { next, result } = accessSystem(state, address);
    steps.push({ result, after: next });
    state = next;
  }
  return { steps, initial, final: state };
}

export interface StatSummary {
  total: number;
  hits: number;
  misses: number;
  hitRate: number;
  missRate: number;
  totalTime: number;
  averageTime: number;
  evictions: number;
}

export function summarize(stats: Stats): StatSummary {
  const total = stats.total;
  return {
    total,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: total === 0 ? 0 : stats.hits / total,
    missRate: total === 0 ? 0 : stats.misses / total,
    totalTime: stats.totalTime,
    averageTime: total === 0 ? 0 : stats.totalTime / total,
    evictions: stats.evictions,
  };
}

export function formatPercent(rate: number, digits = 1): string {
  const pct = rate * 100;
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(digits)}%`;
}

/** "1 unit", "4 units" — used wherever a simulated latency is shown next to its label. */
export function unitsLabel(value: number): string {
  return `${value} unit${value === 1 ? "" : "s"}`;
}

export function formatUnits(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * The simplified two-level average access time:
 * `hit time + miss rate × miss penalty`. With one cache level in the
 * engine, this equals the measured average exactly.
 */
export function averageAccessTime(hitTime: number, missRate: number, missPenalty: number): number {
  return hitTime + missRate * missPenalty;
}

// ---------------------------------------------------------------------------
// Sequences — parsing and named patterns
// ---------------------------------------------------------------------------

export interface SequenceToken {
  /** What the student typed (a number, or a block letter like "A"). */
  label: string;
  address: number;
}

/** Letters A–H stand for well-separated blocks, so "A B C A" reads like a textbook trace. */
export function letterAddress(letter: string): number {
  return (letter.toUpperCase().charCodeAt(0) - 64) * 16;
}

export function parseSequence(raw: string): { tokens: SequenceToken[]; error: string | null } {
  const parts = raw.split(/[\s,]+/).filter(Boolean);
  const tokens: SequenceToken[] = [];
  for (const part of parts) {
    if (/^[A-Ha-h]$/.test(part)) {
      tokens.push({ label: part.toUpperCase(), address: letterAddress(part) });
      continue;
    }
    if (/^\d+$/.test(part)) {
      const value = Number(part);
      if (value > ADDRESS_MAX) {
        return { tokens: [], error: `${part} is outside the address range 0–${ADDRESS_MAX}.` };
      }
      tokens.push({ label: part, address: value });
      continue;
    }
    return { tokens: [], error: `“${part}” isn’t a number 0–${ADDRESS_MAX} or a letter A–H.` };
  }
  if (tokens.length > MAX_SEQUENCE_LENGTH) {
    return { tokens: [], error: `Keep sequences to ${MAX_SEQUENCE_LENGTH} accesses or fewer.` };
  }
  return { tokens, error: null };
}

export function tokensFromAddresses(addresses: number[]): SequenceToken[] {
  return addresses.map((a) => ({ label: String(a), address: a }));
}

export interface PatternDef {
  id: string;
  label: string;
  description: string;
  addresses: number[];
}

const range = (start: number, count: number, step = 1) => Array.from({ length: count }, (_, i) => start + i * step);

export const NAMED_PATTERNS: PatternDef[] = [
  { id: "same", label: "Same address", description: "One address, again and again.", addresses: Array.from({ length: 16 }, () => 42) },
  { id: "loop", label: "Small loop", description: "Four neighbouring addresses, visited twice over.", addresses: [10, 11, 12, 13, 10, 11, 12, 13] },
  { id: "sequential", label: "Sequential scan", description: "Walk straight through 64 consecutive addresses.", addresses: range(0, 64) },
  { id: "strided", label: "Widely spaced", description: "Jump 40 addresses every time, never revisiting.", addresses: range(10, 8, 40) },
  { id: "fits", label: "Working set fits", description: "Cycle over 4 blocks, three times through — fits a 4-line cache.", addresses: Array.from({ length: 12 }, (_, i) => (i % 4) * 16) },
  { id: "toobig", label: "Working set too big", description: "Cycle over 8 blocks, three times through — more than a 4-line cache can hold.", addresses: Array.from({ length: 24 }, (_, i) => (i % 8) * 16) },
  { id: "random", label: "Random", description: "64 reproducible pseudo-random addresses.", addresses: seededAddresses(2024, 64) },
];

// ---------------------------------------------------------------------------
// Address decomposition — tag / index / offset
// ---------------------------------------------------------------------------

export interface AddressSplit {
  offsetBits: number;
  indexBits: number;
  tagBits: number;
  offset: number;
  index: number;
  tag: number;
  block: number;
  binary: string;
  tagStr: string;
  indexStr: string;
  offsetStr: string;
}

export function log2Exact(n: number): number {
  return Math.round(Math.log2(n));
}

/** `lineSize` and `setCount` must be powers of two. */
export function splitAddress(address: number, lineSize: number, setCount: number): AddressSplit {
  const offsetBits = log2Exact(lineSize);
  const indexBits = log2Exact(setCount);
  const tagBits = Math.max(0, ADDRESS_BITS - indexBits - offsetBits);
  const block = Math.floor(address / lineSize);
  const offset = address % lineSize;
  const index = block % setCount;
  const tag = Math.floor(block / setCount);
  const binary = address.toString(2).padStart(ADDRESS_BITS, "0");
  return {
    offsetBits,
    indexBits,
    tagBits,
    offset,
    index,
    tag,
    block,
    binary,
    tagStr: binary.slice(0, tagBits),
    indexStr: binary.slice(tagBits, tagBits + indexBits),
    offsetStr: binary.slice(tagBits + indexBits),
  };
}

// ---------------------------------------------------------------------------
// Animation trace for a single access
// ---------------------------------------------------------------------------

export type NodeId = "cpu" | Servicer;
export type TracePhase = "request" | "check" | "hit" | "miss" | "ram" | "fill" | "return";

export interface TraceStep {
  id: string;
  node: NodeId;
  phase: TracePhase;
  text: string;
  /** Block thrown out by this fill, if any. */
  evictedBlock?: number;
}

/** Turns one `AccessResult` into the ordered steps the diagram animates. */
export function buildTrace(result: AccessResult, config: CacheConfig): TraceStep[] {
  const steps: TraceStep[] = [];
  const name = (id: Servicer) => levelName(id, config.levelCount);
  const rangeLabel = formatRange(result.block, config.lineSize);

  steps.push({
    id: "request",
    node: "cpu",
    phase: "request",
    text:
      config.lineSize === 1
        ? `The CPU needs address ${result.address}.`
        : `The CPU needs address ${result.address}, which belongs to memory block ${rangeLabel}.`,
  });

  for (const lookup of result.lookups) {
    steps.push({ id: `check-${lookup.level}`, node: lookup.level, phase: "check", text: `Check ${name(lookup.level)}…` });
    steps.push(
      lookup.outcome === "hit"
        ? { id: `hit-${lookup.level}`, node: lookup.level, phase: "hit", text: `${name(lookup.level)} has it — found ✓` }
        : { id: `miss-${lookup.level}`, node: lookup.level, phase: "miss", text: `${name(lookup.level)} doesn't have it — miss ✕` },
    );
  }

  if (result.foundAt === "ram") {
    steps.push({
      id: "ram",
      node: "ram",
      phase: "ram",
      text: "Every cache level missed, so the request goes to RAM, which holds the original data.",
    });
  }

  for (const fill of result.fills) {
    steps.push({
      id: `fill-${fill.level}`,
      node: fill.level,
      phase: "fill",
      evictedBlock: fill.evictedBlock ?? undefined,
      text:
        fill.evictedBlock === null
          ? `A copy of ${config.lineSize === 1 ? "the data" : `the line ${rangeLabel}`} is placed in ${name(fill.level)}.`
          : `${name(fill.level)} is full in that spot, so line ${formatRange(fill.evictedBlock, config.lineSize)} is evicted to make room for ${rangeLabel}.`,
    });
  }

  steps.push({
    id: "return",
    node: "cpu",
    phase: "return",
    text: `Data ${result.data} returns to the CPU.`,
  });

  return steps;
}
