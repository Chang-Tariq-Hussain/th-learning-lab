import { inputCls, labelCls } from "./form-styles";
import { DIFFICULTIES, LANGUAGES, MAX_OPTIONS } from "@/lib/questions/types";

export interface ContentDefaults {
  stem?: string; passage?: string | null; options?: string[]; correct_index?: number; fixed_order?: boolean; explanation?: string;
  hints?: string[] | null; concept?: string | null; topic?: string | null; difficulty?: string | null; misconception_tag?: string | null;
  language?: string | null; needs_review?: boolean;
}

export { inputCls, labelCls } from "./form-styles";

/** The editable content of a question. Shared by the create and edit forms (field names match lib/questions/form.ts). */
export function QuestionContentFields({ d, showDifficulty = true }: { d: ContentDefaults; showDifficulty?: boolean }) {
  const options = d.options ?? [];
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="stem" className={labelCls}>Question</label>
        <textarea id="stem" name="stem" rows={5} required defaultValue={d.stem ?? ""} className={inputCls} />
      </div>
      <div>
        <label htmlFor="passage" className={labelCls}>Passage / context (optional)</label>
        <textarea id="passage" name="passage" rows={4} defaultValue={d.passage ?? ""} className={inputCls} />
      </div>
      <fieldset>
        <legend className={labelCls}>Answer options — mark the correct one</legend>
        <div className="space-y-2">
          {Array.from({ length: MAX_OPTIONS }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="radio" name="correct" value={i} defaultChecked={(d.correct_index ?? 0) === i && options[i] !== undefined} aria-label={`Option ${i + 1} is correct`} />
              <input name={`option_${i}`} defaultValue={options[i] ?? ""} placeholder={i < 2 ? `Option ${i + 1} (required)` : `Option ${i + 1} (optional)`} aria-label={`Option ${i + 1}`} className={inputCls} />
            </div>
          ))}
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" name="fixed_order" defaultChecked={d.fixed_order ?? false} /> Keep options in this order (e.g. “all of the above”)</label>
      </fieldset>
      <div>
        <label htmlFor="explanation" className={labelCls}>Explanation (required to publish)</label>
        <textarea id="explanation" name="explanation" rows={5} defaultValue={d.explanation ?? ""} className={inputCls} />
      </div>
      <div>
        <label htmlFor="hints" className={labelCls}>Hints (one per line, optional)</label>
        <textarea id="hints" name="hints" rows={2} defaultValue={(d.hints ?? []).join("\n")} className={inputCls} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div><label htmlFor="topic" className={labelCls}>Topic</label><input id="topic" name="topic" defaultValue={d.topic ?? ""} className={inputCls} /></div>
        <div><label htmlFor="concept" className={labelCls}>Concept tag</label><input id="concept" name="concept" defaultValue={d.concept ?? ""} className={inputCls} /></div>
        <div><label htmlFor="misconception_tag" className={labelCls}>Misconception tag</label><input id="misconception_tag" name="misconception_tag" defaultValue={d.misconception_tag ?? ""} className={inputCls} /></div>
        {showDifficulty ? (
          <div>
            <label htmlFor="difficulty" className={labelCls}>Difficulty</label>
            <select id="difficulty" name="difficulty" defaultValue={d.difficulty ?? ""} className={inputCls}>
              <option value="">—</option>
              {DIFFICULTIES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        ) : null}
        <div>
          <label htmlFor="language" className={labelCls}>Language</label>
          <select id="language" name="language" defaultValue={d.language ?? ""} className={inputCls}>
            <option value="">—</option>
            {LANGUAGES.map((x) => <option key={x} value={x}>{{ en: "English", ur: "Urdu", sd: "Sindhi" }[x]}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" name="needs_review" defaultChecked={d.needs_review ?? false} /> Needs review before publishing</label>
      </div>
    </div>
  );
}
