import { expect, test } from "@playwright/test";
import { ACCOUNTS, adminLogin, countActionPosts, seed, slowActions } from "./helpers";

test.describe("SubmitButton pending state and double-submit", () => {
  test("sign-in: pending label, blocks a double click, and recovers after a failure", async ({ page, context }) => {
    await seed(context);
    await slowActions(page, 1000);
    const posts = countActionPosts(page);
    await page.goto("/admin/login");
    if (ACCOUNTS) await page.getByLabel("Email").fill("super@x.com");
    await page.getByLabel(ACCOUNTS ? "Password" : "Admin password").fill("definitely-wrong");
    const btn = page.getByRole("button", { name: /Sign in/ });
    await btn.dblclick();
    await expect(page.getByRole("button", { name: /Signing in…/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: /Signing in…/ })).toHaveAttribute("aria-busy", "true");
    await expect(page.getByRole("alert").filter({ hasText: /not accepted/ })).toBeVisible(); // inline error after the answer
    await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled(); // back to normal
    expect(posts.count(), "one request despite a double click").toBe(1);
  });

  test("Enter in a field cannot submit twice while the first is running", async ({ page, context }) => {
    await seed(context);
    await slowActions(page, 1000);
    const posts = countActionPosts(page);
    await page.goto("/admin/login");
    if (ACCOUNTS) await page.getByLabel("Email").fill("super@x.com");
    const pw = page.getByLabel(ACCOUNTS ? "Password" : "Admin password");
    await pw.fill("wrong-again");
    await pw.press("Enter");
    await pw.press("Enter");
    await pw.press("Enter");
    await expect(page.getByRole("alert").filter({ hasText: /not accepted/ })).toBeVisible();
    expect(posts.count()).toBe(1);
  });

  test("the pending state is announced and the label is restored on success too (save)", async ({ page, context }) => {
    test.skip(!ACCOUNTS, "needs the question bank");
    await seed(context);
    await adminLogin(page);
    await page.goto("/admin/questions");
    await page.getByRole("link").filter({ hasText: /^[a-z0-9-]+-\d{3,4}$/ }).first().click();
    await page.waitForURL(/\/admin\/questions\/[0-9a-f-]{36}/);
    await slowActions(page, 1200);
    const posts = countActionPosts(page);
    const save = page.getByRole("button", { name: "Save changes" });
    await save.dblclick();
    await expect(page.getByRole("button", { name: /Saving…/ })).toBeDisabled();
    // Only this form's button is busy; the rest of the page stays usable.
    await expect(page.getByRole("button", { name: "Update provenance" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Save changes" })).toBeEnabled({ timeout: 15_000 });
    expect(posts.count()).toBe(1);
  });

  test("filter bar shows its pending state", async ({ page, context }) => {
    test.skip(!ACCOUNTS, "needs the question bank");
    await seed(context);
    await adminLogin(page);
    await page.goto("/admin/questions");
    await page.route("**/admin/questions?*", async (route) => { await new Promise((r) => setTimeout(r, 1000)); await route.continue(); });
    await page.getByLabel("Search").fill("velocity");
    await page.getByRole("button", { name: "Apply", exact: true }).click();
    await expect(page.getByRole("button", { name: /Applying…/ })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Apply", exact: true })).toBeEnabled({ timeout: 15_000 });
    await expect(page).toHaveURL(/q=velocity/);
  });
});
