import { expect, test, type Page } from "@playwright/test";
import { adminLogin, seed } from "./helpers";

test.use({ viewport: { width: 375, height: 700 }, hasTouch: true });

const opener = (page: Page) => page.getByRole("button", { name: "Open navigation menu" });
const drawer = (page: Page) => page.getByRole("dialog", { name: "Admin navigation" });

test.describe("admin mobile drawer", () => {
  test.beforeEach(async ({ page, context }) => {
    await seed(context);
    await adminLogin(page);
    await page.goto("/admin/health");
  });

  test("opens, moves focus inside, closes with Escape and returns focus to the menu button", async ({ page }) => {
    await expect(drawer(page)).toHaveCount(0);
    await opener(page).tap();
    await expect(drawer(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
    await expect(opener(page)).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(drawer(page)).toHaveCount(0);
    await expect(opener(page)).toBeFocused();
    await expect(opener(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("closes from the close button and from the backdrop", async ({ page }) => {
    await opener(page).tap();
    await page.getByRole("button", { name: "Close navigation menu" }).tap();
    await expect(drawer(page)).toHaveCount(0);
    await expect(opener(page)).toBeFocused();

    await opener(page).tap();
    await page.mouse.click(360, 400); // right of the panel (panel is 88vw wide at most 20rem = 320px)
    await expect(drawer(page)).toHaveCount(0);
  });

  test("Tab and Shift+Tab never leave the drawer; the page behind is inert", async ({ page }) => {
    await opener(page).tap();
    await expect(page.locator("#admin-app")).toHaveAttribute("inert", "");
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      expect(await drawer(page).evaluate((d) => d.contains(document.activeElement)), `after Tab #${i + 1}`).toBe(true);
    }
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(await drawer(page).evaluate((d) => d.contains(document.activeElement)), `after Shift+Tab #${i + 1}`).toBe(true);
    }
  });

  test("the page behind does not scroll while it is open, and scrolling is restored afterwards", async ({ page }) => {
    await opener(page).tap();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(360, 300);
    await page.mouse.wheel(0, 600);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });

  test("choosing a page navigates and closes it", async ({ page }) => {
    await opener(page).tap();
    await drawer(page).getByRole("link", { name: "Overview" }).tap();
    await page.waitForURL((u) => u.pathname === "/admin");
    await expect(drawer(page)).toHaveCount(0);
    await expect(page.locator("#admin-app")).not.toHaveAttribute("inert", "");
  });

  test("closes by itself when the window grows to the desktop layout", async ({ page }) => {
    await opener(page).tap();
    await expect(drawer(page)).toBeVisible();
    await page.setViewportSize({ width: 1100, height: 700 });
    await expect(drawer(page)).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Admin" })).toBeVisible();
    await expect(page.locator("#admin-app")).not.toHaveAttribute("inert", "");
  });

  test("the menu button and drawer controls are at least 44px", async ({ page }) => {
    const box = await opener(page).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await opener(page).tap();
    for (const loc of [page.getByRole("button", { name: "Close navigation menu" }), ...(await drawer(page).getByRole("link").all()), drawer(page).getByRole("button", { name: "Sign out" })]) {
      const b = await loc.boundingBox();
      expect(b!.height, await loc.innerText().catch(() => "control")).toBeGreaterThanOrEqual(43.5);
    }
  });
});
