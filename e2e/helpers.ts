import { expect, type BrowserContext, type Locator, type Page } from "@playwright/test";

export const MODE: "accounts" | "password" = process.env.E2E_MODE === "password" ? "password" : "accounts";
export const ACCOUNTS = MODE === "accounts";

/** Fake-auth users from scripts/e2e-accounts/mock-supabase.mjs. */
export const SUPER = { email: "super@x.com", password: "pw1" };
export const ANALYST = { email: "analyst@x.com", password: "pw2" };

export const USERNAME_KEY = "learning-platform-username";

/** Seeds localStorage before any page script runs: a learner name (skips the welcome dialog) and a theme. */
export async function seed(context: BrowserContext, opts: { theme?: string; username?: string | null } = {}): Promise<void> {
  const { theme = "light", username = "Tester" } = opts;
  await context.addInitScript(
    ({ theme, username, key }) => {
      try {
        localStorage.setItem("theme", theme);
        if (username) localStorage.setItem(key, username);
      } catch {
        /* storage unavailable */
      }
    },
    { theme, username, key: USERNAME_KEY },
  );
}

export async function adminLogin(page: Page, who: { email: string; password: string } = SUPER): Promise<void> {
  await page.goto("/admin/login");
  if (ACCOUNTS) await page.getByLabel("Email").fill(who.email);
  const password = ACCOUNTS ? who.password : (process.env.ADMIN_PASSWORD ?? "");
  await page.getByLabel(ACCOUNTS ? "Password" : "Admin password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => !u.pathname.endsWith("/login"));
}

/** True when the page itself (not an inner scroll box) can be scrolled sideways. */
export async function pageOverflowsHorizontally(page: Page): Promise<{ overflow: number; offenders: string[] }> {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const vw = window.innerWidth;
    const offenders: string[] = [];
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      if (offenders.length >= 5) break;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || getComputedStyle(el).position === "fixed") continue;
      if (r.right <= vw + 1 && r.left >= -1) continue;
      let clipped = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(p).overflowX)) { clipped = true; break; }
      }
      if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(".")}`);
    }
    return { overflow: doc.scrollWidth - doc.clientWidth, offenders };
  });
}

/** Opens the first question in the bank and returns its id (from the URL). */
export async function firstQuestionId(page: Page): Promise<string> {
  await page.goto("/admin/questions");
  const link = page.getByRole("link").filter({ hasText: /^[a-z0-9-]+-\d{3,4}$/ }).first();
  await link.click();
  await page.waitForURL(/\/admin\/questions\/[0-9a-f-]{36}/);
  return /\/admin\/questions\/([0-9a-f-]{36})/.exec(page.url())![1]!;
}

/** The two toast live regions (polite for success/info/warning, assertive for errors). */
export function toasts(page: Page): { polite: Locator; assertive: Locator; all: Locator } {
  const polite = page.locator('[data-toast-region="polite"]');
  const assertive = page.locator('[data-toast-region="assertive"]');
  return { polite, assertive, all: page.locator('[data-toast-region] > div') };
}

/** Counts server-action POSTs (Next marks them with a `next-action` header). */
export function countActionPosts(page: Page): { count: () => number } {
  let n = 0;
  page.on("request", (req) => {
    if (req.method() === "POST" && req.headers()["next-action"]) n += 1;
  });
  return { count: () => n };
}

/** Slows every server-action POST so pending states can be observed. This delays the real request; it never fakes a result. */
export async function slowActions(page: Page, ms = 1200): Promise<void> {
  await page.route("**/*", async (route) => {
    const req = route.request();
    if (req.method() === "POST" && req.headers()["next-action"]) await new Promise((r) => setTimeout(r, ms));
    await route.continue();
  });
}

export async function expectNoPageOverflow(page: Page, label: string): Promise<void> {
  const { overflow, offenders } = await pageOverflowsHorizontally(page);
  expect(overflow, `${label}: page scrolls sideways by ${overflow}px (${offenders.join(", ")})`).toBeLessThanOrEqual(0);
}
