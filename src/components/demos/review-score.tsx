"use client";

import { Star } from "lucide-react";

export default function ReviewScore() {
  const score = 4.6;
  const count = 1284;
  const dist = [
    { star: 5, pct: 70 },
    { star: 4, pct: 18 },
    { star: 3, pct: 7 },
    { star: 2, pct: 3 },
    { star: 1, pct: 2 },
  ];
  return (
    <div className="grid grid-cols-2 gap-6 items-center">
      <div className="text-center">
        <div className="text-4xl font-semibold tabular-nums">{score}</div>
        <div className="flex justify-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`size-4 ${s <= Math.round(score) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{count.toLocaleString()} 件のレビュー</div>
      </div>
      <div className="space-y-1.5">
        {dist.map((d) => (
          <div key={d.star} className="flex items-center gap-2 text-xs">
            <span className="w-6 text-muted-foreground">★ {d.star}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${d.pct}%` }} />
            </div>
            <span className="w-7 text-right text-muted-foreground tabular-nums">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
