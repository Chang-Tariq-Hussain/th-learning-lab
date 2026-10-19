# Admin — Phase 2 (database, accounts, roles, audit log, registry import)

What this adds: a Postgres schema mirroring the code registries; individual admin accounts with roles
(Supabase Auth + row-level security); an append-only audit log; an importer that loads the registries
into the database and a parity check proving the two agree. **The learner app is unchanged and still reads
its content from the code registries** — database edits reach learners only through the Phase 4 publish step.

## Set up (once)
1. Create a Supabase project. **Authentication → Providers → Email: turn OFF "Allow new users to sign up"**
   (until learner accounts exist in a later phase, only people you add should be able to have accounts).
2. Apply the schema: `supabase link` then `supabase db push`, **or** paste the two files in
   `supabase/migrations/` (in order) into the SQL editor.
3. Authentication → Users → **Add user** (email + password, auto-confirm) for yourself.
4. Local `.env.local` (and the web host's env): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   Operator-only `DATABASE_URL` (direct connection) goes in `.env.local` on your machine, **not** on the host.
5. `npm run db:create-admin -- --email you@example.com` → makes you the first super admin.
6. `npm run db:import` (dry run — shows what would change, writes nothing), then `npm run db:import -- --apply`.
7. `npm run db:parity` → expect `100% — database mirrors the registries`.
8. Sign in at `/admin/login`. Add colleagues under **Admin users** (they need a Supabase account first).

## Roles
| Role | Can |
|---|---|
| Super admin | everything, incl. Admin users and Audit log |
| Content manager | read all; edit subjects, simulations, GLE, paths, connections, media |
| Question manager | read all; edit question banks, questions, exams |
| Analyst | read-only |
Enforced by row-level security in Postgres — the UI hiding a button is never the control. A signed-in account
with no role has no access to anything. The database refuses to demote or remove the last super admin.

## Import behaviour (important)
- **Idempotent and non-destructive.** Never deletes. Re-running changes nothing.
- **Never overwrites an admin's edit.** Each row stores `content_hash` (now) and `source_hash` (registry version
  last imported). Rows where they differ were edited in admin; import skips them and reports them.
- Parity reports: *stale* (registry changed since import → run import), *edited* (kept), *extra* (DB only, kept).
- GLE content is stored without its React diagrams / interactive verifiers (these stay in code); the dropped JSON
  paths are recorded per topic in `gle_topics.dropped_paths`.

## Provenance (questions)
Provenance (`source_type`: verified_past_paper / existing_bank / generated / platform_authored) is separate from
how far the answer was checked (`answer_check`). Database constraints make it impossible to store a generated
question as independently checked, or a verified past paper without a source year.

## Tests
`npm run db:verify` runs everything above against a real Postgres (PGlite) with the project's real registries:
migrations, constraints, RLS for every role, audited role functions, append-only audit log, import
(dry-run / apply / idempotent / protects edits), parity. It needs no network and no Supabase account.

## Known limits (read before production)
- **MFA is not built yet.** Enable MFA policies in Supabase and treat Super admin accounts accordingly; MFA
  enrolment/enforcement in the console is the first follow-up.
- **Only a real Supabase project exercises Supabase itself.** `db:verify` proves the SQL on real Postgres;
  `scripts/e2e-accounts` proves this app's sign-in/role/redirect/form behaviour against a *fake* of the Auth and
  REST APIs. Neither runs against Supabase's actual services — do a manual smoke test after setup
  (sign in, grant a role, check the audit log, sign out).
- Forbidden pages get a real HTTP 307 from the middleware; pages additionally re-check the role server-side.
- Supabase Auth applies its own rate limiting; the console adds only a short delay on failed sign-ins.
- Changing the `NEXT_PUBLIC_*` variables needs a rebuild/redeploy.
- Phase 1's shared-password mode remains only as a fallback when Supabase isn't configured.
