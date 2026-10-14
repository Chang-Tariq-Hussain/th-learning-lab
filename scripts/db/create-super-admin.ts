/**
 * Bootstrap the FIRST super admin.
 *
 *   1. In Supabase: Authentication → Users → Add user (email + password, auto-confirm).
 *   2. npm run db:create-admin -- --email you@example.com
 *
 * Refuses to run if a super admin already exists (use Admin → Admin users instead);
 * pass --force only for recovery. Writes an audit_log entry.
 */
import { connect } from "./env";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const email = args.find((a) => a.startsWith("--email="))?.split("=")[1] ?? args[args.indexOf("--email") + 1];
  if (!email || email.startsWith("--") || !email.includes("@")) { console.error("Usage: npm run db:create-admin -- --email you@example.com [--force]"); process.exit(2); }
  const force = args.includes("--force");
  const client = await connect();
  try {
    await client.query("begin");
    const existing = Number((await client.query("select count(*)::int n from public.admin_roles where role = 'super_admin'")).rows[0]?.["n"] ?? 0);
    if (existing > 0 && !force) { await client.query("rollback"); console.error("A super admin already exists. Manage admins from the admin area, or pass --force for recovery."); process.exit(1); }
    const user = (await client.query("select id from auth.users where lower(email) = lower($1)", [email.trim()])).rows[0];
    if (!user) { await client.query("rollback"); console.error(`No Supabase account with email ${email}. Create it under Authentication → Users first.`); process.exit(1); }
    await client.query(
      "insert into public.admin_roles (user_id, email, role) values ($1, lower($2), 'super_admin') on conflict (user_id) do update set role = 'super_admin', email = excluded.email, granted_at = now()",
      [user["id"], email.trim()]);
    await client.query(
      "insert into public.audit_log (actor_email, actor_role, action, entity, entity_id, after, meta) values ('operator-script', 'operator-script', 'admin.bootstrap', 'admin_role', $1, '{\"role\":\"super_admin\"}'::jsonb, $2::jsonb)",
      [String(user["id"]), JSON.stringify({ email: email.trim().toLowerCase(), force })]);
    await client.query("commit");
    console.log(`${email} is now a super admin. Sign in at /admin/login.`);
  } finally {
    await client.end();
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
