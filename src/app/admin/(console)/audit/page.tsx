import type { Metadata } from "next";
import { friendlyError } from "@/lib/admin/errors";
import { DataTable, EmptyState, type Column } from "@/components/admin/data-table";
import { ListError, ListNav, NavLink, Results } from "@/components/admin/list-nav";
import { FilterBar } from "@/components/admin/filter-bar";
import { Pagination } from "@/components/admin/pagination";
import { linkBtnCls, summaryCls } from "@/components/admin/form-styles";
import { requirePermission } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Audit Log" };

const PAGE_SIZE = 25;
const KNOWN_ACTIONS = ["admin.login", "admin.bootstrap", "admin.role_granted", "admin.role_changed", "admin.role_revoked", "content.import"];

interface AuditRow {
  id: number; at: string; actor_email: string | null; actor_role: string | null;
  action: string; entity: string; entity_id: string | null; before: unknown; after: unknown; meta: unknown;
}

const json = (v: unknown): string => JSON.stringify(v, null, 2);

export default async function AuditLogPage({ searchParams }: { searchParams: { action?: string; q?: string; page?: string } }) {
  const session = await requirePermission("audit.view");
  if (session.mode !== "accounts") {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-medium">Audit log</h1>
        <p className="text-sm text-ink-soft dark:text-bone-soft">The audit log lives in the database and needs Supabase accounts. Configure it (see <code className="font-mono">.env.example</code>) and restart.</p>
      </div>
    );
  }

  const action = KNOWN_ACTIONS.find((a) => a === searchParams.action) ?? "";
  // Strip characters that have meaning inside a PostgREST filter expression.
  const q = (searchParams.q ?? "").replace(/[,()%*_\\"'`]/g, " ").trim().slice(0, 80);
  const requested = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);

  const supabase = createSupabaseServerClient();
  let query = supabase.from("audit_log").select("id, at, actor_email, actor_role, action, entity, entity_id, before, after, meta", { count: "exact" }).order("at", { ascending: false }).order("id", { ascending: false });
  if (action) query = query.eq("action", action);
  if (q) query = query.or(`actor_email.ilike.%${q}%,entity_id.ilike.%${q}%,action.ilike.%${q}%`);
  const from = (requested - 1) * PAGE_SIZE;
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, pageCount);
  const rows = (data ?? []) as AuditRow[];
  const params = { action: action || undefined, q: q || undefined };

  const columns: Column<AuditRow>[] = [
    { key: "at", header: "When", width: "md:w-44", nowrap: true, className: "text-helper", cell: (r) => new Date(r.at).toLocaleString("en-GB") },
    { key: "actor", header: "Actor", width: "md:w-56", cell: (r) => <div><p>{r.actor_email ?? "—"}</p><p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">{r.actor_role ?? ""}</p></div> },
    { key: "action", header: "Action", width: "md:w-44", className: "font-mono text-helper", cell: (r) => r.action },
    {
      key: "what", header: "What",
      cell: (r) => (
        <div className="space-y-1 text-helper">
          <p><span className="font-mono">{r.entity}</span>{r.entity_id ? <span className="text-ink-soft dark:text-bone-soft"> · {r.entity_id}</span> : null}</p>
          {r.before || r.after || r.meta ? (
            <details>
              <summary className={`${summaryCls} text-pine-700 dark:text-pine-300`}>Details</summary>
              <pre className="mt-1 max-h-60 overflow-auto rounded bg-ink/[0.04] p-2 font-mono text-label dark:bg-bone/[0.06]">{[r.before ? `before: ${json(r.before)}` : "", r.after ? `after: ${json(r.after)}` : "", r.meta ? `meta: ${json(r.meta)}` : ""].filter(Boolean).join("\n")}</pre>
            </details>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-medium">Audit log</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Append-only record of sign-ins, role changes and content imports. Entries cannot be edited or deleted, by anyone.</p>
      </div>
      <ListNav>
      <FilterBar action="/admin/audit" q={q} qLabel="Search" qPlaceholder="Actor email, entity id, action…"
        fields={[{ name: "action", label: "Action", value: action, options: KNOWN_ACTIONS.map((a) => ({ value: a, label: a })) }]} />
      <Results>
      {error ? <ListError message={`Could not load the audit log: ${friendlyError(error)}`} /> : null}
      {error ? null : <DataTable caption="Audit log" columns={columns} rows={rows} rowKey={(r) => String(r.id)} empty={<EmptyState title="No entries match." hint="The log only records sign-ins, role changes and content changes." action={Object.values(params).some(Boolean) ? <NavLink href="/admin/audit" className={linkBtnCls}>Clear filters</NavLink> : undefined} />} />}
      <Pagination base="/admin/audit" params={params} page={page} pageCount={pageCount} total={total} pageSize={PAGE_SIZE} />
      </Results>
      </ListNav>
    </div>
  );
}
