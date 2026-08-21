/**
 * Subject color token shared with `resolveSubjectColors` — kept as a
 * union (rather than importing `Subject` from the subjects registry)
 * so this feature has no dependency on the shape of that registry,
 * only on the four tokens every subject already exposes.
 */
export type ConnectionSubject = "physics" | "chemistry" | "biology" | "math";

/**
 * One endpoint of a connection (its source, destination, or optional
 * prerequisite). Most nodes point at a real topic/simulation page via
 * `href`, but a node doesn't have to — e.g. "ATP" is a concept worth
 * naming in a connection without having its own simulation, so `href`
 * is optional and the node still renders, just without a link.
 */
export interface ConnectionNode {
  /** Which subject this end of the connection belongs to. */
  subject: ConnectionSubject;
  /** Short label shown in the UI, e.g. "Derivatives", "Cellular respiration". */
  label: string;
  /**
   * Optional link to the topic/simulation page this node represents.
   * When present, it doubles as this node's identity for lookups —
   * see `getConnectionsForHref` — mirroring how `subjects.ts` already
   * treats a visualization's `href` as its canonical key.
   */
  href?: string;
}

/**
 * A single cross-subject connection: two topics that illuminate each
 * other, plus the explanation of *how* they connect and *why* that's
 * worth knowing. Deliberately generic — nothing here is specific to
 * any one subject pairing, so the same shape covers a math-to-physics
 * link and a chemistry-to-biology-to-concept chain alike (model a
 * chain as two connections sharing a middle node).
 */
export interface CrossSubjectConnection {
  /** Stable unique id, e.g. "derivatives-velocity-acceleration". */
  id: string;
  source: ConnectionNode;
  destination: ConnectionNode;
  /** Plain-language description of how the two topics connect. */
  explanation: string;
  /** Why this connection is worth knowing — the pedagogical payoff. */
  reason: string;
  /** Optional topic worth reviewing first to get the most out of this connection. */
  prerequisite?: ConnectionNode;
}
