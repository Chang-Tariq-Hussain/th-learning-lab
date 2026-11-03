import { expect, test, type Page } from "@playwright/test";
import { expectNoPageOverflow, seed } from "./helpers";

/**
 * Atomic Structure ("Build an Atom"): derived properties, presets, shells, experiments, limits,
 * the 3D/2D views and the fallbacks. Works whether or not the test browser has WebGL.
 */
const URL = "/dashboard/chemistry/build-an-atom";

async function open(page: Page) {
  await page.goto(URL);
  await page.locator("[data-sim-layout]").first().waitFor({ state: "attached", timeout: 15_000 });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
}

const readout = (page: Page, label: string) => page.locator("[data-sim-layout] dt, [data-sim-layout] [data-readout-label]").filter({ hasText: new RegExp(`^${label}$`, "i") });

/** Value shown in the stage readouts for a label such as "Element" or "Mass number". */
async function readoutValue(page: Page, label: string): Promise<string> {
  const stage = page.locator("[data-sim-stage-col]").first();
  const item = stage.getByText(new RegExp(`^${label}$`, "i")).first();
  const text = await item.locator("xpath=..").innerText();
  return text.replace(new RegExp(label, "i"), "").trim();
}

const count = (page: Page, name: string) => page.getByLabel(new RegExp(`^\\d+ ${name}$`));
async function counts(page: Page) {
  const read = async (n: string) => Number((await count(page, n).first().getAttribute("aria-label"))!.split(" ")[0]);
  return { protons: await read("protons"), neutrons: await read("neutrons"), electrons: await read("electrons") };
}

test.describe("Build an Atom: properties and controls", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("starts as hydrogen and the readouts follow every particle change", async ({ page }) => {
    await open(page);
    expect(await readoutValue(page, "Element")).toBe("H");
    expect(await readoutValue(page, "Mass number")).toBe("1");

    await page.getByRole("button", { name: "Add a proton" }).click();
    expect(await readoutValue(page, "Element")).toBe("He");
    expect(await readoutValue(page, "Charge")).toBe("+");
    expect(await readoutValue(page, "Mass number")).toBe("2");

    await page.getByRole("button", { name: "Add a neutron" }).click();
    expect(await readoutValue(page, "Mass number")).toBe("3");
    expect(await readoutValue(page, "Element")).toBe("He");

    await page.getByRole("button", { name: "Add a electron" }).click();
    expect(await readoutValue(page, "Charge")).toBe("0");
    expect(await readoutValue(page, "Electrons")).toBe("2");
    await expect(page.getByText(/What just changed/)).toBeVisible();
  });

  test("proton changes rename the element in the Info tab, with isotope notation", async ({ page }) => {
    await open(page);
    for (let i = 0; i < 5; i++) await page.getByRole("button", { name: "Add a proton" }).click();
    await page.getByRole("tab", { name: "Info" }).click();
    await expect(page.getByRole("img", { name: /Isotope notation: C-6/ })).toBeVisible();
    await expect(page.getByText("Carbon-6")).toBeVisible();
    await expect(page.getByText(/Mass number:.*= 6 \+ 0 = 6/)).toBeVisible();
    await expect(page.getByText(/Net charge:.*6 − 1 = 5/)).toBeVisible();
  });

  test("presets load neutral atoms, isotopes, cations and anions with the right charge and mass", async ({ page }) => {
    await open(page);
    const cases: [string, { element: string; mass: string; charge: string; electrons: string }][] = [
      ["Carbon-12", { element: "C", mass: "12", charge: "0", electrons: "6" }],
      ["Carbon-14", { element: "C", mass: "14", charge: "0", electrons: "6" }],
      ["Hydrogen-3 (tritium)", { element: "H", mass: "3", charge: "0", electrons: "1" }],
      ["Magnesium ion (Mg²⁺)", { element: "Mg", mass: "24", charge: "2+", electrons: "10" }],
      ["Sodium ion (Na⁺)", { element: "Na", mass: "23", charge: "+", electrons: "10" }],
      ["Oxide ion (O²⁻)", { element: "O", mass: "16", charge: "2−", electrons: "10" }],
      ["Chloride ion (Cl⁻)", { element: "Cl", mass: "35", charge: "−", electrons: "18" }],
    ];
    for (const [label, want] of cases) {
      await page.getByRole("button", { name: label }).click();
      expect(await readoutValue(page, "Element"), label).toBe(want.element);
      expect(await readoutValue(page, "Mass number"), label).toBe(want.mass);
      expect(await readoutValue(page, "Charge"), label).toBe(want.charge);
      expect(await readoutValue(page, "Electrons"), label).toBe(want.electrons);
    }
  });

  test("the periodic selector builds a neutral atom of the chosen element", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Nitrogen, atomic number 7" }).click();
    expect(await readoutValue(page, "Element")).toBe("N");
    expect(await readoutValue(page, "Mass number")).toBe("14");
    expect(await readoutValue(page, "Charge")).toBe("0");
    await expect(page.getByRole("button", { name: "Nitrogen, atomic number 7" })).toHaveAttribute("aria-pressed", "true");
  });

  test("reset atom returns to hydrogen", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Magnesium ion (Mg²⁺)" }).click();
    await page.getByRole("button", { name: "Reset atom" }).click();
    expect(await counts(page)).toEqual({ protons: 1, neutrons: 0, electrons: 1 });
    expect(await readoutValue(page, "Element")).toBe("H");
  });

  test("counts never go negative or past the limits, even with hundreds of rapid clicks", async ({ page }) => {
    await open(page);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    // Click as fast as the page allows, bypassing Playwright's per-click waits.
    await page.evaluate(async () => {
      const click = (label: string, times: number) => {
        const b = document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
        for (let i = 0; i < times; i++) b?.click();
      };
      click("Remove a proton", 300);
      click("Remove a neutron", 300);
      click("Remove an electron", 300);
      click("Remove a electron", 300);
      click("Add a proton", 300);
      click("Add a neutron", 300);
      click("Add a electron", 300);
      click("Add an electron", 300);
    });
    const c = await counts(page);
    expect(c.protons).toBeGreaterThanOrEqual(1);
    expect(c.protons).toBeLessThanOrEqual(36);
    expect(c.neutrons).toBeLessThanOrEqual(60);
    expect(c.electrons).toBeLessThanOrEqual(40);
    await page.evaluate(async () => {
      for (const label of ["Remove a proton", "Remove a neutron", "Remove an electron", "Remove a electron"]) {
        const b = document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
        for (let i = 0; i < 400; i++) b?.click();
      }
    });
    expect(await counts(page)).toEqual({ protons: 1, neutrons: 0, electrons: 0 });
    await expect(page.getByRole("button", { name: "Remove a proton" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Remove a neutron" })).toBeDisabled();
    expect(errors).toEqual([]);
  });
});

test.describe("Build an Atom: shells", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("shell occupancy, full-shell feedback and shell selection", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Shells" }).click();
    await page.getByRole("button", { name: "Add electron" }).click();
    await expect(page.getByRole("status").filter({ hasText: /Shell 1 \(K\) is full \(2\/2\)/ })).toBeVisible();
    await page.getByRole("button", { name: "Add electron" }).click();
    await expect(page.getByText(/Shell 2 \(L\) is now in use/)).toBeVisible();
    await expect(page.getByText("Arrangement: 2, 1")).toBeVisible();

    const shell1 = page.getByRole("button", { name: /Shell 1 \(K\)/ });
    await shell1.click();
    await expect(shell1).toHaveAttribute("aria-pressed", "true");
    await shell1.click();
    await expect(shell1).toHaveAttribute("aria-pressed", "false");
  });

  test("the introductory model is explained and switches to 2n² beyond 20 electrons", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Shells" }).click();
    await page.getByRole("tab", { name: "Build" }).click();
    await page.getByRole("button", { name: "Calcium ion (Ca²⁺)" }).click();
    await page.getByRole("tab", { name: "Shells" }).click();
    await expect(page.getByText("Arrangement: 2, 8, 8")).toBeVisible();
    await expect(page.getByText(/noble gas/)).toBeVisible();
    await page.getByRole("tab", { name: "Build" }).click();
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Add a electron" }).click();
    await page.getByRole("tab", { name: "Shells" }).click();
    await expect(page.getByText(/no longer applies, so the 2n² capacity rule is used/)).toBeVisible();
    await page.getByRole("radio", { name: /Maximum capacity/ }).click();
    await expect(page.getByText(/does not reproduce real configurations/)).toBeVisible();
  });
});

test.describe("Build an Atom: experiments", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("experiment A completes its tasks live, in order, and can be reset", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Experiments" }).click();
    await expect(page.getByText(/Current task/)).toBeVisible();
    await page.getByRole("tab", { name: "Build" }).click();
    await page.getByRole("button", { name: "Nitrogen, atomic number 7" }).click();
    await page.getByRole("tab", { name: "Experiments" }).click();
    await expect(page.getByText(/Completed\./)).toHaveCount(1);
    await page.getByRole("button", { name: "Reset experiment" }).click();
    await expect(page.getByText(/Completed\./)).toHaveCount(0);
    expect(await readoutValue(page, "Element")).toBe("H");
  });

  test("experiment B (isotope): changing only neutrons completes the carbon tasks", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Experiments" }).click();
    await page.getByRole("tab", { name: /B · Isotope/ }).click();
    await page.getByRole("tab", { name: "Build" }).click();
    await page.getByRole("button", { name: "Carbon-12" }).click();
    await page.getByRole("button", { name: "Add a neutron" }).click();
    await page.getByRole("button", { name: "Add a neutron" }).click();
    await page.getByRole("tab", { name: "Experiments" }).click();
    await expect(page.getByText(/Experiment complete/)).toBeVisible();
  });

  test("experiment D compares two atoms side by side", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Carbon-14" }).click();
    await page.getByRole("tab", { name: "Experiments" }).click();
    await page.getByRole("tab", { name: /D · Compare/ }).click();
    await expect(page.getByText(/Isotopes of Carbon/)).toBeVisible();
    await expect(page.getByRole("cell", { name: "✕ differs" }).first()).toBeVisible();
  });

  test("experiment E (challenge): wrong answer gives feedback and hints, right answer succeeds, retry resets", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Experiments" }).click();
    await page.getByRole("tab", { name: /E · Challenge/ }).click();
    await expect(page.getByText(/Create a magnesium ion with a \+2 charge/)).toBeVisible();

    await page.getByRole("button", { name: "Check my atom" }).click();
    await expect(page.getByText(/Not quite yet/)).toBeVisible();
    await page.getByRole("button", { name: "Hint" }).click();
    await expect(page.getByText(/Hint 1:/)).toBeVisible();
    await page.getByRole("button", { name: "Another hint" }).click();
    await page.getByRole("button", { name: "Another hint" }).click();
    await expect(page.getByRole("button", { name: "No more hints" })).toBeDisabled();

    await page.getByRole("tab", { name: "Build" }).click();
    await page.getByRole("button", { name: "Magnesium ion (Mg²⁺)" }).click();
    await page.getByRole("tab", { name: "Experiments" }).click();
    await page.getByRole("button", { name: "Check my atom" }).click();
    await expect(page.getByText(/Correct after 2 tries/)).toBeVisible();

    await page.getByRole("button", { name: "Try again" }).click();
    expect(await readoutValue(page, "Element")).toBe("H");
    await expect(page.getByText(/Correct/)).toHaveCount(0);
  });
});

test.describe("Build an Atom: views and fallbacks", () => {
  test.beforeEach(async ({ context }) => seed(context));

  test("the 2D diagram can be chosen, labels toggle, and the model is labelled as simplified", async ({ page }) => {
    await open(page);
    await expect(page.getByText("Simplified model, not to scale")).toBeVisible();
    await page.getByRole("button", { name: "2D diagram" }).click();
    await expect(page.getByRole("img", { name: /Atom diagram with 1 protons/ })).toBeVisible();
    await page.getByRole("button", { name: "Add a proton" }).click();
    await expect(page.getByRole("img", { name: /Atom diagram with 2 protons/ })).toBeVisible();
    await page.getByRole("button", { name: "3D view" }).click();
    await page.getByRole("tab", { name: "Info" }).click();
    await expect(page.getByText(/not a literal picture of an atom/)).toBeVisible();
    await expect(page.getByText(/Real electrons do not follow circular paths/)).toBeVisible();
    await expect(page.getByRole("list", { name: "Particle key" }).last()).toBeVisible();
  });

  test("without WebGL the 2D diagram is shown with an explanation and the page still works", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (/webgl/i.test(type)) return null;
        return (original as (...a: unknown[]) => unknown).call(this, type, ...rest) as never;
      } as never;
    });
    await open(page);
    await expect(page.getByText(/3D is not available in this browser/)).toBeVisible();
    await expect(page.getByRole("img", { name: /Atom diagram with 1 protons/ })).toBeVisible();
    await page.getByRole("button", { name: "Add a proton" }).click();
    expect(await readoutValue(page, "Element")).toBe("He");
  });

  test("a lost graphics context falls back to the 2D diagram without crashing", async ({ page }) => {
    await open(page);
    const canvas = page.locator("canvas").first();
    test.skip((await page.locator("canvas").count()) === 0, "this browser has no WebGL");
    await canvas.evaluate((el) => el.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
    await expect(page.getByText(/graphics context was lost/)).toBeVisible();
    await expect(page.getByRole("img", { name: /Atom diagram with 1 protons/ })).toBeVisible();
    await canvas.evaluate((el) => el.dispatchEvent(new Event("webglcontextrestored")));
    await expect(page.getByText(/graphics context was lost/)).toHaveCount(0);
  });

  test("reduced motion: the page works and nothing keeps animating the atom", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await seed(context);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await open(page);
    await page.getByRole("button", { name: "Add a proton" }).click();
    expect(await readoutValue(page, "Element")).toBe("He");
    await page.getByRole("button", { name: "2D diagram" }).click();
    const before = await page.locator("svg[aria-label^='Atom diagram'] g[transform*='rotate']").first().getAttribute("transform");
    await page.waitForTimeout(600);
    const after = await page.locator("svg[aria-label^='Atom diagram'] g[transform*='rotate']").first().getAttribute("transform");
    expect(after).toBe(before);
    expect(errors).toEqual([]);
    await context.close();
  });
});

test.describe("Build an Atom: layout", () => {
  test("phone: no horizontal overflow, 44px touch targets, and the stage stays on screen while building", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 700 }, hasTouch: true });
    await seed(context);
    const page = await context.newPage();
    await open(page);
    await expectNoPageOverflow(page, "atom phone");

    const small = await page.evaluate(() => {
      const bad: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>("[data-sim-controls] button, [data-sim-controls] select, [data-sim-actions] button"))) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.height < 43.5) bad.push(`${el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30)} ${Math.round(r.height)}px`);
      }
      return bad;
    });
    expect(small).toEqual([]);

    await page.getByRole("button", { name: "Add a proton" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Add a proton" }).click();
    const stage = page.locator("[data-sim-stage]").first();
    const box = await stage.boundingBox();
    const headerBottom = await page.evaluate(() => document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(headerBottom - 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(700);
    await page.getByRole("tab", { name: "Experiments" }).click();
    await expectNoPageOverflow(page, "atom phone experiments");
    await context.close();
  });

  test("320px: no page-level horizontal overflow on any tab", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
    await seed(context);
    const page = await context.newPage();
    await open(page);
    for (const tab of ["Build", "Info", "Shells", "Experiments"]) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      await expectNoPageOverflow(page, `atom 320 ${tab}`);
    }
    await context.close();
  });

  test("the topic page and learning path still link to the simulation", async ({ page, context }) => {
    await seed(context);
    const res = await page.goto("/dashboard/chemistry/atomic-structure");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByRole("link", { name: /Build an Atom/ }).first()).toBeVisible();
    const sim = await page.goto(URL);
    expect(sim?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: "Build an Atom", level: 1 })).toBeVisible();
  });
});
