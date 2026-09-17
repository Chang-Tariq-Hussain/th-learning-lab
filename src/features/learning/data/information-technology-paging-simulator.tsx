import type { TopicContent } from "../types";

/**
 * Paging Simulator — fifth stop of the Information Technology >
 * Operating Systems sequence, directly after Virtual Memory.
 *
 * Division of labour with the previous topic is deliberate and
 * enforced by the content itself: the Virtual Memory Simulator
 * answers "why does virtual memory exist and what problem does it
 * solve?" (address spaces, residency, memory pressure, overcommit,
 * working set). This topic answers "how does the OS implement it?" —
 * pages, frames, page tables and their entries, address translation
 * arithmetic, page faults, demand paging, replacement policies, page
 * size trade-offs, internal fragmentation, the TLB, and per-process
 * page tables. Nothing from the earlier topic's Learn section is
 * restated here beyond the one sentence needed to hand off.
 *
 * Uses the existing Golden Learning Experience architecture
 * unchanged: Learn → Predict → Explore → Explain → Practice →
 * Challenge → Mastery, with Practice pointing at an existing quiz id
 * rather than authoring questions twice.
 */

const translationSketch = (
  <svg viewBox="0 0 280 150" className="mx-auto h-36 w-full max-w-sm" role="img" aria-labelledby="paging-translation-sketch-title">
    <title id="paging-translation-sketch-title">
      A virtual address splits into a page number and an offset; the page number is translated through the page table into a
      frame number, and the offset is carried through unchanged into the physical address.
    </title>
    <rect x="20" y="10" width="110" height="22" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
    <text x="75" y="25" textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">Page number</text>
    <rect x="150" y="10" width="110" height="22" rx="4" className="fill-none stroke-ink/50 dark:stroke-bone/50" strokeWidth="1.5" />
    <text x="205" y="25" textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">Offset</text>
    <text x="140" y="46" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">virtual address</text>

    <rect x="20" y="62" width="110" height="22" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
    <text x="75" y="77" textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">Page table</text>
    <line x1="75" y1="32" x2="75" y2="62" className="stroke-subject-it" strokeWidth="1.2" markerEnd="url(#paging-arrow)" />

    <rect x="20" y="112" width="110" height="22" rx="4" className="fill-none stroke-subject-it" strokeWidth="1.5" />
    <text x="75" y="127" textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">Frame number</text>
    <line x1="75" y1="84" x2="75" y2="112" className="stroke-subject-it" strokeWidth="1.2" markerEnd="url(#paging-arrow)" />

    <rect x="150" y="112" width="110" height="22" rx="4" className="fill-none stroke-ink/50 dark:stroke-bone/50" strokeWidth="1.5" />
    <text x="205" y="127" textAnchor="middle" className="fill-ink font-mono text-[8px] dark:fill-bone">Offset (unchanged)</text>
    <line x1="205" y1="32" x2="205" y2="112" strokeDasharray="3 3" className="stroke-ink/40 dark:stroke-bone/40" strokeWidth="1.2" markerEnd="url(#paging-arrow)" />
    <text x="140" y="148" textAnchor="middle" className="fill-ink-soft font-mono text-[7px] dark:fill-bone-soft">physical address</text>

    <defs>
      <marker id="paging-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/50 dark:fill-bone/50" />
      </marker>
    </defs>
  </svg>
);

const faultSketch = (
  <svg viewBox="0 0 260 140" className="mx-auto h-36 w-full max-w-sm" role="img" aria-labelledby="paging-fault-sketch-title">
    <title id="paging-fault-sketch-title">
      A page fault sequence: request, page table lookup, fault, load from backing storage, update the page table, retry.
    </title>
    {["CPU requests page", "Page table: not present", "PAGE FAULT", "Load from backing storage", "Update page table", "Retry — access succeeds"].map(
      (label, i) => (
        <g key={label}>
          <rect
            x="15"
            y={6 + i * 22}
            width="230"
            height="16"
            rx="3"
            className={i === 2 ? "fill-none stroke-amber-500" : "fill-none stroke-subject-it"}
            strokeWidth="1.4"
          />
          <text x="130" y={6 + i * 22 + 12} textAnchor="middle" className="fill-ink font-mono text-[7.5px] dark:fill-bone">
            {label}
          </text>
          {i < 5 && (
            <line
              x1="130"
              y1={6 + i * 22 + 16}
              x2="130"
              y2={6 + (i + 1) * 22}
              className="stroke-ink/40 dark:stroke-bone/40"
              strokeWidth="1"
              markerEnd="url(#paging-fault-arrow)"
            />
          )}
        </g>
      ),
    )}
    <defs>
      <marker id="paging-fault-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/40 dark:fill-bone/40" />
      </marker>
    </defs>
  </svg>
);

export const informationTechnologyPagingSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "paging-simulator",
  title: "Paging Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Operating Systems",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/paging-simulator",

  // -------------------------------------------------------------
  // LEARN — the eighteen-point sequence from the brief, in order
  // -------------------------------------------------------------
  learn: {
    objectives: [
      "Explain what paging is, as the mechanism that implements virtual memory.",
      "Distinguish a page from a frame, and explain why both are fixed size.",
      "Read a page table and follow a page through it into a physical frame.",
      "Split a virtual address into a page number and an offset, and rebuild a physical address from a frame number and that same offset.",
      "Explain what a page fault is, what the OS does about it, and why it is not a crash.",
      "Explain demand paging and why it uses limited physical memory efficiently.",
      "Apply FIFO and LRU page replacement, and explain why Optimal is a benchmark rather than a usable policy.",
      "Explain the trade-offs of larger and smaller page sizes, including internal fragmentation.",
      "Explain what a TLB caches and what it does not.",
      "Explain how per-process page tables support process isolation.",
    ],
    concepts: [
      {
        term: "Paging",
        explanation:
          "The mechanism an operating system uses to implement virtual memory. The virtual address space is cut into fixed-size pages, physical memory is cut into equally sized frames, and a page table records which page currently lives in which frame.",
      },
      {
        term: "Page vs. frame",
        explanation:
          "A page is a fixed-size block of a process's VIRTUAL address space. A frame is a fixed-size block of PHYSICAL memory. They are the same size — which is exactly why any page fits in any free frame — but a page is not a frame, and page number 3 has nothing to do with frame number 3.",
      },
      {
        term: "Why fixed size",
        explanation:
          "Because every page and every frame is the same size, allocation never has to hunt for a hole big enough, and memory cannot be left with unusable gaps between allocations. That is the trade paging makes: no external fragmentation, at the cost of some waste inside the last page.",
      },
      {
        term: "Page table",
        explanation:
          "A per-process structure mapping virtual page numbers to physical frame numbers. It holds the mapping, not the data — the page's actual contents are in the frame.",
      },
      {
        term: "Page table entry",
        explanation:
          "One row of the page table. Beyond the frame number it carries a present/valid bit (is this page in RAM?), protection information (what kind of access is allowed), a referenced/accessed indicator, and a modified/dirty indicator.",
      },
      {
        term: "Virtual address = page number + offset",
        explanation:
          "A virtual address is not an opaque number. Divide it by the page size and the quotient is the page number; the remainder is the offset. The page number says which page; the offset says exactly where inside that page.",
      },
      {
        term: "Physical address = frame number + offset",
        explanation:
          "Translation replaces the page number with the frame number the page table supplied, then reattaches the SAME offset. The offset does not change during normal paging translation, because a position inside a page is the identical position inside the frame holding it.",
      },
      {
        term: "Page fault",
        explanation:
          "What happens when a page's present bit is clear: the hardware raises a fault, the OS locates the page in backing storage, loads it into a frame, updates the page table, and retries the instruction. The program itself never sees the interruption.",
      },
      {
        term: "Demand paging",
        explanation:
          "Bringing a page into memory at the moment it is first needed, rather than loading a whole program up front. Pages a program never touches never occupy a frame at all.",
      },
      {
        term: "Page replacement",
        explanation:
          "Once every frame is occupied, satisfying a new page fault means evicting a resident page first. Which page to evict is the replacement decision, and a dirty page has to be written back before its frame is reused.",
      },
      {
        term: "FIFO",
        explanation:
          "First-In, First-Out: evict whichever resident page was loaded earliest, regardless of how recently it was used. Simple to implement, and it can evict a page that is about to be needed again.",
      },
      {
        term: "LRU",
        explanation:
          "Least Recently Used: evict whichever resident page has gone unused for the longest time. It uses access history rather than arrival order, so it tends to respect locality — at the cost of having to track that history.",
      },
      {
        term: "Optimal",
        explanation:
          "Evict the page that will not be needed again for the longest time. This requires knowing the future reference sequence, so it cannot be implemented as an ordinary online policy. It exists as a theoretical benchmark to measure the others against.",
      },
      {
        term: "Page size trade-offs",
        explanation:
          "Smaller pages mean more pages per program, more page table entries, finer allocation, and less data transferred per fault. Larger pages mean fewer entries and fewer faults for sequential access, but more data moved per fault and more potential waste in the final page. There is no single right answer.",
      },
      {
        term: "Internal fragmentation",
        explanation:
          "Paging allocates whole pages, so a program that is not an exact multiple of the page size leaves the last page partly empty. A 10 KB program with 4 KB pages needs three pages — 12 KB allocated, 2 KB unused inside the third.",
      },
      {
        term: "TLB",
        explanation:
          "A small cache of recent address translations: page number to frame number. A TLB hit supplies the frame without consulting the page table at all. It caches translations, never page contents.",
      },
      {
        term: "Multi-process address spaces",
        explanation:
          "Each process has its own page table, so page 0 of one process and page 0 of another are different pages that map to different frames. That is the paging-level reason processes cannot reach each other's memory by using the same address.",
      },
      {
        term: "Where this shows up in practice",
        explanation:
          "Every mainstream desktop, server, and phone operating system runs on paging hardware. It is why a program can start before it is fully loaded, why several large programs coexist in limited RAM, and why a process cannot read another's memory just by guessing an address.",
      },
    ],
    whyItMatters:
      "Paging is the machinery under almost every memory question you will ever ask about a real computer. It explains why a large application starts responding before it has finished loading, why memory-hungry programs slow down sharply when RAM runs short (each fault is a trip to storage), why operating systems care so much about page size, and why one misbehaving process usually cannot corrupt another's data. It is also the layer where a surprising amount of performance work happens — making memory accesses hit already-resident pages, and hit cached translations, rather than faulting.",
    keyTerms: [
      { term: "Page", definition: "A fixed-size block of a process's virtual address space." },
      { term: "Frame", definition: "A fixed-size block of physical memory, the same size as a page." },
      { term: "Page table", definition: "A per-process mapping from virtual page numbers to physical frame numbers." },
      { term: "Present / valid bit", definition: "Whether a page is currently resident in physical memory." },
      { term: "Offset", definition: "The position within a page or frame; unchanged by normal address translation." },
      { term: "Page fault", definition: "The requested page is not currently resident, so the OS must bring it in and retry." },
      { term: "Demand paging", definition: "Loading a page only when it is first needed." },
      { term: "Victim page", definition: "The resident page a replacement policy chooses to evict to free a frame." },
      { term: "Internal fragmentation", definition: "Unused space inside the last allocated page." },
      { term: "TLB", definition: "A cache of recent page-to-frame translations, not of page contents." },
    ],
    visualAids: [
      {
        id: "paging-translation-sketch",
        caption: "Page number → page table → frame number. The offset goes straight across, unchanged.",
        visual: translationSketch,
      },
      {
        id: "paging-fault-sketch",
        caption: "The page-fault path: request → not present → fault → load → update → retry.",
        visual: faultSketch,
      },
    ],
    misconceptions: [
      {
        id: "misconception-page-equals-frame",
        misconception: "Page 3 is stored in frame 3 — the numbers match.",
        correction:
          "Page numbers and frame numbers are independent. A page can occupy any free frame, and the page table entry is the only thing that records which one.",
      },
      {
        id: "misconception-page-fault-means-crash",
        misconception: "A page fault means the program crashed.",
        correction:
          "A page fault means the requested page is not currently resident. The OS loads it and retries the instruction; programs run through very large numbers of faults without incident.",
      },
      {
        id: "misconception-page-table-holds-data",
        misconception: "The page table stores the contents of the pages.",
        correction:
          "The page table stores a mapping — which frame holds which page, plus a few status bits. The data itself lives in the frames.",
      },
      {
        id: "misconception-offset-changes",
        misconception: "Address translation rewrites the whole address, offset included.",
        correction:
          "Only the page number is translated. Because a page and a frame are the same size, the offset means the same thing on both sides and is carried through unchanged.",
      },
      {
        id: "misconception-tlb-stores-page-contents",
        misconception: "The TLB is a small cache of page data.",
        correction:
          "The TLB caches address translations — page number to frame number. Page contents stay in frames; the TLB only saves the lookup.",
      },
      {
        id: "misconception-optimal-is-implementable",
        misconception: "Optimal is simply the best algorithm, so operating systems should use it.",
        correction:
          "Optimal requires knowing future references. It is a benchmark for judging how close implementable policies like FIFO and LRU get, not something an OS can run.",
      },
      {
        id: "misconception-lru-always-best",
        misconception: "LRU always beats FIFO.",
        correction:
          "Which policy produces fewer faults depends on the workload. Try more than one reference string in the comparison table and the ordering changes.",
      },
      {
        id: "misconception-paging-eliminates-waste",
        misconception: "Paging removes wasted memory entirely.",
        correction:
          "Paging removes external fragmentation, but introduces internal fragmentation: the last page of a program is usually only partly filled.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PREDICT
  // -------------------------------------------------------------
  predict: {
    intro: "Commit to an answer first, then go and check it in the simulator.",
    scenarios: [
      {
        id: "it-paging-predict-001",
        scenario: "The page size is 4 bytes. The CPU requests virtual address 13.",
        question: "Which page number and offset does that address split into?",
        options: [
          { id: "p3o1", label: "Page 3, offset 1" },
          { id: "p1o3", label: "Page 1, offset 3" },
          { id: "p4o13", label: "Page 4, offset 13" },
        ],
        actualResultOptionId: "p3o1",
        explanation:
          "13 ÷ 4 = 3 with a remainder of 1. The quotient is the page number and the remainder is the offset — which is why keeping the page size a power of two makes this arithmetic cheap in hardware.",
        hint: "Divide the address by the page size. The quotient and the remainder are the two halves.",
      },
      {
        id: "it-paging-predict-002",
        scenario: "A process accesses a page whose page table entry has its present bit clear.",
        question: "What happens?",
        options: [
          { id: "fault", label: "A page fault — the OS loads the page, updates the table, and retries the instruction" },
          { id: "crash", label: "The program crashes and is terminated" },
          { id: "garbage", label: "The access silently reads whatever happens to be in frame 0" },
        ],
        actualResultOptionId: "fault",
        explanation:
          "A page fault is a normal event. The instruction is restarted once the page is resident, so the program never notices anything went wrong.",
        hint: "Step through an access to a page marked 'not in RAM' in the Address Translation tab.",
      },
      {
        id: "it-paging-predict-003",
        scenario: "Three frames hold pages 7, 0 and 1, loaded in that order. Page 2 is requested and every frame is full.",
        question: "Which page does FIFO evict?",
        options: [
          { id: "seven", label: "Page 7 — it was loaded earliest" },
          { id: "one", label: "Page 1 — it was loaded most recently" },
          { id: "zero", label: "Page 0 — it is in the middle" },
        ],
        actualResultOptionId: "seven",
        explanation:
          "FIFO considers only arrival order, never usage. Page 7 arrived first, so page 7 goes — even if the program is about to ask for it again.",
        hint: "Run 7 0 1 2 with three frames and FIFO in the Reference String tab.",
      },
      {
        id: "it-paging-predict-004",
        scenario: "A program needs 10 KB and the page size is 4 KB.",
        question: "How much memory is allocated, and how much of it goes unused?",
        options: [
          { id: "twelve", label: "12 KB allocated, 2 KB unused inside the last page" },
          { id: "ten", label: "10 KB allocated, nothing unused" },
          { id: "eight", label: "8 KB allocated, so 2 KB of the program does not fit" },
        ],
        actualResultOptionId: "twelve",
        explanation:
          "Paging allocates whole pages, so three pages are needed. The third is only half full, and that leftover 2 KB is internal fragmentation.",
        hint: "Set the page size to 4 KB and the program size to 10 KB in the Page Size tab.",
      },
      {
        id: "it-paging-predict-005",
        scenario: "The same page is translated twice in a row while the TLB is enabled.",
        question: "What is different about the second translation?",
        options: [
          { id: "hit", label: "It hits in the TLB, so the page table is not consulted at all" },
          { id: "same", label: "Nothing — every translation consults the page table" },
          { id: "contents", label: "The page contents come from the TLB instead of from the frame" },
        ],
        actualResultOptionId: "hit",
        explanation:
          "The first translation cached the page-to-frame mapping. The second finds it there and skips the page table lookup. The data itself still comes from the frame — the TLB never holds page contents.",
        hint: "Tap the same page twice in the TLB tab and watch the page table lookup counter.",
      },
    ],
  },

  // -------------------------------------------------------------
  // EXPLORE
  // -------------------------------------------------------------
  explore: {
    howToUse: [
      "Start in Pages & Frames. Tap a page and follow the highlighted chain: virtual page → page table entry → physical frame. Tap a page marked 'not in RAM' and notice it has no frame to point at.",
      "Raise the detail level to Intermediate, then Technical, to reveal the protection, referenced, and dirty fields on each page table entry — and then an explanation of what each one means.",
      "In Address Translation, drag the address slider and watch the page number and offset boxes update, then press Step to walk one translation from CPU request to physical address.",
      "In Page Faults & Demand Paging, request a page that is currently on storage. Keep requesting new pages until every frame is full, then request one more to trigger replacement.",
      "In Reference String & Replacement, run the default string with three frames under FIFO, then LRU, then Optimal, and open the comparison table.",
      "In Page Size & Fragmentation, change the page size and the program size, and watch the hatched unused area in the final page grow and shrink.",
      "In TLB, tap the same page twice, then tap four different pages in a row and see what the three-entry cache does.",
      "In Process Isolation, tap page 0 under each process and follow where each one lands.",
    ],
    tryThis: [
      "Find a virtual address whose translation leaves the offset equal to zero. What is true of every such address?",
      "With the page size at 4 B, translate address 13; then switch to 8 B and translate 13 again. Why did the page number change?",
      "Get RAM completely full, then request pages in an order that makes FIFO evict a page you are about to need again.",
      "In the comparison table, find a reference string where FIFO beats LRU. Then find one where LRU beats FIFO.",
      "Set the page size to 1 KB and then 16 KB for a 10 KB program. Which setting wastes less space, and what does it cost you in page table entries?",
      "In the TLB tab, access four different pages in sequence and then return to the first one. Does it still hit?",
    ],
  },

  // -------------------------------------------------------------
  // EXPLAIN
  // -------------------------------------------------------------
  explain: {
    questions: [
      {
        id: "it-paging-explain-001",
        question: "Why does the offset stay the same when a virtual address is translated into a physical address?",
        answer:
          "Because a page and a frame are exactly the same size. The offset measures how far into the block the data sits, and a block of the same size has the same internal positions whether you call it a page or a frame. Only the page number needs replacing with the frame number that currently holds it.",
      },
      {
        id: "it-paging-explain-002",
        question: "Why is a page fault not a failure?",
        answer:
          "Because it is the expected way a demand-paged system brings memory in. The hardware detects that the present bit is clear and hands control to the OS, which loads the page from backing storage into a frame, updates the page table, and restarts the faulting instruction. The program resumes as if nothing happened — it only ever sees the delay, not an error.",
      },
      {
        id: "it-paging-explain-003",
        question: "Why does paging use fixed-size pages when that guarantees some wasted space in the last page?",
        answer:
          "Because uniform sizes remove a worse problem. If blocks varied in size, free physical memory would end up split into gaps too small to use — external fragmentation — and allocation would have to search for a hole of the right size. With equal-sized pages and frames, any page fits any free frame, and the only waste left is the partly filled final page.",
      },
      {
        id: "it-paging-explain-004",
        question: "Why can't an operating system just use the Optimal replacement algorithm if it produces the fewest faults?",
        answer:
          "Optimal picks the resident page that will not be needed again for the longest time, which means it has to know the future reference sequence. A running OS does not. Optimal is therefore used as a yardstick — run it offline on a recorded reference string to see how close an implementable policy like LRU actually gets.",
      },
      {
        id: "it-paging-explain-005",
        question: "Why does increasing the page size reduce the number of page table entries but risk wasting more memory?",
        answer:
          "A larger page covers more of the address space, so fewer pages are needed to describe the same program and a single-level page table needs fewer rows. But allocation is still in whole pages, so the leftover in the final page can now be much larger — up to one page size minus one byte. It also means more data is transferred on every fault, whether or not the program wanted all of it.",
      },
      {
        id: "it-paging-explain-006",
        question: "Why does a TLB help, given that it does not hold any page data?",
        answer:
          "Because the page table lookup is itself a memory access. Without a TLB, every memory reference would cost at least two accesses: one to read the page table entry and one to reach the data. Caching the translation removes the first of those whenever the same page is used again, which is common because programs tend to reuse the same small set of pages.",
      },
      {
        id: "it-paging-explain-007",
        question: "Why does giving each process its own page table keep processes from reading each other's memory?",
        answer:
          "Because a process can only reach frames its own page table maps. A virtual page number is meaningless until some page table translates it, and each process is translated through its own. Two processes using the same page number end up at different frames, so an address alone grants no access to anyone else's memory.",
      },
    ],
  },

  // -------------------------------------------------------------
  // PRACTICE — foreign key into the existing quiz registry
  // -------------------------------------------------------------
  practice: {
    quizId: "it-paging-simulator-practice",
  },

  // -------------------------------------------------------------
  // CHALLENGE
  // -------------------------------------------------------------
  challenge: {
    intro:
      "Progressively harder problems. Each one asks you to reason it out first — the simulator is there to check your answer, not to supply it.",
    scenarios: [
      {
        id: "it-paging-challenge-001",
        title: "Map Pages into Frames",
        scenario:
          "A process has pages 0 through 5. RAM has four frames. Pages 0, 1 and 3 are resident in frames 1, 0 and 2 respectively; frame 3 is free.",
        objective: "Determine which page table entries have their present bit set, and what the Frame column shows for the rest.",
        requiresExperiment: true,
        tools: [{ id: "map", label: "Pages & Frames" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Pages 0, 1 and 3 have present set and name a frame; pages 2, 4 and 5 have present clear and name no frame" },
            { id: "b", label: "All six pages have present set, because every page exists in the address space" },
            { id: "c", label: "Pages 0, 1, 2 and 3 have present set, because there are four frames" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "A page existing in the address space and a page being resident are two different things. Only a page that currently occupies a frame has its present bit set; the others have nothing meaningful to put in the Frame column.",
        hints: [
          "Count how many pages are actually sitting in a frame.",
          "Does having six pages and four frames mean four pages must be resident?",
        ],
      },
      {
        id: "it-paging-challenge-002",
        title: "Translate a Series of Addresses",
        scenario: "Page size is 4 bytes. Page 0 → frame 1, page 1 → frame 0, page 3 → frame 2. The CPU issues virtual addresses 2, 5 and 14.",
        objective: "Work out the physical address for virtual address 14.",
        requiresExperiment: true,
        tools: [{ id: "translation", label: "Address Translation" }],
        answer: { mode: "numeric", unit: "physical address", target: 10, tolerance: 0 },
        explanation:
          "14 ÷ 4 = 3 remainder 2, so it is page 3 at offset 2. Page 3 maps to frame 2, giving 2 × 4 + 2 = 10. Address 2 is page 0 offset 2 → frame 1 → 6; address 5 is page 1 offset 1 → frame 0 → 1.",
        hints: [
          "Split 14 into a page number and an offset first.",
          "Look up that page number in the mapping given, then rebuild: frame × page size + offset.",
        ],
      },
      {
        id: "it-paging-challenge-003",
        title: "Spot the Page Faults",
        scenario:
          "Starting from the simulator's default state, the CPU accesses pages in this order: 0, 2, 1, 4, 3.",
        objective: "Determine how many of those five accesses raise a page fault.",
        requiresExperiment: true,
        tools: [{ id: "fault", label: "Page Faults & Demand Paging" }],
        answer: { mode: "numeric", unit: "page faults", target: 2, tolerance: 0 },
        explanation:
          "Pages 0, 1 and 3 start resident, so those three accesses are hits. Pages 2 and 4 are not resident, so each raises one fault — two faults in total. Note that the fault for page 2 uses the one free frame, while page 4 arrives to a full RAM and forces a replacement.",
        hints: [
          "Which pages are already in frames when you reset memory?",
          "An access only faults the first time — once loaded, the page stays until it is evicted.",
        ],
      },
      {
        id: "it-paging-challenge-004",
        title: "Run FIFO by Hand",
        scenario: "Reference string 7 0 1 2 0 3 0 4 with three frames, under FIFO, starting from empty.",
        objective: "Count the total number of page faults FIFO produces over those eight references.",
        requiresExperiment: true,
        tools: [{ id: "replacement", label: "Reference String & Replacement" }],
        answer: { mode: "numeric", unit: "page faults", target: 6, tolerance: 0 },
        explanation:
          "7, 0 and 1 fault into the three empty frames. 2 faults and evicts 7 (loaded earliest). 0 hits. 3 faults and evicts 0. 0 faults again — FIFO threw it out one step too soon — evicting 1. 4 faults and evicts 2. That is six faults and two hits.",
        hints: [
          "Fill the empty frames first; those are unavoidable faults.",
          "FIFO never looks at usage, only at arrival order — which is why page 0 gets evicted and immediately needed again.",
        ],
        maxAttempts: 4,
      },
      {
        id: "it-paging-challenge-005",
        title: "Run LRU by Hand",
        scenario: "The same reference string 7 0 1 2 0 3 0 4 with three frames, this time under LRU.",
        objective: "Count the total number of page faults LRU produces, then compare it against your FIFO count.",
        requiresExperiment: true,
        tools: [{ id: "replacement", label: "Reference String & Replacement" }],
        answer: { mode: "numeric", unit: "page faults", target: 6, tolerance: 0 },
        explanation:
          "LRU also produces six faults here, but it reaches them differently: because it tracks last use rather than arrival, page 0 is kept when FIFO discarded it, and page 1 is evicted instead. Equal totals on one string is a useful reminder that a policy which reasons better is not guaranteed to win every workload.",
        hints: [
          "Track when each resident page was last touched, not when it arrived.",
          "Step through it in the simulator and read the note under each reference to see which page was chosen and why.",
        ],
        maxAttempts: 4,
      },
      {
        id: "it-paging-challenge-006",
        title: "Analyze a Reference String",
        scenario:
          "Run 1 2 3 4 1 2 5 1 2 3 4 5 with three frames under FIFO, LRU and Optimal, and open the comparison table.",
        objective: "Determine what the comparison shows about which algorithm is best.",
        requiresExperiment: true,
        tools: [{ id: "replacement", label: "Reference String & Replacement (comparison table)" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Optimal faults least, but FIFO and LRU trade places depending on the string — no implementable policy is best everywhere" },
            { id: "b", label: "LRU is always best, and this string proves it" },
            { id: "c", label: "All three always produce identical results" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "Optimal sets the floor because it can see the future, which is exactly why it is a benchmark rather than a policy. Between the two implementable policies the ordering is workload-dependent — swap in the other presets and watch it change.",
        hints: [
          "Run more than one preset before deciding.",
          "Ask what Optimal knows that FIFO and LRU cannot.",
        ],
      },
      {
        id: "it-paging-challenge-007",
        title: "Choose a Page Size",
        scenario:
          "A 10 KB program will run on a system where you may set the page size to 1 KB or 16 KB. You care about both wasted memory and page table size.",
        objective: "Determine which claim about this choice is correct.",
        requiresExperiment: true,
        tools: [{ id: "pagesize", label: "Page Size & Fragmentation" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "1 KB wastes nothing here but needs far more page table entries; 16 KB needs one page and wastes 6 KB" },
            { id: "b", label: "16 KB is strictly better because fewer pages is always better" },
            { id: "c", label: "1 KB is strictly better because smaller pages waste less" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "10 KB divides exactly into ten 1 KB pages, so there is no internal fragmentation — but a single-level page table over the address space needs many more entries, and ten separate faults may be needed to load the program. One 16 KB page loads in one go and needs almost no table, at the cost of 6 KB sitting unused. Neither is strictly better; it is a trade.",
        hints: [
          "Set the program size to 10 KB and switch between the two page sizes.",
          "Watch two numbers at once: wasted KB, and single-level page table entries.",
        ],
      },
      {
        id: "it-paging-challenge-008",
        title: "Make the TLB Work for You",
        scenario:
          "The TLB in this lab holds three translations and evicts the least recently used one. You will make eight accesses.",
        objective:
          "Determine which access pattern produces the most TLB hits, and therefore the fewest page table lookups.",
        requiresExperiment: true,
        tools: [{ id: "tlb", label: "TLB" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Reusing a small set of pages, e.g. 0 1 2 0 1 2 0 1 — the working set fits in the TLB" },
            { id: "b", label: "Touching eight different pages in a row, so every translation is fresh" },
            { id: "c", label: "Alternating between six pages, since six is more than three" },
          ],
          correctOptionId: "a",
        },
        explanation:
          "A TLB only helps when translations get reused before they are evicted. Three pages fit in a three-entry TLB, so after the first pass every access hits. Eight distinct pages never reuse anything, and cycling through six pages evicts each translation just before it is needed again — the same trap FIFO falls into with page frames.",
        hints: [
          "The TLB holds three entries. What happens to a pattern that touches more than three pages before repeating?",
          "Try both patterns and compare the page table lookup counters.",
        ],
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "virtual-memory-simulator",
      label: "Virtual Memory Simulator",
      href: "/dashboard/information-technology/virtual-memory-simulator",
      reason:
        "Virtual Memory explains why a process gets an address space that need not fit in RAM. Paging is the mechanism that implements it — start there if pages and frames feel like they came out of nowhere.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "memory-management-simulator",
      label: "Memory Management Simulator",
      href: "/dashboard/information-technology/memory-management-simulator",
      reason:
        "That topic shows external fragmentation arising from variable-sized allocations. Paging's fixed-size pages are the direct answer to that problem, and internal fragmentation is the price it pays.",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      label: "Process Management Simulator",
      href: "/dashboard/information-technology/process-management-simulator",
      reason:
        "Each process here carries its own page table, which is part of the per-process state that topic introduces.",
    },
  ],
};
