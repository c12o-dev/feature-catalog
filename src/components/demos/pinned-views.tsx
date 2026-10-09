"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "week", name: "今週の Issue", count: 12 },
  { id: "mine", name: "自分の担当", count: 4 },
  { id: "review", name: "レビュー待ち", count: 7 },
  { id: "bugs", name: "未対応のバグ", count: 23 },
  { id: "backlog", name: "バックログ", count: 87 },
  { id: "design", name: "デザイン確認", count: 5 },
  { id: "release", name: "次回リリース", count: 18 },
  { id: "done", name: "完了済み", count: 124 },
];
const DEFAULT_PINNED = ["week", "mine"];
const KEY = "feature-catalog:pinned-views";

// --- tiny localStorage store (SSR-safe via useSyncExternalStore) ---
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: fall back to in-memory */
  }
  listeners.forEach((l) => l());
}

export default function PinnedViews() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const [memory, setMemory] = useState<string[] | null>(null);
  const pinnedIds = useMemo<string[]>(() => {
    if (memory) return memory;
    if (!raw) return DEFAULT_PINNED;
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : DEFAULT_PINNED;
    } catch {
      return DEFAULT_PINNED;
    }
  }, [raw, memory]);
  const [current, setCurrent] = useState("week");
  const [status, setStatus] = useState("");

  const toggle = (id: string, name: string) => {
    const on = pinnedIds.includes(id);
    const next = on ? pinnedIds.filter((x) => x !== id) : [...pinnedIds, id];
    setMemory(next);
    write(next);
    setStatus(on ? `「${name}」のピン留めを外しました` : `「${name}」をピン留めしました`);
  };

  const reset = () => {
    setMemory(DEFAULT_PINNED);
    write(DEFAULT_PINNED);
    setStatus("ピン留めを初期状態に戻しました");
  };

  const pinned = pinnedIds.map((id) => VIEWS.find((v) => v.id === id)).filter((v): v is (typeof VIEWS)[number] => !!v);
  const others = VIEWS.filter((v) => !pinnedIds.includes(v.id));

  const row = (v: (typeof VIEWS)[number], isPinned: boolean) => (
    <li key={v.id} className={cn("group flex items-center rounded-md", current === v.id && "bg-muted")}>
      <button
        type="button"
        onClick={() => setCurrent(v.id)}
        aria-current={current === v.id ? "page" : undefined}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/70"
      >
        <span className={cn("min-w-0 flex-1 truncate", current === v.id && "font-medium")}>{v.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{v.count}</span>
      </button>
      <button
        type="button"
        aria-pressed={isPinned}
        aria-label={isPinned ? `${v.name}のピン留めを外す` : `${v.name}をピン留め`}
        onClick={() => toggle(v.id, v.name)}
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-md transition-colors hover:bg-muted",
          isPinned ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground/60 hover:text-foreground",
        )}
      >
        <Pin className={cn("size-3.5", isPinned && "fill-current")} />
      </button>
    </li>
  );

  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="h-72 overflow-y-auto rounded-lg border bg-card">
        <div className="sticky top-0 z-10 border-b bg-card/95 p-2 backdrop-blur">
          <div className="mb-1 flex items-center justify-between px-2">
            <span className="text-xs font-medium text-muted-foreground">ピン留め</span>
            <button type="button" onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
              リセット
            </button>
          </div>
          {pinned.length ? (
            <ul className="space-y-px">
              {pinned.map((v) => row(v, true))}
            </ul>
          ) : (
            <p className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground">
              <PinOff className="size-3.5" aria-hidden />
              よく使うビューをピン留めできます
            </p>
          )}
        </div>
        <div className="p-2">
          <div className="mb-1 px-2 text-xs font-medium text-muted-foreground">すべてのビュー</div>
          <ul className="space-y-px">
            {others.map((v) => row(v, false))}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">ピン留めはこのブラウザに保存され、再読み込みしても残ります</p>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
