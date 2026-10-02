/**
 * DNS Simulator model: pure data and logic, no React.
 *
 * Everything here is an offline teaching model. Names, zones and addresses are illustrative (documentation-style
 * ranges plus the classic example.com address); nothing is looked up on the real Internet.
 */

export type DetailLevel = "beginner" | "intermediate" | "technical";
export const DETAIL_LEVEL_LABELS: Record<DetailLevel, string> = { beginner: "Beginner", intermediate: "Intermediate", technical: "Technical" };
export const DETAIL_LEVEL_ORDER: DetailLevel[] = ["beginner", "intermediate", "technical"];

// ---------------------------------------------------------------------------
// Nodes and visual states
// ---------------------------------------------------------------------------

export type NodeId = "client" | "resolver" | "root" | "tld" | "auth" | "website";

export const CLIENT_IP = "192.168.1.10";
export const RESOLVER_IP = "192.0.2.53";
export const ROOT_IP = "198.51.100.1";

/** The visual state of a message, a note or a step. Each has its own colour and label in the UI. */
export type StateKind = "query" | "response" | "hit" | "miss" | "processing" | "success" | "timeout" | "error";

export const STATE_LABEL: Record<StateKind, string> = {
  query: "Query",
  response: "Response",
  hit: "Cache HIT",
  miss: "Cache MISS",
  processing: "Processing",
  success: "Success",
  timeout: "Timeout",
  error: "Error",
};

export interface NodeNote {
  text: string;
  kind: StateKind;
}

// ---------------------------------------------------------------------------
// Names, TLDs and zones (the offline "Internet")
// ---------------------------------------------------------------------------

export type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "NS" | "TXT";

export interface ZoneRecord {
  name: string;
  type: RecordType;
  value: string;
  ttl: number;
}

export interface Zone {
  /** The registered domain this zone covers, e.g. example.com. */
  domain: string;
  nsName: string;
  nsIp: string;
  records: ZoneRecord[];
}

export const KNOWN_TLDS = ["com", "org", "net", "edu", "uk", "pk", "de"] as const;
const TLD_IP: Record<string, string> = { com: "198.51.100.2", org: "198.51.100.3", net: "198.51.100.4", edu: "198.51.100.5", uk: "198.51.100.6", pk: "198.51.100.7", de: "198.51.100.8" };

export function tldServerName(tld: string): string {
  return tld === "com" ? "a.gtld-servers.net" : `ns1.nic.${tld}`;
}
export function tldServerIp(tld: string): string {
  return TLD_IP[tld] ?? "198.51.100.9";
}

export const A_TTL = 300;
/** Delegations (which servers are in charge of a TLD or domain) are normally cached for much longer than address records. */
export const DELEGATION_TTL = 172800;

export const ZONES: Record<string, Zone> = {
  "example.com": {
    domain: "example.com",
    nsName: "ns1.example.com",
    nsIp: "203.0.113.53",
    records: [
      { name: "example.com", type: "A", value: "93.184.216.34", ttl: A_TTL },
      { name: "example.com", type: "AAAA", value: "2001:db8:5d:b8d8::22", ttl: A_TTL },
      { name: "www.example.com", type: "CNAME", value: "example.com", ttl: A_TTL },
      { name: "mail.example.com", type: "A", value: "203.0.113.25", ttl: A_TTL },
      { name: "shop.example.com", type: "A", value: "203.0.113.80", ttl: A_TTL },
      { name: "example.com", type: "MX", value: "10 mail.example.com", ttl: 3600 },
      { name: "example.com", type: "NS", value: "ns1.example.com", ttl: 86400 },
      { name: "example.com", type: "TXT", value: "\"v=spf1 mx -all\"", ttl: 3600 },
    ],
  },
  "school.edu": {
    domain: "school.edu",
    nsName: "ns1.school.edu",
    nsIp: "203.0.113.153",
    records: [
      { name: "school.edu", type: "A", value: "198.51.100.20", ttl: A_TTL },
      { name: "school.edu", type: "NS", value: "ns1.school.edu", ttl: 86400 },
    ],
  },
};

export const EXERCISE_DOMAINS = ["example.com", "school.edu", "mail.example.com", "shop.example.com"] as const;
export const PRESET_DOMAINS = ["www.example.com", "example.com", "mail.example.com", "shop.example.com", "school.edu", "does-not-exist.example"] as const;

export function normalizeName(raw: string): string {
  return raw.trim().toLowerCase().replace(/\.$/, "");
}

/** Returns an explanation if the text can't be a domain name for this lab, otherwise null. */
export function validateName(raw: string): string | null {
  const name = normalizeName(raw);
  if (!name) return "Type a domain name, for example www.example.com.";
  if (name.length > 253) return "Domain names are at most 253 characters long.";
  const labels = name.split(".");
  if (labels.length < 2) return "A domain name needs at least two parts, like example.com.";
  for (const l of labels) {
    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(l)) return "Use letters, numbers and hyphens in each part, separated by dots.";
  }
  return null;
}

export function splitName(name: string): { labels: string[]; tld: string; zone: string } {
  const labels = name.split(".");
  const tld = labels[labels.length - 1] ?? "";
  const zone = labels.slice(-2).join(".");
  return { labels, tld, zone };
}

export type Outcome =
  | { kind: "answer"; ip: string; cname?: string; ttl: number; zone: Zone }
  | { kind: "nxdomain"; at: "root" | "tld" | "auth"; zone?: Zone };

/** What the (simulated) Internet would say for an A query on this name. */
export function outcomeFor(name: string): Outcome {
  const { tld, zone: zoneName } = splitName(name);
  if (!(KNOWN_TLDS as readonly string[]).includes(tld)) return { kind: "nxdomain", at: "root" };
  const zone = ZONES[zoneName];
  if (!zone) return { kind: "nxdomain", at: "tld" };
  const direct = zone.records.find((r) => r.name === name && r.type === "A");
  if (direct) return { kind: "answer", ip: direct.value, ttl: direct.ttl, zone };
  const alias = zone.records.find((r) => r.name === name && r.type === "CNAME");
  if (alias) {
    const target = zone.records.find((r) => r.name === alias.value && r.type === "A");
    if (target) return { kind: "answer", ip: target.value, cname: alias.value, ttl: Math.min(alias.ttl, target.ttl), zone };
  }
  return { kind: "nxdomain", at: "auth", zone };
}

// ---------------------------------------------------------------------------
// Cache and time
// ---------------------------------------------------------------------------

export interface CacheEntry {
  name: string;
  type: "A";
  value: string;
  cname?: string;
  /** TTL the record was cached with, in seconds. */
  ttl: number;
  /** Lab clock time (seconds) at which it stops being usable. */
  expiresAt: number;
}

export interface Delegation {
  /** "com" or "example.com". */
  zone: string;
  nsName: string;
  nsIp: string;
  ttl: number;
  expiresAt: number;
}

export interface CacheState {
  answers: CacheEntry[];
  delegations: Delegation[];
}

export const emptyCache = (): CacheState => ({ answers: [], delegations: [] });
export const cloneCache = (c: CacheState): CacheState => ({ answers: c.answers.map((a) => ({ ...a })), delegations: c.delegations.map((d) => ({ ...d })) });

export function remaining(entry: { expiresAt: number }, now: number): number {
  return Math.max(0, entry.expiresAt - now);
}
export const isFresh = (entry: { expiresAt: number }, now: number): boolean => entry.expiresAt > now;

export function findAnswer(cache: CacheState, name: string): CacheEntry | undefined {
  return cache.answers.find((a) => a.name === name);
}
export function findDelegation(cache: CacheState, zone: string): Delegation | undefined {
  return cache.delegations.find((d) => d.zone === zone);
}

export function withAnswer(cache: CacheState, entry: CacheEntry): CacheState {
  return { ...cache, answers: [...cache.answers.filter((a) => a.name !== entry.name), entry] };
}
export function withDelegation(cache: CacheState, d: Delegation): CacheState {
  return { ...cache, delegations: [...cache.delegations.filter((x) => x.zone !== d.zone), d] };
}

export function hasFreshAnswer(cache: CacheState, now: number): boolean {
  return cache.answers.some((a) => isFresh(a, now));
}

export function formatTtl(seconds: number): string {
  if (seconds >= 86400 && seconds % 86400 === 0) return `${seconds / 86400} day${seconds === 86400 ? "" : "s"}`;
  if (seconds >= 3600 && seconds % 3600 === 0) return `${seconds / 3600} hour${seconds === 3600 ? "" : "s"}`;
  return `${seconds} s`;
}

export function formatClock(totalSeconds: number): string {
  const s = ((totalSeconds % 86400) + 86400) % 86400;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
/** The event log starts at 08:30:01, like the example in the brief. */
export const LOG_START_SECONDS = 8 * 3600 + 30 * 60 + 1;

// ---------------------------------------------------------------------------
// Runs: a lookup planned as a list of steps
// ---------------------------------------------------------------------------

export type LogKind = StateKind | "info";
export interface LogLine {
  kind: LogKind;
  text: string;
  detail?: string;
}

export interface Token {
  from: NodeId;
  to: NodeId;
  kind: StateKind;
  label: string;
  /** The message never arrives: it fades out part-way along the link. */
  lost?: boolean;
}

/** What the query inspector shows for a message. Deliberately not a packet dump. */
export interface DnsMessage {
  title: string;
  direction: "query" | "response";
  from: NodeId;
  to: NodeId;
  name: string;
  type: RecordType;
  question: string;
  response?: string;
  answer?: string;
  ttl?: number;
  server: string;
  rcode?: "NOERROR" | "NXDOMAIN" | "no response";
  flags?: string;
  note?: string;
}

export interface RunStep {
  id: string;
  kind: StateKind;
  title: string;
  text: string;
  /** Extra detail for the Intermediate and Technical levels. */
  tech?: string;
  token?: Token;
  notes?: Partial<Record<NodeId, NodeNote>>;
  log: LogLine[];
  message?: DnsMessage;
  /** The resolver's cache after this step (only present when the step changes it). */
  cache?: CacheState;
  /** Cache entry (by name) to highlight, for a HIT. */
  highlight?: string;
  /** True for the step in which the website node lights up. */
  reachWebsite?: boolean;
}

export type LookupStatus = "resolved" | "cache-hit" | "nxdomain" | "timeout";

export interface LookupResult {
  name: string;
  status: LookupStatus;
  ip?: string;
  cname?: string;
  ttl?: number;
  /** DNS messages sent or received over the network in this lookup. */
  messages: number;
  contacted: string[];
  skipped: string[];
  nxAt?: "root" | "tld" | "auth";
}

export type Fault = "no-response" | null;

export interface Run {
  id: number;
  name: string;
  fault: Fault;
  steps: RunStep[];
  base: CacheState;
  final: CacheState;
  startedAtClock: number;
  result: LookupResult;
}

const RESOLVER_LABEL = `DNS Resolver (${RESOLVER_IP})`;

function q(name: string): string {
  return `What IPv4 address belongs to ${name}?`;
}

/**
 * Plans one lookup from the client's first query to the final result. The plan is a pure function of the name,
 * the resolver's cache and the clock, so Back / Restart replay exactly the same steps.
 */
export function planLookup(args: { id: number; rawName: string; cache: CacheState; now: number; fault?: Fault }): Run {
  const name = normalizeName(args.rawName);
  const fault: Fault = args.fault ?? null;
  const base = cloneCache(args.cache);
  const now = args.now;
  let cache = cloneCache(args.cache);
  const steps: RunStep[] = [];
  const sid = (s: string) => `${args.id}:${steps.length}:${s}`;
  const { tld, zone: zoneName } = splitName(name);
  const outcome = outcomeFor(name);
  const contacted: string[] = [];
  const skipped: string[] = [];
  let messages = 2; // client query + final reply to the client

  const queryMsg = (from: NodeId, to: NodeId, server: string, flags: string, note?: string): DnsMessage => ({
    title: `Query: ${from === "client" ? "client" : "resolver"} → ${to === "resolver" ? "resolver" : to === "root" ? "root server" : to === "tld" ? `.${tld} server` : "authoritative server"}`,
    direction: "query",
    from,
    to,
    name,
    type: "A",
    question: q(name),
    server,
    flags,
    note,
  });

  // 1. The client asks its resolver (always the first message).
  steps.push({
    id: sid("client-query"),
    kind: "query",
    title: "The client asks its DNS resolver",
    text: `An application on the PC needs an IP address for ${name}. The PC sends a DNS query to its configured DNS resolver and asks for the A record (an IPv4 address).`,
    tech: "Ordinary DNS queries are normally sent over UDP port 53. The client sets the RD (recursion desired) flag: \"please find the final answer for me.\"",
    token: { from: "client", to: "resolver", kind: "query", label: "Query", lost: fault === "no-response" },
    notes: { client: { text: `Needs ${name}`, kind: "query" } },
    log: [
      { kind: "query", text: "Client → DNS Resolver" },
      { kind: "query", text: `Query: ${name}`, detail: "type A · recursion desired" },
    ],
    message: queryMsg("client", "resolver", RESOLVER_LABEL, "RD (recursion desired)", "Sent to the resolver address configured on the PC (often handed out by DHCP)."),
  });

  // ---- Fault: the resolver never answers ---------------------------------------------------------------------
  if (fault === "no-response") {
    steps.push({
      id: sid("wait"),
      kind: "processing",
      title: "The client waits for a reply",
      text: "Nothing comes back. DNS over UDP has no built-in delivery guarantee, so the client waits a short time before it gives up on this attempt.",
      notes: { client: { text: "Waiting…", kind: "processing" }, resolver: { text: "No reply", kind: "timeout" } },
      log: [{ kind: "processing", text: "Client waiting for the DNS reply…" }],
    });
    steps.push({
      id: sid("retry"),
      kind: "query",
      title: "The client retries",
      text: "Clients normally try again (and may try a second configured resolver). Here the same silence follows.",
      tech: "Real clients use timeouts of a second or two and a limited number of retries; the exact values depend on the operating system.",
      token: { from: "client", to: "resolver", kind: "query", label: "Retry", lost: true },
      notes: { client: { text: "Retrying…", kind: "query" }, resolver: { text: "No reply", kind: "timeout" } },
      log: [{ kind: "query", text: "Client → DNS Resolver (retry)" }, { kind: "timeout", text: "Still no response" }],
      message: { ...queryMsg("client", "resolver", RESOLVER_LABEL, "RD (recursion desired)"), title: "Query (retry): client → resolver", response: "No response received", rcode: "no response" },
    });
    steps.push({
      id: sid("timeout"),
      kind: "timeout",
      title: "DNS query timed out",
      text: `The application cannot get an IP address for ${name} through DNS, so it cannot start a connection. The website itself may be perfectly fine: the name just can't be turned into an address.`,
      tech: "Typing the site's IP address directly would skip DNS and might still work. That is a classic way to tell a DNS problem from a connectivity problem. Common causes: resolver down or unreachable, wrong resolver address, or a firewall dropping port 53.",
      notes: { client: { text: "DNS query timed out", kind: "timeout" }, resolver: { text: "Unreachable?", kind: "timeout" } },
      log: [{ kind: "timeout", text: "DNS query timed out", detail: `${name}: no answer from ${RESOLVER_IP}` }],
    });
    return finish("timeout");
  }

  // 2. The resolver checks its cache.
  const cached = findAnswer(cache, name);
  steps.push({
    id: sid("check-cache"),
    kind: "processing",
    title: "The resolver checks its cache",
    text: "Before asking anyone else, the resolver looks in its DNS cache for a saved answer to this exact question.",
    notes: { resolver: { text: "Checking cache…", kind: "processing" } },
    log: [{ kind: "processing", text: `Resolver: checking cache for ${name}` }],
  });

  // ---- Cache HIT ------------------------------------------------------------------------------------------
  if (cached && isFresh(cached, now)) {
    const left = remaining(cached, now);
    steps.push({
      id: sid("hit"),
      kind: "hit",
      title: "Cache HIT: the answer is already saved",
      text: `The resolver has ${name} → ${cached.value} saved, with ${left} seconds of its TTL left. No other DNS server needs to be contacted.`,
      tech: "A cached answer may be returned until its TTL runs out. The resolver sets the RA (recursion available) flag and the answer is not marked authoritative: it comes from the cache, not from the zone's own server.",
      notes: { resolver: { text: "Cache HIT", kind: "hit" } },
      highlight: name,
      log: [{ kind: "hit", text: "Cache HIT", detail: `${name} → ${cached.value} · TTL left ${left} s` }],
    });
    steps.push({
      id: sid("hit-answer"),
      kind: "hit",
      title: "The resolver answers immediately",
      text: `The IP address goes straight back to the client: ${cached.value}.`,
      token: { from: "resolver", to: "client", kind: "hit", label: "Answer" },
      notes: { resolver: { text: "From cache", kind: "hit" } },
      highlight: name,
      log: [{ kind: "response", text: "Resolver → Client" }, { kind: "response", text: `Answer: ${cached.value}`, detail: "served from cache" }],
      message: {
        title: "Response: resolver → client (from cache)",
        direction: "response",
        from: "resolver",
        to: "client",
        name,
        type: "A",
        question: q(name),
        response: `${name} has the IPv4 address ${cached.value}.`,
        answer: cached.value,
        ttl: left,
        server: RESOLVER_LABEL,
        rcode: "NOERROR",
        flags: "RD, RA (not authoritative)",
        note: "The TTL in a cached reply counts down as the record ages.",
      },
    });
    steps.push({
      id: sid("done"),
      kind: "success",
      title: "The client has its IP address",
      text: `${name} → ${cached.value}. The client can now connect to the website. This lookup needed just two DNS messages instead of eight.`,
      notes: { client: { text: cached.value, kind: "success" }, website: { text: "Ready to connect", kind: "success" } },
      reachWebsite: true,
      log: [{ kind: "success", text: `Resolved: ${name} → ${cached.value}` }],
    });
    return finish("cache-hit", { ip: cached.value, cname: cached.cname, ttl: left });
  }

  // ---- Cache MISS ------------------------------------------------------------------------------------------
  const expiredNote = cached ? " The saved entry has expired, so it can't be used." : "";
  steps.push({
    id: sid("miss"),
    kind: "miss",
    title: "Cache MISS: the resolver must look it up",
    text: `There is no usable saved answer for ${name}.${expiredNote} The resolver now has to find it by asking DNS servers, working down the hierarchy.`,
    notes: { resolver: { text: cached ? "Entry expired: MISS" : "Cache MISS", kind: "miss" } },
    log: [{ kind: "miss", text: "Cache MISS", detail: cached ? "the saved entry's TTL has run out" : undefined }],
  });

  const zoneDeleg = findDelegation(cache, zoneName);
  const tldDeleg = findDelegation(cache, tld);
  const zoneKnown = !!zoneDeleg && isFresh(zoneDeleg, now);
  const tldKnown = !!tldDeleg && isFresh(tldDeleg, now);
  const failNx = (at: "root" | "tld" | "auth") => finishNx(at);

  // Root
  if (zoneKnown || tldKnown) {
    skipped.push("Root");
    steps.push({
      id: sid("skip-root"),
      kind: "hit",
      title: zoneKnown ? "The resolver already knows who is in charge" : "The resolver already knows the TLD servers",
      text: zoneKnown
        ? `From an earlier lookup the resolver remembers the authoritative server for ${zoneName}, so it skips the root and the .${tld} servers and asks that server directly.`
        : `From an earlier lookup the resolver remembers the .${tld} name servers, so it skips the root and asks them directly.`,
      tech: "Caching is not limited to final answers. Delegations (NS records) are cached too, usually for much longer, which is why root servers see far fewer queries than you might expect.",
      notes: { resolver: { text: "Name servers cached", kind: "hit" } },
      log: [{ kind: "hit", text: zoneKnown ? `Cached name server for ${zoneName}: skipping root and .${tld}` : `Cached .${tld} name servers: skipping root` }],
    });
  } else {
    contacted.push("Root");
    messages += 2;
    steps.push({
      id: sid("root-q"),
      kind: "query",
      title: "The resolver asks a root server",
      text: `The resolver has no name-server information for .${tld}, so it starts at the top of the hierarchy and asks a root server about ${name}.`,
      token: { from: "resolver", to: "root", kind: "query", label: "Query" },
      notes: { resolver: { text: "Cache MISS", kind: "miss" } },
      log: [{ kind: "query", text: "Resolver → Root" }, { kind: "query", text: `Query: ${name}`, detail: "type A · asked iteratively" }],
      message: queryMsg("resolver", "root", `Root server (${ROOT_IP})`, "none (iterative query)", "The resolver does not ask the root to find the final answer; it only wants to know where to ask next."),
    });
    if (outcome.kind === "nxdomain" && outcome.at === "root") return failNx("root");
    const nsName = tldServerName(tld);
    const nsIp = tldServerIp(tld);
    cache = withDelegation(cache, { zone: tld, nsName, nsIp, ttl: DELEGATION_TTL, expiresAt: now + DELEGATION_TTL });
    steps.push({
      id: sid("root-r"),
      kind: "response",
      title: `The root server points to the .${tld} servers`,
      text: `The root doesn't know the IP address of ${name}, but it knows who runs .${tld}. It replies with a referral: "ask ${nsName} (${nsIp})." The resolver does the next step itself.`,
      tech: "A referral is an NS record (plus an address hint called glue). The root server does not forward the query onward.",
      token: { from: "root", to: "resolver", kind: "response", label: "Referral" },
      notes: { resolver: { text: `Learned .${tld} servers`, kind: "response" } },
      cache,
      log: [{ kind: "response", text: "Root → Resolver", detail: `referral: ask the .${tld} servers (${nsIp})` }],
      message: {
        title: "Response: root server → resolver (referral)",
        direction: "response",
        from: "root",
        to: "resolver",
        name,
        type: "A",
        question: q(name),
        response: `I don't have the answer, but the .${tld} servers do. Ask ${nsName}.`,
        answer: `NS ${nsName} (${nsIp})`,
        ttl: DELEGATION_TTL,
        server: `Root server (${ROOT_IP})`,
        rcode: "NOERROR",
        flags: "no answer, referral only",
      },
    });
  }

  // TLD
  if (zoneKnown) {
    skipped.push(`.${tld} TLD`);
  } else {
    contacted.push(`.${tld} TLD`);
    messages += 2;
    const ip = tldServerIp(tld);
    steps.push({
      id: sid("tld-q"),
      kind: "query",
      title: `The resolver asks the .${tld} server`,
      text: `Now the resolver asks a .${tld} top-level domain server the same question.`,
      token: { from: "resolver", to: "tld", kind: "query", label: "Query" },
      log: [{ kind: "query", text: `Resolver → .${tld} server` }, { kind: "query", text: `Query: ${name}`, detail: "type A" }],
      message: queryMsg("resolver", "tld", `.${tld} TLD server (${ip})`, "none (iterative query)"),
    });
    if (outcome.kind === "nxdomain" && outcome.at === "tld") return failNx("tld");
    const zone = outcome.kind === "answer" || outcome.at === "auth" ? outcome.zone! : ZONES[zoneName]!;
    cache = withDelegation(cache, { zone: zoneName, nsName: zone.nsName, nsIp: zone.nsIp, ttl: DELEGATION_TTL, expiresAt: now + DELEGATION_TTL });
    steps.push({
      id: sid("tld-r"),
      kind: "response",
      title: `The .${tld} server points to ${zoneName}'s name server`,
      text: `The .${tld} server knows which name server is in charge of ${zoneName}, but not the address of ${name}. It refers the resolver to ${zone.nsName} (${zone.nsIp}).`,
      token: { from: "tld", to: "resolver", kind: "response", label: "Referral" },
      notes: { resolver: { text: `Learned ${zoneName} servers`, kind: "response" } },
      cache,
      log: [{ kind: "response", text: `.${tld} server → Resolver`, detail: `referral: ask ${zone.nsName} (${zone.nsIp})` }],
      message: {
        title: `Response: .${tld} server → resolver (referral)`,
        direction: "response",
        from: "tld",
        to: "resolver",
        name,
        type: "A",
        question: q(name),
        response: `Ask the name server of ${zoneName}: ${zone.nsName}.`,
        answer: `NS ${zone.nsName} (${zone.nsIp})`,
        ttl: DELEGATION_TTL,
        server: `.${tld} TLD server (${ip})`,
        rcode: "NOERROR",
        flags: "no answer, referral only",
      },
    });
  }

  // Authoritative
  const zone = ZONES[zoneName];
  const authIp = zone ? zone.nsIp : "203.0.113.53";
  const authName = zone ? zone.nsName : `ns1.${zoneName}`;
  contacted.push("Authoritative");
  messages += 2;
  steps.push({
    id: sid("auth-q"),
    kind: "query",
    title: "The resolver asks the authoritative server",
    text: `The resolver asks ${authName}, the server that holds the real DNS records for ${zoneName}.`,
    token: { from: "resolver", to: "auth", kind: "query", label: "Query" },
    log: [{ kind: "query", text: "Resolver → Authoritative Server" }, { kind: "query", text: `Query: ${name}`, detail: "type A" }],
    message: queryMsg("resolver", "auth", `Authoritative server ${authName} (${authIp})`, "none (iterative query)"),
  });
  if (outcome.kind !== "answer") return failNx("auth");

  cache = withAnswer(cache, { name, type: "A", value: outcome.ip, cname: outcome.cname, ttl: outcome.ttl, expiresAt: now + outcome.ttl });
  const viaText = outcome.cname ? `${name} is an alias (CNAME) for ${outcome.cname}, and ${outcome.cname} has the A record ${outcome.ip}.` : `${name} has the A record ${outcome.ip}.`;
  steps.push({
    id: sid("auth-r"),
    kind: "response",
    title: "The authoritative server gives the answer",
    text: `${viaText} The TTL is ${outcome.ttl} seconds, so the resolver may keep this answer for that long.`,
    tech: "An authoritative answer sets the AA flag. A CNAME and the A record it points to in the same zone are normally returned together. Real resolvers cache the CNAME and the A record as separate entries; this lab shows one combined entry.",
    token: { from: "auth", to: "resolver", kind: "response", label: "Answer" },
    notes: { resolver: { text: `Cached for ${outcome.ttl} s`, kind: "response" }, auth: { text: "Authoritative", kind: "success" } },
    cache,
    log: [{ kind: "response", text: "Authoritative Server → Resolver", detail: outcome.cname ? `CNAME ${outcome.cname} · A ${outcome.ip} · TTL ${outcome.ttl}` : `A ${outcome.ip} · TTL ${outcome.ttl}` }, { kind: "processing", text: "Resolver saves the answer in its cache" }],
    message: {
      title: "Response: authoritative server → resolver",
      direction: "response",
      from: "auth",
      to: "resolver",
      name,
      type: "A",
      question: q(name),
      response: viaText,
      answer: outcome.cname ? `CNAME ${outcome.cname}, A ${outcome.ip}` : `A ${outcome.ip}`,
      ttl: outcome.ttl,
      server: `Authoritative server ${authName} (${authIp})`,
      rcode: "NOERROR",
      flags: "AA (authoritative answer)",
    },
  });

  steps.push({
    id: sid("final-answer"),
    kind: "response",
    title: "The resolver returns the answer to the client",
    text: `The resolver did all the searching. It now sends the client the one thing it asked for: ${outcome.ip}.`,
    token: { from: "resolver", to: "client", kind: "response", label: "Answer" },
    log: [{ kind: "response", text: "Resolver → Client" }, { kind: "response", text: `Answer: ${outcome.ip}`, detail: `TTL ${outcome.ttl}` }],
    message: {
      title: "Response: resolver → client",
      direction: "response",
      from: "resolver",
      to: "client",
      name,
      type: "A",
      question: q(name),
      response: `${name} has the IPv4 address ${outcome.ip}.`,
      answer: outcome.ip,
      ttl: outcome.ttl,
      server: RESOLVER_LABEL,
      rcode: "NOERROR",
      flags: "RD, RA",
    },
  });
  steps.push({
    id: sid("done"),
    kind: "success",
    title: "The client has its IP address",
    text: `${name} → ${outcome.ip}. DNS has done its job: a human-friendly name became a network address, and the client can now connect to the website.`,
    notes: { client: { text: outcome.ip, kind: "success" }, website: { text: "Ready to connect", kind: "success" } },
    reachWebsite: true,
    log: [{ kind: "success", text: `Resolved: ${name} → ${outcome.ip}` }],
  });
  return finish("resolved", { ip: outcome.ip, cname: outcome.cname, ttl: outcome.ttl });

  // ---- helpers (function declarations are hoisted, so the paths above can return early) --------------------------
  function finishNx(at: "root" | "tld" | "auth"): Run {
    const who = at === "root" ? "The root servers have no" : at === "tld" ? `The .${tld} servers have no registered` : "The authoritative server has no";
    const what = at === "root" ? `.${tld} top-level domain` : at === "tld" ? `domain called ${zoneName}` : `record for ${name}`;
    const from: NodeId = at;
    const serverLabel = at === "root" ? `Root server (${ROOT_IP})` : at === "tld" ? `.${tld} TLD server (${tldServerIp(tld)})` : `Authoritative server ${authNameFor()}`;
    steps.push({
      id: sid("nx"),
      kind: "error",
      title: "NXDOMAIN: the name does not exist",
      text: `${who} ${what}, so it answers NXDOMAIN ("no such domain"). This is a real, correct DNS answer, not a failure of DNS itself.`,
      tech: "NXDOMAIN is response code 3. Resolvers may cache negative answers like this for a short time so that they don't repeat the same doomed lookup.",
      token: { from, to: "resolver", kind: "error", label: "NXDOMAIN" },
      notes: { [from]: { text: "NXDOMAIN", kind: "error" } },
      log: [{ kind: "error", text: `${from === "root" ? "Root" : from === "tld" ? `.${tld} server` : "Authoritative Server"} → Resolver`, detail: "NXDOMAIN: domain not found" }],
      message: {
        title: `Response: ${from === "root" ? "root server" : from === "tld" ? `.${tld} server` : "authoritative server"} → resolver (NXDOMAIN)`,
        direction: "response",
        from,
        to: "resolver",
        name,
        type: "A",
        question: q(name),
        response: "That name does not exist.",
        server: serverLabel,
        rcode: "NXDOMAIN",
        flags: at === "auth" ? "AA (authoritative answer)" : "no answer",
      },
    });
    steps.push({
      id: sid("nx-final"),
      kind: "error",
      title: "The resolver tells the client: not found",
      text: "The resolver passes the bad news back to the client.",
      token: { from: "resolver", to: "client", kind: "error", label: "NXDOMAIN" },
      log: [{ kind: "error", text: "Resolver → Client", detail: "NXDOMAIN" }],
      message: {
        title: "Response: resolver → client (NXDOMAIN)",
        direction: "response",
        from: "resolver",
        to: "client",
        name,
        type: "A",
        question: q(name),
        response: "That name does not exist.",
        server: RESOLVER_LABEL,
        rcode: "NXDOMAIN",
        flags: "RD, RA",
      },
    });
    steps.push({
      id: sid("nx-done"),
      kind: "error",
      title: "Domain not found",
      text: `The application shows an error such as "server not found". Compare this with a timeout: here DNS replied quickly and clearly, and the answer was "that name doesn't exist". Check the spelling of ${name}.`,
      notes: { client: { text: "Domain not found", kind: "error" } },
      log: [{ kind: "error", text: `NXDOMAIN: ${name} not found` }],
    });
    return finish("nxdomain", { nxAt: at });
  }

  function authNameFor(): string {
    return zone ? `${zone.nsName} (${zone.nsIp})` : `ns1.${zoneName}`;
  }

  function finish(status: LookupStatus, extra: Partial<LookupResult> = {}): Run {
    const result: LookupResult = {
      name,
      status,
      messages: status === "timeout" ? 2 : status === "cache-hit" ? 2 : messages,
      contacted: status === "timeout" ? [] : contacted,
      skipped,
      ...extra,
    };
    return { id: args.id, name, fault, steps, base, final: cache, startedAtClock: now, result };
  }
}

/** The resolver's cache as it looks after the given step (or at the start of the run when no step has been reached). */
export function cacheAtStep(run: Run, stepIndex: number): CacheState {
  let shown = run.base;
  for (let i = 0; i <= stepIndex && i < run.steps.length; i++) {
    const c = run.steps[i]?.cache;
    if (c) shown = c;
  }
  return shown;
}

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

export type ScenarioId = "resolves" | "cache-hit" | "cache-miss" | "no-response" | "nxdomain" | "ttl-expired";

export interface Scenario {
  id: ScenarioId;
  number: number;
  title: string;
  summary: string;
  domain: string;
  fault: Fault;
  watch: string;
  lesson: string;
  /** The resolver's cache and clock when the scenario starts. */
  setup: () => { cache: CacheState; now: number };
}

const fresh = (name: string, value: string, left: number, cname?: string): CacheEntry => ({ name, type: "A", value, cname, ttl: A_TTL, expiresAt: 1000 + left });
const comDeleg: Delegation = { zone: "com", nsName: tldServerName("com"), nsIp: tldServerIp("com"), ttl: DELEGATION_TTL, expiresAt: 1000 + DELEGATION_TTL };
const exDeleg: Delegation = { zone: "example.com", nsName: "ns1.example.com", nsIp: "203.0.113.53", ttl: DELEGATION_TTL, expiresAt: 1000 + DELEGATION_TTL };

export const SCENARIOS: Scenario[] = [
  {
    id: "resolves",
    number: 1,
    title: "Domain resolves",
    summary: "Everything works. The resolver starts with an empty cache and finds the answer.",
    domain: "www.example.com",
    fault: null,
    watch: "Follow the query from the client to the resolver, then root → .com → authoritative, and the answer back.",
    lesson: "A normal lookup: the resolver does the work, one referral at a time, until the authoritative server gives the real answer.",
    setup: () => ({ cache: emptyCache(), now: 1000 }),
  },
  {
    id: "cache-hit",
    number: 2,
    title: "DNS cache hit",
    summary: "The resolver already has this answer saved, so it replies immediately.",
    domain: "www.example.com",
    fault: null,
    watch: "No DNS server is contacted at all. Only two messages are needed.",
    lesson: "Caching makes repeat lookups faster and spares the DNS servers from repeated questions.",
    setup: () => ({ cache: { answers: [fresh("www.example.com", "93.184.216.34", 240, "example.com")], delegations: [comDeleg, exDeleg] }, now: 1000 }),
  },
  {
    id: "cache-miss",
    number: 3,
    title: "DNS cache miss",
    summary: "The cache holds a different name, so the resolver must look this one up, but it already knows where example.com's servers are.",
    domain: "shop.example.com",
    fault: null,
    watch: "Cache MISS, then notice the resolver skips the root and .com and goes straight to the authoritative server.",
    lesson: "A miss means a lookup is needed, but earlier knowledge can still shorten it. Not every lookup walks the whole hierarchy.",
    setup: () => ({ cache: { answers: [fresh("www.example.com", "93.184.216.34", 240, "example.com")], delegations: [comDeleg, exDeleg] }, now: 1000 }),
  },
  {
    id: "no-response",
    number: 4,
    title: "No DNS response",
    summary: "The resolver doesn't answer. The client retries, then gives up.",
    domain: "www.example.com",
    fault: "no-response",
    watch: "The query fades out before it arrives, the client waits and retries, then reports a timeout.",
    lesson: "Without DNS the application can't get the IP address it needs, even if the website is perfectly healthy.",
    setup: () => ({ cache: emptyCache(), now: 1000 }),
  },
  {
    id: "nxdomain",
    number: 5,
    title: "Unknown domain",
    summary: "The name doesn't exist anywhere in DNS.",
    domain: "does-not-exist.example",
    fault: null,
    watch: "A fast, clear NXDOMAIN reply comes back from the root servers, which have no .example TLD.",
    lesson: "NXDOMAIN means \"that name doesn't exist\". It is a proper DNS answer, unlike a timeout where nothing answers at all.",
    setup: () => ({ cache: emptyCache(), now: 1000 }),
  },
  {
    id: "ttl-expired",
    number: 6,
    title: "TTL expired",
    summary: "The saved answer's TTL has run out, so it can't be used any more.",
    domain: "www.example.com",
    fault: null,
    watch: "The cache entry is marked Expired, so the lookup is a MISS, but the name-server knowledge is still cached.",
    lesson: "TTL controls how long a cached record may be kept. After that the resolver must ask again to get a fresh answer.",
    setup: () => ({ cache: { answers: [{ name: "www.example.com", type: "A", value: "93.184.216.34", cname: "example.com", ttl: A_TTL, expiresAt: 1000 - 1 }], delegations: [comDeleg, exDeleg] }, now: 1000 }),
  },
];

// ---------------------------------------------------------------------------
// Hierarchy, records, modes and information panel content
// ---------------------------------------------------------------------------

export type HierarchyId = "root" | "tld" | "domain" | "host";

export interface HierarchyLevel {
  id: HierarchyId;
  chip: string;
  title: string;
  who: string;
  beginner: string;
  intermediate: string;
  technical: string;
  examples: string[];
}

export const HIERARCHY: HierarchyLevel[] = [
  {
    id: "root",
    chip: ". (root)",
    title: "Root",
    who: "Root servers",
    beginner: "The top of the DNS hierarchy. Root servers don't know every website's address, but they know where to find each top-level domain.",
    intermediate: "A resolver that knows nothing about a name starts here. The root answers with a referral to the servers for the TLD (like .com), not with the final address.",
    technical: "The root zone is written as a single dot, and every full name really ends in one (www.example.com.). Resolvers ship with a built-in list of root server addresses, called root hints. There are 13 root server names, each served by many machines worldwide using anycast.",
    examples: ["a.root-servers.net (name only; this lab uses illustrative addresses)"],
  },
  {
    id: "tld",
    chip: "com",
    title: "Top-level domain (TLD)",
    who: "TLD servers",
    beginner: "The last part of a name. Examples: .com, .org, .net, .edu and country-code TLDs such as .uk or .pk. Each TLD has servers that know which name servers handle each domain below it.",
    intermediate: "A .com server doesn't hold the records for example.com. It knows which authoritative name servers do, and refers the resolver to them.",
    technical: "TLDs are grouped into generic (gTLD) and country-code (ccTLD) types. A TLD zone mostly contains NS records (delegations) for the registered domains below it, plus glue addresses where needed.",
    examples: [".com", ".org", ".net", ".edu", "country-code TLDs: .uk, .pk, .de"],
  },
  {
    id: "domain",
    chip: "example",
    title: "Authoritative domain server",
    who: "Authoritative name servers for example.com",
    beginner: "The server that holds the real DNS records for a domain, such as example.com. Its answers are authoritative: they come from whoever manages the domain.",
    intermediate: "This is where lookups end. The authoritative server returns the A, AAAA, CNAME, MX or other record the resolver asked about, together with a TTL.",
    technical: "A domain's NS records name its authoritative servers (usually two or more for redundancy). Their answers carry the AA flag. A zone can be copied between servers, which is when TCP is used for zone transfers.",
    examples: ["example.com → served by ns1.example.com", "school.edu → served by ns1.school.edu"],
  },
  {
    id: "host",
    chip: "www",
    title: "Host name (subdomain)",
    who: "Answered by the same authoritative server",
    beginner: "The leftmost part of the name, such as www or mail. It points to a particular service, host or alias within the domain.",
    intermediate: "Hosts like www.example.com, mail.example.com and shop.example.com are all answered by the same authoritative server, each with its own record.",
    technical: "A name is read right to left: root, TLD, domain, then host labels. The owner of example.com can create as many host names under it as they like without asking anyone above them in the tree.",
    examples: ["www.example.com (CNAME → example.com)", "mail.example.com (A)", "shop.example.com (A)"],
  },
];

export interface RecordInfo {
  type: RecordType;
  maps: string;
  beginner: string;
  /** One row of an example zone: the record as you might see it. */
  example: ZoneRecord;
  arrow: string;
  technical: string;
  usedFor: string;
}

export const RECORD_INFO: RecordInfo[] = [
  { type: "A", maps: "Domain → IPv4 address", beginner: "The most common record. It maps a name to an IPv4 address.", example: { name: "example.com", type: "A", value: "93.184.216.34", ttl: 300 }, arrow: "example.com → 93.184.216.34", technical: "An A record holds one 32-bit address. A name can have several A records, and resolvers may rotate them to share load.", usedFor: "Finding the IPv4 address a client should connect to." },
  { type: "AAAA", maps: "Domain → IPv6 address", beginner: "Like an A record, but for IPv6 addresses.", example: { name: "example.com", type: "AAAA", value: "2001:db8:5d:b8d8::22", ttl: 300 }, arrow: "example.com → 2001:db8:5d:b8d8::22", technical: "The name comes from IPv6 addresses being four times as long as IPv4 ones (128 bits instead of 32). A device can ask for A, AAAA, or both.", usedFor: "Finding the IPv6 address of a host." },
  { type: "CNAME", maps: "Alias → another domain name", beginner: "An alias. It says \"this name is really that other name\". The resolver then looks up the other name.", example: { name: "www.example.com", type: "CNAME", value: "example.com", ttl: 300 }, arrow: "www.example.com → example.com", technical: "A CNAME holds a name, not an address, and a name with a CNAME normally can't have other records of different types. Chains of CNAMEs are possible but add lookups.", usedFor: "Pointing several names at one canonical name." },
  { type: "MX", maps: "Domain → mail server", beginner: "Says which server accepts email for the domain. It has a priority number: lower numbers are tried first.", example: { name: "example.com", type: "MX", value: "10 mail.example.com", ttl: 3600 }, arrow: "example.com → mail.example.com (priority 10)", technical: "An MX record points to a host name (not an IP address), which then needs its own A or AAAA record. Several MX records give backup mail servers.", usedFor: "Delivering email to the right mail-exchange servers." },
  { type: "NS", maps: "Domain → name servers", beginner: "Names the authoritative name servers for a domain, the servers that hold its real records.", example: { name: "example.com", type: "NS", value: "ns1.example.com", ttl: 86400 }, arrow: "example.com → ns1.example.com", technical: "NS records are how delegation works: a TLD server's referral to a domain's servers is made of NS records. Most domains list two or more for redundancy.", usedFor: "Finding who is in charge of a domain." },
  { type: "TXT", maps: "Domain → text information", beginner: "Free-form text attached to a name. It is often used to prove who owns a domain or to publish email-security settings.", example: { name: "example.com", type: "TXT", value: "\"v=spf1 mx -all\"", ttl: 3600 }, arrow: "example.com → \"v=spf1 mx -all\"", technical: "Common uses are SPF (which servers may send mail for the domain) and domain-ownership verification. Long values are split into strings of up to 255 characters.", usedFor: "Publishing text-based information about a domain." },
];

export const INFO_TEXT: Record<DetailLevel, { title: string; body: string[] }> = {
  beginner: {
    title: "What is DNS?",
    body: [
      "People remember names like www.example.com, but networks deliver data using IP addresses. The Domain Name System (DNS) is the Internet's phone book: it translates a name into the address a computer can connect to.",
      "Your computer asks a DNS resolver. The resolver finds the answer (or remembers it from last time) and sends it back. Try it: press Resolve Domain below.",
    ],
  },
  intermediate: {
    title: "How does recursive DNS resolution work?",
    body: [
      "The client sends one question to its configured resolver and waits. The resolver is recursive: it does the work on the client's behalf. If its cache can't answer, it asks a root server, then a TLD server, then the domain's authoritative server. Each one answers with either a referral (\"ask them\") or the final answer.",
      "The resolver keeps what it learns in its cache, so many lookups skip some or all of those steps.",
    ],
  },
  technical: {
    title: "How hierarchy, caching, TTL and record types work together",
    body: [
      "Names are delegated down a tree: the root zone delegates TLDs, TLDs delegate domains, and each domain's NS records name its authoritative servers. A resolver follows NS referrals using iterative queries and sends the client one recursive answer. Ordinary queries use UDP port 53; TCP is used when a response is too large for UDP and for zone transfers.",
      "Every record has a TTL that tells caches how long it may be reused. Resolvers cache both answers (A, AAAA, CNAME, MX, TXT) and delegations (NS), which is why a cold lookup takes several round trips, a warm one may take one, and a cached one takes none. Record types decide what a name maps to: addresses (A, AAAA), another name (CNAME), mail servers (MX), name servers (NS) or text (TXT).",
    ],
  },
};

// ---------------------------------------------------------------------------
// Recursive vs iterative (conceptual sequence diagrams)
// ---------------------------------------------------------------------------

export type Lifeline = "client" | "resolver" | "root" | "tld" | "auth";
export const LIFELINE_LABEL: Record<Lifeline, string> = { client: "Client", resolver: "Resolver", root: "Root", tld: ".com", auth: "Auth." };

export interface SeqMessage {
  from: Lifeline;
  to: Lifeline;
  label: string;
  kind: StateKind;
  text: string;
}

export const RECURSIVE_SEQUENCE: SeqMessage[] = [
  { from: "client", to: "resolver", label: "IP of example.com?", kind: "query", text: "The client asks its resolver once and then waits. It doesn't do any searching itself." },
  { from: "resolver", to: "root", label: "Where is .com?", kind: "query", text: "The resolver does the work on the client's behalf. First it asks a root server." },
  { from: "root", to: "resolver", label: "Ask .com", kind: "response", text: "The root answers with a referral, not the final answer." },
  { from: "resolver", to: "tld", label: "Where is example.com?", kind: "query", text: "The resolver follows the referral to the .com server." },
  { from: "tld", to: "resolver", label: "Ask ns1.example.com", kind: "response", text: "Another referral." },
  { from: "resolver", to: "auth", label: "IP of example.com?", kind: "query", text: "Finally the resolver asks the authoritative server." },
  { from: "auth", to: "resolver", label: "93.184.216.34", kind: "response", text: "The authoritative server gives the real answer." },
  { from: "resolver", to: "client", label: "93.184.216.34", kind: "success", text: "The resolver returns the final answer. From the client's point of view: one question, one answer." },
];

export const ITERATIVE_SEQUENCE: SeqMessage[] = [
  { from: "client", to: "root", label: "IP of example.com?", kind: "query", text: "Imagine the client asks a root server itself, with no resolver doing the work." },
  { from: "root", to: "client", label: "Ask .com", kind: "response", text: "The root replies with the best information it has: a referral to the .com servers." },
  { from: "client", to: "tld", label: "IP of example.com?", kind: "query", text: "The querying system has to continue the process itself, so it asks the .com server." },
  { from: "tld", to: "client", label: "Ask ns1.example.com", kind: "response", text: "Another referral." },
  { from: "client", to: "auth", label: "IP of example.com?", kind: "query", text: "The client asks the authoritative server." },
  { from: "auth", to: "client", label: "93.184.216.34", kind: "success", text: "The authoritative server finally gives the answer. The client did all the following-up." },
];

// ---------------------------------------------------------------------------
// Compare cache HIT, partial MISS and full MISS (derived from the planner so the numbers cannot drift)
// ---------------------------------------------------------------------------

export function lookupCostExamples(): { label: string; result: LookupResult }[] {
  const full = planLookup({ id: 0, rawName: "www.example.com", cache: emptyCache(), now: 1000 }).result;
  const partial = planLookup({ id: 0, rawName: "shop.example.com", cache: { answers: [], delegations: [comDeleg, exDeleg] }, now: 1000 }).result;
  const hit = planLookup({ id: 0, rawName: "www.example.com", cache: { answers: [fresh("www.example.com", "93.184.216.34", 240, "example.com")], delegations: [] }, now: 1000 }).result;
  return [
    { label: "Cache HIT", result: hit },
    { label: "MISS, name servers known", result: partial },
    { label: "MISS, cold cache", result: full },
  ];
}
