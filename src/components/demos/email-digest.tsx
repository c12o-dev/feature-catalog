"use client";

import { Mail } from "lucide-react";

const items = [
  { title: "新しいフォロワー 12 人", value: "+12" },
  { title: "コメント", value: "8" },
  { title: "いいね", value: "47" },
  { title: "閲覧数", value: "1,284" },
];

export default function EmailDigest() {
  return (
    <div className="rounded-md border bg-background p-4 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="size-4 text-blue-500" />
        <div className="text-sm font-medium">週次まとめ</div>
        <div className="text-xs text-muted-foreground ml-auto">2026-04-26</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <div key={it.title} className="rounded border p-2">
            <div className="text-xs text-muted-foreground">{it.title}</div>
            <div className="text-lg font-semibold tabular-nums">{it.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">あなたの今週の活動サマリー。詳細はダッシュボードで。</div>
    </div>
  );
}
