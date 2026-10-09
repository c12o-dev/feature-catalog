/* Screenshots + console capture for the quality loop (docs/design/quality-loop.md §2.1).
   Usage: node scripts/qa-shots.mjs [baseUrl] [--full] [--only=/path,/path]
   Writes docs/qa/shots/<name>-<width>[-reduced].png and prints console errors/warnings. */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3100";
const full = process.argv.includes("--full");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const ROUTES = only ?? ["/", "/categories", "/c/data-visualization", "/c/motion", "/p/contribution-heatmap", "/p/command-palette", "/goals", "/g/experience", "/does-not-exist"];
const WIDTHS = [1440, 390];
const OUT = "docs/qa/shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];
for (const reduced of [false, true]) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      const msgs = [];
      page.removeAllListeners("console");
      page.removeAllListeners("pageerror");
      page.on("console", (m) => ["error", "warning"].includes(m.type()) && msgs.push(`${m.type()}: ${m.text().slice(0, 300)}`));
      page.on("pageerror", (e) => msgs.push(`pageerror: ${e.message.slice(0, 300)}`));
      await page.goto(base + route, { waitUntil: "load", timeout: 90_000 });
      await page.waitForTimeout(1600);
      if (full) {
        // scroll-driven reveals depend on the live scroll position; show their end state in stills
        await page.addStyleTag({ content: ".reveal{animation:none!important}" });
        // scroll through so lazy stages mount, then back to top
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < h; y += 700) {
          await page.evaluate((yy) => scrollTo(0, yy), y);
          await page.waitForTimeout(120);
        }
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(600);
      }
      const name = (route === "/" ? "home" : route.slice(1).replaceAll("/", "_")) + `-${width}${reduced ? "-reduced" : ""}`;
      if (full) {
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        const step = width > 800 ? 1800 : 1600;
        for (let i = 0, y = 0; y < h; i++, y += step)
          await page.screenshot({ path: `${OUT}/${name}-p${i}.png`, fullPage: true, clip: { x: 0, y, width, height: Math.min(step, h - y) } });
      } else await page.screenshot({ path: `${OUT}/${name}.png` });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) msgs.push(`horizontal overflow: ${overflow}px`);
      const filtered = msgs.filter((m) => !/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(m));
      if (filtered.length) problems.push({ route, width, reduced, msgs: [...new Set(filtered)] });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(problems.length ? JSON.stringify(problems, null, 1) : "no console problems, no horizontal overflow");
