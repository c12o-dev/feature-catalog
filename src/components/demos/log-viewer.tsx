"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Lvl = "info" | "warn" | "error";
type Line = { id: number; lvl: Lvl; msg: string; t: string };

const SAMPLE: { lvl: Lvl; msg: string }[] = [
  { lvl: "info", msg: "GET /api/users 200 12ms" },
  { lvl: "info", msg: "POST /api/login 200 45ms" },
  { lvl: "warn", msg: "Slow query: SELECT * FROM orders (843ms)" },
  { lvl: "info", msg: "GET /api/orders 200 8ms" },
  { lvl: "error", msg: "payment-svc: upstream ETIMEDOUT after 5000ms" },
  { lvl: "info", msg: "cache hit ratio 0.94" },
  { lvl: "info", msg: "GET /api/products?page=2 200 21ms" },
  { lvl: "warn", msg: "Retrying job #4821 (attempt 2/5)" },
  { lvl: "info", msg: "POST /api/orders 201 63ms" },
  { lvl: "error", msg: "DELETE /api/users/42 500 internal error" },
];
const BASE = Date.parse("2026-10-01T09:00:00+09:00");
const MAX = 60;

const ts = (i: number) => {
  const d = new Date(BASE + i * 850);
  // Format in JST explicitly so it doesn't depend on the viewer's timezone.
  const j = new Date(d.getTime() + 9 * 3600_000);
  return [j.getUTCHours(), j.getUTCMinutes(), j.getUTCSeconds()].map((n) => String(n).padStart(2, "0")).join(":") + "." + String(j.getUTCMilliseconds()).padStart(3, "0");
};
const make = (i: number): Line => ({ id: i, ...SAMPLE[i % SAMPLE.length], t: ts(i) });
const INITIAL = Array.from({ length: 6 }, (_, i) => make(i));

const LVL_CLS: Record<Lvl, string> = { info: "text-sky-400", warn: "text-amber-400", error: "text-red-400" };

function Hl({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const at = text.toLowerCase().indexOf(q.toLowerCase());
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-sm bg-amber-300 text-zinc-950">{text.slice(at, at + q.length)}</mark>
      <Hl text={text.slice(at + q.length)} q={q} />
    </>
  );
}

export default function LogViewer() {
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [paused, setPaused] = useState(false);
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<Lvl | "all">("all");
  const boxRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const counter = useRef(INITIAL.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const n = counter.current++;
      setLines((l) => [...l.slice(-(MAX - 1)), make(n)]);
    }, 850);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const el = boxRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [lines, q, lvl]);

  const needle = q.trim();
  const shown = lines.filter((l) => (lvl === "all" || l.lvl === lvl) && (!needle || l.msg.toLowerCase().includes(needle.toLowerCase())));

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 p-2">
        <label className="flex min-w-0 flex-1 basis-36 items-center gap-1.5 rounded-md bg-zinc-900 px-2 py-1 focus-within:ring-2 focus-within:ring-sky-500/50">
          <Search aria-hidden className="size-3.5 shrink-0 text-zinc-500" />
          <span className="sr-only">ログを検索</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="検索（例: 500, ETIMEDOUT）" className="min-w-0 flex-1 bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-400" />
        </label>
        <select aria-label="レベルで絞り込み" value={lvl} onChange={(e) => setLvl(e.target.value as Lvl | "all")} className="rounded-md border-0 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none focus:ring-2 focus:ring-sky-500/50">
          <option value="all">すべて</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-xs hover:bg-zinc-800"
        >
          {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
          {paused ? "再開" : "一時停止"}
        </button>
      </div>
      <div
        ref={boxRef}
        role="log"
        aria-label="アプリケーションログ"
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        }}
        className="h-48 overflow-auto p-2 font-mono text-[11px] leading-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500/50"
      >
        {shown.map((l) => (
          <div key={l.id} className="flex gap-2 whitespace-nowrap">
            <span className="text-zinc-400 tabular-nums">{l.t}</span>
            <span className={cn("w-10 shrink-0 font-semibold uppercase", LVL_CLS[l.lvl])}>{l.lvl}</span>
            <span>
              <Hl text={l.msg} q={needle} />
            </span>
          </div>
        ))}
        {shown.length === 0 && <p className="text-zinc-400">一致する行はありません</p>}
      </div>
      <div className="flex items-center justify-between border-t border-zinc-800 px-3 py-1.5 text-[11px] text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-1.5 rounded-full", paused ? "bg-zinc-500" : "bg-emerald-400")} />
          {paused ? "一時停止中" : "ライブ"}
        </span>
        <span className="tabular-nums">
          {needle || lvl !== "all" ? `${shown.length} 件一致 / ` : ""}
          {lines.length} 行
        </span>
      </div>
    </div>
  );
}
