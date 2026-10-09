"use client";

import { Star } from "lucide-react";

const items = [
  { name: "田中 Alice", role: "PM, Acme Inc", quote: "導入してから設定の時間が 10 分の 1 になりました。チーム全員が手放せないツールです。", color: "bg-rose-400" },
  { name: "Bob Tanaka", role: "CTO, Beta Co", quote: "API が直感的で、最初の統合まで 1 時間かかりませんでした。", color: "bg-blue-400" },
];

export default function TestimonialCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it) => (
        <div key={it.name} className="rounded-lg border bg-background p-4">
          <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map((s) => <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />)}</div>
          <p className="text-sm leading-relaxed">「{it.quote}」</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <div className={`size-9 rounded-full ${it.color} grid place-items-center text-white font-medium`}>{it.name[0]}</div>
            <div>
              <div className="text-sm font-medium">{it.name}</div>
              <div className="text-xs text-muted-foreground">{it.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
