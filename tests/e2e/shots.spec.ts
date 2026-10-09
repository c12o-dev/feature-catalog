import { mkdirSync } from "node:fs";
import { test, type Page } from "@playwright/test";
import { KEY_ROUTES } from "./routes";

/*
 * Screenshots for the quality loop (quality-loop §2.1): fixed routes × 1440/390 × light/dark
 * stage × motion/reduced-motion, plus ⌘K open and X-ray on. Output: docs/qa/shots/ (gitignored).
 */
const OUT = "docs/qa/shots";
mkdirSync(OUT, { recursive: true });

const nameOf = (route: string) => (route === "/" ? "home" : route.slice(1).replaceAll("/", "_"));

async function settle(page: Page) {
  // Mount lazy stages, then return to the top so the still shows the first viewport.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

for (const width of [1440, 390]) {
  for (const reduced of [false, true]) {
    test.describe(`${width}${reduced ? " reduced" : ""}`, () => {
      test.use({
        viewport: { width, height: width > 800 ? 900 : 844 },
        reducedMotion: reduced ? "reduce" : "no-preference",
        isMobile: width < 800,
        hasTouch: width < 800,
      });
      for (const route of KEY_ROUTES) {
        test(`shot ${route}`, async ({ page }) => {
          await page.goto(route, { waitUntil: "load" });
          await settle(page);
          const base = `${OUT}/${nameOf(route)}-${width}${reduced ? "-reduced" : ""}`;
          await page.screenshot({ path: `${base}.png` });
          await page.screenshot({ path: `${base}-full.png`, fullPage: true });
          const toggles = page.getByRole("button", { name: "ステージをダークにする" });
          if ((await toggles.count()) > 0) {
            for (const t of await toggles.all()) await t.click().catch(() => {});
            await page.waitForTimeout(600);
            await page.screenshot({ path: `${base}-darkstage.png` });
          }
        });
      }
      test("shot ⌘K open", async ({ page }) => {
        await page.goto("/", { waitUntil: "load" });
        await page.waitForTimeout(500);
        await page.keyboard.press("ControlOrMeta+k");
        await page.getByPlaceholder("パターン名・カテゴリ・目的で検索…").waitFor();
        await page.waitForTimeout(800);
        await page.screenshot({ path: `${OUT}/cmdk-${width}${reduced ? "-reduced" : ""}.png` });
      });
      test("shot X-ray on", async ({ page }) => {
        await page.goto("/?x-ray=1", { waitUntil: "load" });
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `${OUT}/xray-home-${width}${reduced ? "-reduced" : ""}.png` });
        await page.screenshot({ path: `${OUT}/xray-home-${width}${reduced ? "-reduced" : ""}-full.png`, fullPage: true });
      });
    });
  }
}
