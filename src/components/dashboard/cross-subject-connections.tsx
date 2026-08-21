import Link from "next/link";
import { ArrowRight, Waypoints } from "lucide-react";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { cn } from "@/lib/utils";
import type { ConnectionNode, CrossSubjectConnection } from "@/features/cross-subject-connections";

export interface CrossSubjectConnectionsProps {
  connections: CrossSubjectConnection[];
  className?: string;
}

const subjectLabel: Record<ConnectionNode["subject"], string> = {
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  math: "Mathematics",
};

function NodeCard({ node }: { node: ConnectionNode }) {
  const colors = resolveSubjectColors(node.subject);
  const content = (
    <span
      className={cn(
        "flex flex-col gap-0.5 rounded-xl border border-line px-3.5 py-2.5 dark:border-line-dark",
        colors.bg,
      )}
    >
      <span className={cn("font-mono text-[10px] uppercase tracking-[0.15em]", colors.text)}>
        {subjectLabel[node.subject]}
      </span>
      <span className="text-sm font-medium text-ink dark:text-bone">{node.label}</span>
    </span>
  );

  if (!node.href) {
    return content;
  }

  return (
    <Link href={node.href} className="transition hover:opacity-80">
      {content}
    </Link>
  );
}

function ConnectionCard({ connection }: { connection: CrossSubjectConnection }) {
  return (
    <div className="rounded-2xl border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
      {connection.prerequisite ? (
        <p className="mb-4 text-xs text-ink-soft dark:text-bone-soft">
          Best understood after{" "}
          {connection.prerequisite.href ? (
            <Link
              href={connection.prerequisite.href}
              className="font-medium text-ink underline underline-offset-4 dark:text-bone"
            >
              {connection.prerequisite.label}
            </Link>
          ) : (
            <span className="font-medium text-ink dark:text-bone">{connection.prerequisite.label}</span>
          )}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <NodeCard node={connection.source} />
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft dark:text-bone-soft" strokeWidth={1.75} aria-hidden="true" />
        <NodeCard node={connection.destination} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{connection.explanation}</p>

      <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink-soft dark:border-line-dark dark:text-bone-soft">
        <span className="font-medium text-ink dark:text-bone">Why it matters: </span>
        {connection.reason}
      </p>
    </div>
  );
}

/**
 * "Cross-Subject Connections" — an optional block dropped into a
 * simulation page (below `SimulationLearnMore`, if present) showing
 * how the topic connects to ideas in other subjects. Purely additive:
 * pages with no connections pass an empty array and this renders
 * nothing, so most topics are unaffected. Look connections up with
 * `getConnectionsForHref` from `features/cross-subject-connections`
 * rather than hand-picking them per page.
 */
export function CrossSubjectConnections({ connections, className }: CrossSubjectConnectionsProps) {
  if (connections.length === 0) {
    return null;
  }

  return (
    <div className={cn("mt-10", className)}>
      <div className="mb-6 flex items-center gap-2.5">
        <Waypoints className="h-4 w-4 text-ink-soft dark:text-bone-soft" strokeWidth={1.75} aria-hidden="true" />
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          Cross-subject connections
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>
    </div>
  );
}
