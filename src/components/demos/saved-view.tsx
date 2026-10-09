"use client";

import { Filter, Save } from "lucide-react";

const views = [
  { name: "今週の Open PR", count: 8 },
  { name: "自分担当のクリティカルバグ", count: 2 },
  { name: "Stale > 30 日", count: 14 },
  { name: "ラベル: blocker", count: 3 },
];

export default function SavedView() {
  return (
    <div className="space-y-2 max-w-sm">
      <div className="text-xs font-medium flex items-center gap-1.5"><Filter className="size-3.5" />保存したビュー</div>
      <ul className="rounded-md border bg-background divide-y">
        {views.map((v) => (
          <li key={v.name} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent cursor-pointer">
            <Save className="size-3.5 text-muted-foreground" />
            <span className="flex-1">{v.name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">{v.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
