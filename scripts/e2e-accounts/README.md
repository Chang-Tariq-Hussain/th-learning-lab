# Account-mode end-to-end (manual)

Drives the real admin app through: **fake Auth server** (password sign-in, mints real HS256 JWTs) →
**real PostgREST** → **real PostgreSQL** with the project's migrations and registry data. Row-level security, RPCs,
query syntax, cookies, redirects and form actions are all real; only sign-in itself is simulated. Every
assertion about data reads Postgres directly. It does NOT test Supabase's own Auth/Storage — use a real project for that.

Prereqs (Linux): PostgreSQL 16 running locally, the PostgREST binary, `node_modules` installed, `curl`, `python3`.

    # 1. database + PostgREST (JWT secret must match mock-supabase.mjs)
    PGPASSWORD=pw bash scripts/e2e-accounts/reset-db.sh        # builds the DB (stubs → migrations → import → test users)
    postgrest postgrest.conf                                    # db-uri .../thlab3, db-anon-role=anon, jwt-secret=<see mock>, port 3000
    # 2. fake auth + proxy
    node scripts/e2e-accounts/mock-supabase.mjs &               # :54321
    # 3. the app (dev or production build) pointed at it
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=anon npx next dev -p 3122
    # 4. run (reset the DB first; the suite mutates data)
    PGPASSWORD=pw python3 scripts/e2e-accounts/run.py           # APP=http://localhost:3122 by default

Covers sign-in/roles/nav, admin-user management, question list + every filter + sort + paging, edit with
concurrency control, provenance rules, status + bulk actions, create, import (validate/all-or-nothing/upload),
CSV/JSON export (incl. formula-injection), and read-only roles replaying editor forms.
