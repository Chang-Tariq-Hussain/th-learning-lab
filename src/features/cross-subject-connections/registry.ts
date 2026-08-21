import type { CrossSubjectConnection } from "./types";
import { crossSubjectConnections } from "./data/connections";

export { crossSubjectConnections };

/**
 * All connections that touch a given page, whether that page is the
 * source, the destination, or the recommended prerequisite. Using
 * `href` as the lookup key (rather than a separate topic id) means
 * this stays in sync with `subjects.ts` for free — no second,
 * hand-maintained mapping of topics to pages to keep straight.
 *
 * Returns an empty array for any page with no connections yet, which
 * is the expected common case — most topics won't have one, and
 * that's fine (see `CrossSubjectConnections`, which renders nothing
 * for an empty list).
 */
export function getConnectionsForHref(href: string): CrossSubjectConnection[] {
  return crossSubjectConnections.filter(
    (connection) =>
      connection.source.href === href ||
      connection.destination.href === href ||
      connection.prerequisite?.href === href,
  );
}

export function getConnectionById(id: string): CrossSubjectConnection | undefined {
  return crossSubjectConnections.find((connection) => connection.id === id);
}
