import { SubmitButton } from "@/components/admin/submit-button";
import { fieldCls as field, labelCls } from "@/components/admin/form-styles";
import type { Metadata } from "next";
import { friendlyError } from "@/lib/admin/errors";
import { Flash } from "@/components/admin/flash";
import { DataTable, EmptyState, type Column } from "@/components/admin/data-table";
import { ListError } from "@/components/admin/list-nav";
import { requirePermission } from "@/lib/admin/auth";
import { ADMIN_ROLES, ROLE_LABEL, ROLE_SUMMARY, isAdminRole, type AdminRole } from "@/lib/admin/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { FieldError } from "@/components/admin/question-fields";
import { describe, fieldErrorsFor } from "@/lib/questions/field-errors";
import { revokeRoleAction, setRoleAction } from "./actions";

export const metadata: Metadata = { title: "Admin Users" };

interface AdminRow { user_id: string; email: string | null; role: AdminRole; granted_at: string }

export default async function AdminUsersPage({ searchParams }: { searchParams: { ok?: string; info?: string; warn?: string; error?: string } }) {
  const session = await requirePermission("admins.manage");

  if (session.mode !== "accounts") {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-medium">Admin users</h1>
        <p className="text-sm text-ink-soft dark:text-bone-soft">Individual admin accounts and roles need Supabase. Configure it (see <code className="font-mono">.env.example</code>) and restart.</p>
      </div>
    );
  }

  const fe = fieldErrorsFor(searchParams.error);
  const { data, error } = await createSupabaseServerClient().from("admin_roles").select("user_id, email, role, granted_at").order("granted_at", { ascending: true });
  const rows: AdminRow[] = (data ?? []).filter((r): r is AdminRow => isAdminRole(r.role));

  const columns: Column<AdminRow>[] = [
    { key: "email", header: "Admin", cell: (r) => <span>{r.email ?? r.user_id}{r.user_id === session.userId ? <span className="ml-2 font-mono text-label uppercase text-ink-soft dark:text-bone-soft">you</span> : null}</span> },
    { key: "role", header: "Role", cell: (r) => ROLE_LABEL[r.role] },
    { key: "since", header: "Since", nowrap: true, className: "text-helper", cell: (r) => new Date(r.granted_at).toLocaleDateString("en-GB") },
    {
      key: "actions", header: "Actions", hideLabel: true, width: "md:w-48", align: "right",
      cell: (r) => (
        <ConfirmAction label="Revoke…" summary={`Revoke access for ${r.email ?? r.user_id}?`}>
          <p>Remove all admin access for <strong className="[overflow-wrap:anywhere]">{r.email ?? r.user_id}</strong>? This is recorded in the audit log.</p>
          <form action={revokeRoleAction}>
            <input type="hidden" name="user_id" value={r.user_id} />
            <SubmitButton variant="danger-solid" pendingLabel="Revoking…">Confirm revoke</SubmitButton>
          </form>
        </ConfirmAction>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium">Admin users</h1>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Who can use this console, and what they can do. Every change is written to the audit log, and the database refuses to remove the last super admin.</p>
      </div>

      <Flash ok={searchParams.ok} info={searchParams.info} warn={searchParams.warn} error={searchParams.error} />
      {error ? <ListError message={`Could not load admins: ${friendlyError(error)}`} /> : null}

      <DataTable caption="Admin users" columns={columns} rows={rows} rowKey={(r) => r.user_id} empty={<EmptyState title="No admins yet." hint="Use “Grant or change a role” below to add the first one." />} />

      <section aria-labelledby="h-grant" className="rounded-xl border border-ink/10 p-4 dark:border-bone/15">
        <h2 id="h-grant" className="font-display text-lg font-medium">Grant or change a role</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">The person needs an account first (Supabase → Authentication → Users). Choosing an existing admin changes their role.</p>
        <form action={setRoleAction} className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="grant-email" className={labelCls}>Email</label>
            <input id="grant-email" name="email" type="email" required className={`${field} w-full`} {...describe("grant-email", fe)} />
            <FieldError id="grant-email" errors={fe} />
          </div>
          <div>
            <label htmlFor="grant-role" className={labelCls}>Role</label>
            <select id="grant-role" name="role" required defaultValue="" className={field} {...describe("grant-role", fe)}>
              <option value="" disabled>Choose…</option>
              {ADMIN_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
            <FieldError id="grant-role" errors={fe} />
          </div>
          <SubmitButton variant="primary" pendingLabel="Saving…">Save role</SubmitButton>
        </form>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {ADMIN_ROLES.map((r) => (
            <div key={r}><dt className="font-medium">{ROLE_LABEL[r]}</dt><dd className="text-ink-soft dark:text-bone-soft">{ROLE_SUMMARY[r]}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
