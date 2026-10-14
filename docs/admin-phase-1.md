# Admin — Phase 1 (shell + Content Health)

Scope: a protected `/admin` area and a read-only Content Health scanner. **No database, no learner behaviour change.**

## Turn it on
Set two environment variables (see `.env.example`), locally in `.env.local` and on Vercel:

    ADMIN_PASSWORD=<12+ characters>
    ADMIN_SESSION_SECRET=<32+ random characters>   # openssl rand -base64 48

Without BOTH, `/admin` is switched off (fails closed). Then open `/admin`.

This single shared password is **temporary**. It is replaced by account-based roles + MFA in Phase 2. Until then: use a long passphrase, don't share it, and rotate `ADMIN_SESSION_SECRET` to sign everyone out.

## Security model
- `src/middleware.ts` redirects unauthenticated requests under `/admin/**` (convenience only).
- Every admin page and server action ALSO calls `requireAdmin()` server-side — the real boundary.
- Session = HMAC-SHA256-signed, expiring (8 h), HttpOnly, SameSite=Strict, Secure-in-production cookie scoped to `/admin`.
- Password compared via SHA-256 digests, constant time; failed/successful attempts are delayed ~0.7 s. (No cross-instance rate limiting yet — Phase 2.)
- Admin responses are `no-store` + `noindex`.

## Content Health
    npm run health                    # summary + findings (Critical → Low)
    npm run health -- --all           # also Info
    npm run health -- --json
    npm run health -- --fail-on=high  # default: critical
    npm run health -- --no-routes     # skip filesystem route checks

CI (`.github/workflows/ci.yml`) runs typecheck, lint and `health --fail-on=critical`.

Checks live in `src/lib/content-health/checks/*`. To add one: write a `CheckFn` returning `Finding[]` (use `finding({...})`), add its `CheckDefinition`, and register both in `run.ts`. The page and CLI pick it up automatically.

Route checks need the `src/app` sources; on a serverless runtime where they aren't shipped, the page says so and the CLI/CI remains the full source of truth.

## Learner/admin separation
`LearnerShell` (client) now wraps the learner providers, navbar, footer and username prompt; it renders nothing of that under `/admin`. This avoids moving any route files. A route-group split can replace it later without changing URLs.

## Pre-fixes shipped with Phase 1
1. `biology-active-transport-025`: correct answer now matches its option text.
2. `computer-components-explorer`: registered in `subjects.ts`, `learning/registry.ts`, `quiz-engine/registry.ts` (page, GLE and quiz data already existed).
3. CSS MPT: `verified` is now true only for genuine past-paper questions (187 rows corrected in `mpt-mock-data.ts`, `tools/mpt/mpt_question_bank.json`, and the generators `build_mpt.py` / `build_mock2.py` so regeneration keeps it).
