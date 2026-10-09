/* Copies the self-hosted font subsets into public/fonts/ for dev and build.
   The subsets themselves are generated and committed (assets/fonts/), because they are cut
   around this site's own text — see scripts/fonts/subset.py. Regenerate them when copy changes:
     pnpm run build && node scripts/fonts/collect-glyphs.mjs && python3 scripts/fonts/subset.py
   tests/fonts.test.ts fails when catalog text uses a character the subsets don't cover.
   The root layout links fonts.css asynchronously (font-display: swap). public/fonts/ is gitignored. */

import fs from 'node:fs'
import path from 'node:path'

const SRC = 'assets/fonts'
const OUT_DIR = 'public/fonts'

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })
let bytes = 0
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.woff2') || f === 'fonts.css')
for (const f of files) {
  fs.copyFileSync(path.join(SRC, f), path.join(OUT_DIR, f))
  bytes += fs.statSync(path.join(SRC, f)).size
}
console.log(`[fonts] ${files.length} files, ${(bytes / 1024).toFixed(0)} KiB`)
