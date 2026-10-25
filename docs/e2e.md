# Browser tests (Playwright)

`e2e/` holds tests for the flows that broke most often in the UI passes: the admin mobile drawer, active nav state,
toast-after-save (and error + draft preservation), double-submit prevention, and "no page-level horizontal overflow
at 320px". They drive a **production build** (`next build` then `next start`).

| Spec | Needs DB | What it proves |
|---|---|---|
| `overflow-320.spec.ts` | no | `documentElement.scrollWidth <= innerWidth` on learner and admin routes (note `body{overflow-x:hidden}` hides overflow from users, so the test measures the document) |
| `admin-drawer.spec.ts` | no | open/close, Escape, Tab trap, focus return, scroll lock, close on navigation and when the viewport grows past 1024 |
| `nav-active.spec.ts` | no | `aria-current` on nested routes (admin + learner), learner mobile menu (Escape, outside tap, route change), active item scrolled into view |
| `submit-button.spec.ts` | partly | loading label, `aria-busy`, a second click sends no second request |
| `toast-save.spec.ts` | yes | toast only after the server confirmed, error toast + inline error, no duplicates, drafts survive a failed/stale save, discard, role change/revoke |
| `question-bank.spec.ts` | yes | card layout on phones, table at 768+, bulk selection by touch, long text wraps |

## Modes
* `E2E_MODE=password` (CI): needs `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` only. DB-dependent tests skip themselves.
* `E2E_MODE=accounts` (default): needs the local stack from `scripts/e2e-accounts/README.md` (Postgres, PostgREST, fake auth
  server on :54321). Reset the database before each run (`PGPASSWORD=pw bash scripts/e2e-accounts/reset-db.sh`); tests mutate data.

## Running
    npm run build                       # offline? see below
    npm run test:e2e                    # starts `next start` on :3122 unless E2E_BASE_URL is set
    E2E_BASE_URL=http://localhost:3122 PW_CHROMIUM=/path/to/chromium npx playwright test e2e/admin-drawer.spec.ts

* `PW_CHROMIUM` uses an already-installed browser instead of `npx playwright install chromium`.
* No access to Google Fonts (offline sandbox)? Point `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` at a module exporting stand-in CSS
  for the fonts; this only affects the build and never ships.

## Limits
Real screen readers and real iOS/Android browsers are not covered (iOS body scroll lock in particular cannot be tested here).
Sign-in in accounts mode is a fake auth server; Supabase Auth itself is not exercised.
