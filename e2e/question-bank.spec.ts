import { expect, test } from "@playwright/test";
import { ACCOUNTS, adminLogin, expectNoPageOverflow, seed, toasts } from "./helpers";

test.skip(!ACCOUNTS, "the question bank needs account mode");

test.describe("question bank on a phone", () => {
  test.use({ viewport: { width: 375, height: 800 }, hasTouch: true });

  test.beforeEach(async ({ page, context }) => {
    await seed(context);
    await adminLogin(page);
    await page.goto("/admin/questions");
  });

  test("rows are stacked cards, nothing scrolls sideways, and each card shows its labelled fields", async ({ page }) => {
    await expectNoPageOverflow(page, "/admin/questions");
    const row = page.getByRole("row").nth(1);
    expect(await row.evaluate((r) => getComputedStyle(r).display)).toBe("block");
    // The labels are drawn from each cell's data-label (CSS), so check the attribute and what the browser paints.
    for (const label of ["Source", "Answer check", "Status", "Updated"]) {
      const cell = row.locator(`td[data-label="${label}"]`);
      await expect(cell).toBeVisible();
      expect(await cell.evaluate((el) => getComputedStyle(el, "::before").content)).toBe(`"${label}"`);
    }
    await expect(page.getByRole("columnheader", { name: "Source" })).toBeHidden(); // visually hidden header row, still in the a11y tree
  });

  test("selecting by touch works and each checkbox row is a 44px target", async ({ page }) => {
    const boxes = page.getByRole("checkbox");
    await boxes.nth(0).locator("xpath=ancestor::label").tap();
    await boxes.nth(1).locator("xpath=ancestor::label").tap();
    await expect(boxes.nth(0)).toBeChecked();
    await expect(boxes.nth(1)).toBeChecked();
    await expect(page.locator('input[name="ids"]:checked')).toHaveCount(2);
    const b = await boxes.nth(2).locator("xpath=ancestor::label").boundingBox();
    expect(b!.height).toBeGreaterThanOrEqual(43.5);
  });

  test("the bulk action refuses an empty selection with an error toast and inline text", async ({ page }) => {
    await page.getByLabel("For the selected questions").selectOption("in_review");
    await page.getByRole("button", { name: /Apply to selected/ }).tap();
    await expect(toasts(page).assertive.getByText("Select at least one question first.")).toBeVisible();
    await expect(page.getByRole("main").getByText("Select at least one question first.")).toBeVisible();
  });

  test("the question link opens the full question", async ({ page }) => {
    const stemLink = page.getByRole("row").nth(1).getByRole("link").nth(1);
    const text = (await stemLink.innerText()).trim();
    await stemLink.tap();
    await page.waitForURL(/\/admin\/questions\/[0-9a-f-]{36}/);
    await expect(page.getByLabel("Question", { exact: true })).toHaveValue(text);
  });

  test("a very long search term and long text never break the layout", async ({ page }) => {
    await page.getByLabel("Search").fill("x".repeat(400));
    await page.getByRole("button", { name: "Apply", exact: true }).tap();
    await expect(page.getByText("No questions match these filters.")).toBeVisible();
    await expectNoPageOverflow(page, "long search");
  });
});

test.describe("question bank at tablet and laptop widths", () => {
  for (const [w, cols, meta] of [[768, ["ID", "Question", "Status"], true], [1024, ["ID", "Question", "Answer check", "Status"], true], [1440, ["ID", "Question", "Source", "Answer check", "Status", "Updated"], false]] as const) {
    test(`${w}px: table with the right columns, and hidden columns are not lost`, async ({ page, context }) => {
      await seed(context);
      await page.setViewportSize({ width: w, height: 900 });
      await adminLogin(page);
      await page.goto("/admin/questions");
      await expectNoPageOverflow(page, `/admin/questions @${w}`);
      const row = page.getByRole("row").nth(1);
      expect(await row.evaluate((r) => getComputedStyle(r).display)).toBe("table-row");
      for (const c of cols) await expect(page.getByRole("columnheader", { name: c })).toBeVisible();
      for (const c of ["Source", "Answer check", "Updated"]) {
        if (!cols.includes(c as never)) await expect(page.getByRole("columnheader", { name: c })).toBeHidden();
      }
      // Information that left the table must be shown in the relocated line instead of nowhere.
      if (meta) {
        await expect(row.getByText(/^Updated \d/)).toBeVisible();
        if (w === 768) await expect(row.getByText(/Unchecked|Independently checked|Needs/).first()).toBeVisible();
        await expect(row.locator("span.rounded-full, span.border").first()).toBeVisible();
      } else {
        await expect(row.getByText(/^Updated \d/)).toBeHidden();
      }
    });
  }
});
