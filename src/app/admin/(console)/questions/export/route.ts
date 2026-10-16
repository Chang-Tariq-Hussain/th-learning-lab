import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { can } from "@/lib/admin/permissions";
import { toCsv } from "@/lib/questions/csv";
import { EXPORT_LIMIT, applyFilters, parseFilters } from "@/lib/questions/query";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "id", "legacy_id", "source_system", "subject", "exam_subject", "topic", "concept", "difficulty", "language", "stem", "passage",
  "option_1", "option_2", "option_3", "option_4", "option_5", "option_6", "correct_option", "explanation", "hints",
  "source_type", "source_year", "source_exam", "source_reference", "source_note", "answer_check", "verified_note", "needs_review", "status", "updated_at",
] as const;
const SELECT = "id, legacy_id, source_system, exam_subject, topic, concept, difficulty, language, stem, passage, options, correct_index, explanation, hints, source_type, source_year, source_exam, source_reference, source_note, answer_check, verified_note, needs_review, status, updated_at, subjects(slug)";

/** Exports the current filter (up to 10,000 rows). Role-checked server-side and written to the audit log. */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!can(session.role, "questions.view") || session.mode !== "accounts") return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const f = parseFilters(sp);
  const format = sp["format"] === "json" ? "json" : "csv";
  const supabase = createSupabaseServerClient();

  const rows: Record<string, unknown>[] = [];
  const pageSize = 1000;
  for (let from = 0; from < EXPORT_LIMIT; from += pageSize) {
    const select = f.exam ? `${SELECT}, question_exams!inner(exam_types!inner(slug))` : SELECT;
    const { data, error } = await applyFilters(supabase.from("questions").select(select), f).range(from, from + pageSize - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const batch = (data ?? []) as unknown as Record<string, unknown>[];
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  const truncated = rows.length >= EXPORT_LIMIT;
  await supabase.rpc("write_audit", { p_action: "question.exported", p_entity: "question_bank", p_meta: { format, rows: rows.length, truncated, filters: { ...f, page: undefined } } });

  const stamp = new Date().toISOString().slice(0, 10);
  const headers = { "Content-Disposition": `attachment; filename="questions-${stamp}.${format}"`, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (format === "json") return new NextResponse(JSON.stringify(rows, null, 2), { headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });

  const body = toCsv([...COLUMNS], rows.map((r) => {
    const options = (r["options"] as string[]) ?? [];
    const subject = (r["subjects"] as { slug: string } | null)?.slug ?? "";
    return COLUMNS.map((c) => {
      if (c === "subject") return subject;
      if (c.startsWith("option_")) return options[Number(c.slice(7)) - 1] ?? "";
      if (c === "correct_option") return (r["correct_index"] as number) + 1;
      return r[c];
    });
  }));
  return new NextResponse("\uFEFF" + body, { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8" } });
}
