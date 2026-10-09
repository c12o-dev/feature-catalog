"use client";

import { useState } from "react";
import { BadgeCheck, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    id: "r1",
    name: "高橋 美咲",
    initial: "高",
    verified: true,
    score: 5,
    when: "2026年9月24日",
    title: "初めてでも迷わず使えました",
    body: "設定画面がわかりやすく、15 分ほどで導入できました。サポートの返信も当日中で丁寧でした。",
    helpful: 12,
  },
  {
    id: "r2",
    name: "佐藤 健太",
    initial: "佐",
    verified: false,
    score: 4,
    when: "2026年9月10日",
    title: "概ね満足、通知まわりに改善の余地",
    body: "日々の作業は快適です。通知の頻度を細かく調整できるとさらに良いと思います。",
    helpful: 4,
  },
];

export default function NamedReview() {
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setVoted((v) => ({ ...v, [id]: !v[id] }));

  return (
    <ul className="space-y-3">
      {reviews.map((r) => {
        const on = !!voted[r.id];
        const count = r.helpful + (on ? 1 : 0);
        return (
          <li key={r.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {r.initial}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-medium">{r.name}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <BadgeCheck className="size-3" aria-hidden />
                      購入確認済
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{r.when}</div>
              </div>
            </div>
            <div className="mt-2 flex gap-0.5" role="img" aria-label={`5 点中 ${r.score} 点`}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  aria-hidden
                  className={cn("size-3.5", s <= r.score ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
                />
              ))}
            </div>
            <p className="mt-1 text-sm font-medium">{r.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggle(r.id)}
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
                on ? "border-primary/40 bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ThumbsUp className={cn("size-3", on && "fill-current")} aria-hidden />
              参考になった
              <span className="tabular-nums">({count})</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
