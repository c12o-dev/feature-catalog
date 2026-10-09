"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

const counts = [{ star: 5, n: 902 }, { star: 4, n: 231 }, { star: 3, n: 88 }, { star: 2, n: 37 }, { star: 1, n: 26 }];
const total = counts.reduce((s, c) => s + c.n, 0);
const avg = counts.reduce((s, c) => s + c.star * c.n, 0) / total;

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="relative inline-flex" role="img" aria-label={`5 段階中 ${value.toFixed(1)}`}>
      <span className="flex gap-0.5 text-muted-foreground/40">
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={cn(size, "fill-current")} aria-hidden />)}
      </span>
      <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-amber-400" style={{ width: `${(value / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={cn(size, "shrink-0 fill-current")} aria-hidden />)}
      </span>
    </span>
  );
}

export default function ReviewScore() {
  const [helpful, setHelpful] = useState(false);
  const helpfulCount = 42 + (helpful ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
        <div className="text-center sm:pr-4">
          <div className="text-4xl font-semibold tabular-nums">{avg.toFixed(1)}</div>
          <div className="mt-1"><Stars value={avg} /></div>
          <div className="mt-1 text-xs text-muted-foreground tabular-nums">{total.toLocaleString("ja-JP")} 件のレビュー</div>
        </div>
        <ul className="space-y-1.5" aria-label="評価の内訳">
          {counts.map((c) => {
            const pct = Math.round((c.n / total) * 100);
            return (
              <li key={c.star} className="flex items-center gap-2 text-xs">
                <span className="flex w-7 items-center gap-0.5 text-muted-foreground tabular-nums">
                  {c.star}<Star className="size-3 fill-current" aria-hidden />
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-8 text-right text-muted-foreground tabular-nums">{pct}%</span>
                <span className="sr-only">（{c.n} 件）</span>
              </li>
            );
          })}
        </ul>
      </div>

      <article className="space-y-2 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium">中</span>
          <div className="min-w-0">
            <p className="text-sm font-medium">中村 由紀</p>
            <p className="text-xs text-muted-foreground">2026/09/24 · 購入者</p>
          </div>
          <span className="ml-auto"><Stars value={4} size="size-3.5" /></span>
        </div>
        <p className="text-sm text-muted-foreground">軽くて持ち運びやすいです。バッテリーも一日しっかり持ちました。ケースがもう少し薄ければ星5でした。</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={helpful}
            onClick={() => setHelpful((h) => !h)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors",
              helpful ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <ThumbsUp className={cn("size-3.5", helpful && "fill-current")} aria-hidden />
            参考になった
          </button>
          <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">{helpfulCount} 人が参考になったと回答</span>
        </div>
      </article>
    </div>
  );
}
