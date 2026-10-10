import { expect, test } from "@playwright/test";
import { KEY_ROUTES, allRoutes, waitReady } from "./routes";

/*
 * quality-loop G10 at 390px: no horizontal page scroll on the key routes, and on every pattern
 * page the demo stays inside its stage (anything wider must sit in a horizontally scrollable box).
 */
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const route of KEY_ROUTES) {
  test(`no horizontal overflow: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await waitReady(page);
    await page.waitForTimeout(800);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(400);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(over).toBe(0);
  });
}

for (const route of allRoutes().filter((r) => r.startsWith("/p/"))) {
  test(`demo fits its stage: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await waitReady(page);
    await page.waitForTimeout(900);
    const bad = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>("[data-stage]");
      if (!stage) return [];
      const box = stage.getBoundingClientRect();
      // Clipped by design: anything inside a scrollable or overflow-hidden box within the stage
      // (sliding panels, shimmer bands, map panoramas), plus visually hidden inputs.
      const clipped = (el: Element) => {
        for (let n: Element | null = el.parentElement; n && n !== stage; n = n.parentElement) {
          const o = getComputedStyle(n).overflowX;
          if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
        }
        return false;
      };
      const out: string[] = [];
      for (const el of stage.querySelectorAll<HTMLElement>("*")) {
        const r = el.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) continue;
        if ((r.right > box.right + 2 || r.left < box.left - 2) && !clipped(el))
          out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(r.left)}..${Math.round(r.right)} (stage ${Math.round(box.left)}..${Math.round(box.right)})`);
        if (out.length >= 3) break;
      }
      return out;
    });
    expect(bad).toEqual([]);
  });
}
