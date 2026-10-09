"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Clock, Search, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = { q: string; saved: boolean };
const KEY = "feature-catalog:search-history";
const initial: Entry[] = [
  { q: "売上 第1四半期 月別", saved: true },
  { q: "アクティブユーザー 直近7日", saved: false },
  { q: "エラーログ deploy:v2", saved: false },
  { q: "新規登録 流入元別", saved: true },
];
const INITIAL_RAW = JSON.stringify(initial);

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? INITIAL_RAW;
  } catch {
    return INITIAL_RAW;
  }
}
function write(list: Entry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable: ignore */
  }
  listeners.forEach((l) => l());
}

export default function SearchHistory() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_RAW);
  const list = useMemo<Entry[]>(() => {
    try {
      return JSON.parse(raw) as Entry[];
    } catch {
      return initial;
    }
  }, [raw]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const run = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const ex = list.find((x) => x.q === t);
    write([{ q: t, saved: ex?.saved ?? false }, ...list.filter((x) => x.q !== t)].slice(0, 8));
    setQ(t);
    setStatus(`「${t}」で検索しました`);
  };
  const toggle = (t: string) => write(list.map((x) => (x.q === t ? { ...x, saved: !x.saved } : x)));
  const remove = (t: string) => {
    write(list.filter((x) => x.q !== t));
    setStatus(`「${t}」を履歴から削除しました`);
  };

  const saved = list.filter((x) => x.saved);
  const recent = list.filter((x) => !x.saved);

  const renderRow = (it: Entry) => (
    <li key={it.q} className="group flex items-center gap-1 px-1.5 py-1">
      <button
        type="button"
        onClick={() => toggle(it.q)}
        aria-label={it.saved ? `「${it.q}」の保存を解除` : `「${it.q}」を保存`}
        aria-pressed={it.saved}
        className="grid size-7 shrink-0 place-items-center rounded hover:bg-accent"
      >
        <Star className={cn("size-3.5", it.saved ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
      </button>
      <button type="button" onClick={() => run(it.q)} className="min-w-0 flex-1 truncate rounded px-1 py-1 text-left text-sm hover:underline">
        {it.q}
      </button>
      <button
        type="button"
        onClick={() => remove(it.q)}
        aria-label={`「${it.q}」を履歴から削除`}
        className="grid size-7 shrink-0 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </li>
  );

  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          run(q);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
          }}
          aria-label="検索"
          placeholder="検索して Enter"
          className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </form>
      <div className="overflow-hidden rounded-lg border bg-card">
        {saved.length > 0 && (
          <section aria-labelledby="sh-saved">
            <h3 id="sh-saved" className="flex items-center gap-1.5 px-3 pb-1 pt-2.5 text-xs font-medium text-muted-foreground">
              <Star className="size-3.5" aria-hidden />
              保存した検索
            </h3>
            <ul>{saved.map(renderRow)}</ul>
          </section>
        )}
        <section aria-labelledby="sh-recent" className={cn(saved.length > 0 && "border-t")}>
          <h3 id="sh-recent" className="flex items-center gap-1.5 px-3 pb-1 pt-2.5 text-xs font-medium text-muted-foreground">
            <Clock className="size-3.5" aria-hidden />
            最近の検索
          </h3>
          {recent.length ? (
            <ul>{recent.map(renderRow)}</ul>
          ) : (
            <p className="px-3 pb-3 text-xs text-muted-foreground">履歴はありません</p>
          )}
        </section>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span aria-live="polite" className="truncate">{status || "履歴はこのブラウザに保存されます"}</span>
        <button type="button" onClick={() => write(initial)} className="shrink-0 underline underline-offset-2 hover:text-foreground">
          初期状態に戻す
        </button>
      </div>
    </div>
  );
}
