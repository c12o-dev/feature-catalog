"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

const initial = [
  { label: "アカウント作成", done: true },
  { label: "プロフィール設定", done: true },
  { label: "最初のプロジェクト作成", done: false },
  { label: "チームメンバー招待", done: false },
  { label: "通知設定", done: false },
];

export default function OnboardingChecklist() {
  const [items, setItems] = useState(initial);
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-medium">セットアップ進捗</span>
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{items.length}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i}>
            <button
              onClick={() => setItems((items) => items.map((x, j) => j === i ? { ...x, done: !x.done } : x))}
              className="flex items-center gap-2 w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              {it.done ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span className={it.done ? "line-through text-muted-foreground" : ""}>{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
