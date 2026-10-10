/* Post-build step: write <link rel="preload"> for each page's heading-font slices into its <head>.
   A page's slices follow from the font group its root element sets in `--font-serif`
   (src/lib/fonts.ts): common (+ rest) under the base family, the group's own file, and the mono
   index figures. Done on the static HTML rather than in React, because Next also applies
   React-rendered preloads when a page is only prefetched, which pulled every linked page's fonts.
   Usage: node scripts/inject-font-preloads.mjs   (after `next build`) */
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
const manifest = JSON.parse(fs.readFileSync("assets/fonts/manifest.json", "utf8"));
const files = Object.keys(manifest);
const base = files.filter((f) => /^shippori-mincho-b1-(common|rest)\.woff2$/.test(f));
const mono = files.filter((f) => /^jetbrains-mono.*-common\.woff2$/.test(f));

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const tag = (f) => `<link rel="preload" href="/fonts/${f}" as="font" type="font/woff2" crossorigin="anonymous"/>`;
let pages = 0;
for (const file of walk(OUT)) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes('name="x-font-preload"')) continue;
  const group = html.match(/--font-serif:&quot;Shippori Mincho B1 ([a-z0-9-]+)&quot;/)?.[1];
  const own = group && files.includes(`shippori-mincho-b1-${group}.woff2`) ? [`shippori-mincho-b1-${group}.woff2`] : [];
  const links = [...base, ...own, ...mono].map(tag).join("");
  html = html.replace("</head>", `${links}<meta name="x-font-preload" content="${group ?? "base"}"/></head>`);
  fs.writeFileSync(file, html);
  pages++;
}
console.log(`[fonts] preload links written into ${pages} pages`);
