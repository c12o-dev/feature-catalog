/* Step 1 of the font subsetting pipeline (run after `pnpm run build`):
   crawls every page of out/ and records which characters the site shell renders in each
   self-hosted face, per page. Demo stages use platform fonts and are skipped.
   Output: scripts/fonts/glyphs.json  →  consumed by scripts/fonts/subset.py
   Usage: node scripts/fonts/collect-glyphs.mjs  (starts its own server on :3300) */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 3300;
const BASE = `http://localhost:${PORT}`;
const server = spawn("node", ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const xml = fs.readFileSync("out/sitemap.xml", "utf8");
const routes = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
routes.push("/does-not-exist");

/** Runs in the page: text per face key ("zen-400", "zen-700", "mincho-700", "mono"). */
function collect() {
  const out = {};
  const add = (el, text) => {
    if (!text || !text.trim()) return;
    if (el.closest("[data-stage]")) return;
    const cs = getComputedStyle(el);
    const fam = cs.fontFamily.toLowerCase();
    const w = Number(cs.fontWeight) || 400;
    const key = fam.startsWith('"zen') || fam.startsWith("zen")
      ? `zen-${w >= 600 ? 700 : 400}`
      : fam.includes("shippori")
        ? "mincho-700"
        : fam.includes("jetbrains")
          ? "mono"
          : null;
    if (key) out[key] = (out[key] ?? "") + text;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.parentElement) add(n.parentElement, n.nodeValue);
  for (const el of document.querySelectorAll("input[placeholder], textarea[placeholder]")) add(el, el.getAttribute("placeholder"));
  for (const el of document.querySelectorAll("input[value]")) add(el, el.value);
  return out;
}

const result = {};
const record = (route, data) => {
  for (const [face, text] of Object.entries(data)) {
    result[face] ??= {};
    const set = new Set(result[face][route] ?? "");
    for (const ch of text) set.add(ch);
    result[face][route] = [...set].sort().join("");
  }
};

const browser = await chromium.launch();
let i = 0;
async function worker() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  while (i < routes.length) {
    const route = routes[i++];
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 900) await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(200);
    record(route, await page.evaluate(collect));
  }
  await ctx.close();
}
await Promise.all(Array.from({ length: 8 }, worker));

// States that only appear after interaction: X-ray labels, the ⌘K palette (all items listed),
// mobile header, and the 404 search with results.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/?x-ray=1`, { waitUntil: "load" });
await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
await page.waitForTimeout(800);
record("@xray", await page.evaluate(collect));
await page.keyboard.press("Control+k");
await page.getByPlaceholder("パターン名・カテゴリ・目的で検索…").waitFor();
await page.waitForTimeout(800);
record("@palette", await page.evaluate(collect));
await page.goto(`${BASE}/does-not-exist`, { waitUntil: "load" });
await page.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
await page.locator("#nf-q").fill("ー");
await page.waitForTimeout(500);
record("@404-search", await page.evaluate(collect));
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mobile.newPage();
for (const r of ["/", "/c/data-visualization", "/p/contribution-heatmap"]) {
  await mp.goto(BASE + r, { waitUntil: "load" });
  await mp.waitForFunction(() => !document.querySelector("[data-page-loader]"), null, { timeout: 15000 });
  await mp.waitForTimeout(300);
  record(r, await mp.evaluate(collect));
}
await browser.close();
server.kill();

fs.writeFileSync("scripts/fonts/glyphs.json", JSON.stringify(result, null, 0));
for (const [face, pages] of Object.entries(result)) {
  const all = new Set(Object.values(pages).join(""));
  console.log(`${face}: ${Object.keys(pages).length} pages, ${all.size} distinct chars`);
}
