"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "p1", name: "2026 秋 キャンペーン", meta: "マーケティング" },
  { id: "p2", name: "モバイルアプリ刷新", meta: "プロダクト" },
  { id: "p3", name: "採用サイト更新", meta: "人事" },
  { id: "p4", name: "請求システム移行", meta: "経理" },
];

export default function Favorites() {
  const [fav, setFav] = useState<string[]>(["p1"]);
  const toggle = (id: string) => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const sorted = [...items.filter((i) => fav.includes(i.id)), ...items.filter((i) => !fav.includes(i.id))];

  return (
    <div className="mx-auto w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>プロジェクト</span>
        <span className="tabular-nums" aria-live="polite">お気に入り {fav.length} 件</span>
      </div>
      <ul className="space-y-1">
        {sorted.map((it) => {
          const on = fav.includes(it.id);
          return (
            <li key={it.id} className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm">
              <button
                type="button"
                onClick={() => toggle(it.id)}
                aria-pressed={on}
                aria-label={`${it.name} をお気に入り${on ? "から外す" : "に追加"}`}
                className="rounded p-1 hover:bg-muted"
              >
                <Star
                  aria-hidden
                  className={cn("size-4 transition-colors", on ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                />
              </button>
              <span className="min-w-0 flex-1 truncate">{it.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{it.meta}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
