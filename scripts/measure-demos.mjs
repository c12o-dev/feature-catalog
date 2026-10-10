/* Measures each demo's rendered height in a hero stage (/p pages) at 390 and 1440 and writes
   src/data/demo-sizes.generated.json, which the Stage uses to reserve the height before the demo
   chunk arrives (no layout shift on swap). Re-run after changing demos:
     pnpm run build && pnpm run measure && pnpm run build
   Usage: node scripts/measure-demos.mjs   (serves out/ on :3300 by itself) */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 3300;
const server = spawn("node", ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const xml = fs.readFileSync("out/sitemap.xml", "utf8");
const routes = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/p\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const prev = fs.existsSync("src/data/demo-sizes.generated.json") ? JSON.parse(fs.readFileSync("src/data/demo-sizes.generated.json", "utf8")) : {};
const sizes = {};
const browser = await chromium.launch();

async function measure(ctx, route) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load" });
  const stage = page.locator("[data-stage]").first();
  if (!(await stage.count())) return null;
  // wait for the lazy demo chunk to replace the skeleton
  await page.waitForFunction(() => !document.querySelector("[data-stage] [data-demo-root] .animate-pulse"), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(400);
  const r = await page.evaluate(() => {
    const s = document.querySelector("[data-stage]");
    const root = s?.querySelector("[data-demo-root]");
    return s && root ? { key: s.getAttribute("data-demo"), h: Math.round(root.getBoundingClientRect().height) } : null;
  });
  await page.close();
  return r;
}

let i = 0;
async function worker() {
  const lg = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sm = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  while (i < routes.length) {
    const route = routes[i++];
    const a = await measure(lg, route);
    const b = await measure(sm, route);
    if (a && b && a.key) sizes[a.key] = { sm: b.h, lg: a.h };
  }
  await lg.close();
  await sm.close();
}
await Promise.all(Array.from({ length: 6 }, worker));
await browser.close();
server.kill();

const keys = Object.keys(sizes).sort();
const out = Object.fromEntries(keys.map((k) => [k, sizes[k]]));
fs.writeFileSync("src/data/demo-sizes.generated.json", JSON.stringify(out, null, 0) + "\n");
const changed = keys.filter((k) => !prev[k] || prev[k].sm !== out[k].sm || prev[k].lg !== out[k].lg).length;
console.log(`[measure] ${keys.length} demos, ${changed} changed`);
