"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

const platforms = [
  { v: "npm", l: "npm", cmd: "npm install @example/sdk", note: "Node.js 20 以上" },
  { v: "pip", l: "Python", cmd: "pip install example-sdk", note: "Python 3.10 以上" },
  { v: "brew", l: "Homebrew", cmd: "brew install example/tap/cli", note: "macOS / Linux" },
  { v: "go", l: "Go", cmd: "go get example.dev/sdk", note: "Go 1.22 以上" },
];

export default function SdkDownload() {
  const [v, setV] = useState("npm");
  const [copied, setCopied] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cur = platforms.find((p) => p.v === v)!;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const select = (i: number) => { setV(platforms[i].v); setCopied(false); tabs.current[i]?.focus(); };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = platforms.length;
    if (e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % n); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select((i - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); select(0); }
    else if (e.key === "End") { e.preventDefault(); select(n - 1); }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(cur.cmd); } catch { /* clipboard unavailable */ }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2">
      <div role="tablist" aria-label="インストール方法" className="flex flex-wrap gap-1">
        {platforms.map((p, i) => (
          <button
            key={p.v}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`sdk-tab-${p.v}`}
            aria-selected={v === p.v}
            aria-controls="sdk-panel"
            tabIndex={v === p.v ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`rounded-md px-3 py-1.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${v === p.v ? "bg-foreground text-background" : "border hover:bg-accent"}`}
          >
            {p.l}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="sdk-panel" aria-labelledby={`sdk-tab-${v}`} className="space-y-1.5">
        <div className="flex items-center gap-2 rounded-md border bg-zinc-950 py-1.5 pr-1.5 pl-3 text-zinc-100 dark:bg-zinc-900">
          <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap"><span className="text-zinc-500 select-none">$ </span>{cur.cmd}</code>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "コピーしました" : "コマンドをコピー"}
            className="grid size-7 shrink-0 place-items-center rounded text-zinc-400 outline-none hover:bg-white/10 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          </button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{cur.note}</span>
          <span aria-live="polite">{copied ? "コピーしました" : ""}</span>
        </div>
      </div>
    </div>
  );
}
