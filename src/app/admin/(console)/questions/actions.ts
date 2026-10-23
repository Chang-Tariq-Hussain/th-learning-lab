"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { forgetDraft, rememberDraft } from "@/lib/admin/draft";
import { friendlyError } from "@/lib/admin/errors";
import { flashRedirect, flashUrl, guardAction, type FlashKind } from "@/lib/admin/flash";
import { parseNewQuestion, parseProvenance, parseQuestionContent } from "@/lib/questions/form";
import { STATUSES, isOneOf } from "@/lib/questions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const to = (path: string, kind: FlashKind, msg: string): never => flashRedirect(path, kind, msg);

async function editor() {
  const session = await requirePermission("questions.edit");
  if (session.mode !== "accounts") redirect("/admin/questions");
  return createSupabaseServerClient();
}
/** Only ever return to a question-bank URL (the form carries the list's filters in a hidden field). */
const back = (fd: FormData): string => {
  const v = String(fd.get("back") ?? "");
  return /^\/admin\/questions(\?[A-Za-z0-9=&%._~-]*)?$/.test(v) ? v : "/admin/questions";
};
const text = (fd: FormData, k: string): string => String(fd.get(k) ?? "").trim();
/** Fail while keeping what the admin typed, so the form can be refilled instead of starting over. */
const fail = (path: string, scope: string, fd: FormData, msg: string): never => {
  const kept = rememberDraft(scope, fd);
  return to(path, "error", kept ? msg : `${msg} (Your edits were too long to keep automatically — copy them before leaving this page.)`);
};

export async function saveQuestionAction(fd: FormData): Promise<void> {
  const id = text(fd, "id");
  const here = `/admin/questions/${id}`;
  await guardAction(UUID.test(id) ? here : "/admin/questions", async () => {
    const supabase = await editor();
    if (!UUID.test(id)) redirect("/admin/questions");
    const parsed = parseQuestionContent(fd);
    if (parsed.errors.length) fail(here, id, fd, parsed.errors.join(" "));
    const { data, error } = await supabase.rpc("question_save", { p_id: id, p_expected_hash: text(fd, "expected_hash"), p_fields: parsed.fields });
    if (error) fail(here, id, fd, friendlyError(error));
    forgetDraft();
    revalidatePath(here);
    const r = data as { changed?: boolean; answer_check_reset?: boolean } | null;
    if (!r?.changed) to(here, "info", "No changes to save.");
    to(here, "ok", r?.answer_check_reset ? "Question updated successfully. You changed what had been independently checked, so its answer check was reset to Unchecked." : "Question updated successfully.");
  }, (m) => fail(here, id, fd, m));
}

export async function provenanceAction(fd: FormData): Promise<void> {
  const id = text(fd, "id");
  const here = `/admin/questions/${id}`;
  await guardAction(UUID.test(id) ? here : "/admin/questions", async () => {
    const supabase = await editor();
    if (!UUID.test(id)) redirect("/admin/questions");
    const parsed = parseProvenance(fd);
    if (parsed.errors.length) fail(here, `${id}:prov`, fd, parsed.errors.join(" "));
    const { data, error } = await supabase.rpc("question_set_provenance", { p_id: id, p_expected_hash: text(fd, "expected_hash"), p_fields: parsed.fields, p_reason: parsed.reason });
    if (error) fail(here, `${id}:prov`, fd, friendlyError(error));
    forgetDraft();
    revalidatePath(here);
    if ((data as { changed?: boolean } | null)?.changed) to(here, "ok", "Provenance updated and recorded in the audit log.");
    to(here, "info", "No provenance changes to save.");
  }, (m) => fail(here, `${id}:prov`, fd, m));
}

const STATUS_PROGRESS: Record<string, string> = { published: "published", draft: "returned to draft", archived: "archived", in_review: "sent to review" };

async function setStatus(supabase: Awaited<ReturnType<typeof editor>>, ids: string[], status: string, reason: string, returnTo: string): Promise<never> {
  const { data, error } = await supabase.rpc("question_set_status", { p_ids: ids, p_status: status, p_reason: reason || null, p_dry_run: false });
  if (error) return to(returnTo, "error", friendlyError(error));
  const r = data as { changed: number; skipped: { why: string }[] };
  revalidatePath("/admin/questions");
  const skipped = r.skipped.length ? ` ${r.skipped.length} skipped: ${[...new Set(r.skipped.map((s) => s.why))].join("; ")}.` : "";
  const done = `${r.changed} question(s) ${STATUS_PROGRESS[status] ?? `set to ${status.replace("_", " ")}`}.${skipped}`;
  // Nothing changed: say so as a problem. Only some changed: a warning, so the skipped ones are not missed.
  return to(returnTo, r.changed === 0 ? "error" : r.skipped.length ? "warn" : "ok", done);
}

export async function statusAction(fd: FormData): Promise<void> {
  const id = text(fd, "id");
  const here = `/admin/questions/${id}`;
  await guardAction(UUID.test(id) ? here : "/admin/questions", async () => {
    const supabase = await editor();
    const status = text(fd, "status");
    if (!UUID.test(id) || !isOneOf(STATUSES, status)) redirect("/admin/questions");
    await setStatus(supabase, [id], status, text(fd, "reason"), here);
  });
}

export async function bulkStatusAction(fd: FormData): Promise<void> {
  const returnTo = back(fd);
  await guardAction(returnTo, async () => {
    const supabase = await editor();
    const ids = [...new Set(fd.getAll("ids").map(String))];
    const status = text(fd, "status");
    if (ids.length === 0) to(returnTo, "error", "Select at least one question first.");
    if (ids.length > 100 || ids.some((i) => !UUID.test(i))) to(returnTo, "error", "Select between 1 and 100 questions.");
    if (!isOneOf(STATUSES, status)) to(returnTo, "error", "Choose an action.");
    if ((status === "archived" || status === "draft") && fd.get("confirm") !== "on") to(returnTo, "error", "Tick the confirmation box to archive or unpublish questions.");
    await setStatus(supabase, ids, status, text(fd, "reason"), returnTo);
  });
}

export async function createQuestionAction(fd: FormData): Promise<void> {
  const here = "/admin/questions/new";
  await guardAction(here, async () => {
    const supabase = await editor();
    const parsed = parseNewQuestion(fd);
    if (parsed.errors.length) fail(here, "new", fd, parsed.errors.join(" "));
    const { data, error } = await supabase.rpc("question_create", { p_fields: parsed.fields });
    if (error) fail(here, "new", fd, friendlyError(error));
    forgetDraft();
    revalidatePath("/admin/questions");
    to(`/admin/questions/${String(data)}`, "ok", "Question created successfully as a draft. Review it, then publish when it is ready.");
  }, (m) => fail(here, "new", fd, m));
}

export async function importQuestionsAction(fd: FormData): Promise<void> {
  const here = "/admin/questions/import";
  await guardAction(here, async () => {
    const supabase = await editor();
    const file = fd.get("file");
    let raw = text(fd, "json");
    if (file instanceof File && file.size > 0) {
      if (file.size > 2_000_000) to(here, "error", "File is too large (limit 2 MB).");
      raw = (await file.text()).trim();
    }
    if (!raw) to(here, "error", "Choose a JSON file or paste JSON.");
    let rows: unknown;
    try {
      const parsed: unknown = JSON.parse(raw);
      rows = Array.isArray(parsed) ? parsed : (parsed as { questions?: unknown })?.questions;
    } catch {
      return to(here, "error", "That is not valid JSON.");
    }
    if (!Array.isArray(rows)) to(here, "error", 'Expected a JSON array of questions (or {"questions": [...]}).');
    const validateOnly = fd.get("validate_only") === "on";
    const { data, error } = await supabase.rpc("question_import", { p_rows: rows, p_dry_run: validateOnly });
    if (error) to(here, "error", friendlyError(error));
    const r = data as { committed: boolean; created: number; errors: number; results: { row: number; ok: boolean; error?: string }[] };
    const errs = r.results.filter((x) => !x.ok).slice(0, 10).map((x) => `row ${x.row}: ${x.error}`);
    const qs = errs.map((e) => `err=${encodeURIComponent(e.slice(0, 200))}`).join("&");
    if (r.errors > 0) redirect(`${flashUrl(here, "error", `Import failed. ${r.errors} row(s) are invalid, so nothing was imported. Review the validation errors and try again.`)}${qs ? `&${qs}` : ""}`);
    revalidatePath("/admin/questions");
    if (validateOnly) to(here, "ok", `Validation passed: all ${r.results.length} rows are valid. Nothing was saved — untick "Validate only" to import them as drafts.`);
    to(here, "ok", `Import completed successfully: ${r.created} question(s) added as drafts.`);
  });
}

export async function bankAddAction(fd: FormData): Promise<void> {
  const id = text(fd, "id");
  const here = `/admin/questions/${id}`;
  await guardAction(UUID.test(id) ? here : "/admin/questions", async () => {
    const supabase = await editor();
    const bank = text(fd, "bank");
    if (!UUID.test(id)) redirect("/admin/questions");
    if (!/^[a-z0-9-]+$/.test(bank)) to(here, "error", "Choose a bank.");
    const { data, error } = await supabase.rpc("question_bank_add", { p_question: id, p_bank: bank });
    if (error) to(here, "error", friendlyError(error));
    revalidatePath(here);
    if ((data as { changed?: boolean } | null)?.changed) to(here, "ok", `Added to ${bank}. It reaches learners once it is published and the content is published.`);
    to(here, "info", "Already in that bank.");
  });
}

export async function bankRemoveAction(fd: FormData): Promise<void> {
  const id = text(fd, "id");
  const here = `/admin/questions/${id}`;
  await guardAction(UUID.test(id) ? here : "/admin/questions", async () => {
    const supabase = await editor();
    const bank = text(fd, "bank");
    if (!UUID.test(id)) redirect("/admin/questions");
    const { error } = await supabase.rpc("question_bank_remove", { p_question: id, p_bank: bank, p_reason: text(fd, "reason") });
    if (error) to(here, "error", friendlyError(error));
    revalidatePath(here);
    to(here, "ok", `Removed from ${bank}.`);
  });
}

/** "Discard these edits" on a restored form: forget the draft and show the saved version. */
export async function discardDraftAction(fd: FormData): Promise<void> {
  await editor();
  forgetDraft();
  const back = String(fd.get("to") ?? "");
  redirect(/^\/admin\/questions(\/[0-9a-f-]{36}|\/new)?$/i.test(back) ? back : "/admin/questions");
}
