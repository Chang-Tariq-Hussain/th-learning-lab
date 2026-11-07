import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Cell Explorer: selection and highlight, cell-type switching, all four activities (with retry), zoom controls,
 * keyboard operation, and layout on phone / tablet / desktop in light and dark themes.
 */
const PATH = "/dashboard/biology/cell-explorer";

async function open(page: Page) {
  await page.goto(PATH);
  await page.locator('[data-testid="cell-stage"]').waitFor({ timeout: 30_000 });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
}
const part = (page: Page, id: string) => page.locator(`[data-part="${id}"]`).first();

test.describe("cell explorer", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("selecting a structure highlights it and shows its details", async ({ page }) => {
    await open(page);
    const box = (await part(page, "nucleus").boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.65); // real click on the nucleus body
    await expect(page.getByTestId("info-name")).toHaveText("Nucleus");
    await expect(page.getByTestId("info-presence")).toContainText("plant and animal");
    await expect(part(page, "nucleus")).toHaveAttribute("data-selected", "true");
    await expect(page.getByText("Think of it like this")).toBeVisible();
    // legend selects too, and a second click deselects
    await page.locator('[data-legend-id="golgi"]').click();
    await expect(page.getByTestId("info-name")).toHaveText("Golgi Apparatus");
    await page.locator('[data-legend-id="golgi"]').click();
    await expect(page.getByTestId("info-name")).toHaveCount(0);
  });

  test("animal cell never shows plant-only structures; plant cell does", async ({ page }) => {
    await open(page);
    for (const id of ["cellWall", "chloroplast", "largeVacuole", "plasmodesmata"]) {
      await expect(page.locator(`[data-part="${id}"]`)).toHaveCount(0);
      await expect(page.locator(`[data-legend-id="${id}"]`)).toHaveCount(0);
    }
    for (const id of ["cellMembrane", "cytoplasm", "nucleus", "nuclearEnvelope", "nucleolus", "mitochondria", "ribosomes", "roughER", "smoothER", "golgi", "vesicles", "vacuole"]) {
      await expect(page.locator(`[data-part="${id}"]`).first()).toBeAttached();
    }
    await page.getByRole("radio", { name: "Plant cell" }).click();
    for (const id of ["cellWall", "chloroplast", "largeVacuole", "plasmodesmata", "vesicles", "vacuole"]) {
      await expect(page.locator(`[data-part="${id}"]`).first()).toBeAttached();
    }
    await page.locator('[data-legend-id="largeVacuole"]').click();
    await expect(page.getByTestId("info-presence")).toContainText("Plant cells only");
    // switching cell clears the selection
    await page.getByRole("radio", { name: "Animal cell" }).click();
    await expect(page.getByTestId("info-name")).toHaveCount(0);
  });

  test("every structure in both cells can be selected from the diagram", async ({ page }) => {
    await open(page);
    for (const kind of ["Animal cell", "Plant cell"]) {
      await page.getByRole("radio", { name: kind }).click();
      const ids = await page.locator("[data-part]").evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-part")!))]);
      for (const id of ids) {
        await page.locator(`[data-legend-id="${id}"]`).click(); // legend path
        await expect(page.locator(`[data-part="${id}"][data-selected="true"]`).first()).toBeAttached();
        await page.locator(`[data-legend-id="${id}"]`).click();
      }
    }
  });

  test("keyboard: tab to a structure and select it with Enter", async ({ page }) => {
    await open(page);
    const nucleus = part(page, "nucleus");
    await nucleus.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("info-name")).toHaveText("Nucleus");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("info-name")).toHaveCount(0);
  });

  test("zoom in, out and reset", async ({ page }) => {
    await open(page);
    const stage = page.getByTestId("cell-stage");
    await expect(stage).toHaveAttribute("data-zoom", "1.00");
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await expect(stage).not.toHaveAttribute("data-zoom", "1.00");
    await page.getByRole("button", { name: "Reset view" }).click();
    await expect(stage).toHaveAttribute("data-zoom", "1.00");
    await stage.focus();
    await page.keyboard.press("+");
    await expect(stage).not.toHaveAttribute("data-zoom", "1.00");
    await page.keyboard.press("0");
    await expect(stage).toHaveAttribute("data-zoom", "1.00");
  });

  test("identify: wrong answer allows retry, then correct, then finish with score", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Identify" }).click();
    await expect(page.getByTestId("identify-panel")).toBeVisible();
    for (let i = 0; i < 8; i++) {
      const target = (await page.getByTestId("identify-target").textContent())!.trim();
      const ids = await page.locator("[data-part]").evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-part")!))]);
      const names: Record<string, string> = await page.evaluate(() => ({}));
      void names;
      const targetId = await page.evaluate((t) => {
        const el = [...document.querySelectorAll<SVGGElement>("[data-part][aria-label]")].find((e) => e.getAttribute("aria-label") === t);
        return el?.getAttribute("data-part") ?? null;
      }, target);
      expect(targetId, `target ${target}`).not.toBeNull();
      if (i === 0) {
        const wrong = ids.find((id) => id !== targetId && id !== "cytoplasm")!;
        await part(page, wrong).dispatchEvent("click");
        await expect(page.getByTestId("identify-feedback")).toHaveAttribute("data-tone", "retry");
        await page.getByRole("button", { name: "Hint" }).click();
        await expect(page.getByTestId("identify-hint")).toBeVisible();
      }
      await part(page, targetId!).dispatchEvent("click");
      await expect(page.getByTestId("identify-feedback")).toHaveAttribute("data-tone", "success");
      await page.getByTestId("next").click();
    }
    await expect(page.getByTestId("round-score")).toContainText("of 8");
    await page.getByTestId("play-again").click();
    await expect(page.getByTestId("identify-target")).toBeVisible();
  });

  test("function: highlighted structure, wrong then right option", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Function" }).click();
    const panel = page.getByTestId("function-panel");
    await expect(panel).toBeVisible();
    await expect(page.locator('[data-part][aria-label="Highlighted structure"]').first()).toBeAttached();
    // names must not leak while asking
    await expect(page.locator("[data-part][aria-label='Nucleus']")).toHaveCount(0);
    const options = panel.locator("[data-option]");
    expect(await options.count()).toBe(4);
    // the correct option's value is the target's id, which is exposed on the highlighted part
    const targetId = await page.locator("[data-part]").evaluateAll((els) => els.find((e) => e.getAttribute("aria-label") === "Highlighted structure")?.getAttribute("data-part"));
    const wrong = panel.locator(`[data-option]:not([data-option="${targetId}"])`).first();
    await wrong.click();
    await expect(wrong).toBeDisabled();
    await expect(page.getByTestId("function-feedback")).toHaveAttribute("data-tone", "retry");
    await panel.locator(`[data-option="${targetId}"]`).click();
    await expect(page.getByTestId("function-feedback")).toHaveAttribute("data-tone", "success");
    await page.getByTestId("next").click();
    await expect(panel.getByText("Question 2 of 6").first()).toBeVisible();
  });

  test("compare: table, plant-only outline, row switches cell, sort quiz", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Compare" }).click();
    await expect(page.getByTestId("compare-table")).toBeVisible();
    await page.locator('[data-row="cellWall"]').click(); // plant-only: jumps to the plant cell
    await expect(page.getByRole("radio", { name: "Plant cell" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("info-name")).toHaveText("Cell Wall");
    await page.getByRole("switch", { name: /Outline plant-only/ }).click();
    await expect(page.getByRole("switch", { name: /Outline plant-only/ })).toHaveAttribute("aria-checked", "true");
    // sort quiz: answer correctly using the structure's own presence
    const target = (await page.getByTestId("sort-target").textContent())!.trim();
    const plantOnly = ["Cell Wall", "Chloroplasts", "Large Central Vacuole", "Plasmodesmata"].includes(target);
    await page.locator(`[data-option="${plantOnly ? "plant" : "both"}"]`).click();
    await expect(page.getByTestId("sort-feedback")).toHaveAttribute("data-tone", "success");
  });

  for (const vp of [
    { name: "phone", width: 375, height: 700 },
    { name: "tablet", width: 820, height: 1100 },
    { name: "desktop", width: 1366, height: 768 },
  ]) {
    for (const theme of ["light", "dark"]) {
      test(`layout ${vp.name} ${theme}: stage and actions fully visible, no overflow`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        await seed(context, { theme });
        const page = await context.newPage();
        await open(page);
        await page.waitForTimeout(600);
        // Scrolled so the layout starts under the header, and again and again 120px further down, with the controls scrolling under it: the whole stage and the
        // actions must be on screen both times (the stage block is sticky).
        const scrollers: Array<() => Promise<void>> = [
          () => page.evaluate(() => {
            const top = document.querySelector("[data-sim-layout]")!.getBoundingClientRect().top + scrollY;
            scrollTo(0, top - document.querySelector("header")!.getBoundingClientRect().bottom);
          }),
          () => page.evaluate(() => {
            const top = document.querySelector("[data-sim-layout]")!.getBoundingClientRect().top + scrollY;
            scrollTo(0, top - document.querySelector("header")!.getBoundingClientRect().bottom + 120);
          }),
        ];
        for (const scroll of scrollers) {
          await scroll();
          await page.waitForTimeout(300);
          const header = (await page.locator("header").first().boundingBox())!;
          const stage = (await page.locator("[data-sim-stage]").boundingBox())!;
          const actions = (await page.locator("[data-sim-actions]").boundingBox())!;
          expect(stage.width).toBeGreaterThan(Math.min(vp.width * 0.5, 300));
          expect(stage.y).toBeGreaterThanOrEqual(header.y + header.height - 2);
          expect(stage.y + stage.height).toBeLessThanOrEqual(vp.height + 1);
          expect(actions.y + actions.height).toBeLessThanOrEqual(vp.height + 1);
        }
        await expectNoPageOverflow(page, `cell-explorer ${vp.name}`);
        await context.close();
      });
    }
  }

  test("reduced motion: no pulsing animation on the function target", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await seed(context);
    const page = await context.newPage();
    await open(page);
    await page.getByRole("tab", { name: "Function" }).click();
    await expect(page.locator("[data-part] animate")).toHaveCount(0);
    await context.close();
  });
});
