"use client";

import { useState } from "react";
import { Clock, X } from "lucide-react";

const PRODUCTS = [
  { id: "mug", name: "陶器マグ 350ml", price: 2400, from: "from-amber-200 to-orange-300 dark:from-amber-800 dark:to-orange-900" },
  { id: "lamp", name: "真鍮デスクライト", price: 12800, from: "from-yellow-100 to-amber-200 dark:from-yellow-900 dark:to-amber-950" },
  { id: "note", name: "方眼ノート A5", price: 880, from: "from-sky-100 to-sky-300 dark:from-sky-900 dark:to-sky-950" },
  { id: "chair", name: "オーク材スツール", price: 18500, from: "from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900" },
  { id: "plant", name: "ミニ観葉植物セット", price: 3200, from: "from-emerald-100 to-emerald-300 dark:from-emerald-900 dark:to-emerald-950" },
  { id: "pen", name: "アルミ万年筆", price: 6600, from: "from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900" },
];
const MAX = 4;
type Entry = { id: string; at: number };

const yen = (n: number) => "¥" + n.toLocaleString("ja-JP");

function ago(now: number, at: number) {
  const min = (now - at) * 4;
  return min === 0 ? "たった今" : min < 60 ? `${min} 分前` : `${Math.floor(min / 60)} 時間前`;
}

export default function RecentlyViewed() {
  const [history, setHistory] = useState<Entry[]>([
    { id: "lamp", at: -6 },
    { id: "note", at: -21 },
  ]);
  const [tick, setTick] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);

  const view = (id: string) => {
    const now = tick + 1;
    setTick(now);
    setCurrent(id);
    setHistory((h) => [{ id, at: now }, ...h.filter((e) => e.id !== id)].slice(0, MAX));
  };

  const currentProduct = PRODUCTS.find((p) => p.id === current);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium">おすすめ商品</span>
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {currentProduct ? `「${currentProduct.name}」を表示中` : "商品を選ぶと履歴に残ります"}
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => view(p.id)}
                aria-pressed={current === p.id}
                className={`group w-full rounded-lg border bg-card p-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  current === p.id ? "border-foreground/40" : ""
                }`}
              >
                <div className={`mb-2 aspect-[4/3] rounded-md bg-gradient-to-br ${p.from}`} />
                <div className="truncate text-sm">{p.name}</div>
                <div className="text-xs tabular-nums text-muted-foreground">{yen(p.price)}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="rv-title" className="rounded-lg border bg-background p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 id="rv-title" className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="size-3.5" />
            最近見た商品
          </h3>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              履歴を消去
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="py-3 text-center text-xs text-muted-foreground">まだ閲覧履歴はありません</p>
        ) : (
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {history.map((e) => {
              const p = PRODUCTS.find((x) => x.id === e.id)!;
              return (
                <li key={e.id} className="relative w-28 shrink-0">
                  <button
                    type="button"
                    onClick={() => view(e.id)}
                    className="w-full rounded-md p-1 text-left hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className={`mb-1 aspect-square rounded bg-gradient-to-br ${p.from}`} />
                    <div className="truncate text-xs">{p.name}</div>
                    <div className="text-xs tabular-nums text-muted-foreground">{ago(tick, e.at)}</div>
                  </button>
                  <button
                    type="button"
                    aria-label={`${p.name} を履歴から削除`}
                    onClick={() => setHistory((h) => h.filter((x) => x.id !== e.id))}
                    className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-background/90 text-muted-foreground shadow-sm hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
