"use client";

import { useState } from "react";
import { CheckCircle2, Circle, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const initial = [
  { label: "アカウント作成", hint: "完了済み", done: true },
  { label: "プロフィール設定", hint: "写真と表示名", done: true },
  { label: "最初のプロジェクト作成", hint: "テンプレートから 1 分", done: false },
  { label: "チームメンバー招待", hint: "メールアドレスで招待", done: false },
  { label: "通知設定", hint: "受け取るイベントを選ぶ", done: false },
];

export default function OnboardingChecklist() {
  const [items, setItems] = useState(initial);
  const done = items.filter((i) => i.done).length;
  const ratio = done / items.length;
  const complete = done === items.length;

  return (
    <div className="mx-auto w-full max-w-sm space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">アカウントの完成度</span>
          <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
            {Math.round(ratio * 100)}%（{done}/{items.length}）
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="アカウントの完成度"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={done}
        >
          <div
            className="h-full origin-left bg-emerald-500 transition-transform duration-500 dark:bg-emerald-400"
            style={{ transform: `scaleX(${ratio})` }}
          />
        </div>
      </div>

      {complete ? (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
          <PartyPopper className="size-4 shrink-0" aria-hidden />
          セットアップ完了！すべての機能を使えます
        </div>
      ) : null}

      <ul className="space-y-0.5">
        {items.map((it, i) => (
          <li key={it.label}>
            <button
              type="button"
              role="checkbox"
              aria-checked={it.done}
              onClick={() => setItems((prev) => prev.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
              className="flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-muted"
            >
              {it.done ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className="min-w-0">
                <span className={cn("block text-sm", it.done && "text-muted-foreground line-through")}>{it.label}</span>
                <span className="block text-xs text-muted-foreground">{it.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
