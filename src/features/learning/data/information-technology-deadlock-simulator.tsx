import type { TopicContent } from "../types";

export const informationTechnologyDeadlockSimulatorContent: TopicContent = {
  subjectSlug: "information-technology",
  topicSlug: "deadlock-simulator",
  title: "Deadlock Simulator",
  subjectLabel: "Information Technology",
  topicLabel: "Deadlock Simulator",
  colorToken: "it",
  simulationHref: "/dashboard/information-technology/deadlock-simulator",

  learn: {
    objectives: [
      "Explain why deadlocks occur, using the four Coffman conditions",
      "Read a Resource Allocation Graph and know when a cycle does — and doesn't — prove deadlock",
      "Run the Banker's Algorithm to tell a safe state from an unsafe one and decide whether to grant a request",
      "Compare prevention, avoidance, detection, and recovery as four different strategies for the same underlying problem",
    ],
    whyItMatters:
      "Every multi-process operating system has to hand out finite resources — memory, files, printers, locks, database connections — and take them back. Get the bookkeeping wrong and processes can end up waiting on each other forever, with no error message and no crash, just silence. Database systems detect this constantly (a \"transaction deadlock\" is the same idea, one layer up), and understanding it is the difference between a system that recovers gracefully and one that just hangs.",
    concepts: [
      {
        term: "Deadlock",
        explanation:
          "A state where a set of processes are each waiting for a resource held by another process in the same set, and none of them will ever release what they hold. Unlike a crash, nothing fails loudly — the processes are simply stuck.",
      },
      {
        term: "The four Coffman conditions",
        explanation:
          "Mutual Exclusion (a resource is held exclusively), Hold and Wait (a process holds one resource while waiting for another), No Preemption (a held resource can't be forcibly reclaimed), and Circular Wait (a closed chain of processes each waiting on the next). All four must hold at once for the classic deadlock scenario to occur.",
      },
      {
        term: "Resource Allocation Graph (RAG)",
        explanation:
          "A directed graph with process nodes and resource nodes. An edge from a resource to a process means that resource is currently allocated to it; an edge from a process to a resource means the process is requesting it. Deadlock analysis is largely about finding cycles in this graph.",
      },
      {
        term: "Single- vs multi-instance resources",
        explanation:
          "A single-instance resource (one printer) can only satisfy one holder at a time, so a cycle through it is fatal. A multi-instance resource (three database connections) may have a free instance held elsewhere in the system, so a cycle through it doesn't automatically prove deadlock — the general detection algorithm is needed to be sure.",
      },
      {
        term: "Safe state",
        explanation:
          "A state is safe if there exists at least one order in which every process could run to completion, assuming each gets what it eventually needs. Safe does not mean nothing is currently waiting — it means a way out is guaranteed to exist.",
      },
      {
        term: "Unsafe state",
        explanation:
          "A state where no such guaranteed order exists. This is a risk signal, not a diagnosis: an unsafe state has not necessarily deadlocked, and depending on what processes actually request next, it may still resolve without ever deadlocking.",
      },
      {
        term: "Banker's Algorithm",
        explanation:
          "A deadlock-avoidance algorithm that only grants a resource request if the resulting state is still provably safe. It works by computing each process's Need (Maximum − Allocation) and testing, hypothetically, whether every process could still eventually finish.",
        formula: "\\text{Need} = \\text{Maximum} - \\text{Allocation}",
        formulaCaption: "What a process might still request",
      },
      {
        term: "Deadlock detection",
        explanation:
          "Rather than avoiding deadlock in advance, an OS can let it happen and periodically run a reduction algorithm against current allocations and requests: any process the algorithm can never finish is confirmed to be part of a real deadlock.",
      },
      {
        term: "Deadlock recovery",
        explanation:
          "Once a deadlock is confirmed, the OS has to break it — usually by terminating one of the deadlocked processes (releasing what it holds) or by preempting a single resource from one of them and giving it to another.",
      },
    ],
    keyTerms: [
      { term: "Allocation", definition: "What a process currently holds." },
      { term: "Request", definition: "What a process is currently waiting to acquire." },
      { term: "Available", definition: "Instances of a resource type not currently held by anyone." },
      { term: "Prevention", definition: "Structurally ruling out one of the four Coffman conditions by rule." },
      { term: "Avoidance", definition: "Evaluating each request case-by-case to keep the system in a safe state." },
      { term: "Starvation", definition: "Repeatedly missing out on a resource, but not permanently blocked — unlike deadlock, its luck can still turn." },
    ],
    misconceptions: [
      {
        id: "cycle-always-deadlock",
        misconception: "A cycle in a Resource Allocation Graph always means deadlock.",
        correction:
          "Only when every resource on the cycle is single-instance. With a multi-instance resource on the cycle, a process outside the cycle may still release an instance and break the wait — the cycle alone doesn't prove it.",
      },
      {
        id: "unsafe-means-deadlocked",
        misconception: "An unsafe state means a deadlock has already happened.",
        correction:
          "Unsafe only means no safe completion order can be guaranteed in advance. The system may still avoid deadlock entirely, depending on what processes actually request next.",
      },
      {
        id: "deadlock-vs-starvation",
        misconception: "Deadlock and starvation are the same problem.",
        correction:
          "Starvation is a process being repeatedly passed over — unlucky, but it can still eventually run. Deadlock is a permanent, structural block with no way out short of outside intervention.",
      },
    ],
  },

  predict: {
    intro: "Before you open the labs, commit to a prediction for each of these — then go check yourself.",
    scenarios: [
      {
        id: "predict-minimal-deadlock",
        scenario:
          "P1 holds a single-instance Printer and requests a single-instance Scanner. P2 holds the Scanner and requests the Printer. Nothing else changes.",
        question: "What happens to P1 and P2?",
        options: [
          { id: "a", label: "Both remain permanently blocked" },
          { id: "b", label: "One of them eventually gets both resources" },
          { id: "c", label: "The OS automatically shares the resources between them" },
        ],
        actualResultOptionId: "a",
        explanation:
          "With single-instance resources and a completed cycle, there is no path forward for either process without outside intervention — this is the minimal deadlock.",
        hint: "Both resources are single-instance — can either process's request ever be satisfied without the other releasing first?",
      },
      {
        id: "predict-break-hold-and-wait",
        scenario:
          "The same two processes and resources, but now every process must request everything it will ever need before it starts running.",
        question: "Can the same deadlock still occur?",
        options: [
          { id: "a", label: "No — neither process can hold one resource while blocked on the other" },
          { id: "b", label: "Yes, exactly as before" },
          { id: "c", label: "Only if a third resource is added" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Requiring all resources up front removes the partial-hold pattern the scenario depends on — a process either gets everything or waits before acquiring anything.",
        hint: "Which Coffman condition does 'request everything up front' directly target?",
      },
      {
        id: "predict-multi-instance-cycle",
        scenario:
          "A Resource Allocation Graph has a cycle running through a resource type with three instances.",
        question: "Does this cycle alone prove deadlock?",
        options: [
          { id: "a", label: "No — the general detection algorithm has to confirm it" },
          { id: "b", label: "Yes, a cycle always proves deadlock" },
          { id: "c", label: "No — multi-instance resources can never be part of a deadlock" },
        ],
        actualResultOptionId: "a",
        explanation:
          "A free instance held elsewhere could still be released to a waiting process on the cycle — so the cycle by itself is inconclusive here, unlike the single-instance case.",
        hint: "Think about whether every instance of that resource type is necessarily tied up just because a cycle passes through it.",
      },
      {
        id: "predict-unsafe-state",
        scenario:
          "The Banker's Algorithm reports that the current state is unsafe.",
        question: "What does that tell you?",
        options: [
          { id: "a", label: "No safe completion order can currently be guaranteed — but deadlock hasn't necessarily happened" },
          { id: "b", label: "A deadlock has already occurred" },
          { id: "c", label: "Every process will fail" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Unsafe is a weaker, more pessimistic signal than deadlocked — it flags risk, not a confirmed outcome.",
        hint: "Recall the exact definition of a safe state — what does the absence of that guarantee actually claim?",
      },
      {
        id: "predict-banker-defer",
        scenario:
          "A process requests resources that are within its declared Need and within what's currently Available.",
        question: "Will the Banker's Algorithm always grant this request?",
        options: [
          { id: "a", label: "No — it also checks whether the resulting state would stay safe" },
          { id: "b", label: "Yes, passing those two checks is always enough" },
          { id: "c", label: "No — the algorithm never grants requests, only denies them" },
        ],
        actualResultOptionId: "a",
        explanation:
          "Availability and Need checks are necessary but not sufficient — the algorithm pretends to grant the request and re-runs the safety test before actually committing.",
        hint: "What's the very last step in the request-handling sequence, after Request ≤ Need and Request ≤ Available?",
      },
    ],
  },

  explore: {
    howToUse: [
      "Start in Beginner mode — toggle each of the four Coffman conditions off one at a time and watch when the classic deadlock stops occurring.",
      "In Resource Graph, add a couple of processes and resources, then request and allocate until you form a cycle. Notice the color change once a cycle is sufficient proof of deadlock versus merely a warning.",
      "In Deadlock Lab, step through the guided two- and three-process scenarios and watch the DEADLOCK DETECTED verdict appear once the cycle closes.",
      "In Safety Analysis, step through the Banker's Algorithm's safety check, then try the resource request experiment — see a request get deferred even though resources are technically available.",
      "In Prevention, flip the Hold-and-Wait and Circular-Wait toggles and see exactly which request gets blocked and why.",
      "In Detection & Recovery, run detection on a three-process scenario with a multi-instance resource, then try terminating or preempting to see what actually breaks the deadlock.",
    ],
    tryThis: [
      "In Resource Graph, build a cycle using only a resource with 2+ instances — can you see why it doesn't turn the status panel red?",
      "In Safety Analysis, try requesting more than a process's declared Need and see which check fails first.",
      "In Detection & Recovery, try preempting a single resource instead of terminating the whole process — does it still resolve the deadlock?",
    ],
  },

  explain: {
    questions: [
      {
        id: "why-four-conditions",
        question: "Why does breaking just one Coffman condition prevent the classic deadlock scenario?",
        answer:
          "Each condition plays a distinct structural role in forming the wait cycle. Mutual Exclusion is what makes waiting necessary at all; Hold and Wait is what lets a process sit partway through acquiring resources; No Preemption is what makes the wait permanent instead of reversible; Circular Wait is the closed loop itself. Removing any one of these breaks that specific chain — though it's worth remembering this is about the classic scenario, not a claim that every conceivable deadlock in every system vanishes the same way.",
      },
      {
        id: "why-cycle-not-always-deadlock",
        question: "Why isn't a cycle in a Resource Allocation Graph always proof of deadlock?",
        answer:
          "A cycle shows a chain of waiting, but with a multi-instance resource, satisfying one waiting process doesn't require every instance of that resource to be freed — just one. A process entirely outside the cycle might release an instance that lets a process on the cycle proceed, breaking the wait. Only when every resource on the cycle has exactly one instance is the cycle airtight.",
      },
      {
        id: "why-need-formula",
        question: "Why is Need calculated as Maximum minus Allocation, rather than tracked directly?",
        answer:
          "A process declares its maximum possible demand up front (how much of each resource it could ever need), and Allocation tracks what it currently holds. Need — what it might still ask for — is just the gap between those two: Maximum − Allocation. It's derived rather than stored directly so it's always consistent with the two numbers that actually change as the process runs.",
      },
      {
        id: "why-defer-when-available",
        question: "Why would the Banker's Algorithm defer a request even when the resources are currently free?",
        answer:
          "Availability alone doesn't guarantee the system can still finish every process afterward. The algorithm pretends to grant the request, then re-runs the safety check on that hypothetical state. If no safe completion order exists after the grant, it defers — trading a short-term \"yes\" for a longer-term guarantee that nothing gets permanently stuck.",
      },
      {
        id: "why-prevention-vs-avoidance",
        question: "What's the practical difference between preventing and avoiding deadlock?",
        answer:
          "Prevention changes the rules structurally, ahead of time — for example, banning hold-and-wait outright, so the situation that could deadlock simply can't arise. Avoidance leaves all four conditions structurally possible, but makes a real-time decision on every single request, checking whether granting it keeps the system safe. Prevention is simpler to reason about but can be more restrictive; avoidance is more flexible but requires knowing each process's maximum resource needs in advance.",
      },
      {
        id: "why-detection-over-cycle-check",
        question: "Why does the lab use a full detection algorithm instead of just checking for graph cycles?",
        answer:
          "A bare cycle check is correct only for single-instance resources. The moment any resource type has more than one instance, the detection algorithm — which tries to reduce the graph by repeatedly finishing any process whose request currently fits Available — is the only technique that's correct in general. It happens to degrade to the same answer as cycle-checking when every resource is single-instance, which is why the two feel closely related.",
      },
      {
        id: "why-recovery-hard-choice",
        question: "Why does deadlock recovery usually mean picking a process to sacrifice, rather than a clean fix?",
        answer:
          "By the time a deadlock is confirmed, every process involved is holding something another one needs, with no legal next move for any of them. The only way out is to change the situation from outside — take back a resource (preemption) or remove a process from the picture entirely (termination). Neither is \"free\": preemption may leave a process in an inconsistent state, and termination discards its work — which is why picking which process to sacrifice is itself a real engineering decision, not an automatic one.",
      },
    ],
  },

  practice: {
    quizId: "it-deadlock-simulator-practice",
  },

  challenge: {
    intro:
      "Progressively harder problems. Each one asks you to reason it out first — the simulator is there to check your answer, not to supply it.",
    scenarios: [
      {
        id: "challenge-identify-conditions",
        title: "Name the conditions",
        scenario:
          "P1 holds a write lock on a database row and is waiting for a second row's lock, currently held by P2. P2 is waiting for the first row's lock. Neither lock can be shared, and neither process's lock can be forcibly revoked.",
        objective: "Identify which of the four Coffman conditions are present in this scenario.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "All four: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait" },
            { id: "b", label: "Only Circular Wait" },
            { id: "c", label: "Only Mutual Exclusion and No Preemption" },
            { id: "d", label: "None — database locks don't count as resources" },
          ],
          correctOptionId: "a",
        },
        hints: [
          "Is each lock held by exactly one process at a time?",
          "Does each process hold one lock while waiting for the other?",
          "Can a lock be taken back from a process against its will here?",
        ],
        explanation:
          "Exclusive locks give Mutual Exclusion; each process holding one lock while requesting the other gives Hold and Wait; locks that can't be revoked give No Preemption; and the two processes waiting on each other closes the loop for Circular Wait. All four are present — this is a textbook deadlock, just dressed as a database problem instead of a printer and scanner.",
        requiresExperiment: false,
      },
      {
        id: "challenge-complete-graph",
        title: "Complete the graph",
        scenario: "P1 holds R1 and requests R2. P2 holds R2. R1 and R2 are both single-instance.",
        objective: "In the Resource Graph tab, add the missing request so that a cycle forms, then check the status panel.",
        constraints: [{ id: "c1", label: "Use only the two existing processes and two existing resources." }],
        tools: [{ id: "t1", label: "Resource Graph tab's request/allocate controls" }],
        answer: { mode: "interactive", instructions: "Build the graph in the Resource Graph tab until a cycle forms.", verifyLabel: "Check my graph" },
        hints: ["P2 needs to request something P1 is holding.", "P1 holds R1 — that's the missing request."],
        explanation: "Adding P2 → R1 (a request for the resource P1 holds) completes the cycle: P1 → R2 → P2 → R1 → P1.",
      },
      {
        id: "challenge-is-it-deadlocked",
        title: "Deadlocked or not?",
        scenario:
          "Three processes share a resource type with two instances. P1 holds one instance and requests a second. P2 holds one instance and requests nothing further. P3 holds no instances and requests one.",
        objective: "Determine whether this system is currently deadlocked.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "Not deadlocked — P2 can finish and release its instance, which then satisfies P3" },
            { id: "b", label: "Deadlocked — P1's request can never be satisfied" },
            { id: "c", label: "Deadlocked — all three processes are stuck" },
          ],
          correctOptionId: "a",
        },
        hints: [
          "P2 isn't requesting anything — what does that mean for whether it can finish?",
          "If P2 finishes and releases its instance, who benefits?",
        ],
        explanation:
          "P2 has no outstanding request, so it can finish immediately and release its instance. That satisfies P3's request. P1 is left waiting only on whichever instance is freed next — run it through Detection & Recovery to confirm the full order.",
        requiresExperiment: false,
      },
      {
        id: "challenge-find-safe-sequence",
        title: "Find a safe sequence",
        scenario: "Use the Safety Analysis tab's standard 5-process, 3-resource-type example.",
        objective: "Before stepping through the algorithm, predict which process finishes first — then verify.",
        tools: [{ id: "t1", label: "Safety Analysis tab's Available/Allocation/Max/Need table" }],
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "P1" },
            { id: "b", label: "P2" },
            { id: "c", label: "P3" },
          ],
          correctOptionId: "b",
        },
        hints: ["Compare each process's Need row against the starting Available row.", "Which process's entire Need row is already ≤ Available?"],
        explanation:
          "P2's Need is [1, 2, 2] against a starting Available of [3, 3, 2] — every component fits, so P2 can finish first. Step through the Safety Analysis tab to confirm the rest of the order.",
      },
      {
        id: "challenge-evaluate-request",
        title: "Grant or defer?",
        scenario: "Using the same standard example, a process requests resources within both its Need and current Available.",
        objective: "Determine whether every such request is automatically granted, and explain why or why not.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "No — it also has to leave the system in a safe state" },
            { id: "b", label: "Yes, those two checks are always sufficient" },
          ],
          correctOptionId: "a",
        },
        hints: ["What's the third and final check the Resource Request Experiment performs?"],
        explanation:
          "Passing Request ≤ Need and Request ≤ Available only qualifies a request for consideration — the algorithm still pretends to grant it and re-checks safety before actually committing. Try the classic example in the Resource Request Experiment to see a request denied for exactly this reason.",
        requiresExperiment: true,
      },
      {
        id: "challenge-break-circular-wait",
        title: "Prevent it with ordering",
        scenario: "A system imposes the ordering R1 < R2 < R3. A process already holds R2.",
        objective: "Determine which of R1 or R3 that process is allowed to request next under the ordering rule.",
        answer: {
          mode: "choice",
          options: [
            { id: "a", label: "R3 only" },
            { id: "b", label: "R1 only" },
            { id: "c", label: "Both are allowed" },
          ],
          correctOptionId: "a",
        },
        hints: ["The rule requires strictly increasing requests — which direction does R1 move relative to R2?"],
        explanation:
          "R3 is higher-numbered than R2, so requesting it obeys the ordering. Requesting R1 would move backwards, which the rule forbids outright — verify this in the Prevention tab's Circular Wait demo.",
        requiresExperiment: false,
      },
      {
        id: "challenge-recover",
        title: "Recover from a real deadlock",
        scenario: "Open Detection & Recovery and run detection on the default three-process scenario.",
        objective: "Find a single recovery action — terminate or preempt — that resolves the deadlock for the other two processes, using only one action.",
        constraints: [{ id: "c1", label: "Only one recovery action is allowed before re-running detection." }],
        tools: [{ id: "t1", label: "Terminate and Preempt buttons on each deadlocked process" }],
        answer: { mode: "interactive", instructions: "Apply one recovery action, then re-run detection.", verifyLabel: "Check the outcome" },
        hints: ["Terminating a process releases everything it holds at once — that's usually the most reliable single move.", "A single preemption only releases one resource — check whether that's actually enough."],
        explanation:
          "Terminating any one of the three processes releases everything it held, which is enough to let the reduction algorithm finish the remaining two — confirm it by re-running detection afterward.",
      },
    ],
  },

  relatedTopics: [
    {
      subjectSlug: "information-technology",
      topicSlug: "process-management-simulator",
      label: "Process Management Simulator",
      reason: "See the Running / Waiting / Blocked states this topic's processes move through, modeled in full.",
      href: "/dashboard/information-technology/process-management-simulator",
    },
    {
      subjectSlug: "information-technology",
      topicSlug: "file-system-explorer",
      label: "File System Explorer",
      reason: "The previous stop in Operating Systems — how persistent storage is organized.",
      href: "/dashboard/information-technology/file-system-explorer",
    },
  ],
};
