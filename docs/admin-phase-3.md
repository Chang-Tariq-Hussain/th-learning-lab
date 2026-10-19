# Admin — Phase 3 (Question Bank)

One place to find, review, edit, publish, import and export every question — quiz/practice, CSS MPT and
teacher tests (PST / JEST / JST). Needs Phase 2 (Supabase accounts + the imported registries).

**Apply the new migration** (`supabase/migrations/20261010000003_question_admin.sql`) like the others
(`supabase db push`, or paste it into the SQL editor). Then `/admin/questions` appears for every admin role.

## Who can do what
| | Analyst | Content mgr | Question mgr | Super admin |
|---|---|---|---|---|
| Browse, filter, read, export | ✓ | ✓ | ✓ | ✓ |
| Edit, create, import, publish/archive, change provenance | | | ✓ | ✓ |

## How writes are protected
Questions can no longer be written directly by *anyone* signed in — not even a super admin. Every change goes
through a database function (`question_save`, `question_set_provenance`, `question_set_status`, `question_create`,
`question_import`) which checks the role, writes the audit entry in the same transaction, and enforces:
- **No lost updates.** An edit carries the version it was based on; if someone else changed the question
  meanwhile, it is refused and nothing is overwritten.
- **Provenance can't be faked.** *Where a question came from* (past paper / existing bank / generated /
  platform-authored) is separate from *how far its answer was checked*. A generated question can never be
  relabelled a verified past paper (even with a year, reference and reason) and can never be marked
  independently checked. A past paper needs a source year and a reference. Changing a provenance field needs
  a written reason (≥10 chars), stored in the audit log. New questions can't be created pre-checked.
- **Editing invalidates checking.** Changing the question, passage, options or correct answer of an
  *independently checked* question resets its check to Unchecked (and says so).
- **Nothing is deleted.** "Delete" = archive (with a reason). The record and its history stay.
- **Publishing is gated.** A question needs a question text and explanation, and the *needs review* flag cleared.
- **Bulk actions are bounded.** ≤100 per action; archiving/unpublishing needs a reason and a confirmation tick;
  each question gets its own audit entry; skipped questions are listed with the reason.
- **Import is all-or-nothing.** ≤500 rows / 2 MB. "Validate only" (default) checks every row and saves nothing.
  If any row is invalid *nothing* is imported and each problem is listed. Imported rows are unchecked drafts;
  unknown fields are rejected.

## Edited-in-admin vs. the code registries
When you edit a question here it is marked *edited in admin*; re-running `npm run db:import` never overwrites it.
Edits reach learners only when you **publish** (see `docs/admin-phase-4.md`): until then they live in the database
and the question shows *not yet published to learners*.

## Export
Current filter, up to 10,000 rows, CSV (UTF-8 with BOM, opens in Excel) or JSON. Every export is audited.
Cells beginning with `= + - @` are prefixed with `'` so a question can't run as a spreadsheet formula.

## Tests
`npm run db:verify` (101 checks, real Postgres in-process) and `scripts/e2e-accounts` (76 checks: the real
app → a fake Auth server → **real PostgREST** → real Postgres, asserting on database ground truth). See its README.
