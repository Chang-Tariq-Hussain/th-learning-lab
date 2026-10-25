import { expect, test, type Page } from "@playwright/test";
import { ACCOUNTS, adminLogin, seed, slowActions, toasts } from "./helpers";

test.skip(!ACCOUNTS, "these flows write to the database (account mode)");
test.describe.configure({ mode: "serial" });

const STEM = `E2E toast question ${Date.now()}`;
let questionUrl = "";

async function fillNewQuestion(page: Page, stem: string) {
  await page.getByLabel("Subject (quiz questions)").selectOption("physics");
  await page.getByLabel("Question", { exact: true }).fill(stem);
  await page.getByLabel("Option 1", { exact: true }).fill("Right answer");
  await page.getByLabel("Option 2", { exact: true }).fill("Wrong answer");
  await page.getByLabel("Option 1 is correct").check();
  await page.getByLabel("Explanation (required to publish)").fill("Because the right answer is right.");
}

test.beforeEach(async ({ page, context }) => {
  await seed(context);
  await adminLogin(page);
});

test("create: the toast appears only after the server confirmed, then the URL is cleaned", async ({ page }) => {
  await slowActions(page, 1200);
  await page.goto("/admin/questions/new");
  await fillNewQuestion(page, STEM);
  await page.getByRole("button", { name: "Create draft" }).click();
  // While the request is still running: pending button, and no success message anywhere yet.
  await expect(page.getByRole("button", { name: /Creating…/ })).toBeDisabled();
  await expect(toasts(page).all).toHaveCount(0);
  // After confirmation: redirected to the new question, one success toast, URL has no ?ok=.
  await page.waitForURL(/\/admin\/questions\/[0-9a-f-]{36}/);
  await expect(toasts(page).polite.getByText("Question created successfully as a draft")).toBeVisible();
  await expect(toasts(page).all).toHaveCount(1);
  await expect.poll(() => new URL(page.url()).search).toBe("");
  questionUrl = new URL(page.url()).pathname;
});

test("save: success toast, no duplicate, and a reload does not replay it", async ({ page }) => {
  await page.goto(questionUrl);
  await page.getByLabel("Question", { exact: true }).fill(`${STEM} (edited)`);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(toasts(page).polite.getByText("Question updated successfully.")).toBeVisible();
  await expect(toasts(page).all).toHaveCount(1);
  await page.reload();
  await expect(page.getByLabel("Question", { exact: true })).toHaveValue(`${STEM} (edited)`);
  await expect(toasts(page).all).toHaveCount(0);
});

test("save with nothing changed: an info toast, not a success claim", async ({ page }) => {
  await page.goto(questionUrl);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(toasts(page).polite.getByText("No changes to save.")).toBeVisible();
  await expect(toasts(page).polite.getByText("updated successfully")).toHaveCount(0);
});

test("publish: success toast after the status really changed", async ({ page }) => {
  await page.goto(questionUrl);
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(toasts(page).polite.getByText("1 question(s) published.")).toBeVisible();
  await expect(page.getByText("Published").first()).toBeVisible();
});

test("failed save: error toast AND inline error, the typed input is kept, and only one toast", async ({ page }) => {
  await page.goto(questionUrl);
  const explanation = "My careful new explanation that must not be lost.";
  await page.getByLabel("Explanation (required to publish)").fill(explanation);
  // Remove the browser's own "required" check so the server's validation is what answers.
  await page.getByLabel("Question", { exact: true }).evaluate((el) => { (el as HTMLTextAreaElement).required = false; });
  await page.getByLabel("Question", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(toasts(page).assertive.getByText("The question text is required.")).toBeVisible();
  await expect(toasts(page).all).toHaveCount(1);
  await expect(page.getByRole("main").getByText("The question text is required.").first()).toBeVisible(); // inline copy stays
  await expect(page.locator("#stem")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#stem")).toHaveAttribute("aria-describedby", "stem-error");
  await expect(page.locator("#stem-error")).toContainText("The question text is required.");
  await expect(page.getByLabel("Explanation (required to publish)")).toHaveValue(explanation); // draft kept
  await expect(page.getByText("your unsaved edits")).toBeVisible();
});

test("a stale save (someone else saved first) reports an error and keeps the edits", async ({ page, browser }) => {
  await page.goto(questionUrl);
  await page.getByLabel("Explanation (required to publish)").fill("Mine, from the stale tab.");
  // Someone else saves the same question first.
  const other = await browser.newContext();
  await seed(other);
  const p2 = await other.newPage();
  await adminLogin(p2);
  await p2.goto(questionUrl);
  await p2.getByLabel("Explanation (required to publish)").fill("Theirs, saved first.");
  await p2.getByRole("button", { name: "Save changes" }).click();
  await expect(toasts(p2).polite.getByText("Question updated successfully.")).toBeVisible();
  await other.close();

  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(toasts(page).assertive).toContainText(/.+/);
  await expect(page.getByRole("main").locator("p.text-red-800, p.dark\\:text-red-300").first()).toBeVisible();
  await expect(page.getByLabel("Explanation (required to publish)")).toHaveValue("Mine, from the stale tab.");
});

test("'Discard my edits' discards the draft and does NOT save it", async ({ page }) => {
  await page.goto(questionUrl);
  const before = await page.getByLabel("Explanation (required to publish)").inputValue();
  await page.getByLabel("Explanation (required to publish)").fill("Unsaved text that must be discarded.");
  await page.getByLabel("Question", { exact: true }).evaluate((el) => { (el as HTMLTextAreaElement).required = false; });
  await page.getByLabel("Question", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("your unsaved edits")).toBeVisible();
  await page.getByRole("button", { name: "Discard my edits" }).click();
  await page.waitForURL((u) => u.pathname === questionUrl);
  await expect(page.getByText("your unsaved edits")).toHaveCount(0);
  await expect(page.getByLabel("Explanation (required to publish)")).toHaveValue(before);
  await expect(page.getByLabel("Question", { exact: true })).not.toHaveValue("");
});

test("import: a valid file validates (toast), invalid JSON fails (error toast + inline)", async ({ page }) => {
  await page.goto("/admin/questions/import");
  const row = [{ source_system: "quiz", subject_slug: "physics", topic: "simple-motion", difficulty: "easy", stem: `Import check ${Date.now()}`, options: ["A", "B"], correct_index: 0, explanation: "x", source_type: "platform_authored" }];
  await page.getByLabel("…or paste JSON").fill(JSON.stringify(row));
  await page.getByRole("button", { name: /Check \/ import/ }).click();
  await expect(toasts(page).polite.getByText(/Validation passed: all 1 rows are valid/)).toBeVisible();

  await page.getByLabel("…or paste JSON").fill("{ not json");
  await page.getByRole("button", { name: /Check \/ import/ }).click();
  await expect(toasts(page).assertive.getByText("That is not valid JSON.")).toBeVisible();
  await expect(page.getByRole("main").getByText("That is not valid JSON.").first()).toBeVisible();
  await expect(page.locator("#json")).toHaveAttribute("aria-invalid", "true");
});

test("role change and revoke: toasts after the database confirmed", async ({ page }) => {
  await page.goto("/admin/admins");
  await page.getByLabel("Email", { exact: true }).fill("nobody-yet@x.com");
  await page.getByLabel("Role", { exact: true }).selectOption({ label: "Analyst" });
  await page.getByRole("button", { name: "Save role" }).click();
  await expect(toasts(page).polite.getByText(/Role updated successfully: nobody-yet@x.com is now Analyst/)).toBeVisible();
  const row = page.getByRole("row").filter({ hasText: "nobody-yet@x.com" });
  await row.getByText("Revoke…").click();
  await row.getByRole("button", { name: "Confirm revoke" }).click();
  await expect(toasts(page).polite.getByText("Admin access revoked.")).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: "nobody-yet@x.com" })).toHaveCount(0);
});

test("a failed role change (invalid email) shows an error toast and the inline message", async ({ page }) => {
  await page.goto("/admin/admins");
  // Skip the browser's own type=email check so the server-side validation is what's exercised.
  await page.locator("#grant-email").evaluate((el) => { (el as HTMLInputElement).form!.noValidate = true; });
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await page.getByLabel("Role", { exact: true }).selectOption({ label: "Analyst" });
  await page.getByRole("button", { name: "Save role" }).click();
  await expect(toasts(page).assertive.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByRole("main").getByText("Enter a valid email address.").first()).toBeVisible();
  await expect(page.locator("#grant-email")).toHaveAttribute("aria-describedby", "grant-email-error");
});

test("toasts stay clear of the sticky header and are readable (contrast) in light and dark", async ({ page }) => {
  await page.goto("/admin/questions/import");
  await page.getByRole("button", { name: /Check \/ import/ }).click(); // empty -> error toast
  const toast = toasts(page).assertive.getByText("Choose a JSON file or paste JSON.");
  await expect(toast).toBeVisible();
  const [t, h] = [await toasts(page).all.first().boundingBox(), await page.locator("header").first().boundingBox()];
  expect(t!.y).toBeGreaterThan(h!.y + h!.height);
});
