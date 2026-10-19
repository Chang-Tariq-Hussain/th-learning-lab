"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/auth";
import { parseNewQuestion, parseProvenance, parseQuestionContent } from "@/lib/questions/form";
import { STATUSES, isOneOf } from "@/lib/questions/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clip = (s: string, n = 300): string => encodeURIComponent(s.slice(0, n));
const to = (path: string, kind: "ok" | "error", msg: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${clip(msg)}`);

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

export async function saveQuestionAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const id = text(fd, "id");
  if (!UUID.test(id)) redirect("/admin/questions");
  const here = `/admin/questions/${id}`;
  const parsed = parseQuestionContent(fd);
  if (parsed.errors.length) to(here, "error", parsed.errors.join(" "));
  const { data, error } = await supabase.rpc("question_save", { p_id: id, p_expected_hash: text(fd, "expected_hash"), p_fields: parsed.fields });
  if (error) to(here, "error", error.message);
  revalidatePath(here);
  const r = data as { changed?: boolean; answer_check_reset?: boolean } | null;
  to(here, "ok", !r?.changed ? "No changes to save." : r.answer_check_reset ? "Saved. You changed what had been independently checked, so its answer check was reset to Unchecked." : "Saved.");
}

export async function provenanceAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const id = text(fd, "id");
  if (!UUID.test(id)) redirect("/admin/questions");
  const here = `/admin/questions/${id}`;
  const parsed = parseProvenance(fd);
  if (parsed.errors.length) to(here, "error", parsed.errors.join(" "));
  const { data, error } = await supabase.rpc("question_set_provenance", { p_id: id, p_expected_hash: text(fd, "expected_hash"), p_fields: parsed.fields, p_reason: parsed.reason });
  if (error) to(here, "error", error.message);
  revalidatePath(here);
  to(here, "ok", (data as { changed?: boolean } | null)?.changed ? "Provenance updated and recorded in the audit log." : "No provenance changes.");
}

async function setStatus(supabase: Awaited<ReturnType<typeof editor>>, ids: string[], status: string, reason: string, returnTo: string): Promise<never> {
  const { data, error } = await supabase.rpc("question_set_status", { p_ids: ids, p_status: status, p_reason: reason || null, p_dry_run: false });
  if (error) return to(returnTo, "error", error.message);
  const r = data as { changed: number; skipped: { why: string }[] };
  revalidatePath("/admin/questions");
  const skipped = r.skipped.length ? ` ${r.skipped.length} skipped: ${[...new Set(r.skipped.map((s) => s.why))].join("; ")}.` : "";
  return to(returnTo, r.changed > 0 ? "ok" : "error", `${r.changed} question(s) set to ${status.replace("_", " ")}.${skipped}`);
}

export async function statusAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const id = text(fd, "id");
  const status = text(fd, "status");
  if (!UUID.test(id) || !isOneOf(STATUSES, status)) redirect("/admin/questions");
  await setStatus(supabase, [id], status, text(fd, "reason"), `/admin/questions/${id}`);
}

export async function bulkStatusAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const returnTo = back(fd);
  const ids = [...new Set(fd.getAll("ids").map(String))];
  const status = text(fd, "status");
  if (ids.length === 0) to(returnTo, "error", "Select at least one question first.");
  if (ids.length > 100 || ids.some((i) => !UUID.test(i))) to(returnTo, "error", "Select between 1 and 100 questions.");
  if (!isOneOf(STATUSES, status)) to(returnTo, "error", "Choose an action.");
  if ((status === "archived" || status === "draft") && fd.get("confirm") !== "on") to(returnTo, "error", "Tick the confirmation box to archive or unpublish questions.");
  await setStatus(supabase, ids, status, text(fd, "reason"), returnTo);
}

export async function createQuestionAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const parsed = parseNewQuestion(fd);
  if (parsed.errors.length) to("/admin/questions/new", "error", parsed.errors.join(" "));
  const { data, error } = await supabase.rpc("question_create", { p_fields: parsed.fields });
  if (error) to("/admin/questions/new", "error", error.message);
  revalidatePath("/admin/questions");
  to(`/admin/questions/${String(data)}`, "ok", "Created as a draft. Review it, then publish when it is ready.");
}

export async function importQuestionsAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const here = "/admin/questions/import";
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
  if (error) to(here, "error", error.message);
  const r = data as { committed: boolean; created: number; errors: number; results: { row: number; ok: boolean; error?: string }[] };
  const errs = r.results.filter((x) => !x.ok).slice(0, 10).map((x) => `row ${x.row}: ${x.error}`);
  const qs = errs.map((e) => `err=${clip(e, 200)}`).join("&");
  if (r.errors > 0) redirect(`${here}?error=${clip(`${r.errors} row(s) are invalid, so nothing was imported. Fix them and try again.`)}${qs ? `&${qs}` : ""}`);
  revalidatePath("/admin/questions");
  to(here, "ok", validateOnly ? `All ${r.results.length} rows are valid. Nothing was saved — untick "Validate only" to import them as drafts.` : `Imported ${r.created} question(s) as drafts.`);
}

export async function bankAddAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const id = text(fd, "id");
  const bank = text(fd, "bank");
  if (!UUID.test(id)) redirect("/admin/questions");
  if (!/^[a-z0-9-]+$/.test(bank)) to(`/admin/questions/${id}`, "error", "Choose a bank.");
  const { data, error } = await supabase.rpc("question_bank_add", { p_question: id, p_bank: bank });
  if (error) to(`/admin/questions/${id}`, "error", error.message);
  revalidatePath(`/admin/questions/${id}`);
  to(`/admin/questions/${id}`, "ok", (data as { changed?: boolean } | null)?.changed ? `Added to ${bank}. It reaches learners once it is published and the content is published.` : "Already in that bank.");
}

export async function bankRemoveAction(fd: FormData): Promise<void> {
  const supabase = await editor();
  const id = text(fd, "id");
  const bank = text(fd, "bank");
  if (!UUID.test(id)) redirect("/admin/questions");
  const { error } = await supabase.rpc("question_bank_remove", { p_question: id, p_bank: bank, p_reason: text(fd, "reason") });
  if (error) to(`/admin/questions/${id}`, "error", error.message);
  revalidatePath(`/admin/questions/${id}`);
  to(`/admin/questions/${id}`, "ok", `Removed from ${bank}.`);
}
