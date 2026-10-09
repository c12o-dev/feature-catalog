/* Minimal static server for `out/` that mimics Cloudflare Pages closely enough for tests:
   clean URLs (/c/auth → c/auth.html), 404.html fallback, brotli/gzip for text like Pages, and the headers from public/_headers
   (so CSP violations surface as console errors in e2e).
   Usage: node scripts/serve-out.mjs [port] */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve("out");
const PORT = Number(process.argv[2] ?? 3100);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webp": "image/webp",
};

// public/_headers: "<pattern>\n  Name: value" blocks. Only "/*" and "<prefix>/*" patterns are used here.
function parseHeaders() {
  const file = path.join(ROOT, "_headers");
  if (!fs.existsSync(file)) return [];
  const rules = [];
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) rules.push({ prefix: line.trim().replace(/\*$/, ""), headers: {} });
    else {
      const i = line.indexOf(":");
      rules.at(-1).headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return rules;
}
const RULES = parseHeaders();

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/") ? [path.join(clean, "index.html")] : [clean, `${clean}.html`, path.join(clean, "index.html")];
  for (const c of candidates) {
    const abs = path.join(ROOT, c);
    if (abs.startsWith(ROOT) && fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
}

http
  .createServer((req, res) => {
    const urlPath = new URL(req.url, "http://x").pathname;
    const file = resolve(urlPath);
    const status = file ? 200 : 404;
    const target = file ?? path.join(ROOT, "404.html");
    for (const r of RULES) if (urlPath.startsWith(r.prefix)) for (const [k, v] of Object.entries(r.headers)) res.setHeader(k, v);
    const type = TYPES[path.extname(target)] ?? "application/octet-stream";
    res.setHeader("Content-Type", type);
    const accept = String(req.headers["accept-encoding"] ?? "");
    const compressible = /^(text\/|application\/(json|xml)|image\/svg)/.test(type);
    const enc = compressible ? (/\bbr\b/.test(accept) ? "br" : /\bgzip\b/.test(accept) ? "gzip" : null) : null;
    if (enc) {
      res.setHeader("Content-Encoding", enc);
      res.setHeader("Vary", "Accept-Encoding");
    }
    res.writeHead(status);
    const stream = fs.createReadStream(target);
    if (enc === "br") stream.pipe(zlib.createBrotliCompress()).pipe(res);
    else if (enc === "gzip") stream.pipe(zlib.createGzip()).pipe(res);
    else stream.pipe(res);
  })
  .listen(PORT, () => console.log(`serving out/ on http://localhost:${PORT}`));
