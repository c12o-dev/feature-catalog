"use client";

import { Star, ThumbsUp } from "lucide-react";

const reviews = [
  { name: "Alice T.", verified: true, score: 5, when: "1 週間前", body: "とても使いやすかったです。スタッフの方の対応も丁寧で大満足。", helpful: 12 },
  { name: "Bob S.", verified: false, score: 4, when: "3 週間前", body: "概ね良いです。少し改善してほしい点はありますが、また利用したいと思います。", helpful: 4 },
];

export default function NamedReview() {
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.name} className="rounded-md border bg-background p-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-sm">{r.name}</span>
            {r.verified && <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 text-[10px]">購入確認済</span>}
            <span className="text-muted-foreground ml-auto">{r.when}</span>
          </div>
          <div className="flex gap-0.5 my-1">
            {[1,2,3,4,5].map((s) => <Star key={s} className={`size-3.5 ${s <= r.score ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}
          </div>
          <p className="text-sm">{r.body}</p>
          <button className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ThumbsUp className="size-3" />参考になった ({r.helpful})
          </button>
        </div>
      ))}
    </div>
  );
}
