# Account-mode regression (manual)

Exercises the admin console's real Supabase *client plumbing* (cookies via `@supabase/ssr`, role lookup,
redirects, form actions, audit calls) against a small **fake** of Supabase's Auth/REST endpoints. It verifies
this app's behaviour against our reading of the API — it does NOT test Supabase itself. Use a real project for that.

    node scripts/e2e-accounts/mock-supabase.mjs &                          # fake on :54321
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=test \
      npx next dev -p 3122
    python3 scripts/e2e-accounts/run.py

Covers: unauthenticated redirect, wrong password, super admin / analyst / learner, role-filtered nav,
HTTP 307 for forbidden pages, grant/revoke forms (validation + exact RPC calls), replayed forms from a lower
role never reach the database, login audit, sign-out. Assumes the fake's cookie name `sb-127-auth-token`.
