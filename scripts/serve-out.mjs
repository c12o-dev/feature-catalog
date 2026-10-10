/* Minimal static server for `out/` that mimics Cloudflare Pages closely enough for tests:
   clean URLs (/c/auth → c/auth.html), 404.html fallback, brotli/gzip for text like Pages, and the
   headers from public/_headers (so CSP violations surface as console errors in e2e).
   With --h2 it serves HTTPS/2 on a self-signed certificate (Lighthouse then simulates
   multiplexed loading as Cloudflare does; pass --ignore-certificate-errors to Chrome).
   Usage: node scripts/serve-out.mjs [port] [--h2] */
import { execFileSync } from "node:child_process";
import http from "node:http";
import http2 from "node:http2";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve("out");
const PORT = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 3100);
const H2 = process.argv.includes("--h2");

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

// Compressed once per file and kept, like an edge cache; so brotli can run at full quality
// without the CPU cost showing up in the measurements.
const cache = new Map();
function compressed(file, enc) {
  const key = `${enc}:${file}:${fs.statSync(file).mtimeMs}`;
  let buf = cache.get(key);
  if (!buf) {
    const raw = fs.readFileSync(file);
    buf = enc === "br" ? zlib.brotliCompressSync(raw) : zlib.gzipSync(raw);
    cache.set(key, buf);
  }
  return buf;
}

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/") ? [path.join(clean, "index.html")] : [clean, `${clean}.html`, path.join(clean, "index.html")];
  for (const c of candidates) {
    const abs = path.join(ROOT, c);
    if (abs.startsWith(ROOT) && fs.existsSync(abs) && fs.statSync(abs).isFile()) return abs;
  }
  return null;
}

const handler = (req, res) => {
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
    res.end(enc ? compressed(target, enc) : fs.readFileSync(target));
  };

if (H2) {
  // Self-signed cert for localhost, generated once into the OS temp dir.
  const dir = path.join(os.tmpdir(), "feature-catalog-h2");
  fs.mkdirSync(dir, { recursive: true });
  const key = path.join(dir, "key.pem");
  const cert = path.join(dir, "cert.pem");
  if (!fs.existsSync(key) || !fs.existsSync(cert))
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert, "-days", "365", "-subj", "/CN=localhost"], { stdio: "ignore" });
  http2
    .createSecureServer({ key: fs.readFileSync(key), cert: fs.readFileSync(cert), allowHTTP1: true }, handler)
    .listen(PORT, () => console.log(`serving out/ on https://localhost:${PORT} (h2)`));
} else {
  http.createServer(handler).listen(PORT, () => console.log(`serving out/ on http://localhost:${PORT}`));
}
