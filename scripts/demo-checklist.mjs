/* Static checklist for the demo conventions (design doc v2-launch.md §5.2, gate G12).
   The design docs live in the private c12o-dev/project-docs repo, under feature-catalog/.
   Reads src/components/demos/*.tsx (registry.tsx and _* skipped) and writes ../project-docs/feature-catalog/qa/demo-checklist.md.
   Heuristics only: ✓ = passes the static check, ✗ = violation found, – = not statically checkable.
   Run via `pnpm run checklist`. Does not touch the demos. */

import fs from "node:fs";
import path from "node:path";

// DEMO_CHECKLIST_DIR / DEMO_CHECKLIST_OUT override the paths (used to try the heuristics on fixtures).
const DIR = process.env.DEMO_CHECKLIST_DIR ?? "src/components/demos";
const OUT = process.env.DEMO_CHECKLIST_OUT ?? "../project-docs/feature-catalog/qa/demo-checklist.md";

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".tsx") && f !== "registry.tsx" && !f.startsWith("_"))
  .sort();

/* ── helpers ─────────────────────────────────────────────────────────────── */

/** Replace comments with spaces (offsets preserved). Strings/templates are kept. */
function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  let quote = null; // ' " `
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        out += d ?? "";
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      quote = c;
      out += c;
      i++;
      continue;
    }
    if (c === "/" && d === "/") {
      while (i < n && src[i] !== "\n") {
        out += " ";
        i++;
      }
      continue;
    }
    if (c === "/" && d === "*") {
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        out += src[i] === "\n" ? "\n" : " ";
        i++;
      }
      out += "  ";
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

/**
 * Classify the enclosing scope of every character offset.
 * Returns a function (idx) => { frames } where frames is the stack of open brackets
 * with { kind: "call" | "fn" | "block" | "obj" | "paren", name } from outermost to innermost.
 * Strings are skipped (so braces inside template literals don't confuse the stack — roughly).
 */
function scopeIndex(src) {
  const events = []; // { idx, stack snapshot } is too heavy; instead record open/close positions
  const stack = [];
  const opens = []; // [idx, frame]
  const closes = []; // [idx]
  let quote = null;
  const n = src.length;
  for (let i = 0; i < n; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      continue;
    }
    if (c === "`") {
      // template literal: skip to the end, honouring ${} nesting lightly
      let depth = 0;
      i++;
      while (i < n) {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "$" && src[i + 1] === "{") {
          depth++;
          i += 2;
          continue;
        }
        if (depth > 0 && src[i] === "}") {
          depth--;
          i++;
          continue;
        }
        if (depth === 0 && src[i] === "`") break;
        i++;
      }
      continue;
    }
    if (c === "(" || c === "{" || c === "[") {
      const before = src.slice(Math.max(0, i - 80), i);
      let frame;
      if (c === "(") {
        const m = /([A-Za-z_$][\w$.]*)\s*$/.exec(before);
        frame = { kind: m ? "call" : "paren", name: m ? m[1] : "", idx: i, ch: c };
      } else if (c === "{") {
        if (/=>\s*$/.test(before)) frame = { kind: "fn", name: "arrow", idx: i, ch: c };
        else if (/\)\s*$/.test(before)) {
          // function body or control block; find out whether a `function` keyword precedes the paren list
          const open = stack.length ? null : null;
          void open;
          const head = src.slice(Math.max(0, i - 200), i);
          frame = /\bfunction\b[^(]*\([^)]*\)\s*(?::[^{]*)?$/.test(head)
            ? { kind: "fn", name: "function", idx: i, ch: c }
            : /\b(if|for|while|switch|catch)\s*\([^)]*\)\s*$/.test(head)
              ? { kind: "block", name: "control", idx: i, ch: c }
              : { kind: "fn", name: "function", idx: i, ch: c };
        } else if (/\b(else|try|finally|do)\s*$/.test(before)) frame = { kind: "block", name: "control", idx: i, ch: c };
        else frame = { kind: "obj", name: "", idx: i, ch: c };
      } else frame = { kind: "arr", name: "", idx: i, ch: c };
      stack.push(frame);
      opens.push([i, frame]);
    } else if (c === ")" || c === "}" || c === "]") {
      const f = stack.pop();
      if (f) {
        f.end = i;
        closes.push(i);
      }
    }
  }
  void events;
  const frames = opens.map(([, f]) => f);
  return (idx) => frames.filter((f) => f.idx < idx && (f.end === undefined || f.end > idx));
}

/** Name of the function a `fn` frame belongs to (`const foo = (...) => {` / `function foo(` / `useState(() => {`). */
function fnOwner(src, frame) {
  const head = src.slice(Math.max(0, frame.idx - 200), frame.idx) + (frame.name === "arrow-expr" ? "=>" : "");
  const m = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]*)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]*)?=>\s*$/.exec(head);
  if (m) return m[1];
  // inline callback argument: `setX((m) => ...)`, `items.map((it) => ...)`
  const cb = /([A-Za-z_$][\w$.]*)\s*\(\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]*)?=>\s*$/.exec(head);
  if (cb) return `cb:${cb[1].split(".").at(-1)}`;
  const f = /function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(head);
  if (f) return f[1];
  return null;
}

const num = (s) => Number.parseInt(s, 10);

/* ── per-item checks ─────────────────────────────────────────────────────── */

function check(file) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const src = stripComments(raw);
  const r = {}; // item -> { mark, note }

  // 1. "use client" / default export / no props
  {
    const useClient = /^\s*"use client";/m.test(src);
    const m = /export\s+default\s+function\s+([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)/.exec(src);
    const anyDefault = /export\s+default\b/.test(src);
    const notes = [];
    if (!useClient) notes.push('"use client" なし');
    if (!m) notes.push(anyDefault ? "default export が function 宣言でない" : "default export なし");
    else if (m[2].trim() !== "") notes.push(`props あり (${m[2].trim().slice(0, 30)})`);
    r[1] = notes.length ? { mark: "✗", note: notes.join("; ") } : { mark: "✓" };
  }

  // 2. deterministic initial state
  {
    const scopes = scopeIndex(src);
    const compMatch = /export\s+default\s+function\s+[A-Za-z_$]*\s*\([^)]*\)\s*(?::[^{]*)?\{/.exec(src);
    const compOpen = compMatch ? compMatch.index + compMatch[0].length - 1 : -1;
    const re = /\bMath\.random\s*\(|\bDate\.now\s*\(|\bnew\s+Date\s*\(\s*\)|\bperformance\.now\s*\(/g;
    const bad = [];
    const soft = [];
    let m;
    while ((m = re.exec(src))) {
      const frames = scopes(m.index);
      const fnFrames = frames.filter((f) => f.kind === "fn");
      let inner = fnFrames.at(-1);
      // expression-bodied arrow (`const f = () => Math.random()`): no `{` frame, so look for a `=>`
      // between the innermost frame start and the match with no `;` / block `{` in between.
      // Walk the segments between enclosing opens from the match outwards until the innermost fn body.
      for (let k = frames.length; k >= 0; k--) {
        const hi = k === frames.length ? m.index : frames[k].idx;
        const lo = k > 0 ? frames[k - 1].idx + 1 : 0;
        const seg = src.slice(lo, hi);
        const arrow = seg.lastIndexOf("=>");
        if (arrow >= 0 && !/[;]|(?<!\$)\{/.test(seg.slice(arrow + 2))) {
          inner = { kind: "fn", name: "arrow-expr", idx: lo + arrow };
          break;
        }
        if (k > 0 && frames[k - 1].kind === "fn") break;
      }
      // anything inside an effect / timer / listener / event-handler call is fine
      const calls = frames.filter((f) => f.kind === "call").map((f) => f.name.split(".").at(-1));
      const inEffect = calls.some((c) => /^(useEffect|useLayoutEffect|setTimeout|setInterval|requestAnimationFrame|addEventListener|useCallback)$/.test(c));
      const token = m[0].replace(/\s+/g, "").replace(/\($/, "()");
      const where = `L${lineOf(src, m.index)} ${token}`;
      if (inEffect) continue;
      const initCall = calls.find((c) => /^(useState|useMemo|useReducer|useRef)$/.test(c));
      if (initCall) {
        bad.push(`${where} が ${initCall} の初期値`);
        continue;
      }
      if (!inner) {
        bad.push(`${where} がモジュール直下`);
        continue;
      }
      if (inner.idx === compOpen) {
        bad.push(`${where} がコンポーネント本体`);
        continue;
      }
      const owner = fnOwner(src, inner);
      if (owner?.startsWith("cb:")) {
        const callee = owner.slice(3);
        if (/^set[A-Z]/.test(callee)) continue; // state updater callback → runs from a handler/effect
        if (/^(useState|useMemo|useReducer|useRef)$/.test(callee)) {
          bad.push(`${where} が ${callee} の初期値`);
          continue;
        }
        soft.push(`${where} が ${callee}() のコールバック内（呼び出し元は未確認）`);
        continue;
      }
      // Inner arrow props (onClick={() => ...}) and named handlers are fine; module-level helpers are unknown.
      const isHandlerProp = /\bon[A-Z][A-Za-z]*\s*=\s*\{\s*(?:async\s*)?\([^)]*\)\s*=>\s*$/.test(src.slice(Math.max(0, inner.idx - 120), inner.idx));
      if (isHandlerProp || (owner && /^(on|handle|toggle|add|remove|start|stop|reset|submit|run|send|next|prev|go|play|pause|copy|save|load|open|close|retry|refresh|click|press|fire|emit|push|pop|shuffle|roll|generate|regenerate|undo|redo|apply|dismiss|select|pick|rotate|tick|advance|step|answer|vote|like|react|post|drop|move)/i.test(owner))) continue;
      soft.push(`${where} が ${owner ? `${owner}()` : "ネスト関数"} 内（呼び出し元は未確認）`);
    }
    if (bad.length) r[2] = { mark: "✗", note: bad.join("; ") };
    else if (soft.length) r[2] = { mark: "–", note: soft.join("; ") };
    else r[2] = { mark: "✓" };
  }

  // 3. motion within one click / autonomous loops stop within 10s
  r[3] = { mark: "–" };

  // 4. timers / subscriptions cleaned up
  {
    const notes = [];
    const has = (re) => re.test(src);
    const abort = /AbortController|signal\s*:/.test(src);
    // Benign one-shots that need no cleanup: Promise resolvers / revokeObjectURL on a timer,
    // focus moves on the next frame (no state, no loop).
    const callbackOf = (idx) => src.slice(idx, Math.min(src.length, idx + 400));
    const timeouts = [...src.matchAll(/\bsetTimeout\s*\(/g)].map((m) => callbackOf(m.index + m[0].length));
    const realTimeouts = timeouts.filter((cb) => !/^\s*\(?\s*(?:r|res|resolve|done|ok)\s*\)?\s*,/.test(cb) && !/^[^;]*revokeObjectURL/.test(cb));
    const rafs = [...src.matchAll(/\brequestAnimationFrame\s*\(/g)].map((m) => callbackOf(m.index + m[0].length));
    const focusOnly = (cb) => {
      const body = cb.split(/\n\s*\}\);|\);\n/)[0];
      return /\.focus\(/.test(body) && !/\bset(?!SelectionRange|Attribute|Property|PointerCapture|Item)[A-Z]\w*\(|requestAnimationFrame/.test(body);
    };
    const realRafs = rafs.filter((cb) => !focusOnly(cb));
    const pairs = [
      [/\bsetInterval\s*\(/, /\bclearInterval\b/, "setInterval → clearInterval なし"],
      [realTimeouts.length > 0, /\bclearTimeout\b/, "setTimeout → clearTimeout なし"],
      [/\baddEventListener\s*\(/, /\bremoveEventListener\b/, "addEventListener → removeEventListener なし"],
      [/\bnew\s+ResizeObserver\s*\(/, /\.disconnect\b|\.unobserve\b/, "ResizeObserver → disconnect なし"],
      [/\bnew\s+IntersectionObserver\s*\(/, /\.disconnect\b|\.unobserve\b/, "IntersectionObserver → disconnect なし"],
      [/\bnew\s+MutationObserver\s*\(/, /\.disconnect\b/, "MutationObserver → disconnect なし"],
      [realRafs.length > 0, /\bcancelAnimationFrame\b/, "requestAnimationFrame → cancelAnimationFrame なし"],
      [/\.addListener\s*\(/, /\.removeListener\b/, "matchMedia addListener → removeListener なし"],
    ];
    const used = (use) => (typeof use === "boolean" ? use : has(use));
    for (const [use, clean, msg] of pairs) {
      if (used(use) && !has(clean) && !(msg.startsWith("addEventListener") && abort)) notes.push(msg);
    }
    const benign = [];
    if (timeouts.length > realTimeouts.length) benign.push("setTimeout は Promise 解決/revokeObjectURL のみ");
    if (rafs.length > realRafs.length) benign.push("rAF はフォーカス移動のみ");
    const usesAny = pairs.some(([use]) => used(use)) || /useSyncExternalStore/.test(src);
    if (notes.length) r[4] = { mark: "✗", note: notes.join("; ") };
    else if (usesAny) r[4] = { mark: "✓", note: benign.length ? benign.join("; ") : undefined };
    else r[4] = { mark: "–", note: benign.length ? benign.join("; ") : "タイマー/購読なし" };
    // Synchronous setState inside useEffect: enforced by react-hooks/set-state-in-effect (lint passes) → no static re-check.
  }

  // 5. reduced motion
  {
    const usesMotionLib = /from\s+"motion\//.test(src);
    const honours = /useReducedMotion|prefers-reduced-motion/.test(src);
    const motionSafe = /motion-(safe|reduce):/.test(src);
    // CSS motion classes: animate-* (not animate-none) and transitions that move things.
    const cssClasses = src.match(/\b(?:[\w-]+:)*(?:animate-(?!none\b)[\w-]+|transition(?:-(?:all|transform)|\b(?!-)))/g) ?? [];
    const cssMotion = cssClasses.length > 0 || /\b(?:animation|transition)\s*:/.test(src);
    // JS-driven autonomous motion (not covered by the global CSS reduced-motion rule, globals.css D13)
    // rAF loops (a frame callback scheduling the next frame), Web Animations, confetti. One-shot rAF focus
    // moves and setInterval-driven text updates are not motion; CSS transitions they trigger fall under D13.
    const rafCount = (src.match(/\brequestAnimationFrame\s*\(/g) ?? []).length;
    const rafLoop = rafCount >= 2 && /requestAnimationFrame\s*\(\s*(?:[A-Za-z_$][\w$]*|\(\s*\)\s*=>|\(\s*[A-Za-z_$][\w$]*\s*(?::[^)]*)?\)\s*=>)/.test(src) && !/\.focus\(\)[\s\S]*\.focus\(\)/.test(src);
    const jsMotion = rafLoop || /\.animate\s*\(|\bcanvas-confetti\b/.test(src);
    const notes = [];
    if (usesMotionLib && !honours) notes.push("motion/react を使うが useReducedMotion なし");
    if (jsMotion && !honours) notes.push("rAF ループ / WAAPI / confetti があるが reduced-motion を見ていない");
    if (notes.length) r[5] = { mark: "✗", note: notes.join("; ") };
    else if (!usesMotionLib && !cssMotion && !jsMotion) r[5] = { mark: "–", note: "アニメーションなし" };
    else if (cssMotion && !usesMotionLib && !jsMotion && !motionSafe && !honours)
      r[5] = { mark: "✓", note: "CSS のみ（motion-safe: なし、globals.css の D13 グローバル規則で停止）" };
    else r[5] = { mark: "✓" };
  }

  // 6. no fixed widths ≥ 320
  {
    const bad = [];
    const soft = [];
    const scroll = /overflow-(x-)?(auto|scroll)/.test(src);
    const clipped = /overflow-hidden/.test(src);
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (/initialDimension/.test(line)) return;
      for (const m of line.matchAll(/\b(min-w|w)-\[(\d+)px\]/g)) {
        const px = num(m[2]);
        if (px < 320) continue;
        if (m[1] === "min-w" && scroll) soft.push(`L${i + 1} ${m[0]}（overflow-x-auto 内）`);
        else bad.push(`L${i + 1} ${m[0]}`);
      }
      for (const m of line.matchAll(/\b(?:min)?[wW]idth\s*:\s*"?(\d+)(?:px)?"?/g)) {
        const px = num(m[1]);
        if (px >= 320) bad.push(`L${i + 1} ${m[0].trim()}`);
      }
      for (const m of line.matchAll(/<(?:svg|canvas|img|video|iframe)\b[^>]*\bwidth=["{](\d+)["}]/g)) {
        if (num(m[1]) < 320 || /w-full|max-w-full/.test(line)) continue;
        if (clipped) soft.push(`L${i + 1} width=${m[1]}（overflow-hidden 内）`);
        else bad.push(`L${i + 1} width=${m[1]}`);
      }
    });
    if (bad.length) r[6] = { mark: "✗", note: bad.join("; ") };
    else if (soft.length) r[6] = { mark: "✓", note: soft.join("; ") };
    else r[6] = { mark: "✓" };
  }

  // 7. no network / external assets
  {
    const bad = [];
    // Template literals are display-only code samples here (embed snippets etc.); blank their contents.
    const code = src.replace(/`(?:\\.|[^`\\])*`/g, (t) => "`" + t.slice(1, -1).replace(/[^\n]/g, " ") + "`");
    const lines = code.split("\n");
    lines.forEach((line, i) => {
      const hits = [
        [/\bfetch\s*\(/, "fetch("],
        [/<img\b[^>]*\bsrc=["{]\s*["']?https?:/, '<img src="http'],
        [/<(?:video|audio|source|iframe|script|link)\b[^>]*\b(?:src|href)=["{]\s*["']?https?:/, "external src/href"],
        [/\bnew\s+Image\s*\(/, "new Image("],
        [/url\(\s*["']?https?:/, "url(http"],
        [/@import\b/, "@import"],
        [/\bnavigator\.sendBeacon\s*\(|\bnew\s+(?:XMLHttpRequest|WebSocket|EventSource)\s*\(/, "network API"],
        [/@font-face|fonts\.googleapis/, "external font"],
      ];
      for (const [re, label] of hits) if (re.test(line)) bad.push(`L${i + 1} ${label}`);
    });
    r[7] = bad.length ? { mark: "✗", note: bad.join("; ") } : { mark: "✓" };
  }

  // 8. readable on both stages
  {
    // `dark:` is remapped in globals.css to follow [data-stage], so dark: variants are the correct tool.
    // A light surface whose text colour is inherited (no text-*/fill-* in the same class string) turns
    // light-on-light in the dark stage; a pinned dark text colour on an inherited surface does the reverse.
    // Self-contained pairs (bg-white + text-zinc-900) read the same on both stages and are not flagged.
    const bad = [];
    const LIGHT_BG = /(?:^|\s|["'`])(bg-white|bg-(?:zinc|slate|gray|neutral|stone)-(?:50|100))(?=\s|["'`]|$)/;
    const DARK_TEXT = /(?:^|\s|["'`])(text-black|text-(?:zinc|slate|gray|neutral|stone)-(?:800|900|950))(?=\s|["'`]|$)/;
    const ANY_TEXT = /(?:^|\s|["'`])(?:text|fill)-(?:black|white|[a-z]+-\d{2,3})(?:\/\d+)?(?=\s|["'`]|$)/;
    const ANY_BG = /(?:^|\s|["'`])bg-(?:black|white|[a-z]+-\d{2,3}|\[[^\]]+\])(?:\/\d+)?(?=\s|["'`]|$)/;
    // decorative: dots, bars, swatches, handles — no text inside
    const DECOR = /(?:^|\s|["'`])(?:size-\d+(?:\.\d+)?|h-(?:px|0\.5|1|1\.5|2|2\.5|3)|w-(?:px|0\.5|1|1\.5|2|2\.5|3)|rounded-full|origin-left|border)(?=\s|["'`]|$)/;
    for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{cn\(([\s\S]*?)\)\})/g)) {
      const s = m[1] ?? m[2] ?? m[3] ?? "";
      if (s.includes("dark:")) continue;
      const line = lineOf(src, m.index);
      const lbg = s.match(LIGHT_BG);
      const dtx = s.match(DARK_TEXT);
      if (lbg && !ANY_TEXT.test(s) && !DECOR.test(s)) bad.push(`L${line} ${lbg[1]} に文字色指定なし（dark: なし）`);
      else if (dtx && !ANY_BG.test(s) && !DECOR.test(s)) bad.push(`L${line} ${dtx[1]} に背景指定なし（dark: なし）`);
    }
    r[8] = bad.length ? { mark: "✗", note: bad.join("; ") } : { mark: "✓" };
  }

  // 9. recharts ResponsiveContainer sizing
  {
    if (!/from\s+"recharts"/.test(src)) r[9] = { mark: "–", note: "recharts 不使用" };
    else if (!/ResponsiveContainer/.test(src)) r[9] = { mark: "✓", note: "ResponsiveContainer 不使用" };
    else {
      const ok = [];
      const bad = [];
      const re = /<ResponsiveContainer\b[^>]*>/g;
      let m;
      while ((m = re.exec(src))) {
        const line = lineOf(src, m.index);
        if (/initialDimension/.test(m[0])) {
          ok.push(`L${line} initialDimension`);
          continue;
        }
        // parent with explicit height: look back ~400 chars for h-NN / h-[..] / style={{ height
        const before = src.slice(Math.max(0, m.index - 400), m.index);
        if (/\bh-(?:\d+|\[[^\]]+\])\b|style=\{\{[^}]*\bheight\s*:/.test(before)) ok.push(`L${line} 親の高さ固定`);
        else bad.push(`L${line} initialDimension も親の高さもなし`);
      }
      r[9] = bad.length ? { mark: "✗", note: bad.join("; ") } : { mark: "✓" };
    }
  }

  return r;
}

/* ── run ─────────────────────────────────────────────────────────────────── */

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const results = files.map((f) => ({ slug: path.basename(f, ".tsx"), r: check(f) }));

const counts = Object.fromEntries(ITEMS.map((i) => [i, { "✓": 0, "✗": 0, "–": 0 }]));
for (const { r } of results) for (const i of ITEMS) counts[i][r[i].mark]++;

const failures = [];
for (const { slug, r } of results)
  for (const i of ITEMS) if (r[i].mark === "✗") failures.push({ slug, item: i, note: r[i].note ?? "" });

const notes = [];
for (const { slug, r } of results)
  for (const i of ITEMS) if (r[i].mark === "–" && r[i].note && i !== 3 && i !== 9 && !(i === 4 || i === 5)) notes.push({ slug, item: i, note: r[i].note });

const ITEM_LABELS = {
  1: ['"use client" / default export / props なし', '先頭に "use client"、`export default function X()`（引数なし）'],
  2: ["初期状態が決定的", "Math.random / Date.now / new Date() がモジュール直下・コンポーネント本体・useState 等の初期値にない（effect・ハンドラ内は可）"],
  3: ["1 クリックで動く / 自律動作は 10 秒以内に停止", "静的検査不可（G9 の Playwright で確認）"],
  4: ["タイマー・購読・イベントの cleanup", "setInterval / setTimeout / addEventListener / Observer / rAF に対応する解除があるか（Promise 解決用 setTimeout、フォーカス移動のみの rAF は除外）。useEffect 内の同期 setState は lint（react-hooks/set-state-in-effect）で担保"],
  5: ["prefers-reduced-motion", "motion/react なら useReducedMotion、rAF ループ・WAAPI・confetti なら useReducedMotion か prefers-reduced-motion。CSS のみの動きは motion-safe: か globals.css の D13 グローバル規則で停止"],
  6: ["固定幅なし", "`w-[≥320px]`・`min-w-[≥320px]`（overflow-x-auto 内は可）・inline width ≥ 320・svg/canvas の width 属性 ≥ 320（overflow-hidden 内は可）"],
  7: ["外部ネットワーク・外部フォント・外部画像なし", "fetch / 外部 src・href / new Image / url(http / @import / @font-face / WebSocket 等（テンプレート文字列内の表示用コードは除外）"],
  8: ["ライト／ダーク両ステージで読める", "`dark:` は data-stage に追従する。light 固定の面（bg-white 等）で文字色が未指定、または濃色文字（text-black 等）で背景未指定の className を検出（装飾要素は除外）"],
  9: ["recharts の ResponsiveContainer", "`initialDimension` があるか、直前の親に h-* / style height がある"],
};

const today = new Date().toISOString().slice(0, 10);
const md = [];
md.push("# デモ規約チェックリスト（G12）");
md.push("");
md.push(`> \`pnpm run checklist\`（\`scripts/demo-checklist.mjs\`）が生成。手で編集しない。生成日: ${today}。対象 ${results.length} 件（\`src/components/demos/*.tsx\`、\`registry.tsx\` と \`_*\` を除く）。`);
md.push("> 規約は `design/v2-launch.md` §5.2。静的ヒューリスティックによる判定で、✓ は「違反を検出しなかった」の意味。");
md.push("");
md.push("## 凡例");
md.push("");
md.push("| 記号 | 意味 |");
md.push("|---|---|");
md.push("| ✓ | 静的検査で規約を満たす（または該当する違反を検出しなかった） |");
md.push("| ✗ | 違反を検出（末尾の一覧に理由） |");
md.push("| – | 該当なし、または静的に判定できない |");
md.push("");
md.push("| # | 項目 | 検査内容 |");
md.push("|---|---|---|");
for (const i of ITEMS) md.push(`| ${i} | ${ITEM_LABELS[i][0]} | ${ITEM_LABELS[i][1]} |`);
md.push("");
md.push("## 一覧");
md.push("");
md.push("| デモ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |");
md.push("|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|");
for (const { slug, r } of results) md.push(`| \`${slug}\` | ${ITEMS.map((i) => r[i].mark).join(" | ")} |`);
md.push("");
md.push("## 集計");
md.push("");
md.push("| # | ✓ | ✗ | – |");
md.push("|---|--:|--:|--:|");
for (const i of ITEMS) md.push(`| ${i} | ${counts[i]["✓"]} | ${counts[i]["✗"]} | ${counts[i]["–"]} |`);
md.push("");
const d13 = results.filter(({ r }) => r[5].note?.includes("D13")).length;
md.push(`- ✗ 合計: ${failures.length} 件（${new Set(failures.map((f) => f.slug)).size} デモ）`);
md.push(`- 項目 5 で \`motion-safe:\` を書かず globals.css の D13 グローバル規則（\`prefers-reduced-motion: reduce\` で全要素の animation/transition を停止）に依存している CSS-only デモ: ${d13} 件`);
md.push("");
md.push("## ✗ の一覧");
md.push("");
if (failures.length === 0) md.push("なし。");
else {
  md.push("| デモ | # | 理由 |");
  md.push("|---|:-:|---|");
  for (const f of failures) md.push(`| \`${f.slug}\` | ${f.item} | ${f.note.replace(/\|/g, "\\|")} |`);
}
md.push("");
if (notes.length) {
  md.push("## – の補足（項目 2: 乱数・現在時刻をネスト関数内で使用、呼び出し元は未確認）");
  md.push("");
  md.push("| デモ | # | 補足 |");
  md.push("|---|:-:|---|");
  for (const n of notes) md.push(`| \`${n.slug}\` | ${n.item} | ${n.note.replace(/\|/g, "\\|")} |`);
  md.push("");
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md.join("\n"));

console.log(`${OUT}: ${results.length} demos, ${failures.length} ✗`);
for (const i of ITEMS) console.log(`  ${i}: ✓ ${counts[i]["✓"]}  ✗ ${counts[i]["✗"]}  – ${counts[i]["–"]}`);
for (const f of failures) console.log(`  ✗ ${f.slug} #${f.item}: ${f.note}`);
for (const n of notes) console.log(`  – ${n.slug} #${n.item}: ${n.note}`);
