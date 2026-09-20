import type { TopicContent } from "../types";

/**
 * Cache Memory Explorer — third stop of the Information Technology >
 * Computer Fundamentals sequence, between CPU Architecture &
 * Instruction Cycle and CPU–RAM–Storage Data Flow.
 *
 * Division of labour with its neighbours is deliberate and enforced by
 * the content itself:
 *  - CPU Architecture answers "what happens inside the CPU while it
 *    executes an instruction?". This topic never replays Fetch →
 *    Decode → Execute; it shows the memory system that supplies the
 *    instructions and data those steps need.
 *  - Cache Memory Explorer (here) answers "how does small, fast memory
 *    help the CPU reach recently or frequently needed data?".
 *  - CPU–RAM–Storage Data Flow answers "how does data travel between
 *    the CPU, RAM and storage?". It contains a short cache hit/miss
 *    demo; this topic is the deep dive that demo points toward.
 *
 * Wording rule: cache size, latency, line size, associativity and
 * policy all vary by processor. Copy uses relative language and labels
 * every number as a simulation value.
 *
 * Uses the existing Golden Learning Experience architecture unchanged
 * (Learn → Predict → Explore → Explain → Practice → Challenge →
 * Mastery). Practice points at an existing quiz id rather than
 * authoring questions twice. Every numeric answer below was computed
 * with the simulation's own engine, not by hand.
 */

const hierarchySketch = (
  <svg viewBox="0 0 280 170" className="mx-auto h-40 w-full max-w-sm" role="img" aria-labelledby="cache-hierarchy-sketch-title">
    <title id="cache-hierarchy-sketch-title">
      The memory hierarchy as a stack: CPU and registers at the top, then L1, L2, and L3 cache, then RAM, then storage. Layers get wider (larger) and
      slower the farther they are from the CPU.
    </title>
    {[
      { label: "CPU + registers", w: 90 },
      { label: "L1 cache", w: 120 },
      { label: "L2 cache", w: 150 },
      { label: "L3 cache", w: 180 },
      { label: "RAM", w: 215 },
      { label: "Storage", w: 250 },
    ].map((row, i) => (
      <g key={row.label}>
        <rect x={140 - row.w / 2} y={6 + i * 26} width={row.w} height={20} rx="4" className="fill-none stroke-subject-it" strokeWidth="1.4" />
        <text x="140" y={6 + i * 26 + 14} textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">
          {row.label}
        </text>
      </g>
    ))}
    <text x="6" y="14" className="fill-ink-soft font-mono text-[6.5px] dark:fill-bone-soft">faster</text>
    <text x="6" y="24" className="fill-ink-soft font-mono text-[6.5px] dark:fill-bone-soft">smaller</text>
    <text x="274" y="156" textAnchor="end" className="fill-ink-soft font-mono text-[6.5px] dark:fill-bone-soft">larger · slower</text>
  </svg>
);

const hitMissSketch = (
  <svg viewBox="0 0 280 120" className="mx-auto h-32 w-full max-w-sm" role="img" aria-labelledby="cache-hitmiss-sketch-title">
    <title id="cache-hitmiss-sketch-title">
      A cache hit: the CPU asks the cache and the cache answers directly. A cache miss: the cache doesn’t have it, so the request continues to RAM, and a
      copy is stored in the cache on the way back.
    </title>
    <text x="10" y="14" className="fill-ink font-mono text-[8px] font-semibold dark:fill-bone">HIT</text>
    {["CPU", "Cache", "CPU"].map((label, i) => (
      <g key={`h${i}`}>
        <rect x={40 + i * 80} y="4" width="60" height="16" rx="3" className={i === 1 ? "fill-none stroke-emerald-500" : "fill-none stroke-subject-it"} strokeWidth="1.4" />
        <text x={70 + i * 80} y="15" textAnchor="middle" className="fill-ink font-mono text-[7.5px] dark:fill-bone">{label}</text>
      </g>
    ))}
    <text x="10" y="70" className="fill-ink font-mono text-[8px] font-semibold dark:fill-bone">MISS</text>
    {["CPU", "Cache", "RAM"].map((label, i) => (
      <g key={`m${i}`}>
        <rect x={40 + i * 80} y="60" width="60" height="16" rx="3" className={i === 1 ? "fill-none stroke-rose-500" : "fill-none stroke-subject-it"} strokeWidth="1.4" />
        <text x={70 + i * 80} y="71" textAnchor="middle" className="fill-ink font-mono text-[7.5px] dark:fill-bone">{label}</text>
      </g>
    ))}
    <text x="140" y="96" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">data returns, and a copy is kept in the cache</text>
    <text x="140" y="112" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">simplified model — real designs differ</text>
  </svg>
);

const addressSketch = (
  <svg viewBox="0 0 280 90" className="mx-auto h-24 w-full max-w-sm" role="img" aria-labelledby="cache-address-sketch-title">
    <title id="cache-address-sketch-title">
      A memory address split into three fields: the tag, the index, and the offset. The index selects a set, the tag is compared to check for the right block,
      and the offset selects the word within the line.
    </title>
    {[
      { label: "TAG", x: 10, w: 110, note: "is it the right block?" },
      { label: "INDEX", x: 122, w: 80, note: "which set?" },
      { label: "OFFSET", x: 204, w: 66, note: "which word?" },
    ].map((f) => (
      <g key={f.label}>
        <rect x={f.x} y="14" width={f.w} height="28" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
        <text x={f.x + f.w / 2} y="32" textAnchor="middle" className="fill-ink font-mono text-[9px] font-semibold dark:fill-bone">{f.label}</text>
        <text x={f.x + f.w / 2} y="58" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">{f.note}</text>
      </g>
    ))}
    <text x="140" y="80" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">simplified — exact splits depend on the architecture</text>
  </svg>
);

export const informationTechnologyCacheMemoryExplorerContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "cache-memory-explorer",
  title: "Cache Memory Explorer",
  subjectLabel: "Information Technology",
  topicLabel: "Computer Fundamentals",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/cache-memory-explorer",

  // -------------------------------------------------------------
  // LEARN — the twenty-point sequence from the brief, in order
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what cache memory is, and why it is not simply “faster RAM”.",
      "Explain why CPUs need cache and why cache sits close to the CPU.",
      "Describe the memory hierarchy and the speed, size and cost trade-off that shapes it.",
      "Distinguish a cache hit from a cache miss, and follow a request through L1, L2, L3 and RAM in the simplified model.",
      "Calculate hit rate and miss rate, and explain how they change average access time.",
      "Explain temporal and spatial locality, and recognise each in an access pattern.",
      "Explain cache lines, capacity, eviction and replacement policies (FIFO and LRU).",
      "Describe direct-mapped, set-associative and fully associative mapping, and read a tag / index / offset split.",
      "Explain instruction versus data caches, and why multiple cores create a cache-coherence problem.",
      "Explain why cache performance depends so heavily on the access pattern.",
    ],
    concepts: [
      {
        term: "1. What is cache memory?",
        explanation:
          "A small, fast memory system that keeps copies of data and instructions the CPU is likely to need again, placed close to the CPU. It holds copies, not originals: the original data still lives in RAM. Hardware manages it automatically — programs don’t normally decide what goes in it.",
      },
      {
        term: "2. Why CPUs need cache",
        explanation:
          "A CPU can work through instructions much faster than main memory can deliver data. Without a cache, the CPU would spend much of its time waiting. Cache narrows that gap by answering most requests from a nearby, quick memory instead of making a slow trip to RAM.",
      },
      {
        term: "3. Memory hierarchy",
        explanation:
          "Computers layer their memory: registers, then cache, then RAM, then storage. Closer to the CPU means smaller and faster; farther away means larger and slower. Making a large memory extremely fast is costly and complex, so instead of one huge fast memory, systems combine several layers that each play to their strengths.",
      },
      {
        term: "4. L1, L2 and L3",
        explanation:
          "Caches are often organised in levels. L1 is the smallest and fastest, L2 is usually larger and slower, and L3, where present, is larger again and often shared between cores. This is a common modern pattern, not a universal rule: cache levels, sizes and sharing all vary by processor, and not every CPU has an L3.",
      },
      {
        term: "5. Cache hit",
        explanation:
          "The data the CPU asked for is already in the cache, so the request is answered from there without going to a lower level. In the simplified model, a hit at L1 is the cheapest access in the whole hierarchy.",
      },
      {
        term: "6. Cache miss",
        explanation:
          "The data isn’t in the cache, so it must be retrieved from a lower level — ultimately RAM — and a copy is stored in the cache for next time. Misses cost far more than hits, and this lab’s hierarchy view is a simplified model: real CPUs don’t necessarily check each level in exactly that order.",
      },
      {
        term: "7. Hit rate",
        explanation: "The fraction of memory accesses that the cache answers. A higher hit rate means fewer slow trips to RAM.",
        formula: "\\text{hit rate} = \\dfrac{\\text{hits}}{\\text{total accesses}}",
        formulaCaption: "hit rate = hits ÷ total accesses",
      },
      {
        term: "8. Miss rate",
        explanation: "The fraction of accesses the cache could not answer. Hit rate and miss rate always add up to 100%.",
        formula: "\\text{miss rate} = \\dfrac{\\text{misses}}{\\text{total accesses}} = 1 - \\text{hit rate}",
        formulaCaption: "miss rate = misses ÷ total accesses",
      },
      {
        term: "9. Cache latency",
        explanation:
          "Latency is how long an access takes. This lab uses illustrative simulation values — L1 = 1, L2 = 4, L3 = 12, RAM = 50 units — chosen to make the ratios easy to see. They are not real hardware timings, and each level that is checked adds its own lookup time in this simplified model.",
      },
      {
        term: "10. Temporal locality",
        explanation:
          "If data is used now, it may be useful again soon. Loop counters and frequently used variables show it. A cache that keeps recently used data close turns those repeat uses into hits.",
      },
      {
        term: "11. Spatial locality",
        explanation:
          "If one memory location is accessed, nearby locations may be accessed soon. Walking through an array or executing instructions in order both show it. Caches exploit it by fetching neighbours together.",
      },
      {
        term: "12. Cache lines (blocks)",
        explanation:
          "A cache doesn’t store one address at a time; it stores a whole line of neighbouring addresses. When one address misses, the surrounding block is loaded together, so the next accesses nearby can hit. Real line sizes vary by architecture.",
      },
      {
        term: "13. Cache capacity",
        explanation:
          "A cache is small by design. If the data being reused is larger than the cache, it cannot all stay resident, and the cache spends its time replacing lines. Growing a cache helps only until the working set fits — after that, extra size buys little.",
      },
      {
        term: "14. Eviction",
        explanation:
          "When every line is in use and a new block arrives, an existing line must be replaced. That replaced line is evicted. Frequent evictions of data that is soon needed again are a sign the cache is too small for the workload.",
      },
      {
        term: "15. Replacement policies",
        explanation:
          "The rule that chooses which line to evict. FIFO evicts the oldest arrival; LRU evicts the least recently used; Random picks any. Which is best depends on the access pattern, and real caches often use cheap approximations of LRU.",
      },
      {
        term: "16. Cache mapping",
        explanation:
          "Mapping decides which cache lines a memory block may occupy. Direct-mapped: exactly one line. Set-associative: one set, then any line in that set. Fully associative: any line. Fewer choices are cheaper to search; more choices avoid needless conflicts.",
      },
      {
        term: "17. Tag, index and offset",
        explanation:
          "A cache slices an address into fields. The index selects the set, the tag is compared to confirm it is the right block, and the offset selects the word inside the line. The exact split depends on the architecture and cache design.",
      },
      {
        term: "18. Instruction cache vs data cache",
        explanation:
          "Instructions and data have different access habits, so many CPUs keep separate instruction and data caches at some levels while other levels are unified. The CPU needs both for every instruction it runs — see CPU Architecture & Instruction Cycle for what it does with them.",
      },
      {
        term: "19. Multi-core and cache coherence",
        explanation:
          "With several cores, each core’s cache may hold a copy of the same data. If one core changes it, the others’ copies become stale unless something keeps them coherent. Hardware coherence mechanisms exist for exactly this. This lab only introduces the idea.",
      },
      {
        term: "20. How cache affects performance",
        explanation:
          "Because a miss is so much slower than a hit, average access time is dominated by the miss rate. In a simplified two-level model it is hit time plus miss rate times miss penalty. Small changes in hit rate can make large changes in speed.",
        formula: "\\text{average access time} \\approx \\text{hit time} + \\text{miss rate} \\times \\text{miss penalty}",
        formulaCaption: "simplified two-level model",
      },
      {
        term: "Where this shows up in practice",
        explanation:
          "Cache behaviour is why a loop over an array is fast while jumping around memory is slow, why memory-heavy programs benefit from reusing data, and why hardware designers spend so much effort on cache design. Real systems add prefetching, several levels, and overlapped memory operations that this lab leaves out.",
      },
    ],
    whyItMatters:
      "Almost every program you run is limited less by how fast the CPU can compute than by how fast it can be fed data. Cache is the reason a modern processor isn’t constantly stalled waiting for memory. It explains why the same algorithm can run several times faster just by touching memory in a friendlier order, why array traversal order matters, why data structures that keep related items together perform better, and why CPU specifications quote cache sizes at all. Understanding hits, misses and locality gives you an intuition for performance that carries into programming, systems design and hardware choices.",
    keyTerms: [
      { term: "Cache", definition: "A small, fast memory that keeps copies of data and instructions the CPU is likely to need again." },
      { term: "Cache hit", definition: "The requested data is already in the cache." },
      { term: "Cache miss", definition: "The requested data is not in the cache and must be fetched from a lower level." },
      { term: "Hit rate / miss rate", definition: "The fraction of accesses that hit or miss. They add up to 100%." },
      { term: "Locality", definition: "The tendency of programs to reuse data (temporal) and use nearby data (spatial)." },
      { term: "Cache line (block)", definition: "The group of neighbouring addresses a cache loads and stores together." },
      { term: "Eviction", definition: "Removing a line from a full cache to make room for a new one." },
      { term: "Replacement policy", definition: "The rule that decides which line to evict, such as FIFO or LRU." },
      { term: "Associativity", definition: "How many cache lines a given memory block is allowed to occupy." },
      { term: "Tag / index / offset", definition: "The fields a cache reads from an address to find and verify a line." },
      { term: "Cache coherence", definition: "Keeping copies of the same data consistent across several caches." },
    ],
    visualAids: [
      {
        id: "cache-hierarchy-sketch",
        caption: "The memory hierarchy: closer to the CPU means smaller and faster; farther away means larger and slower.",
        visual: hierarchySketch,
      },
      {
        id: "cache-hitmiss-sketch",
        caption: "A hit is answered by the cache. A miss continues to RAM and leaves a copy behind in the cache.",
        visual: hitMissSketch,
      },
      {
        id: "cache-address-sketch",
        caption: "A cache reads an address as tag, index and offset.",
        visual: addressSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-cache-is-faster-ram",
        misconception: "Cache is just a faster version of RAM.",
        correction:
          "Cache holds copies of data that live in RAM and is managed automatically by hardware. Its speed comes from being small and close to the CPU, and it only pays off because programs reuse data and touch nearby data.",
      },
      {
        id: "misconception-bigger-always-better",
        misconception: "A bigger cache is always better.",
        correction:
          "A larger cache helps only until the working set fits. Beyond that, extra capacity buys little, and larger caches are generally slower and costlier to build. That is why the hierarchy has several sizes.",
      },
      {
        id: "misconception-cache-stores-one-address",
        misconception: "A cache stores one address at a time.",
        correction:
          "A cache stores whole lines of neighbouring addresses. One miss brings in the whole line, which is what turns sequential access into mostly hits.",
      },
      {
        id: "misconception-first-access-hits",
        misconception: "The first time a program touches data, the cache should already have it.",
        correction:
          "A cold cache is empty, so the first access to any block misses. The cache only benefits later accesses to data it has already loaded.",
      },
      {
        id: "misconception-fixed-lookup-order",
        misconception: "Every real CPU checks L1, then L2, then L3, then RAM in exactly that order.",
        correction:
          "That is the simplified model this lab uses to teach the idea. Real hardware overlaps lookups, and cache organisation varies by processor. Not every CPU has an L3 at all.",
      },
      {
        id: "misconception-lru-always-best",
        misconception: "LRU always beats FIFO.",
        correction:
          "LRU often keeps useful data, but which policy wins depends on the access pattern. Try more than one pattern in the Replacement lab.",
      },
      {
        id: "misconception-random-access-is-fine",
        misconception: "The order I access memory in doesn’t matter, only how much I access.",
        correction:
          "Access order can change hit rate dramatically. Reading 16 addresses in sequence and reading the same 16 in a scattered order can differ enormously in misses.",
      },
      {
        id: "misconception-coherence-not-needed",
        misconception: "Each core’s cache is independent, so multiple copies of the same data are harmless.",
        correction:
          "If one core changes a value, other cores’ cached copies become stale. Multi-core systems need mechanisms to keep those copies coherent.",
      },
      {
        id: "misconception-cache-numbers-universal",
        misconception: "L1 is always 1 unit, L2 is always 4, and RAM is always 50.",
        correction:
          "Those are simulation values chosen to make ratios visible. Real latencies, sizes, line sizes and policies vary by architecture.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to an answer first, then go and check it in the lab.",
    scenarios: [
      {
        id: "it-cache-predict-001",
        scenario: "The CPU requests address 100. Address 100 is already in L1.",
        question: "Is this a cache hit or a cache miss, and where is the data served from?",
        options: [
          { id: "hit-l1", label: "A hit — served from L1, with no trip to a lower level" },
          { id: "miss-ram", label: "A miss — it must still be fetched from RAM to be sure it is current" },
          { id: "hit-ram", label: "A hit — but it is served from RAM" },
        ],
        actualResultOptionId: "hit-l1",
        explanation:
          "When the data is already in L1, the request is answered there. That’s the whole point of a cache: no trip to RAM. In the Access Lab, request an address, then request it again and watch the second answer come from the cache.",
        hint: "Ask for the same address twice in the Access Lab and compare the two results.",
      },
      {
        id: "it-cache-predict-002",
        scenario: "The cache has just been reset and is empty. The CPU reads address 42 for the first time.",
        question: "What happens?",
        options: [
          { id: "miss", label: "A miss — it is fetched from RAM and a copy is stored in the cache" },
          { id: "hit", label: "A hit — the cache always has data ready before it’s asked for" },
          { id: "error", label: "An error — an empty cache can’t serve any request" },
        ],
        actualResultOptionId: "miss",
        explanation:
          "An empty cache holds nothing, so the first access to anything must miss. The data is fetched from RAM, and a copy is left in the cache so the next request for it can hit.",
        hint: "Press Reset cache in the Access Lab, then access address 42.",
      },
      {
        id: "it-cache-predict-003",
        scenario: "An empty cache with room for 4 entries. The CPU reads the same address eight times in a row.",
        question: "How many of the eight reads miss?",
        options: [
          { id: "one", label: "One — only the first" },
          { id: "eight", label: "All eight — the cache can’t remember addresses" },
          { id: "four", label: "Four — one for each cache entry" },
        ],
        actualResultOptionId: "one",
        explanation:
          "The first read misses and stores the data. The other seven find it there, for a hit rate of 7 out of 8. That’s temporal locality: recently used data is likely to be used again.",
        hint: "Open Experiments and load Experiment 1 — Cache hit.",
      },
      {
        id: "it-cache-predict-004",
        scenario: "Cache lines hold 4 words. The cache is empty. The CPU reads address 100, then address 101.",
        question: "What happens on the second read?",
        options: [
          { id: "hit", label: "A hit — the miss on 100 brought 100–103 in together" },
          { id: "miss", label: "A miss — every address needs its own trip to RAM" },
          { id: "depends", label: "It depends on whether the CPU is busy" },
        ],
        actualResultOptionId: "hit",
        explanation:
          "A cache fetches a whole line of neighbouring addresses. The miss on 100 loaded 100–103 together, so 101 is already there. That is spatial locality being exploited by cache lines.",
        hint: "Switch to Intermediate level, open Locality & Lines, and view Spatial locality with a 4-word line.",
      },
      {
        id: "it-cache-predict-005",
        scenario: "A cache holds only 2 lines and replaces the least recently used. The CPU reads blocks A, B, A, C, then B.",
        question: "Is the final read of B a hit or a miss?",
        options: [
          { id: "miss", label: "A miss — B was evicted when C arrived" },
          { id: "hit", label: "A hit — B was read earlier so it must still be there" },
          { id: "depends", label: "There is no way to tell without knowing the sizes" },
        ],
        actualResultOptionId: "miss",
        explanation:
          "A and B fill the two lines. Reading A again makes B the least recently used. When C arrives the cache is full, so B is evicted. Reading B now misses. Only the repeat read of A hit.",
        hint: "Open the Eviction tab with 2 lines and tap A, B, A, C, B.",
      },
      {
        id: "it-cache-predict-006",
        scenario: "In a simplified model a hit costs 1 unit and a miss penalty is 50 units. The hit rate improves from 90% to 99%.",
        question: "What happens to the average access time?",
        options: [
          { id: "quarter", label: "It drops to about a quarter of what it was (from 6 to 1.5)" },
          { id: "ten", label: "It drops by about 10%" },
          { id: "same", label: "It barely changes, since both hit rates are high" },
        ],
        actualResultOptionId: "quarter",
        explanation:
          "Average time = 1 + miss rate × 50. At a 10% miss rate that is 1 + 5 = 6; at 1% it is 1 + 0.5 = 1.5. A nine-point rise in hit rate cuts average time to a quarter, because each miss costs so much more than a hit.",
        hint: "Open the Performance Lab, choose ‘Set a hit rate’, and slide between 90% and 99%.",
      },
      {
        id: "it-cache-predict-007",
        scenario:
          "A cache has 8 lines and is direct-mapped: each memory block may go in only one line, chosen as block number mod 8. The CPU alternates between blocks 0 and 8, four times each.",
        question: "How many of the eight accesses hit?",
        options: [
          { id: "zero", label: "None — blocks 0 and 8 map to the same line and keep evicting each other" },
          { id: "six", label: "Six — after the first two misses, both stay cached" },
          { id: "four", label: "Four — every second access hits" },
        ],
        actualResultOptionId: "zero",
        explanation:
          "0 mod 8 and 8 mod 8 are both 0, so both blocks belong in line 0 and evict each other every time — a conflict miss — even though seven other lines are empty. A 2-way set-associative or fully associative cache would keep both.",
        hint: "Switch to Technical level, open Mapping, and try X = 0, Y = 8 in the Conflict demo.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start in Memory Hierarchy. Tap each layer — CPU, cache, RAM, storage — and read what it is for. Then use Try a lookup to see which layer answers a request and how the simulated cost adds up.",
      "Open the Access Lab. Enter an address and press Access memory: the request travels down the diagram, the result panel reports hit or miss and the simulated latency, and the cache table highlights what was loaded.",
      "Press Same address again and watch the result flip from a miss to a hit. Then try Next address and Random address, and watch the hit and miss counts and the hit rate change.",
      "Open Experiments and work through Experiment 1 (Cache hit), Experiment 3 (Random access), Experiment 4 (Small cache) and Experiment 5 (Larger cache). Step through each run and compare the side-by-side table.",
      "Raise the detail level to Intermediate. The Access Lab now has L1, L2 and L3, a line-size control, and a full cache evicts. Try line sizes 1, 4 and 8 and notice how nearby addresses start to hit.",
      "In Locality & Lines, view Temporal locality (A B A A B A), Spatial locality (100–103 with different line sizes), and Cache lines, where you tap an address in RAM and watch a whole line copy into the cache.",
      "In Eviction, tap blocks until the cache is full, then tap one more. Read the banner that says which block was replaced.",
      "In Performance Lab, drag the hit-rate slider and watch average access time change, then run a real access pattern and compare hits, misses and total simulated time.",
      "In CPU & Caches, step through a tiny program. Notice that instruction 101 hits because instruction 100’s line brought it along, and that the second run is much cheaper than the first.",
      "Raise the level to Technical. In Replacement, compare FIFO, LRU and Random on the same pattern. In Mapping, find two blocks that conflict in a direct-mapped cache. In Tag / Index / Offset, split an address. In Coherence, turn the mechanism off and on and step through.",
    ],
    tryThis: [
      "Find the smallest cache size at which Experiment 4’s pattern stops missing every time. What is special about that size?",
      "Read 16 consecutive addresses with 1-word, 4-word and 8-word lines. Which line size causes the fewest misses, and what is the cost of ever-longer lines?",
      "Find an access pattern where FIFO scores more hits than LRU. Then find one where LRU scores more.",
      "In the Mapping conflict demo, find another pair of blocks that fight in a direct-mapped cache. What do those numbers have in common?",
      "In the Performance Lab, drop the hit rate from 99% to 90% with a 50-unit miss penalty. How much slower does the average access become?",
      "At Technical level in the Access Lab (4 lines, 4-word lines), choose direct-mapped and access 0, 16, 0, 16, 0, 16. Blocks 0 and 4 share L1 line 0, so watch L2 answer instead of L1. Then switch to fully associative and repeat.",
      "With the coherence mechanism off, find the exact step where Core 2 starts reading stale data.",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-cache-explain-001",
        question: "Why do CPUs need cache memory at all?",
        answer:
          "Because a CPU can process instructions far faster than main memory can supply data. Without cache, the CPU would spend much of its time waiting for RAM. A small, fast cache close to the CPU answers most requests quickly, so the CPU stalls far less.",
      },
      {
        id: "it-cache-explain-002",
        question: "Why isn’t cache simply a bigger, faster RAM?",
        answer:
          "Because speed and size trade against each other. A memory can be made very fast if it is small and close to the CPU; making a large memory equally fast is very costly and complex. Cache is small on purpose, holds copies of data that live in RAM, and is managed automatically by hardware. It only helps because programs tend to reuse data and use nearby data.",
      },
      {
        id: "it-cache-explain-003",
        question: "Why does the first access to an address always miss in an empty cache?",
        answer:
          "Because the cache only holds copies of data it has already loaded. When it is empty, there is nothing to find. The miss brings the data (and, with cache lines, its neighbours) into the cache so later accesses can hit.",
      },
      {
        id: "it-cache-explain-004",
        question: "What is the difference between temporal and spatial locality?",
        answer:
          "Temporal locality means recently used data is likely to be used again soon, such as a loop counter. Spatial locality means data near recently used data is likely to be used soon, such as the next element of an array. Caches exploit the first by keeping recent data and the second by loading whole lines.",
      },
      {
        id: "it-cache-explain-005",
        question: "Why do caches load whole lines instead of single addresses?",
        answer:
          "Because of spatial locality. If the CPU touches one address, its neighbours are likely next. Loading the whole line on one miss turns the following nearby accesses into hits. The trade-off is that a long line can drag in data that is never used, and a cache of fixed size holds fewer distinct lines.",
      },
      {
        id: "it-cache-explain-006",
        question: "Why can making a cache bigger stop helping?",
        answer:
          "Once the whole working set — the data the program reuses — fits in the cache, adding capacity has nothing left to save. Bigger caches are also generally slower and costlier to build, so there is a trade-off between size and speed.",
      },
      {
        id: "it-cache-explain-007",
        question: "Why does a full cache have to evict, and who decides what goes?",
        answer:
          "A cache has a fixed number of lines. When they are all in use and a new block arrives, one must be replaced to make room. The replacement policy decides which; common choices are FIFO, LRU and random. The exact behaviour depends on the cache’s organisation and policy.",
      },
      {
        id: "it-cache-explain-008",
        question: "Why does a small drop in hit rate hurt performance so much?",
        answer:
          "Because a miss is much more expensive than a hit. Average access time is roughly hit time plus miss rate times miss penalty, and the penalty is large, so each extra percentage point of misses adds a lot. Going from a 99% to a 90% hit rate with a 50-unit penalty takes the simulated average from 1.5 to 6.",
      },
      {
        id: "it-cache-explain-009",
        question: "What problem does cache mapping solve, and why is direct-mapped not always best?",
        answer:
          "Mapping decides where a memory block may sit in the cache so the cache can find it quickly. Direct-mapped gives each block exactly one possible line, which is cheap to search but causes conflict misses when two blocks want the same line. Set-associative and fully associative caches allow more choices, reducing conflicts at the cost of searching more lines.",
      },
      {
        id: "it-cache-explain-010",
        question: "Why do multi-core processors need cache coherence?",
        answer:
          "Each core commonly has its own cache, so several caches may hold copies of the same data. If one core changes its copy, the others’ copies are out of date unless the system takes action. Coherence mechanisms keep the copies consistent so cores don’t work from stale data.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — foreign key into the existing quiz registry
  // -------------------------------------------------------------
  practice: {
    quizId: "it-cache-memory-explorer-practice",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Progressively harder problems. Each one asks you to reason it out first — the lab is there to check your answer, not to supply it.",
    scenarios: [
      {
        id: "it-cache-challenge-001",
        title: "Order the Memory Hierarchy",
        scenario:
          "A computer has CPU registers, an L1 cache, an L2 cache, an L3 cache, RAM and an SSD. You are asked to list them from the smallest and fastest to the largest and slowest.",
        objective: "Choose the correct ordering.",
        requiresExperiment: true,
        tools: [{ id: "hierarchy", label: "Memory Hierarchy" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Registers → L1 → L2 → L3 → RAM → SSD" },
            { id: "b", label: "Registers → L3 → L2 → L1 → RAM → SSD" },
            { id: "c", label: "L1 → Registers → RAM → L2 → L3 → SSD" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Closer to the CPU means smaller and faster, so the order runs registers, L1, L2, L3, RAM, storage. L1 is the smallest and fastest cache, and each step outward trades speed for capacity.",
        hints: [
          "Which layer does the CPU look in first?",
          "Speed and size pull in opposite directions: the fastest layers are the smallest.",
        ],
      },
      {
        id: "it-cache-challenge-002",
        title: "Hit or Miss?",
        scenario:
          "A cache has 4 entries of 1 word each, replaces the least recently used, and starts empty. The CPU reads these addresses in order: 5, 6, 5, 7, 6, 8, 5.",
        objective: "Work out how many of the seven accesses are hits.",
        requiresExperiment: true,
        tools: [{ id: "sandbox", label: "Experiments → Sandbox (4 lines)" }],
        answer: { mode: "numeric", unit: "hits", target: 3, tolerance: 0 },
        explanation:
          "5 misses, 6 misses, 5 hits, 7 misses, 6 hits, 8 misses, 5 hits. Four different blocks (5, 6, 7, 8) fit exactly in four entries, so nothing is ever evicted, and every repeat access hits. That is three hits and four misses.",
        hints: [
          "The first time any address appears it must miss — count the different addresses.",
          "With four entries and only four different addresses, nothing gets evicted.",
        ],
      },
      {
        id: "it-cache-challenge-003",
        title: "Calculate the Hit Rate",
        scenario:
          "A cache has 4 lines of 4 words each and starts empty. The CPU reads addresses 100, 101, 102, 103, 104, 105 in that order. (Intermediate level → Experiments → Experiment 2, the 4-word run.)",
        objective: "Find the hit rate for this pattern as a percentage.",
        requiresExperiment: true,
        tools: [{ id: "experiments", label: "Experiments → Experiment 2" }],
        answer: { mode: "numeric", unit: "% hit rate", target: 66.7, tolerance: 0.5 },
        explanation:
          "Line 100–103 is loaded by the miss on 100, so 101, 102 and 103 hit. The miss on 104 loads 104–107, so 105 hits. That is 4 hits out of 6 accesses: 4 ÷ 6 ≈ 66.7%. The remaining 33.3% is the miss rate.",
        hints: [
          "Work out which addresses share a line before you count.",
          "Hit rate = hits ÷ total accesses, so decide how many of the six accesses hit.",
        ],
      },
      {
        id: "it-cache-challenge-004",
        title: "Temporal or Spatial?",
        scenario:
          "Program X repeatedly reads one variable called total inside a loop. Program Y reads array elements arr[0], arr[1], arr[2], arr[3] one after another.",
        objective: "Decide which kind of locality each program mainly shows.",
        requiresExperiment: true,
        tools: [{ id: "locality", label: "Locality & Lines" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "X shows temporal locality (same data reused); Y shows spatial locality (neighbouring data used)" },
            { id: "b", label: "X shows spatial locality; Y shows temporal locality" },
            { id: "c", label: "Both show only spatial locality, because both use memory" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Reading the same variable again and again reuses recently used data, which is temporal locality. Reading consecutive array elements uses neighbouring addresses, which is spatial locality — and it is exactly what cache lines are designed to exploit.",
        hints: [
          "Is the program asking for the same address again, or for nearby addresses?",
          "Temporal is about time (again soon); spatial is about space (nearby).",
        ],
      },
      {
        id: "it-cache-challenge-005",
        title: "Manage a Small Cache",
        scenario:
          "A cache holds only 2 entries of 1 word each, replaces the least recently used, and starts empty. The CPU reads 1, 2, 1, 3, 1, 2.",
        objective: "Count how many of the six reads are hits.",
        requiresExperiment: true,
        tools: [{ id: "eviction", label: "Eviction (2 lines) — treat 1, 2, 3 as blocks A, B, C" }],
        answer: { mode: "numeric", unit: "hits", target: 2, tolerance: 0 },
        explanation:
          "1 miss, 2 miss, 1 hit. Reading 3 finds the cache full and evicts the least recently used entry, 2. Reading 1 hits. Reading 2 misses again and evicts 3. That’s two hits and four misses, with two evictions — the working set of three doesn’t fit in two entries.",
        hints: [
          "Track which entry is least recently used each time the cache is full.",
          "After reading 1 again, entry 2 becomes the least recently used one.",
        ],
        maxAttempts: 4,
      },
      {
        id: "it-cache-challenge-006",
        title: "Compare FIFO and LRU",
        scenario: "A cache with 3 lines of 1 word starts empty. The CPU reads A, B, C, A, B, D, A. Compare FIFO with LRU. (Technical level → Replacement.)",
        objective: "Find how many more hits LRU gets than FIFO on this pattern.",
        requiresExperiment: true,
        tools: [{ id: "replacement", label: "Replacement" }],
        answer: { mode: "numeric", unit: "more hits for LRU", target: 1, tolerance: 0 },
        explanation:
          "Both start with three misses, then A and B hit. When D arrives, FIFO evicts A (the oldest arrival) even though A was just used, and the final read of A misses. LRU evicts C, so A is still there and hits. FIFO ends with 2 hits, LRU with 3, so LRU has one more.",
        hints: [
          "When D arrives and the cache is full, decide who each policy evicts.",
          "FIFO looks at arrival order. LRU looks at last use.",
        ],
        maxAttempts: 4,
      },
      {
        id: "it-cache-challenge-007",
        title: "Read an Address",
        scenario:
          "A cache holds 32 words in lines of 4 words, organised as 4 sets. The CPU reads address 100. (Technical level → Tag / Index / Offset, with the default settings.)",
        objective: "Work out the tag of address 100.",
        requiresExperiment: true,
        tools: [{ id: "address", label: "Tag / Index / Offset" }],
        answer: { mode: "numeric", unit: "tag", target: 6, tolerance: 0 },
        explanation:
          "The block number is ⌊100 ÷ 4⌋ = 25, and the offset is 100 mod 4 = 0. With 4 sets, the index is 25 mod 4 = 1 and the tag is ⌊25 ÷ 4⌋ = 6. So the cache looks in set 1 and checks whether a stored line has tag 6.",
        hints: [
          "First find the block number by dividing the address by the line size.",
          "The index is the block number mod the number of sets; the tag is what is left over when you divide.",
        ],
      },
      {
        id: "it-cache-challenge-008",
        title: "Reorder for the Cache",
        scenario:
          "A program must read all 16 addresses from 0 to 15, in any order it likes. The cache has 2 lines of 4 words and replaces the least recently used. Reading them in the order 0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15 misses on every access.",
        objective: "What is the fewest misses the program can achieve by reordering the same 16 reads?",
        requiresExperiment: true,
        tools: [{ id: "experiments", label: "Experiments → Sandbox (2 lines, 4-word lines)" }],
        answer: { mode: "numeric", unit: "misses", target: 4, tolerance: 0 },
        explanation:
          "The 16 addresses fall in four lines of four words: 0–3, 4–7, 8–11, 12–15. Reading them in sequence loads each line once and then uses it four times, so there are only 4 misses and 12 hits. The scattered order keeps switching between four lines with room for only two, so every line is evicted before it is reused — 16 misses. Same data, different order, very different cache behaviour.",
        hints: [
          "How many different cache lines does the program need in total?",
          "Can you finish with one line completely before moving to the next?",
        ],
        maxAttempts: 4,
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-architecture-instruction-cycle",
      label: "CPU Architecture & Instruction Cycle",
      href: "/dashboard/information-technology/cpu-architecture-instruction-cycle",
      reason:
        "That topic shows what the CPU does with each instruction. Cache is the memory system supplying the instructions and data that cycle depends on — start there if the CPU’s role feels unfamiliar.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "cpu-ram-storage-data-flow",
      label: "CPU–RAM–Storage Data Flow",
      href: "/dashboard/information-technology/cpu-ram-storage-data-flow",
      reason:
        "Next: how data travels between CPU, RAM and storage when a computer opens an app or saves a file. The cache is one stop on that journey.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "paging-simulator",
      label: "Paging Simulator",
      href: "/dashboard/information-technology/paging-simulator",
      reason:
        "The same ideas — replacement policies, hits, misses and a small fast structure caching something larger — reappear one level up, in how an operating system manages virtual memory.",
    },
  ],
};
