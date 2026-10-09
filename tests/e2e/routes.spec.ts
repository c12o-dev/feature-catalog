import { expect, test, type Page } from "@playwright/test";
import { IGNORED_CONSOLE, allRoutes } from "./routes";

/** Scroll the whole page so lazily mounted stages render and get a chance to log. */
async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 900) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
}

for (const route of allRoutes()) {
  test(`console is clean: ${route}`, async ({ page }) => {
    const msgs: string[] = [];
    page.on("console", (m) => {
      if ((m.type() === "error" || m.type() === "warning") && !IGNORED_CONSOLE.test(m.text())) msgs.push(`${m.type()}: ${m.text()}`);
    });
    page.on("pageerror", (e) => msgs.push(`pageerror: ${e.message}`));
    const res = await page.goto(route, { waitUntil: "load" });
    expect(res?.status()).toBe(route === "/does-not-exist" ? 404 : 200);
    await page.waitForTimeout(500);
    if (route === "/" || route.startsWith("/c/") || route.startsWith("/g/")) await scrollThrough(page);
    await page.waitForTimeout(300);
    // The 404 page logs the 404 itself as a resource error; that one is expected.
    const real = route === "/does-not-exist" ? msgs.filter((m) => !/status of 404/.test(m)) : msgs;
    expect(real).toEqual([]);
  });
}
