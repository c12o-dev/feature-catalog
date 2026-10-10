import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
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
  // Scroll-driven reveals (animation-timeline: view()) only play as a section enters the
  // viewport; a full-page capture never scrolls, so show their end state in the stills.
  await page.addStyleTag({ content: ".reveal{animation:none!important}" });
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
          // Full-page stills: Chromium's fullPage capture doesn't scroll, so content-visibility
          // cards stay skipped and lazy stages never mount. Grow the viewport to the page instead.
          const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
          await page.setViewportSize({ width, height: Math.min(docHeight, 12000) });
          await page.waitForFunction(() => !document.querySelector("[data-demo-root] .animate-pulse"), null, { timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(1200);
          await page.screenshot({ path: `${base}-full.png` });
          await page.setViewportSize({ width, height: width > 800 ? 900 : 844 });
          await page.waitForTimeout(300);
          // Toolbars are hover-revealed and off-screen cards are content-visibility: auto, so
          // click through the DOM rather than waiting for Playwright's actionability checks.
          const toggled = await page.evaluate(() => {
            const b = document.querySelectorAll<HTMLButtonElement>('button[aria-label="ステージをダークにする"]');
            b.forEach((x) => x.click());
            return b.length;
          });
          if (toggled > 0) {
            await page.waitForTimeout(1500);
            // every stage on the page must actually be dark now (G11)
            const notDark = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("[data-stage]")].filter((s) => s.dataset.stage !== "dark").map((s) => s.dataset.demo));
            expect(notDark).toEqual([]);
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
        await settle(page);
        await page.screenshot({ path: `${OUT}/xray-home-${width}${reduced ? "-reduced" : ""}.png` });
        const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width, height: Math.min(docHeight, 12000) });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${OUT}/xray-home-${width}${reduced ? "-reduced" : ""}-full.png` });
      });
    });
  }
}
