"use client";

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const initial = `// 入力すると補完候補が出ます（↑↓ で選択、Tab/Enter で確定）
function fizzbuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else out.push(String(i));
  }
  return out;
}
`;

const KEYWORDS = ["async", "await", "break", "case", "const", "continue", "default", "else", "export", "false", "for", "function", "if", "import", "let", "new", "null", "return", "switch", "this", "true", "undefined", "while"];
const API = ["console", "log", "length", "push", "map", "filter", "reduce", "forEach", "includes", "join", "String", "Number", "Math", "floor", "JSON", "stringify"];
const KW = new Set(KEYWORDS);

type Tok = { t: "kw" | "str" | "num" | "com" | "fn" | "id" | "punc" | "ws"; v: string };

function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"'`]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ t: "com", v: m[1] });
    else if (m[2]) out.push({ t: "str", v: m[2] });
    else if (m[3]) out.push({ t: "num", v: m[3] });
    else if (m[4]) {
      const rest = line.slice(re.lastIndex);
      out.push({ t: KW.has(m[4]) ? "kw" : /^\s*\(/.test(rest) ? "fn" : "id", v: m[4] });
    } else if (m[5]) out.push({ t: "ws", v: m[5] });
    else out.push({ t: "punc", v: m[6] });
  }
  return out;
}

const color: Record<Tok["t"], string> = {
  kw: "text-violet-300",
  str: "text-emerald-300",
  num: "text-amber-300",
  com: "text-zinc-500 italic",
  fn: "text-sky-300",
  id: "text-zinc-100",
  punc: "text-zinc-400",
  ws: "",
};

type Suggest = { prefix: string; items: string[]; index: number; line: number; col: number };

export default function CodeEditor() {
  const [value, setValue] = useState(initial);
  const [sug, setSug] = useState<Suggest | null>(null);
  const ta = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);

  const lines = value.split("\n");
  const maxCols = Math.max(...lines.map((l) => l.length), 20);
  const LINE = 20;

  useLayoutEffect(() => {
    if (pendingCaret.current !== null && ta.current) {
      ta.current.selectionStart = ta.current.selectionEnd = pendingCaret.current;
      pendingCaret.current = null;
    }
  }, [value]);

  const idents = useMemo(() => {
    const s = new Set<string>([...KEYWORDS, ...API]);
    for (const m of value.matchAll(/[A-Za-z_$][\w$]{2,}/g)) s.add(m[0]);
    return [...s];
  }, [value]);

  const computeSuggest = (text: string, caret: number): Suggest | null => {
    const before = text.slice(0, caret);
    const after = text.slice(caret, caret + 1);
    if (/[\w$]/.test(after)) return null;
    const m = /[A-Za-z_$][\w$]*$/.exec(before);
    if (!m) return null;
    const lineStart = before.lastIndexOf("\n") + 1;
    if (before.slice(lineStart).includes("//")) return null;
    const prefix = m[0];
    const items = idents
      .filter((w) => w !== prefix && w.toLowerCase().startsWith(prefix.toLowerCase()))
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .slice(0, 6);
    if (!items.length) return null;
    const line = before.split("\n").length - 1;
    return { prefix, items, index: 0, line, col: m.index - lineStart };
  };

  const accept = (s: Suggest, word: string) => {
    const el = ta.current;
    if (!el) return;
    const caret = el.selectionStart;
    const start = caret - s.prefix.length;
    const next = value.slice(0, start) + word + value.slice(caret);
    pendingCaret.current = start + word.length;
    setValue(next);
    setSug(null);
    el.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (sug) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const d = e.key === "ArrowDown" ? 1 : -1;
        setSug({ ...sug, index: (sug.index + d + sug.items.length) % sug.items.length });
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        accept(sug, sug.items[sug.index]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSug(null);
        return;
      }
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart;
      pendingCaret.current = s + 2;
      setValue(value.slice(0, s) + "  " + value.slice(el.selectionEnd));
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </span>
        <span className="font-mono text-zinc-300">fizzbuzz.js</span>
        <span className="ml-auto tabular-nums">{lines.length} 行</span>
      </div>
      <div className="max-h-72 overflow-auto">
        <div className="flex min-w-full w-max font-mono text-xs leading-5">
          <div aria-hidden className="sticky left-0 z-10 select-none bg-zinc-950 py-3 pr-3 pl-3 text-right text-zinc-400">
            {lines.map((_, i) => (
              <div key={i} className={cn("tabular-nums", sug?.line === i && "text-zinc-300")}>{i + 1}</div>
            ))}
          </div>
          <div className="relative flex-1" style={{ minWidth: `calc(${maxCols + 4}ch + 1.5rem)`, height: lines.length * LINE + 24 }}>
            <pre aria-hidden className="pointer-events-none absolute inset-0 m-0 whitespace-pre p-3 pl-1">
              {lines.map((l, i) => (
                <div key={i} className="h-5">
                  {tokenize(l).map((t, j) => (
                    <Fragment key={j}>{t.t === "ws" ? t.v : <span className={color[t.t]}>{t.v}</span>}</Fragment>
                  ))}
                </div>
              ))}
            </pre>
            <textarea
              ref={ta}
              value={value}
              wrap="off"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="コードエディタ"
              role="combobox"
              aria-expanded={!!sug}
              aria-controls="code-editor-suggest"
              aria-autocomplete="list"
              aria-activedescendant={sug ? `code-sug-${sug.index}` : undefined}
              onChange={(e) => {
                setValue(e.target.value);
                setSug(computeSuggest(e.target.value, e.target.selectionStart));
              }}
              onKeyDown={onKeyDown}
              onBlur={() => setSug(null)}
              onClick={() => setSug(null)}
              className="absolute inset-0 resize-none overflow-hidden whitespace-pre bg-transparent p-3 pl-1 text-transparent caret-zinc-100 outline-none selection:bg-sky-500/30"
            />
            {sug && (
              <ul
                id="code-editor-suggest"
                role="listbox"
                aria-label="補完候補"
                className="absolute z-20 min-w-36 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-lg"
                style={{ top: (sug.line + 1) * LINE + 14, left: `calc(${sug.col}ch + 0.25rem)` }}
              >
                {sug.items.map((w, i) => (
                  <li
                    key={w}
                    id={`code-sug-${i}`}
                    role="option"
                    aria-selected={i === sug.index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      accept(sug, w);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-2 py-0.5",
                      i === sug.index ? "bg-sky-500/25 text-white" : "text-zinc-300",
                    )}
                  >
                    <span className={cn("grid size-4 place-items-center rounded-sm text-[9px] font-bold", KW.has(w) ? "bg-violet-500/30 text-violet-200" : "bg-sky-500/30 text-sky-200")}>
                      {KW.has(w) ? "K" : "ƒ"}
                    </span>
                    <span>
                      <span className="text-sky-300">{w.slice(0, sug.prefix.length)}</span>
                      {w.slice(sug.prefix.length)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
