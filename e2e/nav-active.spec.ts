import { expect, test, type Page } from "@playwright/test";
import { ACCOUNTS, adminLogin, firstQuestionId, seed } from "./helpers";

const current = (page: Page, scope: string) => page.locator(`${scope} [aria-current="page"]`);

test.describe("active navigation states", () => {
  test("admin: a sub-page keeps its parent item active (sidebar and drawer)", async ({ page, context }) => {
    test.skip(!ACCOUNTS, "question bank needs account mode");
    await seed(context);
    await page.setViewportSize({ width: 1280, height: 800 });
    await adminLogin(page);
    await firstQuestionId(page);
    const side = page.getByRole("navigation", { name: "Admin" }).first();
    await expect(side.getByRole("link", { name: "Question Bank" })).toHaveAttribute("aria-current", "page");
    await expect(side.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current", "page");
    await expect(side.locator('[aria-current="page"]')).toHaveCount(1);

    await page.setViewportSize({ width: 375, height: 700 });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const d = page.getByRole("dialog", { name: "Admin navigation" });
    await expect(d.getByRole("link", { name: "Question Bank" })).toHaveAttribute("aria-current", "page");
    await expect(d.locator('[aria-current="page"]')).toHaveCount(1);
  });

  test("admin: Overview is active only on /admin itself", async ({ page, context }) => {
    await seed(context);
    await page.setViewportSize({ width: 1280, height: 800 });
    await adminLogin(page);
    await page.goto("/admin");
    const side = page.getByRole("navigation", { name: "Admin" });
    await expect(side.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    await page.goto("/admin/health");
    await expect(side.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current", "page");
    await expect(side.getByRole("link", { name: "Content Health" })).toHaveAttribute("aria-current", "page");
  });

  test("learner: a simulation keeps its subject active; Dashboard is exact", async ({ page, context }) => {
    await seed(context);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/dashboard/physics/simple-motion");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Physics" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current", "page");
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await page.goto("/dashboard");
    await expect(nav.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
    await page.goto("/dashboard/mock-tests/css-mpt");
    await expect(nav.getByRole("link", { name: "Mock Tests" })).toHaveAttribute("aria-current", "page");
  });

  test("learner: the active item is scrolled into view in the desktop row", async ({ page, context }) => {
    await seed(context);
    await page.setViewportSize({ width: 700, height: 800 }); // sm+: the row is visible but too narrow for all 8 items
    await page.goto("/dashboard/information-technology");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const overflowing = await nav.evaluate((n) => n.scrollWidth > n.clientWidth);
    expect(overflowing, "the row should overflow at 700px for this test to mean anything").toBe(true);
    await expect.poll(async () => {
      const link = nav.getByRole("link", { name: "Information Technology" });
      const [l, n] = [await link.boundingBox(), await nav.boundingBox()];
      return !!l && !!n && l.x >= n.x - 1 && l.x + l.width <= n.x + n.width + 1;
    }).toBe(true);
  });
});

test.describe("learner mobile menu", () => {
  test.use({ viewport: { width: 375, height: 700 }, hasTouch: true });
  const open = (page: Page) => page.getByRole("button", { name: "Open menu", exact: true });
  const menu = (page: Page) => page.locator("#mobile-nav");

  test.beforeEach(async ({ page, context }) => {
    await seed(context);
    await page.goto("/dashboard/physics");
  });

  test("Escape closes it and returns focus to the button", async ({ page }) => {
    await open(page).tap();
    await expect(menu(page)).toBeVisible();
    await expect(menu(page).getByRole("link", { name: "Physics" })).toHaveAttribute("aria-current", "page");
    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(0);
    await expect(open(page)).toBeFocused();
  });

  test("a tap outside closes it", async ({ page }) => {
    await open(page).tap();
    await expect(menu(page)).toBeVisible();
    await page.mouse.click(180, 650);
    await expect(menu(page)).toHaveCount(0);
  });

  test("choosing a page closes it", async ({ page }) => {
    await open(page).tap();
    await menu(page).getByRole("link", { name: "Practice" }).tap();
    await page.waitForURL("**/dashboard/practice");
    await expect(menu(page)).toHaveCount(0);
  });
});

test.describe("skip links", () => {
  test("learner: the skip link is the first tab stop and moves focus into main", async ({ page, context }) => {
    await seed(context);
    await page.goto("/dashboard");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
  test("admin: the skip link is the first tab stop and moves focus into main", async ({ page }) => {
    await adminLogin(page);
    await page.goto("/admin");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#admin-main")).toBeFocused();
  });
});
