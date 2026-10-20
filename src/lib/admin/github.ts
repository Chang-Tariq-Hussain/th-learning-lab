/**
 * One-click publishing: the admin button asks GitHub to run .github/workflows/publish-content.yml, which generates the
 * content overlay, commits it, and lets the normal deploy (Vercel) make it live. The token only ever lives in the
 * server's environment and is never sent to the browser or written to an error message.
 *
 *   GITHUB_PUBLISH_TOKEN     fine-grained token for ONE repository, permission "Actions: Read and write"
 *   GITHUB_PUBLISH_REPO      owner/repo, e.g. acme/th-learning-lab
 *   GITHUB_PUBLISH_BRANCH    optional, default "main"
 *   GITHUB_PUBLISH_WORKFLOW  optional, default "publish-content.yml"
 */
// Overridable only so tests can point at a fake GitHub; production uses the real API.
const API = process.env.GITHUB_API_URL || "https://api.github.com";

export interface PublishConfig { token: string; repo: string; branch: string; workflow: string }

export function publishConfig(): PublishConfig | null {
  const token = process.env.GITHUB_PUBLISH_TOKEN ?? "";
  const repo = process.env.GITHUB_PUBLISH_REPO ?? "";
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  const branch = process.env.GITHUB_PUBLISH_BRANCH || "main";
  const workflow = process.env.GITHUB_PUBLISH_WORKFLOW || "publish-content.yml";
  if (!/^[\w./-]+$/.test(branch) || !/^[\w.-]+\.ya?ml$/.test(workflow)) return null;
  return { token, repo, branch, workflow };
}

export interface RunInfo { status: "queued" | "in_progress" | "completed" | string; conclusion: string | null; url: string; startedAt: string }

const headers = (c: PublishConfig): Record<string, string> => ({
  Authorization: `Bearer ${c.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "th-learning-lab-admin",
});

const explain = (status: number): string =>
  status === 401 || status === 403 ? "GitHub rejected the publishing token (expired, or missing the Actions read/write permission). Ask your developer to renew it."
    : status === 404 || status === 422 ? "GitHub could not find the publishing workflow on that repository and branch. Ask your developer to check the publishing settings."
      : "GitHub did not accept the request. Try again in a minute.";

/** The most recent run of the publish workflow, `null` if there has been none, or an error message. */
export async function latestRun(c: PublishConfig): Promise<{ run: RunInfo | null } | { error: string }> {
  try {
    const res = await fetch(`${API}/repos/${c.repo}/actions/workflows/${c.workflow}/runs?per_page=1&branch=${encodeURIComponent(c.branch)}`, { headers: headers(c), cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { error: explain(res.status) };
    const body = (await res.json()) as { workflow_runs?: { status: string; conclusion: string | null; html_url: string; run_started_at?: string; created_at: string }[] };
    const r = body.workflow_runs?.[0];
    return { run: r ? { status: r.status, conclusion: r.conclusion, url: r.html_url, startedAt: r.run_started_at ?? r.created_at } : null };
  } catch {
    return { error: "Could not reach GitHub to check the publish status." };
  }
}

export async function startPublish(c: PublishConfig, requestedBy: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const who = /^[\w.+@-]{1,80}$/.test(requestedBy) ? requestedBy : "admin";
  try {
    const res = await fetch(`${API}/repos/${c.repo}/actions/workflows/${c.workflow}/dispatches`, {
      method: "POST", headers: { ...headers(c), "Content-Type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ ref: c.branch, inputs: { requested_by: who } }),
    });
    return res.status === 204 ? { ok: true } : { ok: false, message: explain(res.status) };
  } catch {
    return { ok: false, message: "Could not reach GitHub. Nothing was started — please try again." };
  }
}
